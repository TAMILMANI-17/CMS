import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesService } from './roles.service';
import { Role, RoleSchema } from './schemas/role.schema';
import { FeaturesModule } from '../features/features.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    forwardRef(() => FeaturesModule),
  ],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}

