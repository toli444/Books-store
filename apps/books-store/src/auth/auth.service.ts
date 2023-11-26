import {
  BadRequestException,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dtos/signIn.dto';
import { SignUpDto } from './dtos/signUp.dto';
import * as process from 'process';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';

interface UserI {
  _id: Types.ObjectId;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signUp(createUserDto: SignUpDto) {
    const userExists = await this.usersService.findByEmail(createUserDto.email);

    if (userExists) {
      throw new BadRequestException('User already exists.');
    }

    const hashedPassword = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword
    });

    const tokens = await this.getTokens(newUser);

    await this.updateRefreshToken(newUser._id, tokens.refreshToken);

    return tokens;
  }

  async signIn(data: SignInDto) {
    const user = await this.usersService.findByEmail(data.email);

    if (!user) {
      throw new BadRequestException('Invalid username or password.');
    }

    const passwordMatches = await this.compareHashes(
      user.password,
      data.password
    );

    if (!passwordMatches) {
      throw new BadRequestException('Invalid username or password.');
    }

    const tokens = await this.getTokens(user);

    await this.updateRefreshToken(user._id, tokens.refreshToken);

    return tokens;
  }

  logout(userId: Types.ObjectId) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId: Types.ObjectId, refreshToken: string) {
    const user = await this.usersService.findById(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied.');
    }

    const refreshTokenMatches = await this.compareHashes(
      user.refreshToken,
      refreshToken
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied.');
    }

    const tokens = await this.getTokens(user);

    await this.updateRefreshToken(user._id, tokens.refreshToken);

    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  compareHashes(hash1: string, hash2: string) {
    return bcrypt.compare(hash1, hash2);
  }

  async updateRefreshToken(userId: Types.ObjectId, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);

    return this.usersService.update(userId, {
      refreshToken: hashedRefreshToken
    });
  }

  async getTokens({ _id, email }: UserI) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: _id,
          email
        },
        {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          expiresIn: '15m'
        }
      ),
      this.jwtService.signAsync(
        {
          sub: _id,
          email
        },
        {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
          expiresIn: '7d'
        }
      )
    ]);

    return {
      accessToken,
      refreshToken
    };
  }
}
