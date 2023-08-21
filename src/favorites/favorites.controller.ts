import {
  Controller,
  Get,
  Post,
  Param,
  ParseUUIDPipe,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('/track/:id')
  async addTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.favoritesService.addTrack({
      entries: 'track',
      itemId: id,
    });
  }

  @Delete('/track/:id')
  @HttpCode(204)
  async removeTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.favoritesService.delete({ itemId: id });
  }

  @Post('/album/:id')
  async addAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.favoritesService.addAlbum({
      entries: 'album',
      itemId: id,
    });
  }

  @Delete('/album/:id')
  @HttpCode(204)
  async removeAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.favoritesService.delete({ itemId: id });
  }

  @Post('/artist/:id')
  async addArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.favoritesService.addArtist({
      entries: 'artist',
      itemId: id,
    });
  }

  @Delete('/artist/:id')
  @HttpCode(204)
  async removeArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.favoritesService.delete({ itemId: id });
  }
}
