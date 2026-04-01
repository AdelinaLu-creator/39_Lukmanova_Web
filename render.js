export const UI = {
    renderFacts(facts) {
        const list = document.getElementById("factsList");
        list.innerHTML = "";
        facts.forEach(f => this.appendFact(f));
    },
    appendFact(f) {
        const list = document.getElementById("factsList");
        const card = document.createElement('div');
        card.className = 'card animate-fadeIn';
        card.innerHTML = `<p>${f.text || f.body}</p>
        <button class="del" style="background:none; border:none; cursor:pointer; margin-top:15px; color:#ef4444; font-size:0.8rem;">Удалить</button>`;
        card.querySelector('.del').onclick = () => { card.remove(); this.showToast("Удалено локально"); }; // DELETE (UI)
        list.prepend(card);
    },
    renderUsers(users) {
        const list = document.getElementById("usersList");
        list.innerHTML = "";
        users.forEach(u => this.appendUser(u));
    },
    appendUser(u) {
        const list = document.getElementById("usersList");
        const card = document.createElement('div');
        card.className = 'card animate-fadeIn';
        card.style = "display:flex; align-items:center; gap:20px;";
        card.innerHTML = `
            <img src="${u.avatar || 'https://i.pravatar.cc/150?u='+u.id}" style="width:60px; border-radius:15px; border:2px solid var(--accent);">
            <div style="flex:1"><h4>${u.name}</h4><small>${u.email}</small></div>
            <button class="del" style="background:none; border:none; cursor:pointer; font-size:1.2rem;">🗑️</button>`;
        card.querySelector('.del').onclick = async () => {
            await fetch(`https://jsonplaceholder.typicode.com/users/${u.id}`, { method: 'DELETE' });
            card.remove(); 
            this.showToast("Удалено (DELETE)"); 
        };
        list.prepend(card);
    },
    showToast(msg) {
        const t = document.getElementById("toast");
        t.textContent = msg; t.classList.add("show");
        setTimeout(() => t.classList.remove("show"), 3000);
    }
};