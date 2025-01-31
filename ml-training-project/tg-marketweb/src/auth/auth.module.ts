import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { GetTokenStrategy } from 'src/users/strategies';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    PrismaService,
    JwtService,
    GetTokenStrategy,
    PrismaClient,
  ],
})
export class AuthModule {}
