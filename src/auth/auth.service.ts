import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signToken(
    user_id: string,
    email: string,
    isAuthorizedSeller: boolean,
    name: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      user_id,
      email,
      isAuthorizedSeller,
      name,
    };

    const expiresIn: string = this.configService.get('JWT_EXPIRES_IN');
    const secret: string = this.configService.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: expiresIn,
      secret: secret,
    });

    return {
      access_token: token,
    };
  }

  async signUp(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prismaService.user.findFirst({
        where: { email: dto.email },
      });

      if (user) {
        throw new BadRequestException('Email already exists');
      }

      await this.prismaService.user.create({
        data: {
          email: dto.email,
          password: hash,
          name: dto.name,
          lastName: dto.last_name,
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
    }
  }

  async signIn(dto: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(user.password, dto.password);

    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    return this.signToken(
      user.id,
      user.email,
      user.isAuthorizedSeller,
      user.name,
    );
  }
}
