import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { DB } from 'src/storage/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { ArtistRemoveEvent } from './events/artist-remove.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArtistsService {
  constructor(
    private storage: DB,
    private prisma: PrismaService,
    private evenEmitter: EventEmitter2,
  ) {}

  async create(data: CreateArtistDto) {
    const artist = await this.prisma.artist.create({ data });
    return artist;
  }

  async findAll() {
    return await this.prisma.artist.findMany();
  }

  async findOne({ id }: Prisma.ArtistWhereUniqueInput): Promise<Artist | null> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async update({ id }: Prisma.ArtistWhereUniqueInput, data: UpdateArtistDto) {
    try {
      const artist = await this.prisma.artist.update({
        where: { id },
        data,
      });
      return artist;
    } catch {
      throw new NotFoundException('Artist not found');
    }
  }

  async remove({ id }: Prisma.ArtistWhereUniqueInput) {
    try {
      await this.prisma.artist.delete({
        where: {
          id,
        },
      });
      return;
    } catch {
      throw new NotFoundException('Artist not found');
    }
  }
}
