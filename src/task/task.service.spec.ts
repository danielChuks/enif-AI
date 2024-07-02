import { Test, TestingModule } from "@nestjs/testing";
import { TaskService } from "./task.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Task as TaskEntity } from "../typeorm";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { TaskDto } from "../dtos/task/TaskDto";
import { UpdateTaskDto } from "../dtos/task/UpdateTaskDto";

describe("TaskService", () => {
    let service: TaskService;
    let repository: Repository<TaskEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TaskService,
                {
                    provide: getRepositoryToken(TaskEntity),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<TaskService>(TaskService);
        repository = module.get<Repository<TaskEntity>>(
            getRepositoryToken(TaskEntity)
        );
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("createTask", () => {
        it("should create a new task", async () => {
            const createTaskDto: TaskDto = {
                name: "Test Task",
                description: "Test Desc",
                isCompleted: false,
            };
            const savedTask = { ...createTaskDto, id: 1 };
            jest.spyOn(repository, "create").mockReturnValue(savedTask as any);
            jest.spyOn(repository, "save").mockResolvedValue(savedTask as any);

            expect(await service.createTask(createTaskDto)).toEqual(savedTask);
        });
    });

    describe("findAll", () => {
        it("should return an array of tasks", async () => {
            const tasks = [
                {
                    id: 1,
                    name: "Test Task",
                    description: "Test Desc",
                    isCompleted: false,
                },
            ];
            jest.spyOn(repository, "find").mockResolvedValue(tasks as any);

            expect(await service.findAll()).toEqual(tasks);
        });
    });

    describe("getTaskById", () => {
        it("should return a task", async () => {
            const task = {
                id: 1,
                name: "Test Task",
                description: "Test Desc",
                isCompleted: false,
            };
            jest.spyOn(repository, "findOneBy").mockResolvedValue(task as any);

            expect(await service.getTaskById(1)).toEqual(task);
        });

        it("should throw NotFoundException if task not found", async () => {
            jest.spyOn(repository, "findOneBy").mockResolvedValue(null);

            await expect(service.getTaskById(1)).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe("deleteById", () => {
        it("should delete a task", async () => {
            const task = {
                id: 1,
                name: "Test Task",
                description: "Test Desc",
                isCompleted: false,
            };
            jest.spyOn(repository, "findOne").mockResolvedValue(task as any);
            jest.spyOn(repository, "delete").mockResolvedValue(undefined);

            expect(await service.deleteById(1)).toEqual(task);
        });

        it("should throw NotFoundException if task not found", async () => {
            jest.spyOn(repository, "findOne").mockResolvedValue(null);

            await expect(service.deleteById(1)).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe("updateTaskById", () => {
        it("should update a task", async () => {
            const updateTaskDto: UpdateTaskDto = {
                name: "Updated Task",
                description: "Updated Desc",
                isCompleted: true,
            };
            const task = {
                id: 1,
                name: "Test Task",
                description: "Test Desc",
                isCompleted: false,
            };
            jest.spyOn(repository, "findOne").mockResolvedValue(task as any);
            jest.spyOn(repository, "update").mockResolvedValue(undefined);

            expect(await service.updateTaskById(1, updateTaskDto)).toEqual(
                task
            );
        });

        it("should throw NotFoundException if task not found", async () => {
            const updateTaskDto: UpdateTaskDto = {
                name: "Updated Task",
                description: "Updated Desc",
                isCompleted: true,
            };
            jest.spyOn(repository, "findOne").mockResolvedValue(null);

            await expect(
                service.updateTaskById(1, updateTaskDto)
            ).rejects.toThrow(NotFoundException);
        });
    });
});
