import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  picture: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password?: string;
}
