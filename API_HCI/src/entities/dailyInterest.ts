import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class DailyInterest extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { nullable: false })
    rate: number;

    @CreateDateColumn()
    createdAt: Date;
}