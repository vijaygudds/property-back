import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { Op } from 'sequelize';
import { ConfigService } from '@nestjs/config';

// Master DB Models
import { Staff } from 'src/model/Master/Staff';
import { Client } from 'src/model/Master/Client';

// Client DB Models
import { User } from 'src/model/Client/User';
import QRoles from 'src/qnatk/src/models/QRoles';
import QRolePermissions from 'src/qnatk/src/models/QRolePermissions';
import QEntityActions from 'src/qnatk/src/models/QEntityActions';
import { DynamicDatabaseService } from 'src/database/dynamic-database-service';

// Dynamic Database Service

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Staff) private staffModel: typeof Staff,
    @InjectModel(Client) private clientModel: typeof Client,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(QRoles) private qRoleModel: typeof QRoles,
    @InjectModel(QRoles) private qRolesModel: typeof QRoles,
    @InjectModel(QRolePermissions)
    private qRolePermissionsModel: typeof QRolePermissions,

    private jwtService: JwtService,
    private configService: ConfigService,
    private dynamicDbService: DynamicDatabaseService,
  ) {}

  private getISTDateString(date?: Date) {
    const nowUtc = date || new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const workingDate = new Date(nowUtc.getTime() + istOffset);
    const year = workingDate.getUTCFullYear();
    const month = (workingDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = workingDate.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get client database credentials based on APP_MODE
   */
  private getClientDBCredentials(client: Client) {
    const appMode = this.configService.get<string>('APP_MODE')?.toUpperCase();

    if (appMode === 'SAAS') {
      // SaaS Mode - har client ka alag database with own credentials
      return {
        dbName: client.database_name,
        dbHost: client.database_host,
        dbPort: client.database_port,
        dbUsername: client.database_username,
        dbPassword: client.database_password,
        mode: 'SAAS',
      };
    } else if (appMode === 'STANDALONE') {
      // Standalone Mode - ek hi database, multiple clients
      return {
        dbName: client.standalone_db_name,
        dbHost: client.standalone_db_host,
        dbPort: client.standalone_db_port,
        dbUsername: client.standalone_db_username,
        dbPassword: client.standalone_db_password,
        mode: 'STANDALONE',
      };
    } else {
      throw new BadRequestException(
        'Invalid APP_MODE. Must be SAAS or STANDALONE',
      );
    }
  }

  private createJWT(payload: any, dbName: string, dbHost: string) {
    const secret =
      this.configService.get<string>('JWT_SECRET') + dbHost + dbName;
    return this.jwtService.sign(payload, { secret });
  }

  /**
   * Fetch role and permissions from specific client database
   */
  private async getRolePermissions(roleId: number, clientConnection: any) {
    const QRolesModel = clientConnection.model('QRoles');
    const QRolePermissionsModel = clientConnection.model('QRolePermissions');
    const QEntityActionsModel = clientConnection.model('QEntityActions');

    const role = await QRolesModel.findOne({
      where: { id: roleId },
    });

    const permissions: string[] = [];

    if (role) {
      const perms = await QRolePermissionsModel.findAll({
        include: [{ model: QEntityActionsModel, as: 'entityAction' }],
        where: { role_id: role.id, status: 1 },
      });

      perms.forEach((p: any) => {
        permissions.push(
          p.entityAction.Action + ':' + p.entityAction.BaseModel,
        );
      });
    }

    return {
      roleName: role?.name || null,
      permissions,
    };
  }

  /**
   * ADMIN LOGIN
   * Admin authenticates from Master DB
   * Then connects to client-specific database using client's own credentials
   */
  async adminLogin(username: string, password: string): Promise<any> {
    if (!username || !password) {
      throw new BadRequestException('Username and password are required');
    }

    console.log('\n🔐 ===== ADMIN LOGIN PROCESS =====');

    // Step 1: Authenticate from MASTER DB
    console.log('📍 Step 1: Authenticating from Master DB...');
    const user = await this.staffModel.findOne({
      where: { username, is_active: true },
    });

    if (!user || user.password !== password) {
      throw new BadRequestException('Username or password is incorrect');
    }

    console.log(`✅ Staff authenticated: ${user.username}`);
    if (user && user.password === password) {
      const { password, ...result } = user.get();

      // Get current UTC dateSystem and time
      const nowUtc = new Date();

      // Convert to IST (UTC+5:30)
      const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
      const workingDate = new Date(nowUtc.getTime() + istOffset);

      // Format to MySQL dateSystem-only string "YYYY-MM-DD"
      const year = workingDate.getUTCFullYear();
      const month = workingDate.getUTCMonth() + 1; // getUTCMonth returns 0-11
      const day = workingDate.getUTCDate();
      const workingDateString = `${year}-${month
        .toString()
        .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      // Add environment variables to the response
      const envVariables = {
        IS_LIVE: this.configService.get<string>('IS_LIVE') ?? false,
        DB_NAME: this.configService.get<string>('MASTER_DB_DATABASE'),
        DB_HOST: this.configService.get<string>('MASTER_DB_HOST'),
      };
      const tokenData = {
        ...result,
        workingDate: workingDateString,
        userType: 'admin', // ← Add this
        envVariables, // ← Add this
      };
      const secret =
        this.configService.get<string>('JWT_SECRET') +
        this.configService.get<string>('MASTER_DB_HOST') +
        this.configService.get<string>('MASTER_DB_DATABASE');
      const token = this.jwtService.sign(tokenData, { secret });
      const role = await this.qRoleModel.findOne({
        where: { id: user.q_role_id },
      });

      const permissions = [];
      if (role) {
        const permissionsModel = await this.qRolePermissionsModel.findAll({
          include: ['entityAction'],
          where: { role_id: role.id, status: 1 },
        });

        permissionsModel.forEach((permission) => {
          permissions.push(
            permission.entityAction.Action +
              ':' +
              permission.entityAction.BaseModel,
          );
        });
      }
      console.log('\n✅ ===== ADMIN LOGIN SUCCESSFUL =====');
      console.log(`   User: ${user.username}`);
      console.log(
        `   Database: ${this.configService.get<string>('MASTER_DB_DATABASE')}`,
      );
      console.log(`   Mode: ${this.configService.get<string>('APP_MODE')}`);
      console.log('=====================================\n');
      return {
        ...tokenData,
        role: role?.name,
        token,
        workingDate: workingDateString,
        permissions,
        userType: 'admin',
        envVariables,
      };
    }
    throw new BadRequestException('Username or password is incorrect');
  }

  /**
   * CLIENT LOGIN
   * Client user login - searches across all client databases
   * Uses each client's own database credentials
   */
  async clientLogin(username: string, password: string): Promise<any> {
    if (!username || !password) {
      throw new BadRequestException('Username and password are required');
    }

    console.log('\n🔐 ===== CLIENT LOGIN PROCESS =====');
    console.log(`📍 Searching for user: ${username}`);

    // Step 1: Get all active clients from MASTER DB
    const clients = await this.clientModel.findAll({
      where: { allow_login: 1 },
    });

    console.log(`\n📊 Found ${clients.length} active clients to search`);

    let foundUser = null;
    let foundClient = null;
    let clientConnection = null;
    let dbCredentials = null;

    // Step 2: Try to find user in each client database
    for (const client of clients) {
      try {
        console.log(`\n🔍 Checking client: ${client.name}...`);

        // Get this client's database credentials
        const credentials = this.getClientDBCredentials(client);

        console.log(`   Database: ${credentials.dbName}`);
        console.log(`   Host: ${credentials.dbHost}:${credentials.dbPort}`);

        // Connect to this client's database with their credentials
        const connection = await this.dynamicDbService.getClientConnection({
          dbName: credentials.dbName,
          dbHost: credentials.dbHost,
          dbPort: credentials.dbPort,
          dbUsername: credentials.dbUsername,
          dbPassword: credentials.dbPassword,
        });

        // Search for user in this database
        // const UserModel = connection.model('User');
        const UserModel = connection.model('User') as typeof User;

        const user = await UserModel.findOne({
          where: {
            username,
            // [Op.or]: [{ username: username }, { mobile: username }],
          },
        });

        if (user && user.password === password) {
          console.log(`✅ User found and authenticated in ${client.name}!`);
          foundUser = user;
          foundClient = client;
          clientConnection = connection;
          dbCredentials = credentials;
          break;
        } else if (user) {
          console.log(`   ❌ User found but password incorrect`);
        } else {
          console.log(`   ℹ️  User not found in this database`);
        }
      } catch (error) {
        console.log(`   ⚠️  Error: ${error.message}`);
        continue;
      }
    }

    if (!foundUser || !foundClient) {
      throw new BadRequestException('Username or password is incorrect');
    }

    // Step 3: Create JWT token
    const { password: pwd, ...result } = foundUser.get();

    // Get current UTC dateSystem and time
    const nowUtc = new Date();

    // Convert to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const workingDate = new Date(nowUtc.getTime() + istOffset);

    // Format to MySQL dateSystem-only string "YYYY-MM-DD"
    const year = workingDate.getUTCFullYear();
    const month = workingDate.getUTCMonth() + 1; // getUTCMonth returns 0-11
    const day = workingDate.getUTCDate();
    const workingDateString = `${year}-${month
      .toString()
      .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    const secret =
      this.configService.get<string>('JWT_SECRET') +
      dbCredentials.dbHost +
      dbCredentials.dbName;

    const envVariables = {
      IS_LIVE: this.configService.get<string>('IS_LIVE') ?? false,
      DB_NAME: dbCredentials.dbName,
      DB_HOST: dbCredentials.dbHost,
      DB_PORT: dbCredentials.dbPort,
      DB_USERNAME: dbCredentials.dbUsername, // ✅ Add this
      DB_PASSWORD: dbCredentials.dbPassword, // ✅ Add this
      APP_MODE: dbCredentials.mode,
    };
    const tokenData = {
      ...result,
      workingDate: workingDateString,
      userType: 'client_user', // ← Add this
      envVariables, // ← Add this
    };
    const token = this.jwtService.sign(tokenData, { secret });
    const role = await this.qRoleModel.findOne({
      where: { id: foundUser.q_role_id },
    });

    const permissions = [];
    if (role) {
      const permissionsModel = await this.qRolePermissionsModel.findAll({
        include: ['entityAction'],
        where: { role_id: role.id, status: 1 },
      });

      permissionsModel.forEach((permission) => {
        permissions.push(
          permission.entityAction.Action +
            ':' +
            permission.entityAction.BaseModel,
        );
      });
    }
    // Add environment variables to the response
    console.log('\n✅ ===== CLIENT LOGIN SUCCESSFUL =====');
    console.log(`   User: ${username}`);
    console.log(`   Client: ${foundClient.name}`);
    console.log(`   Database: ${dbCredentials.dbName}`);
    console.log(`   Mode: ${dbCredentials.mode}`);
    console.log('======================================\n');
    return {
      ...tokenData,
      role: role?.name,
      token,
      workingDate: workingDateString,
      permissions,
      userType: 'client_user',
      envVariables,
    };
  }
}
