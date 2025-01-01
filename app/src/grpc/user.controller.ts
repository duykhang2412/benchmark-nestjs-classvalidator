// import { UserController } from 'src/http/user.c
// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Injectable()
export class UserController {

    @GrpcMethod('UserServiceInternal', 'GetUser')
    getUser(data: { userId: string }): { ok: boolean; data: { userId: string; userName: string; createdTime: string; updatedTime: string } } {

        return {
            ok: true,
            data: null,
        };
    }

    // @GrpcMethod('UserServiceInternal', 'CreateUser')
    // createUser(data: CreateUserRequest): CreateUserResponse {
    //     // const newUser: BenchmarkHonoUser = data.data;
    //     // this.users.push(newUser);
    //     return { ok: true, data: "newUser" };
    // }

    // @GrpcMethod('UserServiceInternal', 'Update')
    // updateUser(data: UpdateUserRequest): UpdateUserResponse {

    //     return { ok: false };
    // }
}
