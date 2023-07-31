import { Module, forwardRef } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { StorageModule } from 'src/storage/storage.module';
import { ArtistsModule } from 'src/artists/artists.module';

@Module({
  imports: [StorageModule, forwardRef(() => ArtistsModule)],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
