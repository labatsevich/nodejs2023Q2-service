import { User } from 'src/users/entities/user.entity';

export class DB {
  public users: Array<User>;
  constructor() {
    this.users = [];
  }
}
