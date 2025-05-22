import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {
    IsDateString,
    IsEmail,
//    IsOptional,
//    IsUrl,
    Length } from "class-validator";
import { Verification } from "./verification";
import { Account } from "./account";
import { Card } from "./card";
import { DailyReturn } from "./dailyReturn";
import { Payment } from "./payment";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    @Length(1, 50)
    firstName: string;

    @Column({ nullable: false })
    @Length(1, 50)
    lastName: string;

    @Column({ nullable: false, unique: true })
    @IsEmail()
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
    @IsDateString()
    birthDate: Date;

    @Column({ nullable: false, default: false })
    isVerified: boolean;

    @Column({ type: "simple-json", nullable: true })
    metadata?: object;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Verification, verification => verification.user, { cascade: true })
    verification: Verification[];

    @OneToOne(() => Account, account => account.user, { cascade: true })
    account: Account;

    @OneToMany(() => Card, card => card.user)
    cards: Card[];

    @OneToMany(() => Payment, payment => payment.payer, { cascade: true })
    paymentsPaid: Payment[];

    @OneToMany(() => Payment, payment => payment.receiver, { cascade: true })
    paymentsReceived: Payment[];

    @OneToMany(() => DailyReturn, dailyReturn => dailyReturn.user, { cascade: true })
    dailyReturns: DailyReturn[];
}