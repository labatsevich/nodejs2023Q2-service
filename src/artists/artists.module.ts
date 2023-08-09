import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { StorageModule } from 'src/storage/storage.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [StorageModule],
  controllers: [ArtistsController],
  providers: [ArtistsService, PrismaService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
