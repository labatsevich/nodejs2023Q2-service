import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DB } from 'src/storage/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { ArtistsService } from 'src/artists/artists.service';

@Injectable()
export class TracksService {
  public constructor(
    private storage: DB,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
  ) {}

  create(createTrackDto: CreateTrackDto) {
    if (createTrackDto.artistId.length !== 0) {
      const artist = this.artistsService.findOne(createTrackDto.artistId);
      createTrackDto.artistId = artist ? artist.id : null;
    }
    const newTrack = Object.assign({}, { ...createTrackDto }, { id: uuidv4() });
    this.storage.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return this.storage.tracks;
  }

  findOne(id: string) {
    const track = this.storage.tracks.find((entry) => entry.id === id);
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const index = this.storage.tracks.findIndex((entry) => entry.id === id);
    if (index !== -1) {
      const track = this.storage.tracks[index];
      Object.assign(track, { ...updateTrackDto });
      return track;
    } else {
      throw new NotFoundException('Track not found');
    }
  }

  remove(id: string) {
    const track = this.storage.tracks.find((entry) => entry.id === id);
    if (!track) throw new NotFoundException('Track not found');
    this.storage.tracks = this.storage.tracks.filter(
      (entry) => entry.id !== id,
    );
  }
}
