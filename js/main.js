import { getUselessFacts, createUselessFact, updateUselessFact, deleteUselessFact } from "./api/uselessFactsApi.js";
import { predictGender, predictMultipleGenders } from "./api/genderizeApi.js";
import { getRandomUsers, createUser, updateUser, deleteUser, searchUsers } from "./api/usersApi.js";
import { 
    skeletonFacts, 
    skeletonGender, 
    skeletonUsers,
    renderUselessFacts, 
    renderGenderPredictions, 
    renderRandomUsers,
    showError,
    showEmpty,
    showToast,
} from "./ui/render.js";

const tabs = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".tab");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const saveBtn = document.getElementById("savePost");
const closeModal = document.getElementById("closeModal");
const createPostBtn = document.getElementById("createPost");
const searchInput = document.getElementById("searchUser");
const singleNameInput = document.getElementById("singleNameInput");
const predictSingleBtn = document.getElementById("predictSingleBtn");
const singleGenderResult = document.getElementById("singleGenderResult");
const addUserBtn = document.getElementById("addUserBtn");

let usersCache = [];
let genderCache = [];
let factsCache = [];
let currentEditId = null;

async function load(type) {
    try {
        if (type === "facts") {
            const container = document.getElementById("factsList");
            skeletonFacts(container, 6);
            const data = await getUselessFacts(10);
            factsCache = data;
            renderUselessFacts(data, handleDeleteFact);
        }
        if (type === "gender") {
            const container = document.getElementById("genderList");
            skeletonGender(container, 4);
            const names = ["Александр", "Мария", "Дмитрий", "Елена", "Анна", "Михаил", "Ольга", "Сергей"];
            const data = await predictMultipleGenders(names);
            genderCache = data;
            renderGenderPredictions(data);
            if (singleGenderResult) singleGenderResult.classList.add("hidden");
        }
        if (type === "users") {
            const container = document.getElementById("usersList");
            skeletonUsers(container, 6);
            const data = await getRandomUsers(10, { nat: 'us,gb,ru,de' });
            usersCache = data;
            if (searchInput) searchInput.value = '';
            renderRandomUsers(data, handleEditUser, handleDeleteUser);
        }
    } catch (error) {
        console.error(`Error loading ${type}:`, error);
        const container = document.getElementById(`${type}List`);
        showError(container, error.message, () => load(type));
        showToast(`Ошибка загрузки: ${error.message}`, "error");
    }
}

window.load = load;

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initModal();
    initSearch();
    initCreateButton();
    initSinglePredict();
    initAddUser();
    load("facts"); 
});

function initTabs() {
    tabs.forEach(btn => {
        btn.onclick = async () => {
            const tabType = btn.dataset.tab;
            tabs.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            sections.forEach(s => s.classList.remove("active"));
            const targetSection = document.getElementById(tabType);
            if (targetSection) {
                targetSection.classList.add("active");
            }
            await load(tabType);
        };
    });
}

function initModal() {
    if (closeModal) {
        closeModal.onclick = () => closeModalHandler();
    }
    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal) {
                closeModalHandler();
            }
        };
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
            closeModalHandler();
        }
    });
}

function closeModalHandler() {
    if (modal) {
        modal.classList.add("hidden");
    }
    currentEditId = null;
    if (modalTitle) modalTitle.value = "";
    if (modalBody) modalBody.value = "";
}

function openModal(data = null) {
    if (!modal) return;
    modal.classList.remove("hidden");
    if (data) {
        currentEditId = data.id;
        if (modalTitle) modalTitle.value = data.text || data.name || '';
        if (modalBody) modalBody.value = data.text || '';
    } else {
        currentEditId = null;
        if (modalTitle) modalTitle.value = "";
        if (modalBody) modalBody.value = "";
    }
    if (modalTitle) modalTitle.focus();
}

function initSearch() {
    if (searchInput) {
        searchInput.oninput = (e) => {
            const query = e.target.value;
            if (!usersCache || usersCache.length === 0) return;
            const filtered = searchUsers(usersCache, query);
            if (filtered.length === 0 && query.trim() !== '') {
                showEmpty(document.getElementById("usersList"), "Пользователи не найдены");
            } else if (query.trim() === '') {
                renderRandomUsers(usersCache, handleEditUser, handleDeleteUser);
            } else {
                renderRandomUsers(filtered, handleEditUser, handleDeleteUser);
            }
        };
    }
}

function initCreateButton() {
    if (createPostBtn) {
        createPostBtn.onclick = () => openModal();
    }
    if (saveBtn) {
        saveBtn.onclick = handleSave;
    }
}

