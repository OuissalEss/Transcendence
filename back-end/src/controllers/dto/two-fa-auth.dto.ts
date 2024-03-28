import { IsString } from "class-validator"

export class TwoFaAuthDto {
    @IsString()
    code: string
}