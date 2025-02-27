import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptoService } from './crypto.service';
import { UserEntity } from '../common/entities/users.entity';
import { JwtService } from '@nestjs/jwt';


@Injectable()

export class AuthService {
    constructor(
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
            const {id, fullName, username, email, status, pwdExpirationAt} = user;

            if (status === 2) {
                return {status: 2};
            }
            return {
                id,
                fullName,
                username,
                email,
                status,
                pwdExpirationAt,
            };
        }
        return null;
    }


}
