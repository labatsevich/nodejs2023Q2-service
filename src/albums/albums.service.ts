import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DB } from 'src/storage/storage.service';
import { ArtistsService } from 'src/artists/artists.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AlbumsService {
  public constructor(
    private storage: DB,
    private prisma: PrismaService,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
  ) {}

  async create(data: CreateAlbumDto) {
    const { artistId } = data;

    if (
      (typeof artistId === 'string' && artistId.length !== 0) ||
      artistId === null
    ) {
      return await this.prisma.album.create({ data });
    } else
      throw new BadRequestException(
        'artistId should not be empty, artistId must be a string or null',
      );
  }

  async findAll() {
    return await this.prisma.album.findMany();
  }

  async findOne({ id }: Prisma.AlbumWhereUniqueInput) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  async update({ id }: Prisma.AlbumWhereUniqueInput, data: UpdateAlbumDto) {
    const { artistId } = data;

    if (
      (typeof artistId === 'string' && artistId.length !== 0) ||
      artistId === null
    ) {
      try {
        const album = await this.prisma.album.update({
          where: { id },
          data,
        });

        return album;
      } catch {
        throw new NotFoundException('Albun not found');
      }
    } else
      throw new BadRequestException(
        'artistId should not be empty, artistId must be a string or null',
      );
  }

  async remove({ id }: Prisma.AlbumWhereUniqueInput) {
    try {
      await this.prisma.album.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Album not found');
    }
  }
}
