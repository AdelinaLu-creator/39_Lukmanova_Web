export interface IUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
    location: string;
}

export interface IGender {
    name: string;
    gender: 'male' | 'female' | null;
    probability: number;
    count: number;
    genderRu: string; 
}

export interface IFact {
    id: number | string;
    text: string;
}