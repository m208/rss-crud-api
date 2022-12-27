export interface IUser {
    id: string;
    username: string;
    age: number;
    hobbies: Array<string>;
}

export interface ApiResponce {
    status: number;
    data: string | IUser | Array<IUser>;
}