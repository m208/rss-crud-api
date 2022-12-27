import { IUser } from "../types";

export class DBInMemory {
    users: Array<IUser>;

    constructor() {
        this.users = [];
    }

    getUsers() {
        return this.users;
    }

    getUser(id: string) {
        return this.users.find(el=>el.id === id) || null;
    }

    addUser(user: IUser) {
        this.users.push(user);
        return user;
    }

    updateUser(id: string, user: IUser) {
        const index = this.users.findIndex(el => el.id === id);

        if (index >= 0) {
            this.users[index] = user;
        }
        return (index >= 0)? user : null;
    }

    deleteUser(id: string) {
        const index = this.users.findIndex(el => el.id === id);
        if (index >= 0) {
            this.users.splice(index, 1);
        }
        return (index >= 0);
    }

}