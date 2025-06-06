import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvInterface } from './interfaces/common.interface';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { PlaylistModule } from './modules/playlist/playlist.module';
import { SongModule } from './modules/song/song.module';
import { CacheService } from './services/cache/cache.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { S3Module } from 'nestjs-s3';

/**
 * ANCHOR App Module
 * @date 18/04/2025 - 10:41:00
 *
 * @export
 * @class AppModule
 * @typedef {AppModule}
 */
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvInterface>) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvInterface>) => ({
        ttl: 1000 * 60 * 60 * 24 * 7, // 7 days,
        stores: [
          createKeyv({
            url: `redis://${configService.get<string>('REDIS_HOST')}:${configService.get<string>('REDIS_PORT')}`,
            password: configService.get<string>('REDIS_AUTH_PASS'),
            database: 0,
          }),
        ],
      }),
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvInterface>) => ({
        config: {
          host: configService.get<string>('REDIS_HOST'),
          port: Number(configService.get<string>('REDIS_PORT')),
          password: configService.get<string>('REDIS_AUTH_PASS'),
        },
      }),
    }),
    S3Module.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvInterface>) => ({
        config: {
          forcePathStyle: true,
          signatureVersion: 'v4',
          region: configService.get<string>('DIGITALOCEAN_SPACES_REGION'),
          endpoint: configService.get<string>('DIGITALOCEAN_SPACES_ENDPOINT'),
          credentials: {
            accessKeyId: configService.get<string>(
              'DIGITALOCEAN_SPACES_ACCESS_KEY_ID',
            )!,
            secretAccessKey: configService.get<string>(
              'DIGITALOCEAN_SPACES_SECRET_ACCESS_KEY',
            )!,
          },
        },
      }),
    }),
    PlaylistModule,
    SongModule,
  ],
  controllers: [AppController],
  providers: [AppService, CacheService],
  exports: [AppService, CacheService],
})
export class AppModule {}
