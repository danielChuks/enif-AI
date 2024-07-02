import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskModule } from "./task.module";
import { Task as TaskEntity } from "../typeorm";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("TaskController (e2e)", () => {
    let app: INestApplication;
    let repository: Repository<TaskEntity>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                TaskModule,
                TypeOrmModule.forRoot({
                    type: "sqlite",
                    database: ":memory:",
                    entities: [TaskEntity],
                    synchronize: true,
                }),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        repository = moduleFixture.get<Repository<TaskEntity>>(
            getRepositoryToken(TaskEntity)
        );
    });

    afterAll(async () => {
        await app.close();
    });

    describe("/task/create-task (POST)", () => {
        it("should create a new task", async () => {
            const createTaskDto = {
                name: "Test Task",
                description: "Test Desc",
                isCompleted: false,
            };

            return request(app.getHttpServer())
                .post("/task/create-task")
                .send(createTaskDto)
                .expect(201)
                .expect((res) => {
                    expect(res.body.name).toEqual(createTaskDto.name);
                    expect(res.body.description).toEqual(
                        createTaskDto.description
                    );
                    expect(res.body.isCompleted).toEqual(
                        createTaskDto.isCompleted
                    );
                });
        });
    });

    describe("/task (GET)", () => {
        it("should return an array of tasks", async () => {
            const task = new TaskEntity();
            task.name = "Test Task";
            task.description = "Test Desc";
            task.isCompleted = false;
            await repository.save(task);

            return request(app.getHttpServer())
                .get("/task")
                .expect(200)
                .expect((res) => {
                    expect(res.body.length).toBeGreaterThan(0);
                    expect(res.body[0].name).toEqual(task.name);
                });
        });
    });

    describe("/task/id/:id (GET)", () => {
        it("should return a single task by id", async () => {
            const task = new TaskEntity();
            task.name = "Test Task";
            task.description = "Test Desc";
            task.isCompleted = false;
            const savedTask = await repository.save(task);

            return request(app.getHttpServer())
                .get(`/task/id/${savedTask.id}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.name).toEqual(savedTask.name);
                    expect(res.body.description).toEqual(savedTask.description);
                    expect(res.body.isCompleted).toEqual(savedTask.isCompleted);
                });
        });

        it("should return 404 if task not found", async () => {
            return request(app.getHttpServer()).get("/task/id/999").expect(404);
        });
    });

    describe("/task/update/:id (PUT)", () => {
        it("should update a task by id", async () => {
            const task = new TaskEntity();
            task.name = "Test Task";
            task.description = "Test Desc";
            task.isCompleted = false;
            const savedTask = await repository.save(task);

            const updateTaskDto = {
                name: "Updated Task",
                description: "Updated Desc",
                isCompleted: true,
            };

            return request(app.getHttpServer())
                .put(`/task/update/${savedTask.id}`)
                .send(updateTaskDto)
                .expect(200)
                .expect((res) => {
                    expect(res.body.name).toEqual(updateTaskDto.name);
                    expect(res.body.description).toEqual(
                        updateTaskDto.description
                    );
                    expect(res.body.isCompleted).toEqual(
                        updateTaskDto.isCompleted
                    );
                });
        });

        it("should return 404 if task not found", async () => {
            const updateTaskDto = {
                name: "Updated Task",
                description: "Updated Desc",
                isCompleted: true,
            };

            return request(app.getHttpServer())
                .put("/task/update/999")
                .send(updateTaskDto)
                .expect(404);
        });
    });

    describe("/task/delete/:id (DELETE)", () => {
        it("should delete a task by id", async () => {
            const task = new TaskEntity();
            task.name = "Test Task";
            task.description = "Test Desc";
            task.isCompleted = false;
            const savedTask = await repository.save(task);

            return request(app.getHttpServer())
                .delete(`/task/delete/${savedTask.id}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.name).toEqual(savedTask.name);
                    expect(res.body.description).toEqual(savedTask.description);
                });
        });

        it("should return 404 if task not found", async () => {
            return request(app.getHttpServer())
                .delete("/task/delete/999")
                .expect(404);
        });
    });
});
