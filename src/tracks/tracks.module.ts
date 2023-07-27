import { forwardRef, Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { StorageModule } from 'src/storage/storage.module';
import { ArtistsModule } from 'src/artists/artists.module';

@Module({
  imports: [StorageModule, forwardRef(() => ArtistsModule)],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
