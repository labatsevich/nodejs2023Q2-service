import {
  ClassSerializerInterceptor,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DB } from 'src/storage/storage.service';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private storage: DB) {}

  @UseInterceptors(ClassSerializerInterceptor)
  create(createUserDto: CreateUserDto): Partial<User> {
    const newUser = new User({ ...createUserDto });
    newUser.id = uuidv4();
    newUser.version = 1;
    newUser.createdAt = Date.now();
    newUser.updatedAt = Date.now();

    this.storage.users.push(newUser);

    return newUser;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.storage.users;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(id: string): Promise<User> {
    const user = this.storage.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  update(id: string, updateUserDto: UpdateUserDto) {
    const index = this.storage.users.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }
    const user = this.storage.users[index];
    if (updateUserDto.oldPassword !== user.password) {
      throw new ForbiddenException('Old password is wrong');
    }
    user.password = updateUserDto.newPassword;
    user.version = user.version + 1;
    user.updatedAt = Date.now();
    return user;
  }

  remove(id: string) {
    const user = this.storage.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.storage.users = this.storage.users.filter((entry) => entry.id !== id);
  }
}
