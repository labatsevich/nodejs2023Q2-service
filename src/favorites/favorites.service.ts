import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { DB } from 'src/storage/storage.service';
import { TracksService } from 'src/tracks/tracks.service';
import { Favorite } from './entities/favorite.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { ArtistRemoveEvent } from 'src/artists/events/artist-remove.event';
import { AlbumRemoveEvent } from 'src/albums/events/album-remove.event';
import { TrackRemoveEvent } from 'src/tracks/events/track-remove.event';

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

  deleteTrack(trackId: string, skipError = false) {
    const track = this.storage.favorites.tracks.find((id) => id === trackId);

    if (!track && !skipError) {
      throw new NotFoundException('track is not favorite');
    }

    this.storage.favorites.tracks = this.storage.favorites.tracks.filter(
      (id) => id !== trackId,
    );
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

  deleteArtist(artistId: string, skipError = false) {
    const artist = this.storage.favorites.artists.find((id) => id === artistId);

    if (!artist && !skipError) {
      throw new NotFoundException('artist is not favorite');
    }

    this.storage.favorites.artists = this.storage.favorites.artists.filter(
      (id) => id !== artistId,
    );
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

  deleteAlbum(albumId: string, skipError = false) {
    const album = this.storage.favorites.albums.find((id) => id === albumId);

    if (!album && !skipError) {
      throw new NotFoundException('album is not favorite');
    }

    this.storage.favorites.albums = this.storage.favorites.albums.filter(
      (id) => id !== albumId,
    );
  }

  @OnEvent('artist.removed')
  handleRemoveArtistFromFavorites(event: ArtistRemoveEvent) {
    const { id } = event;
    this.deleteArtist(id, true);
  }

  @OnEvent('album.removed')
  handleRemoveAlbumFromFavorites(event: AlbumRemoveEvent) {
    const { id } = event;
    this.deleteAlbum(id, true);
  }

  @OnEvent('track.removed')
  async handleTrackRemoveEvent(event: TrackRemoveEvent) {
    const { id } = event;
    this.deleteTrack(id, true);
  }
}
