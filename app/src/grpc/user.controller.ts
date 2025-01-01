import { Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { userRepository } from "../store/repositories";
import { UserEntity } from '../store/entities';
@Injectable()
export class UserController {
    constructor(private readonly repository: userRepository) { }
    @GrpcMethod('UserServiceInternal', 'GetUser')
    async getUser(data: { userId: string }): Promise<{ ok: boolean; data: { userId: string; userName: string; createdTime: string; updatedTime: string } }> {
        const user: UserEntity | Error = await this.repository.GetUser(data.userId);

        // Check for errors or missing user
        if (user instanceof Error || !user) {
            return {
                ok: false,
                data: {
                    userId: '',
                    userName: '',
                    createdTime: '',
                    updatedTime: ''
                },
            };
        }
        return {
            ok: true,
            data: {
                userId: user.userId,
                userName: user.userName,
                createdTime: user.createdTime,
                updatedTime: user.updatedTime,
            },
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
