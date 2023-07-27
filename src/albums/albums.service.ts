import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DB } from 'src/storage/storage.service';
import { ArtistsService } from 'src/artists/artists.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlbumsService {
  public constructor(
    private storage: DB,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
  ) {}

  create(createAlbumDto: CreateAlbumDto) {
    if (createAlbumDto.artistId.length !== 0) {
      const artist = this.artistsService.findOne(createAlbumDto.artistId);
      createAlbumDto.artistId = artist ? artist.id : null;
    }

    const newAlbum = Object.assign({}, { ...createAlbumDto }, { id: uuidv4() });
    this.storage.albums.push(newAlbum);

    return newAlbum;
  }

  findAll() {
    return this.storage.albums;
  }

  findOne(id: string) {
    const album = this.storage.albums.find((entry) => entry.id === id);
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (this.isExists(id)) {
      const index = this.storage.albums.findIndex((entry) => entry.id === id);
      const album = this.storage.albums[index];
      Object.assign(album, { ...updateAlbumDto });
      return album;
    } else throw new NotFoundException('Album not found');
  }

  remove(id: string) {
    if (this.isExists(id)) {
      this.storage.albums = this.storage.albums.filter(
        (entry) => entry.id !== id,
      );
    } else throw new NotFoundException('Album not found');
  }

  private isExists(id: string): boolean {
    const album = this.storage.albums.find((entry) => entry.id === id);
    if (album) return true;
    return false;
  }
}
