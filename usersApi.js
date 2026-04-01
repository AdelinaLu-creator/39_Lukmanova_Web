export async function getUsers() {
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await res.json();
        return data.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            avatar: `https://i.pravatar.cc/150?u=${u.id}`
        }));
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function createUser(name, email) {
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'POST',
            body: JSON.stringify({ name, email }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });
        return await res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}