function initSinglePredict() {
    if (predictSingleBtn && singleNameInput) {
        predictSingleBtn.onclick = async () => {
            const name = singleNameInput.value.trim();
            if (!name) {
                showToast("Введите имя", "warning");
                return;
            }
            predictSingleBtn.disabled = true;
            predictSingleBtn.textContent = "Проверка...";
            try {
                const result = await predictGender(name);
                const genderColor = result.gender === 'male' ? 'var(--primary)' : 
                                   result.gender === 'female' ? 'var(--secondary)' : 'var(--text-muted)';
                if (singleGenderResult) {
                    singleGenderResult.innerHTML = `
                        <div class="gender-header">
                            <h3>${result.name}</h3>
                            <span class="gender-icon">${result.gender === 'male' ? '👨' : result.gender === 'female' ? '👩' : '❓'}</span>
                        </div>
                        <div class="gender-result" style="background: ${genderColor}15; border-left: 4px solid ${genderColor}">
                            <div class="gender-value">${result.genderRu || result.gender || 'Не определён'}</div>
                            <div class="gender-probability">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${result.probability ? result.probability * 100 : 0}%; background: ${genderColor}"></div>
                                </div>
                                <span>${result.confidence || '0%'} уверенность</span>
                            </div>
                            <div class="gender-count">На основе ${result.count || 0} записей</div>
                        </div>
                    `;
                    singleGenderResult.classList.remove("hidden");
                }
                showToast("Пол определён", "success");
            } catch (error) {
                showToast(`Ошибка: ${error.message}`, "error");
            } finally {
                predictSingleBtn.disabled = false;
                predictSingleBtn.textContent = "Проверить";
            }
        };
        singleNameInput.onkeydown = (e) => {
            if (e.key === "Enter") predictSingleBtn.click();
        };
    }
}

function initAddUser() {
    if (addUserBtn) {
        addUserBtn.onclick = async () => {
            const firstName = prompt("Имя:", "Новый");
            if (!firstName) return;
            
            const lastName = prompt("Фамилия:", "Пользователь");
            const email = prompt("Email:", `${firstName.toLowerCase()}@example.com`);
            
            try {
                const newUser = await createUser({
                    firstName: firstName || "Новый",
                    lastName: lastName || "Пользователь",
                    email: email || "user@example.com",
                    phone: "+7 (999) 000-00-00",
                    city: "Москва",
                    country: "Russia"
                });
                
                usersCache.unshift(newUser);
                renderRandomUsers(usersCache, handleEditUser, handleDeleteUser);
                showToast("Пользователь добавлен", "success");
            } catch (error) {
                showToast(`Ошибка: ${error.message}`, "error");
            }
        };
    }
}

async function handleDeleteFact(id, el) {
    if (!confirm("Удалить этот факт?")) return;
    el.style.transition = "all 0.3s ease";
    el.style.opacity = "0";
    el.style.transform = "scale(0.9) translateX(-20px)";
    try {
        await deleteUselessFact(id);
        setTimeout(() => {
            el.remove();
            showToast("Факт удалён", "success");
        }, 300);
    } catch (error) {
        showToast("Ошибка удаления", "error");
        el.style.opacity = "1";
        el.style.transform = "scale(1) translateX(0)";
    }
}

function handleEditUser(user) {
    const newName = prompt("Новое имя:", user.name.full);
    if (newName && newName.trim() !== '') {
        const [firstName, lastName] = newName.split(' ');
        updateUser(user.id, { 
            name: { 
                ...user.name, 
                first: firstName, 
                last: lastName || '', 
                full: newName 
            } 
        }).then(() => {
            const index = usersCache.findIndex(u => u.id === user.id);
            if (index !== -1) {
                usersCache[index].name = {
                    ...usersCache[index].name,
                    first: firstName,
                    last: lastName || '',
                    full: newName
                };
                renderRandomUsers(usersCache, handleEditUser, handleDeleteUser);
            }
            showToast(`${firstName} обновлён`, "success");
        });
    }
}

async function handleDeleteUser(id, el) {
    if (!confirm("Удалить этого пользователя?")) return;
    el.style.transition = "all 0.3s ease";
    el.style.opacity = "0";
    el.style.transform = "translateX(20px)";
    try {
        await deleteUser(id);
        usersCache = usersCache.filter(u => u.id !== id);
        setTimeout(() => {
            el.remove();
            showToast("Пользователь удалён", "success");
        }, 300);
    } catch (error) {
        showToast("Ошибка удаления", "error");
        el.style.opacity = "1";
        el.style.transform = "translateX(0)";
    }
}

async function handleSave() {
    const title = modalTitle?.value?.trim() || '';
    const body = modalBody?.value?.trim() || '';
    if (!title && !body) {
        showToast("Заполните хотя бы одно поле", "warning");
        return;
    }
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = "Сохранение...";
        saveBtn.classList.add("btn-loading");
    }
    try {
        if (currentEditId) {
            await updateUselessFact(currentEditId, { text: body || title });
            showToast("Факт обновлён", "success");
        } else {
            const newFact = await createUselessFact({ text: body || title });
            factsCache.unshift(newFact);
            renderUselessFacts(factsCache, handleDeleteFact);
            showToast("Факт создан", "success");
        }
        closeModalHandler();
    } catch (error) {
        showToast(`Ошибка: ${error.message}`, "error");
    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = "Сохранить";
            saveBtn.classList.remove("btn-loading");
        }
    }
}

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 25}s`;
        particle.style.animationDuration = `${20 + Math.random() * 15}s`;
        particlesContainer.appendChild(particle);
    }
}

createParticles();
