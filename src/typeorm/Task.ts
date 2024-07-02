import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn({
        type: "bigint",
        name: "task_id",
    })
    id: number;
    @Column({
        nullable: false,
        default: "",
    })
    name: string;

    @Column({
        nullable: false,
        default: "",
    })
    description: string;

    @Column({ default: false })
    isCompleted: boolean;
}
