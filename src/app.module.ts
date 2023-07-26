import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { StorageModule } from './storage/storage.module';
import { ArtistsModule } from './artists/artists.module';
import { TracksModule } from './tracks/tracks.module';

@Module({
  imports: [UsersModule, StorageModule, ArtistsModule, TracksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
