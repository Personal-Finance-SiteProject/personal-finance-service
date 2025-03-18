import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './users.entity';

@Entity('category_expense')
export class CategoryExpenseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 20,
        nullable: false
    })
    type: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp'
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        nullable: true
    })
    updatedAt: Date;

    @Column({
        default: 1
    })
    status: number;

    @ManyToOne(() => UserEntity, (user) => user.categories, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        nullable: true
    })

    @ManyToOne(() => UserEntity, (user) => user.categories, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        nullable: true
    })
    @JoinColumn({ name: 'id_creator_user' })
    creator: UserEntity;

}
