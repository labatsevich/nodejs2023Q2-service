import { Module, forwardRef } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { StorageModule } from 'src/storage/storage.module';
import { ArtistsModule } from 'src/artists/artists.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [StorageModule, forwardRef(() => ArtistsModule)],
  controllers: [AlbumsController],
  providers: [AlbumsService, PrismaService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
