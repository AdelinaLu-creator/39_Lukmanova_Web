const BASE_URL = "https://randomuser.me/api";

export async function getRandomUsers(count = 10, options = {}) {
    const params = new URLSearchParams({
        results: count.toString(),
        inc: 'name,email,phone,cell,location,picture,login',
        nat: options.nat || 'us,gb,ru,de'
    });
    
    const response = await fetch(`${BASE_URL}?${params}`);
    
    if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.results.map(user => ({
        id: user.login.uuid,
        name: {
            title: user.name.title,
            first: user.name.first,
            last: user.name.last,
            full: `${user.name.first} ${user.name.last}`
        },
        email: user.email,
        phone: user.phone,
        cell: user.cell,
        location: {
            street: `${user.location.street.number} ${user.location.street.name}`,
            city: user.location.city,
            state: user.location.state,
            country: user.location.country,
            postcode: user.location.postcode
        },
        avatar: {
            large: user.picture.large,
            medium: user.picture.medium,
            thumbnail: user.picture.thumbnail
        },
        username: user.login.username
    }));
}

export async function createUser(userData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        id: crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
        name: {
            title: userData.title || 'Mr',
            first: userData.firstName || 'John',
            last: userData.lastName || 'Doe',
            full: `${userData.firstName || 'John'} ${userData.lastName || 'Doe'}`
        },
        email: userData.email || `user${Date.now()}@example.com`,
        phone: userData.phone || '+1-555-000-0000',
        location: {
            city: userData.city || 'Unknown',
            country: userData.country || 'Unknown'
        },
        avatar: {
            large: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.firstName || 'J')}+${encodeURIComponent(userData.lastName || 'D')}&size=256`
        },
        createdAt: new Date().toISOString(),
        success: true
    };
}

export async function updateUser(id, userData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        id,
        ...userData,
        updatedAt: new Date().toISOString(),
        success: true
    };
}

export async function deleteUser(id) {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.05) {
                resolve({ success: true, id, deletedAt: new Date().toISOString() });
            } else {
                reject(new Error('Ошибка удаления'));
            }
        }, 300);
    });
}

export function searchUsers(users, query) {
    if (!query || query.trim() === '') {
        return users || [];
    }
    
    const searchQuery = query.toLowerCase().trim();
    
    return (users || []).filter(user => {
        if (!user || !user.name) return false;
        
        const name = (user.name.full || `${user.name.first} ${user.name.last}`).toLowerCase();
        const email = (user.email || '').toLowerCase();
        const city = (user.location?.city || '').toLowerCase();
        const country = (user.location?.country || '').toLowerCase();
        
        return name.includes(searchQuery) ||
               email.includes(searchQuery) ||
               city.includes(searchQuery) ||
               country.includes(searchQuery);
    });
}