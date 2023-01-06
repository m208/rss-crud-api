export interface IUserData {
    username: string;
    age: number;
    hobbies: Array<string>;
}

export type IUser = IUserData & { id: string };

export interface ApiResponce {
    status: number;
    data: string | IUser | Array<IUser>;
}

export interface DBTransfer {
    db: Array<IUser>;
}