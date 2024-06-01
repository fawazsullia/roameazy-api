import { IsString } from "class-validator";

export class CreateUserRequest {
    
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsString()
    confirmPassword: string;

    @IsString()
    companyName: string;

}