import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { StorageModule } from 'src/storage/storage.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [StorageModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
