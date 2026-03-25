const BASE_URL = "https://uselessfacts.jsph.pl/random.json?language=en";
const STORAGE_KEY = 'useless_facts_cache';

export async function getUselessFacts(limit = 10) {
    try {
        const promises = [];
        for (let i = 0; i < limit; i++) {
            promises.push(
                fetch(BASE_URL)
                    .then(response => response.ok ? response.json() : null)
                    .catch(() => null)
            );
        }
        
        const results = await Promise.all(promises);
        
        const facts = results
            .filter(fact => fact && fact.text)
            .map((fact, index) => ({
                id: fact.id || `fact-${index}-${Date.now()}`,
                text: fact.text,
                source: "Useless Facts API",
                upvotes: Math.floor(Math.random() * 100),
                createdAt: new Date().toLocaleDateString('ru-RU')
            }));
        
        if (facts.length < 3) {
            throw new Error('API returned too few facts');
        }
        
        return facts;
        
    } catch (error) {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved).slice(0, limit);
        }
        
        return [
            { id: "fallback-1", text: "Кошки спят около 70% своей жизни, что составляет примерно 13-16 часов в день.", source: "Fallback Data", upvotes: 156, createdAt: new Date().toLocaleDateString('ru-RU') },
            { id: "fallback-2", text: "У кошек 32 мышцы в каждом ухе, что позволяет им поворачивать уши на 180 градусов.", source: "Fallback Data", upvotes: 142, createdAt: new Date().toLocaleDateString('ru-RU') },
            { id: "fallback-3", text: "Кошки могут прыгать в высоту, в 6 раз превышающую длину их тела.", source: "Fallback Data", upvotes: 138, createdAt: new Date().toLocaleDateString('ru-RU') },
            { id: "fallback-4", text: "У кошек есть третье веко, называемое 'мигательная перепонка', которое защищает глаза.", source: "Fallback Data", upvotes: 125, createdAt: new Date().toLocaleDateString('ru-RU') },
            { id: "fallback-5", text: "Кошки не чувствуют сладкий вкус из-за генетической мутации вкусовых рецепторов.", source: "Fallback Data", upvotes: 119, createdAt: new Date().toLocaleDateString('ru-RU') },
            { id: "fallback-6", text: "Кошки проводят 30-50% своего времени за вылизыванием шерсти.", source: "Fallback Data", upvotes: 112, createdAt: new Date().toLocaleDateString('ru-RU') },
            { id: "fallback-7", text: "Отпечаток носа кошки уникален, как отпечатки пальцев у человека.", source: "Fallback Data", upvotes: 108, createdAt: new Date().toLocaleDateString('ru-RU') },
            { id: "fallback-8", text: "Кошки могут издавать около 100 различных звуков, в то время как собаки — только около 10.", source: "Fallback Data", upvotes: 105, createdAt: new Date().toLocaleDateString('ru-RU') },
            { id: "fallback-9", text: "Сердце кошки бьётся почти в два раза быстрее, чем сердце человека.", source: "Fallback Data", upvotes: 98, createdAt: new Date().toLocaleDateString('ru-RU') },
            { id: "fallback-10", text: "Кошки могут бегать со скоростью до 48 км/ч на коротких дистанциях.", source: "Fallback Data", upvotes: 95, createdAt: new Date().toLocaleDateString('ru-RU') }
        ].slice(0, limit);
    }
}

export async function createUselessFact(data) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newFact = {
        id: `custom-${Date.now()}`,
        text: data.text || 'Новый интересный факт',
        source: 'User Submitted',
        upvotes: 0,
        createdAt: new Date().toLocaleDateString('ru-RU'),
        success: true
    };
    
    const saved = localStorage.getItem(STORAGE_KEY);
    const facts = saved ? JSON.parse(saved) : [];
    facts.unshift(newFact);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(facts));
    
    return newFact;
}

export async function updateUselessFact(id, data) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const saved = localStorage.getItem(STORAGE_KEY);
    let facts = saved ? JSON.parse(saved) : [];
    
    const index = facts.findIndex(f => f.id === id);
    if (index !== -1) {
        facts[index] = { ...facts[index], ...data, updatedAt: new Date().toLocaleDateString('ru-RU') };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(facts));
    }
    
    return { id, ...data, updatedAt: new Date().toLocaleDateString('ru-RU'), success: true };
}

export async function deleteUselessFact(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        let facts = JSON.parse(saved);
        facts = facts.filter(f => f.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(facts));
    }
    
    return { id, success: true, deletedAt: new Date().toISOString() };
}