import { UserRoles } from "../enums";

export interface User{
    firstName?: string;
    lastName?: string;
    email?: string;
    username?: string;
    password?: string;
    role: UserRoles;
}