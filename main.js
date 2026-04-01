import * as FactsAPI from "./api/uselessFactsApi.js";
import * as UsersAPI from "./api/usersApi.js";
import * as GenderAPI from "./api/genderizeApi.js";
import { UI } from "./ui/render.js";

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.nav-btn[data-tab]');
    
    const switchTab = async (id) => {
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab').forEach(s => s.classList.remove('active'));
        document.querySelector(`[data-tab="${id}"]`).classList.add('active');
        document.getElementById(id).classList.add('active');

        if(id === 'facts') UI.renderFacts(await FactsAPI.getFacts()); 
        if(id === 'users') UI.renderUsers(await UsersAPI.getUsers()); 
    };

    tabs.forEach(t => t.onclick = () => switchTab(t.dataset.tab));

    document.getElementById("openFactModal").onclick = () => document.getElementById("factModal").classList.remove("hidden");
    document.getElementById("closeFactModal").onclick = () => document.getElementById("factModal").classList.add("hidden");
    document.getElementById("saveFact").onclick = async () => {
        const text = document.getElementById("modalFactBody").value;
        if (!text) return;
        const newFact = await FactsAPI.createFact(text); 
        UI.appendFact(newFact || { body: text }); 
        document.getElementById("factModal").classList.add("hidden");
        UI.showToast("Факт добавлен (POST)");
    };

    document.getElementById("openUserModal").onclick = () => document.getElementById("userModal").classList.remove("hidden");
    document.getElementById("closeUserModal").onclick = () => document.getElementById("userModal").classList.add("hidden");
    document.getElementById("saveUser").onclick = async () => {
        const n = document.getElementById("userNameInput").value, e = document.getElementById("userEmailInput").value;
        if (!n || !e) return;
        const newUser = await UsersAPI.createUser(n, e); 
        UI.appendUser({ ...newUser, name: n, email: e });
        document.getElementById("userModal").classList.add("hidden");
        UI.showToast("Пользователь создан (POST)");
    };

    document.getElementById("predictSingleBtn").onclick = async () => {
        const n = document.getElementById("singleNameInput").value;
        const res = await GenderAPI.predictGender(n);
        const div = document.getElementById("singleGenderResult");
        div.innerHTML = `<div class="card" style="margin-top:20px; border-color:var(--accent)"><h3>${res.gender}</h3><p>${res.probability}% уверенности</p></div>`;
        div.classList.remove("hidden");
    };

    switchTab('facts');
});