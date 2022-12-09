import { Reflector } from '@nestjs/core';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../../users/entities/user.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles = this.reflector.get<string[]>(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization.split(' ')[1];

    const role = this.jwtService.decode(token)['role'];

    const user = request.user as User;

    if (!user) throw new BadRequestException('User not found');

    const hasRole = () => validRoles.includes(role);

    if (user && role && hasRole()) return true;

    throw new ForbiddenException(
      'You do not have permission to access this route',
    );
  }
}
