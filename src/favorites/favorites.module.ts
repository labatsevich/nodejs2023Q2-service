import { Module, forwardRef } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { StorageModule } from 'src/storage/storage.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [StorageModule, forwardRef(() => TracksModule)],
  controllers: [FavoritesController],
  providers: [FavoritesService, PrismaService],
})
export class FavoritesModule {}
