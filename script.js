const CARD_IMAGES = [
  { id: 'rainbow', src: 'https://i.pinimg.com/736x/e3/71/c3/e371c3f2f01ef5786e22264078772644.jpg', alt: 'Рейнбоу Дэш' },
  { id: 'sparkle', src: 'https://i.pinimg.com/736x/1a/89/5b/1a895b9c4a726be809263bbc412c41c7.jpg', alt: 'Искорка' },
  { id: 'applejack', src: 'https://i.pinimg.com/736x/e6/78/7d/e6787de4af534fa5865fd36d413d3ef0.jpg', alt: 'Эплджек' },
  { id: 'pinkie', src: 'https://i.pinimg.com/736x/00/d4/90/00d4909ad39ab7a5eef35e9e463140ae.jpg', alt: 'Пинки Пай' }
];

class Card {
  constructor({ id, name, type, cost, description, power, rarity, predefined = true, imageId = 'pinkie' }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.cost = cost;
    this.description = description;
    this.power = power;
    this.rarity = rarity;
    this.predefined = predefined;
    this.imageId = imageId;
  }

  getCardTypeName() { return this.type; }
  getStatsText() { return this.power ? `Сила: ${this.power}` : ""; }
  getRarityInfo() { return this.rarity ? `Редкость: ${this.rarity}` : ""; }

  getDataForSave() {
    return {
      id: this.id, name: this.name, type: this.type, cost: this.cost,
      description: this.description, power: this.power, rarity: this.rarity,
      predefined: this.predefined, imageId: this.imageId, className: this.constructor.name
    };
  }

  renderCardElement(isEditMode, handlers) {
    const article = document.createElement("article");
    article.className = "card";
    article.dataset.cardId = this.id;

    const imgContainer = document.createElement("div");
    imgContainer.className = "card-image-container";
    const img = document.createElement("img");
    const imageData = CARD_IMAGES.find(i => i.id === this.imageId) || CARD_IMAGES[3];
    img.src = imageData.src;
    img.alt = imageData.alt;
    img.className = "card-image";
    imgContainer.appendChild(img);
    article.appendChild(imgContainer);

    const header = document.createElement("div");
    header.className = "card-header";
    const titleWrap = document.createElement("div");
    
    const typeEl = document.createElement("div");
    typeEl.className = "card-type";
    typeEl.textContent = this.getCardTypeName();
    
    const nameEl = document.createElement("div");
    nameEl.className = "card-name";
    nameEl.textContent = this.name;
    
    titleWrap.append(typeEl, nameEl);
    
    const costEl = document.createElement("div");
    costEl.className = "card-cost";
    costEl.textContent = `Стоимость: ${this.cost}`;
    
    header.append(titleWrap, costEl);

    const body = document.createElement("div");
    body.className = "card-body";
    body.textContent = this.description;
    
    if (this.getStatsText()) {
      const statsEl = document.createElement("div");
      statsEl.className = "card-stats";
      statsEl.textContent = this.getStatsText();
      body.appendChild(statsEl);
    }
    
    if (this.getRarityInfo()) {
      const metaEl = document.createElement("div");
      metaEl.className = "card-meta";
      metaEl.textContent = this.getRarityInfo();
      body.appendChild(metaEl);
    }

    article.append(header, body);

    if (isEditMode) {
      const controls = document.createElement("div");
      controls.className = "card-controls";

      if (this.predefined) {
        const editBtn = document.createElement("button");
        editBtn.textContent = "Редактировать";
        editBtn.addEventListener("click", () => handlers.onEdit(this));
        controls.appendChild(editBtn);
      }

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Удалить";
      removeBtn.classList.add("danger");
      removeBtn.addEventListener("click", () => handlers.onRemove(this));
      controls.appendChild(removeBtn);

      article.appendChild(controls);
    }
    return article;
  }
}

class AttackCard extends Card {
  getCardTypeName() { return "Атака"; }
  getStatsText() { return this.power ? `Урон: ${this.power}` : ""; }
}

class SkillCard extends Card {
  getCardTypeName() { return "Навык"; }
  getStatsText() { return this.power ? `Эффект: ${this.power}` : ""; }
}

class PowerCard extends Card {
  getCardTypeName() { return "Сила"; }
  getStatsText() { return this.power ? `Пост. бонус: ${this.power}` : ""; }
}

const STORAGE_KEY = "lab5_deck_state";
const appState = { deck: [], isEditMode: false };
const validImages = ['rainbow', 'sparkle', 'applejack', 'pinkie'];

function createDefaultDeck() {
  return [
    new AttackCard({ id: "c1", name: "Удар молнии", type: "attack", cost: 1, description: "Наносит 8 урона выбранной цели.", power: 8, rarity: "Обычная", predefined: true, imageId: 'rainbow' }),
    new SkillCard({ id: "c2", name: "Железная воля", type: "skill", cost: 1, description: "Даёт 5 блока и позволяет добрать 1 карту.", power: "5 блока + добор", rarity: "Необычная", predefined: true, imageId: 'sparkle' }),
    new PowerCard({ id: "c3", name: "Пылающее сердце", type: "power", cost: 2, description: "В начале хода даёт +1 к урону всех атак.", power: "+1 урон атакам", rarity: "Редкая", predefined: true, imageId: 'applejack' })
  ];
}

function reviveCard(obj) {
  const base = { ...obj, imageId: obj.imageId || 'pinkie' };
  if (obj.className === "AttackCard") return new AttackCard(base);
  if (obj.className === "SkillCard") return new SkillCard(base);
  if (obj.className === "PowerCard") return new PowerCard(base);
  return new Card(base);
}

function loadDeckFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return createDefaultDeck();
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.map(reviveCard) : createDefaultDeck();
  } catch { return createDefaultDeck(); }
}

function saveDeckToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState.deck.map(c => c.getDataForSave())));
}

function buildHeader() {
  const header = document.createElement("header");
  const h1 = document.createElement("h1");
  h1.textContent = "Лабораторная работа 5";

  const nav = document.createElement("nav");
  const label = document.createElement("label");
  label.className = "toggle-edit";
  
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = appState.isEditMode;
  checkbox.addEventListener("change", (e) => {
    appState.isEditMode = e.target.checked;
    renderCards();
  });

  label.append(checkbox, document.createTextNode("Режим редактирования"));
  nav.append(h1, label);
  header.appendChild(nav);
  return header;
}

function buildFooter() {
  const footer = document.createElement("footer");
  footer.textContent = "Приятной игры, уважаемые ;)";
  return footer;
}

function buildMain() {
  const main = document.createElement("main");
  const article = document.createElement("article");
  article.id = "deck";

  const h2 = document.createElement("h2");
  h2.textContent = "Колода карточной игры";

  const meta = document.createElement("div");
  meta.className = "deck-meta";
  meta.textContent = "Добро пожаловать в волшебную Эквестрию! Собирайте свою колоду с любимыми милыми пони. Карты трёх типов - Атака (как молнии Рейнбоу Дэш), Навык (мудрость Искорки) и Сила (упорство Эплджек) - помогут вам защитить гармонию и одержать победу в дружеской дуэли!";

  const controlsBar = document.createElement("div");
  controlsBar.className = "controls-bar";

  const addBtn = document.createElement("button");
  addBtn.className = "primary";
  addBtn.textContent = "Добавить карту";
  addBtn.addEventListener("click", handleAddCard);

  const hint = document.createElement("small");
  hint.className = "hint";
  hint.textContent = "Редактировать можно только заранее заданные карты.";

  controlsBar.append(addBtn, hint);

  const section = document.createElement("section");
  const h3 = document.createElement("h3");
  h3.textContent = "Список карт";
  
  const grid = document.createElement("div");
  grid.className = "cards-grid";
  grid.id = "cards-grid";

  section.append(h3, grid);
  article.append(h2, meta, controlsBar, section);
  main.appendChild(article);
  return main;
}

function renderCards() {
  const grid = document.getElementById("cards-grid");
  if (!grid) return;
  grid.innerHTML = "";
  
  const handlers = { onEdit: handleEditCard, onRemove: handleRemoveCard };
  appState.deck.forEach(card => {
    grid.appendChild(card.renderCardElement(appState.isEditMode, handlers));
  });
}

function renderMain() {
  const oldMain = document.querySelector("main");
  if (oldMain) oldMain.remove();
  document.body.insertBefore(buildMain(), document.querySelector("footer"));
  renderCards();
}

function handleAddCard() {
  const type = prompt("Тип карты (attack/skill/power):", "attack");
  if (!type) return;
  const name = prompt("Название карты:");
  if (!name) return;
  const cost = prompt("Стоимость:", "1");
  const power = prompt("Параметр силы (урон/эффект/пост.бонус):", "");
  const description = prompt("Описание:");
  if (!description) return;
  const rarity = prompt("Редкость (Обычная/Необычная/Редкая):", "Пользовательская");

  let imageId = prompt("Изображение (rainbow, sparkle, applejack, pinkie):", "pinkie");
  if (!validImages.includes(imageId?.trim().toLowerCase())) imageId = 'pinkie';
  else imageId = imageId.trim().toLowerCase();

  const base = {
    id: `c_${Date.now()}`,
    name: name.trim(), type: type.trim(), cost: Number(cost) || 0,
    description: description.trim(), power: power.trim(), rarity: rarity.trim(),
    predefined: false, imageId
  };

  let card;
  if (type === "attack") card = new AttackCard(base);
  else if (type === "skill") card = new SkillCard(base);
  else card = new PowerCard(base);

  appState.deck.push(card);
  saveDeckToStorage();
  renderCards();
}

function handleEditCard(card) {
  const newName = prompt("Новое название:", card.name);
  if (newName === null) return;
  const newCost = prompt("Новая стоимость:", card.cost);
  if (newCost === null) return;
  const newPower = prompt("Новый параметр силы:", card.power || "");
  if (newPower === null) return;
  const newDesc = prompt("Новое описание:", card.description);
  if (newDesc === null) return;
  const newRarity = prompt("Новая редкость:", card.rarity || "Обычная");
  if (newRarity === null) return;

  let newImageId = prompt(`Изображение (текущая: ${card.imageId}):`, card.imageId);
  if (newImageId !== null && validImages.includes(newImageId.trim().toLowerCase())) {
    card.imageId = newImageId.trim().toLowerCase();
  }

  card.name = newName.trim() || card.name;
  card.cost = Number(newCost) || card.cost;
  card.power = newPower.trim();
  card.description = newDesc.trim() || card.description;
  card.rarity = newRarity.trim() || card.rarity;

  saveDeckToStorage();
  renderCards();
}

function handleRemoveCard(card) {
  if (!confirm(`Удалить карту "${card.name}"?`)) return;
  appState.deck = appState.deck.filter(c => c.id !== card.id);
  saveDeckToStorage();
  renderCards();
}

function buildPage() {
  appState.deck = loadDeckFromStorage();
  document.body.append(buildHeader(), buildMain(), buildFooter());
  renderCards();
}

document.addEventListener("DOMContentLoaded", buildPage);