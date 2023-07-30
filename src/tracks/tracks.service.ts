import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DB } from 'src/storage/storage.service';
import { v4 as uuidv4, validate } from 'uuid';
import { ArtistsService } from 'src/artists/artists.service';
import { AlbumsService } from 'src/albums/albums.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ArtistRemoveEvent } from 'src/artists/events/artist-remove.event';
import { AlbumRemoveEvent } from 'src/albums/events/album-remove.event';

@Injectable()
export class TracksService {
  public constructor(
    private storage: DB,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    private eventEmitter: EventEmitter2,
  ) {}

  create(createTrackDto: CreateTrackDto) {
    const { artistId, albumId } = createTrackDto;

    if (artistId.length && validate(artistId)) {
      const artist = this.artistsService.findOne(createTrackDto.artistId);
      createTrackDto.artistId = artist ? artist.id : null;
    } else throw new BadRequestException('artistId is invalid uuid');

    if (albumId.length && validate(albumId)) {
      const album = this.albumsService.findOne(albumId);
      createTrackDto.albumId = album ? album.id : null;
    } else throw new BadRequestException('albumId is invalid uuid');

    const newTrack = Object.assign({}, { ...createTrackDto }, { id: uuidv4() });
    this.storage.tracks.push(newTrack);
    return newTrack;
  }

  async findAll() {
    return this.storage.tracks;
  }

  findOne(id: string) {
    const track = this.storage.tracks.find((entry) => entry.id === id);
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const index = this.storage.tracks.findIndex((entry) => entry.id === id);
    if (index !== -1) {
      const track = this.storage.tracks[index];
      Object.assign(track, { ...updateTrackDto });
      return track;
    } else {
      throw new NotFoundException('Track not found');
    }
  }

  remove(id: string) {
    const track = this.storage.tracks.find((entry) => entry.id === id);
    if (!track) throw new NotFoundException('Track not found');
    this.storage.tracks = this.storage.tracks.filter(
      (entry) => entry.id !== id,
    );
    this.eventEmitter.emitAsync(
      'track.removed',
      new AlbumRemoveEvent(`track ${id} removed`, id),
    );
  }

  @OnEvent('artist.removed')
  async handleArtistRemoveEvent(event: ArtistRemoveEvent) {
    const { id } = event;
    const tracks = await this.findAll();
    tracks.forEach((entry) => {
      if (entry.artistId === id) {
        const updateTrackDto = {
          id: entry.id,
          name: entry.name,
          artistId: null,
          albumId: entry.albumId,
          duration: entry.duration,
        };

        this.update(entry.id, updateTrackDto);
      }
    });
  }

  @OnEvent('album.removed')
  async handleAlbumRemoveEvent(event: AlbumRemoveEvent) {
    const { id } = event;
    const tracks = await this.findAll();
    tracks.forEach((entry) => {
      if (entry.albumId === id) {
        const updateTrackDto = {
          id: entry.id,
          name: entry.name,
          artistId: entry.artistId,
          albumId: null,
          duration: entry.duration,
        };

        this.update(entry.id, updateTrackDto);
      }
    });
  }
}
