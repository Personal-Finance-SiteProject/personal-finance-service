import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptoService } from './crypto.service';
import { UserEntity } from '../common/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { addDays, format } from 'date-fns';
import * as jwt from 'jsonwebtoken';


@Injectable()

export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly cryptoService: CryptoService,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userRepository.findOne({
            where: {username},
        });
        if (user && (await this.cryptoService.comparePassword(password, user.password))) {
            const {id, fullName, username, email, status} = user;

            if (status === 2) {
                return {status: 2};
            }
            return {
                id,
                fullName,
                username,
                email,
                status,
                // pwdExpirationAt,
            };
        }
        return null;
    }

    async getUserByName(userName: string): Promise<any> {
        const user = await this.userRepository.findOne({
            where: {
                username: userName
            }
        });

        if (user) {
            const {
                id,
                fullName,
                username,
                email,
                status,
                // pwdExpirationAt,
            } = user;

            if (status === 2) {
                return { status: 2 };
            } else {
                return {
                    id,
                    fullName,
                    username,
                    email,
                    status,
                    // pwdExpirationAt,
                };
            }
        }
        return null;
    }


    async generateToken(user: any) {
        const payload = {
            sub: user.id,
            username: user.username,
            fullName: user.fullName,
            pwdExpirationAt: user.pwdExpirationAt,
            permissions: user.permissions,
            userToGroups: user.userToGroups,
            userToCompanies: user.userToCompanies,
        };
        const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";
        const countUnit = jwtExpiresIn.charAt(0);
        const days = parseInt(countUnit, 10) || 1;

        const currentDate = new Date();
        const expirationDate = addDays(currentDate, days);
        return {
            access_token: this.jwtService.sign(payload, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }),
            expiredAt: format(expirationDate, 'yyyy-MM-dd HH:mm:ss'),
        };
    }


    verificationLink(data: any) {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET no está definido en las variables de entorno');
        }

        const token = jwt.sign(data, jwtSecret, {
            expiresIn: '4h',
        });
        const ver = jwt.verify(token, jwtSecret);
        const id = data.id;
        return `${process.env.FRONTEND_URL}/authentication/resetPass/${token}`;
    }


    async reset(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
        });
        if (user) {
            return user;
        } else {
            throw new RpcException({
                code: 404,
                message: 'Usuario no encontrado',
            });
        }
    }


    // async recovery(data: any) {
    //     try {
    //         const update = await this.userRepository.update(
    //             { id: data.id },
    //             {
    //                 status: 2,
    //             },
    //         );
    //         if (update.affected > 0) {
    //             const link = this.verificationLink(data);
    //             await this.notificationProvider.sendMail({
    //                 ...data,
    //                 url: link,
    //             });
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     } catch (e) {
    //         console.log(e);
    //         throw new RpcException({
    //             code: 404,
    //             message: 'Usuario no encontrado',
    //         });
    //     }
    // }


}
