export class AuthSignInDto {
    username: string;
    password: string;
}

export class AuthResetDto {
    id: number;
    status: number;
    password: string;
}

export class AuthSignOut {
    token: string
}
