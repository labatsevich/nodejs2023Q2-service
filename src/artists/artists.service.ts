import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { DB } from 'src/storage/storage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistsService {
  constructor(private storage: DB) {}

  create(createArtistDto: CreateArtistDto) {
    const newArtist = {
      ...createArtistDto,
      id: uuidv4(),
    };
    this.storage.artists.push(newArtist);
    return newArtist;
  }

  findAll() {
    return this.storage.artists;
  }

  findOne(artistId: string): Artist {
    const artist = this.storage.artists.find((entry) => entry.id === artistId);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  update(artistId: string, updateArtistDto: UpdateArtistDto) {
    const index = this.storage.artists.findIndex(
      (entry) => entry.id === artistId,
    );

    if (index === -1) throw new NotFoundException('Artist not found');

    const artist = this.storage.artists[index];
    artist.grammy = updateArtistDto.grammy;
    artist.name = updateArtistDto.name;
    return artist;
  }

  remove(artistId: string) {
    this.storage.artists = this.storage.artists.filter(
      (entry) => entry.id !== artistId,
    );
  }
}
