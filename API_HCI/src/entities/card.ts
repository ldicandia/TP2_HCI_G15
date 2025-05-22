import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { User } from "./user";
import { IsEnum, Length, Matches } from "class-validator";
import { CardType } from "./cardType";
import { Payment } from "./payment";

@Entity()
@Index(["number", "user"], { unique: true })
export class Card extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    number: string;

    @Column({ select: false })
    @Length(3)
    cvv: string;

    @Column()
    @Matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)
    expirationDate: string;

    @Column()
    @Length(1, 50)
    fullName: string;

    @Column({ default: CardType.CREDIT })
    @IsEnum(CardType)
    type: string;

    @Column({ type: "simple-json", nullable: true })
    metadata?: object;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, user => user.cards, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => Payment, payment => payment.card)
    payments: Payment[];
}