import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ArtistsService } from 'src/artists/artists.service';
import { AlbumsService } from 'src/albums/albums.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ArtistRemoveEvent } from 'src/artists/events/artist-remove.event';
import { AlbumRemoveEvent } from 'src/albums/events/album-remove.event';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TracksService {
  public constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(data: CreateTrackDto) {
    const { artistId, albumId } = data;

    if (
      ((typeof artistId === 'string' && artistId.length !== 0) ||
        artistId === null) &&
      ((typeof albumId === 'string' && albumId.length !== 0) ||
        albumId === null)
    ) {
      return await this.prisma.track.create({
        data,
      });
    } else
      throw new BadRequestException(
        'check fields: artistId / albumId should not be empty, artistId / albumId must be a string or null',
      );
  }

  async findAll() {
    return this.prisma.track.findMany();
  }

  async findOne({ id }: Prisma.TrackWhereUniqueInput) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) throw new NotFoundException('Track not found');

    return track;
  }

  async update({ id }: Prisma.TrackWhereUniqueInput, data: UpdateTrackDto) {
    const track = await this.findOne({ id });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    const { artistId, albumId } = data;

    if (
      ((typeof artistId === 'string' && artistId.length !== 0) ||
        artistId === null) &&
      ((typeof albumId === 'string' && albumId.length !== 0) ||
        albumId === null)
    ) {
      const track = await this.prisma.track.update({
        where: { id },
        data,
      });
      return track;
    } else
      throw new BadRequestException(
        'check fields: artistId / albumId should not be empty, artistId / albumId must be a string or null',
      );
  }

  async remove({ id }: Prisma.TrackWhereUniqueInput) {
    try {
      await this.prisma.track.delete({
        where: { id },
      });

      this.eventEmitter.emitAsync(
        'track.removed',
        new AlbumRemoveEvent(`track ${id} removed`, id),
      );
      return;
    } catch {
      throw new NotFoundException('Track not found');
    }
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

        this.update({ id }, updateTrackDto);
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

        this.update({ id }, updateTrackDto);
      }
    });
  }
}
