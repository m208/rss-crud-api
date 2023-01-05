import { IUser, IUserData } from "../types";
import { v4 as uuidv4 } from 'uuid';

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

    addUser(user: IUserData) {
        const newUser: IUser = {
            ...user, 
            id: uuidv4(),
        }
        this.users.push(newUser);
        return newUser;
    }

    updateUser(id: string, user: IUserData) {
        const index = this.users.findIndex(el => el.id === id);

        const updatedUser: IUser = {
            id,
            ...user,
        }

        if (index >= 0) {
            this.users[index] = updatedUser;
        }
        
        return (index >= 0)? updatedUser : null;
    }

    deleteUser(id: string) {
        const index = this.users.findIndex(el => el.id === id);
        if (index >= 0) {
            this.users.splice(index, 1);
        }
        return (index >= 0);
    }

}