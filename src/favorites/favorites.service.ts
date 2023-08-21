import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TracksService } from 'src/tracks/tracks.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Artist, Prisma } from '@prisma/client';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    private prisma: PrismaService,
    readonly tracksService: TracksService,
  ) {}

  async findAll() {
    const artists: Artist[] = [];
    const albums = [];
    const tracks = [];

    const favoriteArtists = await this.prisma.favorite.findMany({
      select: { itemId: true },
      where: { entries: 'artist' },
    });

    const favoriteTracks = await this.prisma.favorite.findMany({
      select: { itemId: true },
      where: { entries: 'track' },
    });

    const favoriteAlbums = await this.prisma.favorite.findMany({
      select: { itemId: true },
      where: { entries: 'album' },
    });

    for await (const item of favoriteArtists) {
      const { itemId } = item;

      const artist = await this.prisma.artist.findUnique({
        where: { id: itemId },
      });

      if (artist) {
        artists.push(artist);
      }
    }

    for await (const item of favoriteAlbums) {
      const { itemId } = item;

      const album = await this.prisma.album.findUnique({
        where: { id: itemId },
      });

      if (album) {
        albums.push(album);
      }
    }

    for await (const item of favoriteTracks) {
      const { itemId } = item;

      const track = await this.prisma.track.findUnique({
        where: { id: itemId },
      });

      if (track) {
        tracks.push(track);
      }
    }

    return {
      artists,
      albums,
      tracks,
    } as Favorite;
  }

  async addTrack(data: Prisma.FavoriteCreateInput) {
    const { itemId } = data;

    const track = await this.prisma.track.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!track) {
      throw new UnprocessableEntityException(
        `track with id  ${itemId} doesn't exist`,
      );
    }

    const fav = await this.prisma.favorite.create({
      data,
    });

    return fav;
  }

  async addArtist(data: Prisma.FavoriteCreateInput) {
    const { itemId } = data;
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!artist) {
      throw new UnprocessableEntityException(
        `artist with id  ${itemId} doesn't exist`,
      );
    }

    const fav = await this.prisma.favorite.create({
      data,
    });

    return fav;
  }

  async addAlbum(data: Prisma.FavoriteCreateInput) {
    const { itemId } = data;
    const album = await this.prisma.album.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!album) {
      throw new UnprocessableEntityException(
        `album with id  ${itemId} doesn't exist`,
      );
    }

    const fav = await this.prisma.favorite.create({
      data,
    });

    return fav;
  }

  async delete({ itemId }: Prisma.FavoriteWhereUniqueInput) {
    try {
      await this.prisma.favorite.delete({
        where: {
          itemId,
        },
      });
      return;
    } catch {
      throw new NotFoundException('Record not found');
    }
  }
}
