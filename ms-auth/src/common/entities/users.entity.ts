import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'full_name', type: 'varchar', length: 100, nullable: false })
    fullName: string;

    @Column({ name: 'email', type: 'varchar', length: 50, unique: true, nullable: false })
    email: string;

    @Column({ name: 'user_name', type: 'varchar', length: 20, nullable: false })
    username: string;

    @Column({ name: 'password', type: 'varchar', length: 30, nullable: false })
    password: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'avatar', type: 'varchar', length: 255, nullable: true })
    avatar?: string;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

    @Column({ name: 'status', type: 'int', default: 1 })
    status: number;

    @Column({ name: 'company_id', type: 'int', nullable: true })
    companyId?: number;

    @Column({ name: 'pwd_expiration_at', type: 'datetime', nullable: true })
    pwdExpirationAt?: Date;

    @Column({ name: 'extra_info', type: 'json', nullable: true })
    extraInfo?: any;
}
