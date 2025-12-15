import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FeaturesGuard } from '../auth/guards/features.guard';
import { Features } from '../auth/decorators/features.decorator';

@Controller('features')
@UseGuards(JwtAuthGuard, FeaturesGuard)
export class FeaturesController {
  @Get('feature_1')
  @Features('feature_1')
  feature1() {
    return { feature: 'feature_1', message: 'Feature 1 content' };
  }

  @Get('feature_2')
  @Features('feature_2')
  feature2() {
    return { feature: 'feature_2', message: 'Feature 2 content' };
  }

  @Get('feature_3')
  @Features('feature_3')
  feature3() {
    return { feature: 'feature_3', message: 'Feature 3 content' };
  }

  @Get('feature_4')
  @Features('feature_4')
  feature4() {
    return { feature: 'feature_4', message: 'Feature 4 content' };
  }

  @Get('feature_5')
  @Features('feature_5')
  feature5() {
    return { feature: 'feature_5', message: 'Feature 5 content' };
  }

  @Get('feature_6')
  @Features('feature_6')
  feature6() {
    return { feature: 'feature_6', message: 'Feature 6 content' };
  }

  @Get('feature_7')
  @Features('feature_7')
  feature7() {
    return { feature: 'feature_7', message: 'Feature 7 content' };
  }

  @Get('feature_8')
  @Features('feature_8')
  feature8() {
    return { feature: 'feature_8', message: 'Feature 8 content' };
  }

  @Get('feature_9')
  @Features('feature_9')
  feature9() {
    return { feature: 'feature_9', message: 'Feature 9 content' };
  }

  @Get('feature_10')
  @Features('feature_10')
  feature10() {
    return { feature: 'feature_10', message: 'Feature 10 content' };
  }
}


