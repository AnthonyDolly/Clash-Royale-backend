import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';

export function Auth(...role: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...role),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
