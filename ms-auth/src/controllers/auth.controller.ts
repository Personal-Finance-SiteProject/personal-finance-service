import { Body, ClassSerializerInterceptor, Controller, UseInterceptors, } from '@nestjs/common';
import { RabbitAuthMQ } from '../common/constants';
import { AuthSignInDto, AuthSignOut } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';


@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {
    }

    @MessagePattern(RabbitAuthMQ().actions.SIGN_IN)
    async signIn(@Body() userDto: AuthSignInDto) {
        const userData = await this.authService.validateUser(
            userDto.username,
            userDto.password,
        );
        if (userData) {
            if (userData.status === 2) {
                throw new RpcException({
                    code: 401,
                    message: 'Cambio de contraseña',
                });
            } else {
                const accessToken = await this.authService.generateToken(userData);
                return {
                    ...userData,
                    token: accessToken.access_token,
                    expiresIn: process.env.JWT_EXPIRES_IN,
                    expiredAt: accessToken.expiredAt,
                };
            }
        } else {
            throw new RpcException({
                code: 404,
                message: 'Usuario o contraseña incorrectos',
            });
        }

    }

}
