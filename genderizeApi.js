const BASE_URL = "https://api.genderize.io";

/**
 * Предсказание пола по имени
 * @param {string} name - имя для анализа
 * @returns {Promise<Object>} Результат предсказания
 */
export async function predictGender(name) {
    if (!name || typeof name !== 'string' || name.trim() === '') {
        throw new Error('Имя не может быть пустым');
    }
    
    const cleanName = name.trim().split(' ')[0]; // Берём только первое имя
    
    try {
        const response = await fetch(`${BASE_URL}?name=${encodeURIComponent(cleanName)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
            name: data.name,
            gender: data.gender,
            genderRu: translateGender(data.gender),
            probability: data.probability || 0,
            confidence: data.probability ? `${Math.round(data.probability * 100)}%` : 'N/A',
            count: data.count || 0,
            emoji: getGenderEmoji(data.gender)
        };
        
    } catch (error) {
        console.error('Genderize API Error:', error);
        throw new Error(`Не удалось определить пол для имени "${cleanName}"`);
    }
}

/**
 * Предсказание пола для нескольких имён
 * @param {Array<string>} names - массив имён
 * @returns {Promise<Array>} Массив результатов
 */
export async function predictMultipleGenders(names) {
    if (!Array.isArray(names) || names.length === 0) {
        throw new Error('Необходимо передать массив имён');
    }
    
    // Обрабатываем каждое имя параллельно
    const promises = names.map(name => 
        predictGender(name).catch(error => ({
            name: name,
            error: error.message,
            gender: null,
            genderRu: 'Ошибка',
            probability: 0,
            confidence: '0%',
            count: 0,
            emoji: '❌'
        }))
    );
    
    return Promise.all(promises);
}

/**
 * Перевод пола на русский
 * @param {string} gender - пол на английском
 * @returns {string} Пол на русском
 */
function translateGender(gender) {
    switch (gender) {
        case 'male': return 'Мужской';
        case 'female': return 'Женский';
        default: return 'Не определён';
    }
}

/**
 * Получение эмодзи для пола
 * @param {string} gender - пол
 * @returns {string} Эмодзи
 */
function getGenderEmoji(gender) {
    switch (gender) {
        case 'male': return '👨';
        case 'female': return '👩';
        default: return '❓';
    }
}

/**
 * Сохранение предсказания (эмуляция для лабы)
 * @param {Object} data - данные предсказания
 * @returns {Promise<Object>} Сохранённое предсказание
 */
export async function savePrediction(data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
        id: `pred-${Date.now()}`,
        ...data,
        savedAt: new Date().toISOString(),
        success: true
    };
}

/**
 * Обновление предсказания (эмуляция)
 */
export async function updatePrediction(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
        id,
        ...data,
        updatedAt: new Date().toISOString(),
        success: true
    };
}

/**
 * Удаление предсказания (эмуляция)
 */
export async function deletePrediction(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
        id,
        success: true,
        deletedAt: new Date().toISOString()
    };
}