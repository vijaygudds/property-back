import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { HelperService } from '../helper/helper.service';

import { ClsService } from 'nestjs-cls';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private helperService: HelperService,
    private readonly cls: ClsService,
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      // First decode the token WITHOUT verification to get the payload
      const decoded = this.jwtService.decode(token) as any;

      if (!decoded) {
        throw new UnauthorizedException('Invalid token format');
      }
      console.log('decode', decoded);
      let secret: string;

      // Determine which secret to use based on userType
      if (decoded.userType === 'admin') {
        // Admin tokens use MASTER DB credentials
        secret =
          this.configService.get<string>('JWT_SECRET') +
          this.configService.get<string>('MASTER_DB_HOST') +
          this.configService.get<string>('MASTER_DB_DATABASE');
      } else if (decoded.userType === 'client_user') {
        // Client tokens use their own DB credentials (stored in envVariables)
        if (!decoded.envVariables?.DB_HOST || !decoded.envVariables?.DB_NAME) {
          throw new UnauthorizedException(
            'Invalid token: missing database credentials',
          );
        }

        // const secret =
        //   this.configService.get<string>('JWT_SECRET') +
        //   this.configService.get<string>('MASTER_DB_HOST') +
        //   this.configService.get<string>('MASTER_DB_DATABASE');
        secret =
          this.configService.get<string>('JWT_SECRET') +
          decoded.envVariables.DB_HOST +
          decoded.envVariables.DB_NAME;
      } else {
        throw new UnauthorizedException('Invalid user type');
      }
      const user = await this.jwtService.verifyAsync(token, { secret });

      // ✅ Working date handling
      const workingDateTime = request.headers['x-working-datetime'];
      if (workingDateTime) {
        user.workingDate = this.helperService.dateSystem(workingDateTime);
      } else if (user.workingDate) {
        user.workingDate = this.helperService.dateSystem(user.workingDate);
      } else {
        user.workingDate = this.helperService.dateSystem(new Date());
      }

      // ✅ Store database credentials in CLS for later use
      if (user.userType === 'client_user' && user.envVariables) {
        this.cls.set('dbCredentials', {
          dbName: user.envVariables.DB_NAME,
          dbHost: user.envVariables.DB_HOST,
          dbPort: user.envVariables.DB_PORT,
          dbUsername: user.envVariables.DB_USERNAME, // if available
          dbPassword: user.envVariables.DB_PASSWORD, // if available
          mode: user.envVariables.APP_MODE,
        });
      } else if (user.userType === 'admin') {
        // For admin, use master DB credentials
        this.cls.set('dbCredentials', {
          dbName: this.configService.get<string>('MASTER_DB_DATABASE'),
          dbHost: this.configService.get<string>('MASTER_DB_HOST'),
          dbPort: this.configService.get<string>('MASTER_DB_PORT'),
          mode: 'MASTER',
        });
      }

      // ✅ SaaS / Standalone: attach client info if not present
      // if (!user.clientId && user.userType === 'admin') {
      //   user.clientId = user.client?.id || null;
      // }

      // ✅ Attach user to request and CLS
      request['user'] = user;
      this.cls.set('user', user);
    } catch (error) {
      console.log('UnauthorizedException in AuthGuard:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
