import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { User } from 'src/users/entities/user.entity';

export class DB {
  public users: Array<User>;
  public artists: Array<Artist>;
  public tracks: Array<Track>;
  public albums: Array<Album>;

  constructor() {
    this.users = [];
    this.artists = [];
    this.tracks = [];
    this.albums = [];
  }
}
