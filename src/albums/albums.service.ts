import {
  BadRequestException,
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
import { AlbumRemoveEvent } from './events/album-remove.event';

@Injectable()
export class AlbumsService {
  public constructor(
    private storage: DB,
    private eventEmmiter: EventEmitter2,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
  ) {}

  create(createAlbumDto: CreateAlbumDto) {
    const { artistId } = createAlbumDto;

    if (
      (typeof artistId === 'string' && artistId.length !== 0) ||
      artistId === null
    ) {
      const artist = this.storage.artists.find(({ id }) => id === artistId);
      createAlbumDto.artistId = artist ? artist.id : null;

      const newAlbum = Object.assign(
        {},
        { ...createAlbumDto },
        { id: uuidv4() },
      );
      this.storage.albums.push(newAlbum);
      return newAlbum;
    } else
      throw new BadRequestException(
        'artistId should not be empty, artistId must be a string or null',
      );
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
    const { artistId } = updateAlbumDto;

    if (
      (typeof artistId === 'string' && artistId.length !== 0) ||
      artistId === null
    ) {
      const artist = this.storage.artists.find(({ id }) => id === artistId);
      updateAlbumDto.artistId = artist ? artist.id : null;

      if (this.isExists(id)) {
        const index = this.storage.albums.findIndex((entry) => entry.id === id);
        const album = this.storage.albums[index];
        Object.assign(album, { ...updateAlbumDto });
        return album;
      } else throw new NotFoundException('Album not found');
    } else
      throw new BadRequestException(
        'artistId should not be empty, artistId must be a string or null',
      );
  }

  remove(id: string) {
    if (this.isExists(id)) {
      this.storage.albums = this.storage.albums.filter(
        (entry) => entry.id !== id,
      );
      this.eventEmmiter.emitAsync(
        'album.removed',
        new AlbumRemoveEvent(`album ${id} removed`, id),
      );
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
