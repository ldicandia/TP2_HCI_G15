import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { User } from "./user";
import { MinLength } from "class-validator";

@Entity()
export class Account extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'double', default: 0 })
    balance: number;

    @Column({ type: 'double', default: 0 })
    invested: number;

    @Column({ unique: true })
    cvu: string;

    @MinLength(6)
    @Column({ unique: true })
    alias: string;

    @OneToOne(() => User, user => user.account)
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}