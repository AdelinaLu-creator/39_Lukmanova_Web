import type { IUser, IGender } from './types';

const MOCK_API = 'https://jsonplaceholder.typicode.com/posts';

export const api = {
    getUsers: async (count = 6): Promise<IUser[]> => {
        const res = await fetch(`https://randomuser.me/api/?results=${count}`);
        if (!res.ok) throw new Error('Ошибка при получении пользователей');
        const data = await res.json();
        
        return data.results.map((u: any) => ({
            id: u.login.uuid,
            name: `${u.name.first} ${u.name.last}`,
            email: u.email,
            avatar: u.picture.large,
            location: u.location.city
        }));
    },

    getGender: async (name: string): Promise<IGender> => {
        const res = await fetch(`https://api.genderize.io/?name=${encodeURIComponent(name)}`);
        if (!res.ok) throw new Error('Ошибка при анализе имени');
        const data = await res.json();
        
        return {
            name: data.name,
            gender: data.gender,
            probability: data.probability,
            count: data.count,
            genderRu: data.gender === 'male' ? 'Мужчина' : 
                      data.gender === 'female' ? 'Женщина' : 'Не определено'
        };
    },

    createFact: async (text: string) => {
        const res = await fetch(MOCK_API, {
            method: 'POST',
            body: JSON.stringify({ title: 'System Log', body: text, userId: 1 }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });
        return await res.json();
    },

    deleteFact: async (id: number | string) => {
        const res = await fetch(`${MOCK_API}/${id}`, {
            method: 'DELETE'
        });
        return res.ok;
    }
};