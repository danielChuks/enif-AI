import { Injectable } from "@nestjs/common";
import { SerializedUser } from "../types";
import { InjectRepository } from "@nestjs/typeorm";
import { User as UserEntity } from "../typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dtos/users/CreateUser.dto";
import { encodePassword } from "../utils/bcrypt";
import { ConflictExcepton } from "../exception/Conflict.exception";
import { UserNotFoundException } from "../exception/UserNotFound.exception";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async getUsers(): Promise<SerializedUser[]> {
        const users = await this.userRepository.find();
        return users.map((user) => new SerializedUser(user));
    }

    //create new user...........................
    async createUser(createUserDto: CreateUserDto) {
        const lowercaseUserEmail = createUserDto.email.toLowerCase();

        const userExist = await this.userRepository.findOne({
            where: { email: lowercaseUserEmail },
        });

        if (userExist) {
            throw new ConflictExcepton("User with this email already exist");
        }
        const password = encodePassword(createUserDto.password);
        const newUser = this.userRepository.create({
            ...createUserDto,
            email: lowercaseUserEmail,
            password,
        });
        await this.userRepository.save(newUser);
        return new SerializedUser(newUser);
    }

    // find user by username ........................
    async findUserByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email } });
    }

    // find user by id
    async findUserbyId(id: number) {
        const userDB = await this.userRepository.findOne({ where: { id } });

        return new SerializedUser(userDB);
    }

    // Delete use by id
    async deleteById(id: number) {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (user) {
                await this.userRepository.delete({ id });
                return new SerializedUser(user);
            }
        } catch (error) {
            return new UserNotFoundException();
        }
    }

    // find and update user by id ........................
    async updateUserById(id: number, createUserDto: CreateUserDto) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (user) {
            await this.userRepository.update(id, createUserDto);
            return new SerializedUser(user);
        } else {
            return new UserNotFoundException();
        }
    }
}
