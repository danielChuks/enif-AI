import {
  Controller,
  Post,
  UseGuards,
  Session,
  Get,
  Request,
} from '@nestjs/common';

import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from '../utils/LocalGuard';
import { LoginDto } from '../dtos/auth/Login.dto';
import { LogInResponseDto } from '../dtos/auth/LoginResponse.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @ApiOperation({ summary: 'This handles login request.' })
  @ApiResponse({
    status: 200,
    description: '',
    type: LogInResponseDto,
  })
  @UseGuards(LocalGuard)
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Request() req: any) {
    return req.user;
  }

  @Get('')
  async getAuthSession(@Session() session: Record<string, any>) {
    session.authenticated = true;
    return session;
  }
}
