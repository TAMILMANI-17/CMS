import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeaturesService } from './features.service';
import { Feature, FeatureSchema } from './schemas/feature.schema';
import { FeaturesController } from './features.controller';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feature.name, schema: FeatureSchema }]),
    forwardRef(() => RolesModule),
  ],
  providers: [FeaturesService],
  controllers: [FeaturesController],
  exports: [FeaturesService],
})
export class FeaturesModule {}

