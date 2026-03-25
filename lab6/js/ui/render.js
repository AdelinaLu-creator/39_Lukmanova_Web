export function skeletonFacts(container, count = 6) {
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const el = document.createElement("div");
        el.className = "card skeleton skeleton-post";
        container.appendChild(el);
    }
}

export function skeletonGender(container, count = 4) {
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const el = document.createElement("div");
        el.className = "card skeleton skeleton-gender";
        container.appendChild(el);
    }
}

export function skeletonUsers(container, count = 6) {
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const el = document.createElement("div");
        el.className = "card skeleton skeleton-user";
        container.appendChild(el);
    }
}

export function renderUselessFacts(facts, onDelete) {
    const container = document.getElementById("factsList");
    if (!container) return;
    
    container.innerHTML = "";

    if (!facts || facts.length === 0) {
        showEmpty(container, "Факты не найдены");
        return;
    }

    facts.forEach((fact, index) => {
        const el = document.createElement("div");
        el.className = "card fact-card animate-slide-left";
        el.style.animationDelay = `${index * 0.1}s`;
        
        el.innerHTML = `
            <div class="card-header">
                <span class="card-id">#${fact.id?.slice(-6) || index + 1}</span>
                <span class="card-source">${fact.source}</span>
            </div>
            <p class="card-text">${fact.text}</p>
            <div class="fact-meta">
                <span class="fact-upvotes">${fact.upvotes || 0}</span>
                <span class="fact-date">${fact.createdAt || 'N/A'}</span>
            </div>
            <div class="actions">
                <button class="btn-small btn-copy" title="Копировать">Копировать</button>
                <button class="btn-small btn-delete" title="Удалить">Удалить</button>
            </div>
        `;

        const copyBtn = el.querySelector(".btn-copy");
        if (copyBtn) {
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(fact.text).then(() => {
                    showToast("Факт скопирован в буфер", "success");
                }).catch(() => {
                    showToast("Не удалось скопировать", "error");
                });
            };
        }

        const deleteBtn = el.querySelector(".btn-delete");
        if (deleteBtn && onDelete) {
            deleteBtn.onclick = () => onDelete(fact.id, el);
        }

        container.appendChild(el);
    });
}

export function renderGenderPredictions(predictions) {
    const container = document.getElementById("genderList");
    if (!container) return;
    
    container.innerHTML = "";

    if (!predictions || predictions.length === 0) {
        showEmpty(container, "Нет данных для отображения");
        return;
    }

    predictions.forEach((pred, index) => {
        const el = document.createElement("div");
        el.className = "card gender-card animate-scale";
        el.style.animationDelay = `${index * 0.1}s`;
        
        const genderColor = pred.gender === 'male' ? 'var(--primary)' : 
                           pred.gender === 'female' ? 'var(--secondary)' : 'var(--text-muted)';
        
        const probabilityPercent = pred.probability ? Math.round(pred.probability * 100) : 0;

        el.innerHTML = `
            <div class="gender-header">
                <h3 class="gender-name">${pred.name}</h3>
                <span class="gender-icon">${pred.gender === 'male' ? 'M' : pred.gender === 'female' ? 'F' : '?'}</span>
            </div>
            <div class="gender-result" style="background: ${genderColor}15; border-left: 4px solid ${genderColor}">
                <div class="gender-value">${pred.genderRu || pred.error || 'Не определён'}</div>
                <div class="gender-probability">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${probabilityPercent}%; background: ${genderColor}"></div>
                    </div>
                    <span>${pred.confidence || '0%'} уверенность</span>
                </div>
                <div class="gender-count">На основе ${pred.count || 0} записей</div>
            </div>
            ${pred.error ? `<div class="error-message" style="margin-top: 10px; font-size: 12px; color: var(--error)">${pred.error}</div>` : ''}
        `;

        container.appendChild(el);
    });
}

export function renderRandomUsers(users, onEdit, onDelete) {
    const container = document.getElementById("usersList");
    if (!container) return;
    
    container.innerHTML = "";

    if (!users || users.length === 0) {
        showEmpty(container, "Пользователи не найдены");
        return;
    }

    users.forEach((user, index) => {
        const el = document.createElement("div");
        el.className = "card user-card animate-slide-right";
        el.style.animationDelay = `${index * 0.05}s`;
        
        const initials = `${user.name?.first?.charAt(0) || 'U'}${user.name?.last?.charAt(0) || ''}`;

        el.innerHTML = `
            <img class="user-avatar" 
                 src="${user.avatar?.large || user.picture?.large}" 
                 alt="${user.name?.full || 'User'}" 
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%236366f1%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22 font-family=%22sans-serif%22>${initials}</text></svg>'">
            <div class="user-info">
                <h3 class="user-name">${user.name?.title || ''} ${user.name?.full || 'Unknown User'}</h3>
                <p class="user-email">${user.email || 'N/A'}</p>
                <p class="user-phone">${user.phone || user.cell || 'N/A'}</p>
                <p class="user-location">${user.location?.city || ''}, ${user.location?.country || ''}</p>
            </div>
            <div class="user-actions">
                <button class="btn-icon btn-edit" title="Редактировать">✏️</button>
                <button class="btn-icon btn-delete" title="Удалить">🗑️</button>
            </div>
        `;

        const editBtn = el.querySelector(".btn-edit");
        if (editBtn && onEdit) {
            editBtn.onclick = () => onEdit(user);
        }
        
        const deleteBtn = el.querySelector(".btn-delete");
        if (deleteBtn && onDelete) {
            deleteBtn.onclick = () => onDelete(user.id, el);
        }

        container.appendChild(el);
    });
}

export function showError(container, message, onRetry) {
    if (!container) return;
    
    container.innerHTML = `
        <div class="error-state">
            <h3>Ошибка загрузки</h3>
            <p>${message || 'Произошла неизвестная ошибка'}</p>
            ${onRetry ? `<button class="btn-primary btn-retry">Попробовать снова</button>` : ''}
        </div>
    `;
    if (onRetry) {
        const retryBtn = container.querySelector('.btn-retry');
        if (retryBtn) {
            retryBtn.onclick = onRetry;
        }
    }
}

export function showEmpty(container, message) {
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-state">
            <h3>Ничего не найдено</h3>
            <p>${message || 'Здесь пока пусто'}</p>
        </div>
    `;
}

export function showToast(message, type = "success", duration = 3000) {
    const toast = document.getElementById("toast");
    if (!toast) {
        console.warn('Toast element not found');
        return;
    }
    
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, duration);
}
