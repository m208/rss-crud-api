import { IUserData } from "../types";

export const isValidUserData = (data: any | IUserData): data is IUserData => {
    const typedData = data as IUserData;
   
    const nameCheck = typeof typedData.username == 'string';
    const ageCheck = typeof typedData.age == 'number';
    const arrayCheck = Array.isArray(typedData.hobbies);
    
    const arrayContentCheck = arrayCheck 
        ? typedData.hobbies.find(el => typeof el !== 'string') == undefined
        : false
        
    return ( nameCheck && ageCheck && arrayCheck && arrayContentCheck);
}