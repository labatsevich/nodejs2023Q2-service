import { IsNotEmpty, IsString, IsInt, NotEquals } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty({ message: 'field name is required' })
  name: string;

  @IsInt()
  @IsNotEmpty({ message: 'field year is required' })
  year: number;

  @NotEquals(undefined, {
    message: "artistId can't be empty, must be a string or null",
  })
  artistId: string | null;
}
