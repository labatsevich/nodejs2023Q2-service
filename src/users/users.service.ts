import {
  ClassSerializerInterceptor,
  Injectable,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { DB } from 'src/storage/storage.service';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private storage: DB, private prisma: PrismaService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  async create(data: Prisma.UserCreateInput) {
    data.version = 1;
    const user = await this.prisma.user.create({ data });
    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.prisma.user.findMany();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return {
      ...user,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  remove(id: string) {
    try {
      this.prisma.user.delete({
        where: {
          id,
        },
      });
      return true;
    } catch {
      return false;
    }
  }
}
