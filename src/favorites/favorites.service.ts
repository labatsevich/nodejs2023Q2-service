import {
  Inject,
  Injectable,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { DB } from 'src/storage/storage.service';
import { TracksService } from 'src/tracks/tracks.service';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    private storage: DB,
    @Inject(forwardRef(() => TracksService))
    readonly tracksService: TracksService,
  ) {}

  findAll() {
    const favorites = new Favorite();
    const { artists, albums, tracks } = this.storage.favorites;

    favorites.artists = [];
    favorites.albums = [];
    favorites.tracks = [];

    tracks.forEach((id) => {
      const track = this.storage.tracks.find((entry) => entry.id === id);
      favorites.tracks.push(track);
    });

    albums.forEach((id) => {
      const album = this.storage.albums.find((entry) => entry.id === id);
      favorites.albums.push(album);
    });

    artists.forEach((id) => {
      const artist = this.storage.artists.find((entry) => entry.id === id);
      favorites.artists.push(artist);
    });

    return favorites;
  }

  addTrack(trackId: string) {
    const track = this.storage.tracks.find((entry) => entry.id === trackId);

    if (!track) {
      throw new UnprocessableEntityException(
        `track with id  ${trackId} doesn't exist`,
      );
    }

    this.storage.favorites.tracks.push(trackId);

    return {
      message: `track "${track.name}" added to favorites`,
    };
  }

  addArtist(artistId: string) {
    const artist = this.storage.artists.find((entry) => entry.id === artistId);

    if (!artist) {
      throw new UnprocessableEntityException(
        `artist with id  ${artistId} doesn't exist`,
      );
    }

    this.storage.favorites.artists.push(artistId);

    return {
      message: `"${artist.name}" added to favorites`,
    };
  }

  addAlbum(albumId: string) {
    const album = this.storage.albums.find((entry) => entry.id === albumId);

    if (!album) {
      throw new UnprocessableEntityException(
        `album with id  ${albumId} doesn't exist`,
      );
    }

    this.storage.favorites.albums.push(albumId);

    return {
      message: `"${album.name}" added to favorites`,
    };
  }
}
