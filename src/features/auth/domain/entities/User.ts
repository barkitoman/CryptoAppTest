export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: number;
}

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends AuthCredentials {
    name: string;
}

export interface AuthSession {
    user: User;
    token: string;
    expiresAt: number;
}
