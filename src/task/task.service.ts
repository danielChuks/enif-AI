import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Task as TaskEntity } from "../typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TaskDto } from "../dtos/task/TaskDto";
import { UpdateTaskDto } from "../dtos/task/UpdateTaskDto";

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly taskRepository: Repository<TaskEntity>
    ) {}

    async createTask(createTaskDto: TaskDto): Promise<TaskEntity> {
        const newTask = this.taskRepository.create(createTaskDto);
        await this.taskRepository.save(newTask);
        return newTask;
    }

    async findAll(): Promise<TaskEntity[]> {
        return await this.taskRepository.find();
    }

    async getTaskById(id: number): Promise<TaskEntity> {
        const task = await this.taskRepository.findOneBy({ id });
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }

    async deleteById(id: number) {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (task) {
            await this.taskRepository.delete({ id });
            return task;
        } else {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }
    
    async updateTaskById(id: number, updateTaskDto: UpdateTaskDto) {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (task) {
            await this.taskRepository.update(id, updateTaskDto);
            return task;
        } else {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }

}
