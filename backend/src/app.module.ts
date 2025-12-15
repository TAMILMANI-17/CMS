import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { FeaturesModule } from './features/features.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGODB_URI');
        if (!mongoUri) {
          throw new Error(
            'MONGODB_URI is not defined in environment variables. Please set it in your .env file.',
          );
        }
        return {
          uri: mongoUri,
          dbName: configService.get<string>('DB_NAME', 'CMS'),
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    FeaturesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

