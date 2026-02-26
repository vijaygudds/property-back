import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

// Import all Client DB models
import { User } from 'src/model/Client/User';
import { Agreement } from 'src/model/Client/Agreement';
import { Plot } from 'src/model/Client/Plot';
import { Buyer } from 'src/model/Client/Buyer';
import { LedgerEntry } from 'src/model/Client/LedgerEntry';
import { MapImage } from 'src/model/Client/MapImage';
import { Property } from 'src/model/Client/Property';
import QRoles from 'src/qnatk/src/models/QRoles';
import QRolePermissions from 'src/qnatk/src/models/QRolePermissions';
import QEntityActions from 'src/qnatk/src/models/QEntityActions';
import { Plan } from 'src/model/Client/Plan';
import { PlanInfrastructure } from 'src/model/Client/PlanInfrastructure';
import { PlotBooking } from 'src/model/Client/PlotBooking';
import { State } from 'src/model/Client/State';
import { City } from 'src/model/Client/City';
import { Tehsil } from 'src/model/Client/Tehsil';
import { Village } from 'src/model/Client/Village';

interface ClientDbCredentials {
  dbName: string;
  dbHost: string;
  dbPort: number;
  dbUsername: string;
  dbPassword: string;
}

@Injectable()
export class DynamicDatabaseService implements OnModuleDestroy {
  // Store active connections: Map<"host:port:dbname", Sequelize>
  private connections: Map<string, Sequelize> = new Map();

  // All client DB models
  private clientModels = [
    User,
    Agreement,
    Plot,
    Plan,
    PlanInfrastructure,
    PlotBooking,
    Buyer,
    LedgerEntry,
    MapImage,
    Property,
    QRoles,
    QRolePermissions,
    QEntityActions,
    State,
    City,
    Tehsil,
    Village,
  ];

  /**
   * Get or create a connection to a specific client database
   * Har client ke apne credentials se connect hota hai
   */
  async getClientConnection(
    credentials: ClientDbCredentials,
  ): Promise<Sequelize> {
    const { dbName, dbHost, dbPort, dbUsername, dbPassword } = credentials;

    // Create unique connection key
    const connectionKey = `${dbHost}:${dbPort}:${dbName}`;

    // Check if connection already exists and is alive
    if (this.connections.has(connectionKey)) {
      console.log(`♻️  Reusing existing connection: ${connectionKey}`);

      const connection = this.connections.get(connectionKey);

      // Verify connection is still alive
      try {
        await connection.authenticate();
        return connection;
      } catch (error) {
        console.log(`⚠️  Dead connection detected, recreating...`);
        await connection.close();
        this.connections.delete(connectionKey);
      }
    }

    console.log(`🔌 Creating new connection...`);
    console.log(`   Host: ${dbHost}:${dbPort}`);
    console.log(`   Database: ${dbName}`);
    console.log(`   Username: ${dbUsername}`);

    // Create new Sequelize connection
    const sequelize = new Sequelize({
      dialect: 'mysql',
      host: dbHost,
      port: dbPort,
      username: dbUsername,
      password: dbPassword,
      database: dbName,

      logging: false, // Set to console.log for debugging

      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },

      timezone: '+05:30',

      dialectOptions: {
        connectTimeout: 10000,
        dateStrings: true,
        typeCast: true,
        multipleStatements: true,
      },
    });

    // Add all client DB models to this connection
    sequelize.addModels(this.clientModels);

    // Test the connection
    try {
      await sequelize.authenticate();
      console.log(`✅ Successfully connected!`);
      console.log(`   Connection Key: ${connectionKey}`);
    } catch (error) {
      console.error(`❌ Failed to connect to database!`);
      console.error(`   Host: ${dbHost}:${dbPort}`);
      console.error(`   Database: ${dbName}`);
      console.error(`   Username: ${dbUsername}`);
      console.error(`   Password: ${dbPassword}`);
      console.error(`   Error: ${error.message}`);
      throw new Error(
        `Database connection failed for ${dbName}: ${error.message}`,
      );
    }

    // Store the connection
    this.connections.set(connectionKey, sequelize);

    return sequelize;
  }

  /**
   * Get active connections count
   */
  getActiveConnectionsCount(): number {
    return this.connections.size;
  }

  /**
   * Get list of active connections
   */
  getActiveConnections(): string[] {
    return Array.from(this.connections.keys());
  }

  /**
   * Close a specific connection
   */
  async closeConnection(connectionKey: string): Promise<void> {
    const connection = this.connections.get(connectionKey);

    if (connection) {
      try {
        await connection.close();
        this.connections.delete(connectionKey);
        console.log(`🔌 Closed connection: ${connectionKey}`);
      } catch (error) {
        console.error(
          `❌ Error closing connection ${connectionKey}:`,
          error.message,
        );
      }
    }
  }

  /**
   * Close all connections (cleanup on app shutdown)
   */
  async closeAllConnections(): Promise<void> {
    console.log(`🔌 Closing all connections (${this.connections.size})...`);

    const closePromises = Array.from(this.connections.entries()).map(
      async ([key, connection]) => {
        try {
          await connection.close();
          console.log(`   ✅ Closed: ${key}`);
        } catch (error) {
          console.error(`   ❌ Error closing ${key}:`, error.message);
        }
      },
    );

    await Promise.all(closePromises);
    this.connections.clear();
    console.log(`✅ All connections closed`);
  }

  /**
   * Health check for a specific connection
   */
  async checkConnection(connectionKey: string): Promise<boolean> {
    const connection = this.connections.get(connectionKey);

    if (!connection) {
      return false;
    }

    try {
      await connection.authenticate();
      return true;
    } catch (error) {
      console.error(
        `❌ Connection ${connectionKey} health check failed:`,
        error.message,
      );
      this.connections.delete(connectionKey);
      return false;
    }
  }

  /**
   * Get connection info for debugging
   */
  getConnectionInfo(connectionKey: string): any {
    const connection = this.connections.get(connectionKey);

    if (!connection) {
      return null;
    }

    return {
      connectionKey,
      database: connection.config.database,
      host: connection.config.host,
      port: connection.config.port,
      username: connection.config.username,
      //   dialect: connection.config.dialect,
      pool: connection.config.pool,
    };
  }

  /**
   * Lifecycle hook - cleanup on module destroy
   */
  async onModuleDestroy() {
    console.log('🔄 DynamicDatabaseService shutting down...');
    await this.closeAllConnections();
  }
}
