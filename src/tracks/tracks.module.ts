import { forwardRef, Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { StorageModule } from 'src/storage/storage.module';
import { ArtistsModule } from 'src/artists/artists.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    StorageModule,
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
  ],
  controllers: [TracksController],
  providers: [TracksService, PrismaService],
  exports: [TracksService],
})
export class TracksModule {}
