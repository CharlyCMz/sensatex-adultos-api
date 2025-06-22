import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Public_Key } from '../decorators/public.decorator';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
//import { Request } from 'express';

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(Public_Key, context.getHandler());
    if (isPublic) {
      return true; // Skip API key validation for public routes
    }
    //To access the request object
    //const requets = context.switchToHttp().getRequest<Request>();
    //const accessToken = requets.headers['accessToken'];
    return super.canActivate(context);
  }
}
