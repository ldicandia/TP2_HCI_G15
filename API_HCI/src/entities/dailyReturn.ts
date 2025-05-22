import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { User } from "./user";

@Entity()
export class DailyReturn extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    returnGiven: number;

    @Column()
    investedBefore: number;

    @Column()
    investedAfter: number;

    @ManyToOne(() => User, user => user.dailyReturns)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}