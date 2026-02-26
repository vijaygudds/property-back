import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('admin-login')
  login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.adminLogin(username, password);
  }

  @Post('client-login')
  clientLogin(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    console.log('me Client hu');
    return this.authService.clientLogin(username, password);
  }
}
