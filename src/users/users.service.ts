import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DB } from 'src/storage/storage.service';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private storage: DB) {}
  create(createUserDto: CreateUserDto) {
    const newUser = {
      ...createUserDto,
      id: uuidv4(),
    } as User;

    this.storage.users.push(newUser);
    return newUser;
  }

  findAll() {
    return this.storage.users;
  }

  async findOne(id: string): Promise<User> {
    const user = this.storage.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const index = this.storage.users.findIndex((entry) => entry.id === id);
    if (index === -1) {
    }
    const user = this.storage.users[index];
    if (user.password === updateUserDto.oldpassword) {
      user.password = updateUserDto.newpassword;
    }
    return user;
  }

  remove(id: string) {
    this.storage.users = this.storage.users.filter((entry) => entry.id !== id);
  }
}
