import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FEATURES_KEY } from '../decorators/features.decorator';
import { RolesService } from '../../roles/roles.service';

@Injectable()
export class FeaturesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFeatures = this.reflector.getAllAndOverride<string[]>(
      FEATURES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredFeatures || requiredFeatures.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }

    const userFeatures = await this.rolesService.getFeaturesByRole(user.role);

    return requiredFeatures.every((feature) => userFeatures.includes(feature));
  }
}

