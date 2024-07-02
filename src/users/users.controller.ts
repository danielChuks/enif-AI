import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    // Header,
    Inject,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { SerializedUser } from "../types";
import { CreateUserDto } from "../dtos/users/CreateUser.dto";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserNotFoundException } from "../exception/UserNotFound.exception";
import { UpdateUserDto } from "../dtos/users/UpdateUser.dto";
import { ConfigService } from "@nestjs/config";

@ApiTags("users")
@Controller("users")
export class UsersController {
    containerName = this.configService.get<string>("CONTAINER_NAME");
    constructor(
        @Inject("USER_SERVICE") private readonly userservice: UsersService,
        // private readonly fileUploadService: FileUploadService,
        private readonly configService: ConfigService
    ) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("")
    getUsers() {
        return this.userservice.getUsers();
    }

    @ApiOperation({ summary: "Create a new user" })
    @ApiResponse({
        status: 201,
        type: SerializedUser,
        description: "The user has been successfully created.",
    })
    @ApiResponse({ status: 400, description: "Bad Request" })
    @ApiBody({ type: CreateUserDto })
    @UseInterceptors(ClassSerializerInterceptor)
    @Post("create")
    @UsePipes(ValidationPipe)
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userservice.createUser(createUserDto);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get("email/:email")
    async findUserByEmail(@Param("email") email: string) {
        try {
            const user = await this.userservice.findUserByEmail(email);
            if (user) return new SerializedUser(user);
            return new UserNotFoundException("User not found");
        } catch {
            throw new UserNotFoundException();
        }
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(ValidationPipe)
    @Get("id/:id")
    async findUserById(@Param("id", ParseIntPipe) id: number) {
        try {
            const user = await this.userservice.findUserbyId(id);
            if (user) return user;
            return new UserNotFoundException();
        } catch (error) {
            return error;
        }
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(ValidationPipe)
    @Delete("delete/:id")
    async deleteById(@Param("id", ParseIntPipe) id: number) {
        return this.userservice.deleteById(id);
    }

    @ApiBody({ type: UpdateUserDto })
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(ValidationPipe)
    @Put("update/:id")
    updateUserById(
        @Param("id", ParseIntPipe) id: number,
        @Body() createUserDto: CreateUserDto
    ) {
        return this.userservice.updateUserById(id, createUserDto);
    }
}
