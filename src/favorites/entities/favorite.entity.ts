import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';

export class Favorite {
  artists: Array<Artist>;
  albums: Array<Album>;
  tracks: Array<Track>;
}
