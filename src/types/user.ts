export interface CreatUserPayload {
    fullName: string;
    email: string;
    dateOfBirth: Date;
    passwordHash: string;
    mobile: string;
}

export interface UserDetails {
    userId: string;
    fullName: string;
    email: string;
    dateOfBirth: Date;
    passwordHash: string;
    mobile: string;
}
