import { Inject, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { comparePassword } from "../utils/bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserNotFoundException } from "../exception/UserNotFound.exception";

@Injectable()
export class AuthService {
    constructor(
        @Inject("USER_SERVICE") private readonly userService: UsersService,
        private jwtService: JwtService
    ) {}
    async validateUser(email: string, passowrd: string) {
        const userDB = await this.userService.findUserByEmail(email);
        if (!userDB) {
            throw new UserNotFoundException();
        }
        const match = comparePassword(passowrd, userDB.password);
        if (!match) {
            return new UserNotFoundException();
        }

        const payload = { sub: userDB.id, email: userDB.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
