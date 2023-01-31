import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  AuthService,
  RegistrationSeederStatus,
  RegistrationStatus,
} from './auth.service';
import { CreateUserDto, LoginUserDto } from '../users/user.dto';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    try {
      const result: RegistrationStatus = await this.authService.register(
        createUserDto,
      );
      return result;
    } catch (error) {
      return error;
    }
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return await this.authService.login(loginUserDto);
  }
}
