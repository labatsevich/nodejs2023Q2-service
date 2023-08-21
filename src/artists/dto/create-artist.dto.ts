import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty({ message: 'field is required' })
  @Length(2, 30)
  name: string;

  @IsBoolean()
  grammy: boolean;
}
