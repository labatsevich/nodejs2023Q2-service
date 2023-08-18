import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { StorageModule } from './storage/storage.module';
import { ArtistsModule } from './artists/artists.module';
import { TracksModule } from './tracks/tracks.module';
import { AlbumsModule } from './albums/albums.module';
import { FavoritesModule } from './favorites/favorites.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './logger/custom-logger.module';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './common/filters/custom-exception.filter';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    LoggerModule,
    UsersModule,
    StorageModule,
    ArtistsModule,
    TracksModule,
    AlbumsModule,
    FavoritesModule,
    EventEmitterModule.forRoot(),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
