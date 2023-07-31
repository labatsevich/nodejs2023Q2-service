import { IsInt, IsNotEmpty, IsString, NotEquals } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty({ message: 'field is required' })
  name: string;

  @NotEquals(undefined, {
    message: "artistId can't be empty, must be a string or null",
  })
  artistId: string | null;
  @NotEquals(undefined, {
    message: "albumId can't be empty, must be a string or null",
  })
  albumId: string | null;

  @IsInt()
  @IsNotEmpty({ message: 'duration field is required ' })
  duration: number;
}
