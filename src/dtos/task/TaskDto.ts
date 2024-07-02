import { IsNotEmpty, MinLength, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TaskDto {
    @ApiProperty({
        description: "The name of the task",
        minLength: 3,
        example: "Write Unit Tests",
    })
    @IsNotEmpty({ message: "Name should not be empty" })
    @MinLength(3, { message: "Name must be at least 3 characters long" })
    name: string;

    @ApiProperty({
        description: "A brief description of the task",
        minLength: 3,
        example: "Write unit tests for the task module",
    })
    @IsNotEmpty({ message: "Description should not be empty" })
    @MinLength(3, { message: "Description must be at least 3 characters long" })
    description: string;

    @ApiProperty({
        description: "The completion status of the task",
        example: false,
    })
    @IsNotEmpty({ message: "Completion status should not be empty" })
    @IsBoolean({ message: "Completion status must be a boolean value" })
    isCompleted: boolean;
}
