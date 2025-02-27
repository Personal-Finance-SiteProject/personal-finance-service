import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { CryptoService } from './services/crypto.service';
import { UserEntity } from "./common/entities/users.entity";


@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true, envFilePath: '../.env'}),
        TypeOrmModule.forFeature([UserEntity]),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_MAIN_HOST,
            port: parseInt(process.env.DB_MAIN_PORT ?? '3306'),
            username: process.env.DB_MAIN_USERNAME,
            password: process.env.DB_MAIN_PASSWORD,
            database: process.env.DB_MAIN_DATABASE,
            logging: true,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {expiresIn: process.env.JWT_EXPIRES_IN},
        }),

    ],
    controllers: [],
    providers: [AuthService, CryptoService],
})
export class AppModule {
}
