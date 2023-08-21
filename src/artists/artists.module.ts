import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { StorageModule } from 'src/storage/storage.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [StorageModule, JwtModule],
  controllers: [ArtistsController],
  providers: [ArtistsService, PrismaService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
