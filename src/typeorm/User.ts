import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn({
        type: "bigint",
        name: "user_id",
    })
    id: number;

    @Column({
        nullable: false,
        default: "",
    })
    username: string;

    @Column({
        nullable: false,
        default: "",
    })
    firstName: string;

    @Column({
        nullable: false,
        default: "",
    })
    lastName: string;

    @Column({
        nullable: false,
        default: "",
    })
    email: string;

    @Column({})
    password: string;
}
