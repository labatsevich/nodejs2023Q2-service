import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { StorageModule } from './storage/storage.module';
import { ArtistsModule } from './artists/artists.module';
import { TracksModule } from './tracks/tracks.module';
import { AlbumsModule } from './albums/albums.module';
import { FavoritesModule } from './favorites/favorites.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    UsersModule,
    StorageModule,
    ArtistsModule,
    TracksModule,
    AlbumsModule,
    FavoritesModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
