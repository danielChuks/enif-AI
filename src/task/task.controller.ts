import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    ValidationPipe,
    UsePipes,
    ParseIntPipe,
    Put,
} from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskDto } from "../dtos/task/TaskDto";
import { UpdateTaskDto } from "../dtos/task/UpdateTaskDto";

@Controller("task")
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Post("create-task")
    async create(@Body() createTaskDto: TaskDto) {
        return await this.taskService.createTask(createTaskDto);
    }

    @Get("")
    async findAll() {
        return await this.taskService.findAll();
    }

    @UsePipes(ValidationPipe)
    @Get("id/:id")
    async findOne(@Param("id", ParseIntPipe) id: number) {
        return await this.taskService.getTaskById(id);
    }

    // .........................

    @UsePipes(ValidationPipe)
    @UsePipes(ValidationPipe)
    @Put("update/:id")
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateTaskDto: UpdateTaskDto
    ) {
        return await this.taskService.updateTaskById(id, updateTaskDto);
    }

    //...................

    @UsePipes(ValidationPipe)
    @Delete("delete/:id")
    async(@Param("id", ParseIntPipe) id: number) {
        return this.taskService.deleteById(id);
    }
}
