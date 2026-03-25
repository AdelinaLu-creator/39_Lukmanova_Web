// Cat Facts API
export { 
    getCatFacts, 
    createCatFact, 
    updateCatFact, 
    deleteCatFact 
} from './uselessFactsApi.js';

// Genderize API
export { 
    predictGender, 
    predictMultipleGenders, 
    savePrediction, 
    updatePrediction, 
    deletePrediction 
} from './genderizeApi.js';

// RandomUser API
export { 
    getRandomUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser, 
    searchUsers 
} from './usersApi.js';
