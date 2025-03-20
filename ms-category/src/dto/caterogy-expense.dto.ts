import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateCategoryDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsOptional()
    status?: number;
}
