import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DB } from 'src/storage/storage.service';
import { ArtistsService } from 'src/artists/artists.service';
import { v4 as uuidv4 } from 'uuid';
import { OnEvent } from '@nestjs/event-emitter';
import { ArtistRemoveEvent } from 'src/artists/events/artist-remove.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AlbumsService {
  public constructor(
    private storage: DB,
    private eventEmmiter: EventEmitter2,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
  ) {}

  create(createAlbumDto: CreateAlbumDto) {
    if (createAlbumDto.artistId.length !== 0) {
      const artist = this.artistsService.findOne(createAlbumDto.artistId);
      createAlbumDto.artistId = artist ? artist.id : null;
    }

    const newAlbum = Object.assign({}, { ...createAlbumDto }, { id: uuidv4() });
    this.storage.albums.push(newAlbum);

    return newAlbum;
  }

  findAll() {
    return this.storage.albums;
  }

  findOne(id: string) {
    const album = this.storage.albums.find((entry) => entry.id === id);
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (this.isExists(id)) {
      const index = this.storage.albums.findIndex((entry) => entry.id === id);
      const album = this.storage.albums[index];
      Object.assign(album, { ...updateAlbumDto });
      return album;
    } else throw new NotFoundException('Album not found');
  }

  remove(id: string) {
    if (this.isExists(id)) {
      this.storage.albums = this.storage.albums.filter(
        (entry) => entry.id !== id,
      );
      this.eventEmmiter.emitAsync('album.removed');
    } else throw new NotFoundException('Album not found');
  }

  private isExists(id: string): boolean {
    const album = this.storage.albums.find((entry) => entry.id === id);
    if (album) return true;
    return false;
  }

  @OnEvent('artist.removed')
  async handleArtistRemoveEvent(event: ArtistRemoveEvent) {
    const { id } = event;
    const albums = await this.findAll();

    albums.forEach((entry) => {
      if (entry.artistId === id) {
        const updateAlbumDto = {
          id: entry.id,
          name: entry.name,
          year: entry.year,
          artistId: null,
        };
        this.update(entry.id, updateAlbumDto);
      }
    });
  }
}
