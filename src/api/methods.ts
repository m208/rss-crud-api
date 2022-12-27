import { IUser } from "../types"


export const getUsers = () => {
    console.log('getUsers');
    
}

export const getUser = (id: string) => {
    console.log('getUser ', id);
    
}

export const addUser = (user: IUser) => {
    console.log('addUser ', user);
}

export const updateUser = (id: string, user: IUser) => {
    console.log('updateUser ', user);
}

export const deleteUser = (id: string) => {
    console.log('deleteUser ', id);
}