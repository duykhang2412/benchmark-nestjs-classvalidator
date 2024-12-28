import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    userId!: string;

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    userName!: string;
}
