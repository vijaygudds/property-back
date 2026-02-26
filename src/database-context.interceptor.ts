import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClsService } from 'nestjs-cls';
import { DynamicDatabaseService } from './database/dynamic-database-service';

@Injectable()
export class DatabaseContextInterceptor implements NestInterceptor {
  private readonly logger = new Logger(DatabaseContextInterceptor.name);

  constructor(
    private readonly cls: ClsService,
    private readonly dynamicDbService: DynamicDatabaseService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user || this.cls.get('user');

    if (!user) {
      return next.handle();
    }

    this.logger.log(`User Type: ${user.userType}`);

    // For client users, establish connection to their database
    if (user.userType === 'client_user' && user.envVariables) {
      try {
        this.logger.log(
          `Connecting to client DB: ${user.envVariables.DB_NAME}`,
        );
        this.logger.log(`Host: ${user.envVariables.DB_HOST}`);

        // Store credentials in CLS for the entire request lifecycle
        this.cls.set('dbCredentials', {
          dbName: user.envVariables.DB_NAME,
          dbHost: user.envVariables.DB_HOST,
          dbPort: user.envVariables.DB_PORT,
          dbUsername: user.envVariables.DB_USERNAME,
          dbPassword: user.envVariables.DB_PASSWORD,
          mode: user.envVariables.APP_MODE,
        });

        // Establish connection
        const connection = await this.dynamicDbService.getClientConnection({
          dbName: user.envVariables.DB_NAME,
          dbHost: user.envVariables.DB_HOST,
          dbPort: user.envVariables.DB_PORT,
          dbUsername: user.envVariables.DB_USERNAME,
          dbPassword: user.envVariables.DB_PASSWORD,
        });

        // Store connection in CLS
        this.cls.set('clientConnection', connection);

        this.logger.log(
          `✅ Successfully connected to ${user.envVariables.DB_NAME}`,
        );
      } catch (error) {
        this.logger.error(
          `❌ Failed to connect to client database: ${error.message}`,
        );
        throw error;
      }
    }

    return next.handle();
  }
}
