import { Module } from '@nestjs/common';
import { DB } from './storage.service';

@Module({
  providers: [DB],
  exports: [DB],
})
export class StorageModule {}
