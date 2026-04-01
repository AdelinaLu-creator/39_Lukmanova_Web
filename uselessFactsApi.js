export async function getFacts() {
    try {
        const res = await fetch('https://fish-text.ru/get?format=json&number=6');
        const data = await res.json();
        return data.text.split(/[.!?]\s/).filter(t => t.length > 5).map((t, i) => ({ 
            id: Date.now() + i, 
            text: t.trim() + '.' 
        }));
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function createFact(text) {
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({ body: text, userId: 1 }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });
        return await res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}