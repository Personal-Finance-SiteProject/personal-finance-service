import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CategoryExpenseEntity } from './category-expense.entity';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'full_name', length: 100, nullable: false})
    fullName: string;

    @Column({length: 50, unique: true, nullable: false})
    email: string;

    @Column({name: 'user_name', length: 20, nullable: false})
    userName: string;

    @Column({length: 200, nullable: false})
    password: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Column({length: 255, nullable: true})
    avatar: string;

    @UpdateDateColumn({name: 'updated_at', nullable: true})
    updatedAt: Date;

    @Column({default: 1})
    status: number;

    @OneToMany(
        () => CategoryExpenseEntity,
        (category) => category.creator
    )
    categories: CategoryExpenseEntity[];
}


