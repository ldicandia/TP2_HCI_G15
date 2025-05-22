import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { IsEnum } from "class-validator";
import { User } from "./user";
import { VerificationType } from "./verificationType";

@Entity()
export class Verification extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: VerificationType.REGISTRATION })
    @IsEnum(VerificationType)
    type: string;

    @Column()
    code: string;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    expirationDate: Date;

    @ManyToOne(() => User, user => user.verification)
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}