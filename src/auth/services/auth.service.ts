import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { access } from 'fs';
import { JwtTokenPayload } from '../models/JwtTokenPayload.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return user;
      }
    }
    return null;
  }

  generateJwt(user: User) {
    const payload: JwtTokenPayload = {
      username: user.username,
      role: user.role.name,
      sub: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
