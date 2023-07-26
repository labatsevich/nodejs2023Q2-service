import { Artist } from 'src/artists/entities/artist.entity';
import { User } from 'src/users/entities/user.entity';

export class DB {
  public users: Array<User>;
  public artists: Array<Artist>;

  constructor() {
    this.users = [];
    this.artists = [];
  }
}
