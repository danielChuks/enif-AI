import { Inject } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UsersService } from "../users/users.service";
import { User } from "../typeorm";

export class SessionSerializer extends PassportSerializer {
    constructor(
        @Inject("USER_SERVICE") private readonly userService: UsersService
    ) {
        super();
    }
    serializeUser(user: User, done: (err, user: User) => void) {
        done(null, user);
    }
    async deserializeUser(user: User, done: (err, user: User) => void) {
        const userDB = await this.userService.findUserbyId(user.id);
        return userDB ? done(null, user) : done(null, null);
    }
}
