export async function predictGender(name) {
    const res = await fetch(`https://api.genderize.io?name=${encodeURIComponent(name)}`);
    const data = await res.json();
    return {
        name: data.name,
        gender: data.gender === 'male' ? 'Мужской' : 'Женский',
        probability: Math.round(data.probability * 100),
        color: data.gender === 'male' ? '#8b5cf6' : '#ec4899'
    };
}