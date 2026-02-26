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
    @InjectModel(QRolePermissions)
    private qPermissionModel: typeof QRolePermissions,
    @InjectModel(QEntityActions)
    private qEntityActionModel: typeof QEntityActions,

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
    const staff = await this.staffModel.findOne({
      where: { username, is_active: true },
    });

    if (!staff || staff.password !== password) {
      throw new BadRequestException('Username or password is incorrect');
    }

    console.log(`✅ Staff authenticated: ${staff.username}`);

    if (!staff.client_id) {
      throw new BadRequestException('Staff is not associated with any client');
    }

    // Step 2: Get client details from MASTER DB
    console.log(
      `\n📍 Step 2: Fetching client details for client_id: ${staff.client_id}...`,
    );
    const client = await this.clientModel.findByPk(staff.client_id);

    if (!client) {
      throw new BadRequestException('Client not found');
    }

    console.log(`✅ Client found: ${client.name}`);

    // Step 3: Check if client login is allowed
    if (client.allow_login === 0) {
      throw new BadRequestException('Client login is disabled');
    }

    // Step 4: Get client database credentials
    console.log('\n📍 Step 3: Getting client database credentials...');
    const dbCredentials = this.getClientDBCredentials(client);

    console.log(`📊 Database Credentials:`);
    console.log(`   Mode: ${dbCredentials.mode}`);
    console.log(`   Host: ${dbCredentials.dbHost}:${dbCredentials.dbPort}`);
    console.log(`   Database: ${dbCredentials.dbName}`);
    console.log(`   Username: ${dbCredentials.dbUsername}`);
    console.log(`   Password: ${'*'.repeat(dbCredentials.dbPassword.length)}`);

    // Step 5: Connect to CLIENT DATABASE with client's credentials
    console.log('\n📍 Step 4: Connecting to client database...');
    const clientConnection = await this.dynamicDbService.getClientConnection({
      dbName: dbCredentials.dbName,
      dbHost: dbCredentials.dbHost,
      dbPort: dbCredentials.dbPort,
      dbUsername: dbCredentials.dbUsername,
      dbPassword: dbCredentials.dbPassword,
    });

    console.log(`✅ Connected to client database successfully!`);

    // Step 6: Create JWT token
    const { password: pwd, ...result } = staff.get();
    const workingDate = this.getISTDateString();

    const tokenData = {
      ...result,
      workingDate,
      client_id: client.id,
      client: {
        id: client.id,
        name: client.name,
        client_code: client.client_code,
        database_name: client.database_name,
        database_host: client.database_host,
        database_port: client.database_port,
        standalone_db_name: client.standalone_db_name,
        standalone_db_host: client.standalone_db_host,
        standalone_db_port: client.standalone_db_port,
        status: client.status,
      },
    };

    const token = this.createJWT(
      tokenData,
      dbCredentials.dbName,
      dbCredentials.dbHost,
    );

    // Step 7: Fetch role and permissions from CLIENT DATABASE
    let roleName = null;
    let permissions: string[] = [];

    if (staff.q_role_id) {
      console.log('\n📍 Step 5: Fetching permissions from client database...');
      const roleData = await this.getRolePermissions(
        staff.q_role_id,
        clientConnection,
      );
      roleName = roleData.roleName;
      permissions = roleData.permissions;
      console.log(`✅ Loaded ${permissions.length} permissions`);
    }

    console.log('\n✅ ===== ADMIN LOGIN SUCCESSFUL =====');
    console.log(`   User: ${staff.username}`);
    console.log(`   Client: ${client.name}`);
    console.log(`   Database: ${dbCredentials.dbName}`);
    console.log(`   Mode: ${dbCredentials.mode}`);
    console.log('=====================================\n');

    return {
      ...tokenData,
      token,
      role: roleName,
      permissions,
      userType: 'admin',
      envVariables: {
        IS_LIVE: this.configService.get<string>('IS_LIVE') === 'true',
        DB_NAME: dbCredentials.dbName,
        DB_HOST: dbCredentials.dbHost,
        DB_PORT: dbCredentials.dbPort,
        APP_MODE: dbCredentials.mode,
      },
    };
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
    const workingDate = this.getISTDateString();

    const tokenData = {
      ...result,
      workingDate,
      client_id: foundClient.id,
      client: {
        id: foundClient.id,
        name: foundClient.name,
        client_code: foundClient.client_code,
        database_name: foundClient.database_name,
        database_host: foundClient.database_host,
        database_port: foundClient.database_port,
        standalone_db_name: foundClient.standalone_db_name,
        standalone_db_host: foundClient.standalone_db_host,
        standalone_db_port: foundClient.standalone_db_port,
        status: foundClient.status,
      },
    };

    const token = this.createJWT(
      tokenData,
      dbCredentials.dbName,
      dbCredentials.dbHost,
    );

    // Step 4: Fetch role and permissions from CLIENT DATABASE
    let roleName = null;
    let permissions: string[] = [];

    if (foundUser.q_role_id) {
      console.log('\n📍 Fetching permissions...');
      const roleData = await this.getRolePermissions(
        foundUser.q_role_id,
        clientConnection,
      );
      roleName = roleData.roleName;
      permissions = roleData.permissions;
      console.log(`✅ Loaded ${permissions.length} permissions`);
    }

    console.log('\n✅ ===== CLIENT LOGIN SUCCESSFUL =====');
    console.log(`   User: ${username}`);
    console.log(`   Client: ${foundClient.name}`);
    console.log(`   Database: ${dbCredentials.dbName}`);
    console.log(`   Mode: ${dbCredentials.mode}`);
    console.log('======================================\n');

    return {
      ...tokenData,
      token,
      role: roleName,
      permissions,
      userType: 'client_user',
      envVariables: {
        IS_LIVE: this.configService.get<string>('IS_LIVE') === 'true',
        DB_NAME: dbCredentials.dbName,
        DB_HOST: dbCredentials.dbHost,
        DB_PORT: dbCredentials.dbPort,
        APP_MODE: dbCredentials.mode,
      },
    };
  }
}
