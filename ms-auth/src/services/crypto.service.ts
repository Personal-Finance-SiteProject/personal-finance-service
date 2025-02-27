import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
    async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 16;
        return await bcrypt.hash(password, saltOrRounds);
    }
    async comparePassword(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}
