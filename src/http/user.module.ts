import { Module } from "@nestjs/common";
import { UserController } from "src/http/user.client";
import { userRepository } from "src/store/repositories";

@Module({
    imports: [],
    controllers: [UserController],
    providers: [userRepository],
    exports: [],
})
export class UserModule { }