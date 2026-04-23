const API_BASE = (window.KUBA_API_BASE || '').replace(/\/$/, '');

const looks = [
  {
    id: 'tee-bear',
    title: 'Футболка с вышивкой',
    price: '1800₽',
    sizes: '42–48',
    occasion: 'day',
    mood: 'light',
    tags: ['top'],
    image: 'assets/0992F790-F216-4204-AF6F-0042EE5240F7.jpeg',
    desc: 'Нежная база с мягким акцентом — работает как спокойный верх под джинсы, юбку и лёгкие капсулы на день.',
    composition: ['Футболка — 1800₽', 'Размеры — 42–48']
  },
  {
    id: 'blue-jacket',
    title: 'Жакет в клетку',
    price: '3800₽',
    sizes: '42, 44, 48',
    occasion: 'office',
    mood: 'calm',
    tags: ['top'],
    image: 'assets/347906FC-A487-43A1-BCCD-0D5F87D774DB.jpeg',
    desc: 'Структурный жакет для офиса, города и отполированной базовой гардеробной капсулы.',
    composition: ['Жакет — 3800₽', 'Размеры — 42, 44, 48']
  },
  {
    id: 'mini-backpack',
    title: 'Сумка mini city',
    price: '1300₽',
    sizes: 'универсально',
    occasion: 'city',
    mood: 'calm',
    tags: ['bag'],
    image: 'assets/57C060E1-4F0C-4C23-80BE-9385A30E5CE4.jpeg',
    desc: 'Компактная городская сумка, которая собирает casual-образы и держит повседневный ритм.',
    composition: ['Сумка — 1300₽']
  },
  {
    id: 'leopard-city',
    title: 'Леопард + деним',
    price: '5670₽',
    sizes: 'футболка / джинсы / брошь',
    occasion: 'city',
    mood: 'accent',
    tags: ['top', 'bottom', 'accessory'],
    image: 'assets/0CB2C0D4-7FC7-4839-8342-D0304F58B272.jpeg',
    desc: 'Городской образ с акцентом: принт, расслабленный деним и маленькая деталь, которая делает комплект живым.',
    composition: ['Футболка — 1600₽', 'Джинсы — 3700₽', 'Брошь — 370₽']
  },
  {
    id: 'mint-soft',
    title: 'Мятная воздушная капсула',
    price: '7200₽',
    sizes: 'джинсовка / юбка / майка',
    occasion: 'soft',
    mood: 'light',
    tags: ['top', 'bottom'],
    image: 'assets/0F36B715-45C0-4ECD-AAC0-11D416A3B0FB.jpeg',
    desc: 'Лёгкий романтичный образ с многослойностью: мягкая джинсовка, воздушная юбка и базовая майка.',
    composition: ['Джинсовка — 3500₽', 'Юбка — 2500₽', 'Майка — 1200₽']
  },
  {
    id: 'sage-suit',
    title: 'Костюм soft power',
    price: '6000₽',
    sizes: '42, 48',
    occasion: 'office',
    mood: 'soft',
    tags: ['top', 'bottom'],
    image: 'assets/93DABBE5-81E8-4863-B35F-EE08C53E91CA.jpeg',
    desc: 'Чистая женственная сила: костюм для выхода, события, офиса и эффектной современной классики.',
    composition: ['Костюм — 6000₽', 'Размеры — 42, 48']
  },
  {
    id: 'olive-dress',
    title: 'Платье olive day',
    price: '3800₽',
    sizes: '44, 46, 48',
    occasion: 'soft',
    mood: 'soft',
    tags: ['top', 'bottom'],
    image: 'assets/E58FEA85-61A6-429D-813B-F7C48DBABB33.jpeg',
    desc: 'Женственное платье на каждый день — спокойно выглядит, красиво движется и легко собирается аксессуарами.',
    composition: ['Платье — 3800₽', 'Размеры — 44, 46, 48']
  }
];

window.KUBA_LOOKS = looks;

const mosaicData = [
  { image: 'assets/93DABBE5-81E8-4863-B35F-EE08C53E91CA.jpeg', title: 'Tailored morning', label: 'office edit' },
  { image: 'assets/347906FC-A487-43A1-BCCD-0D5F87D774DB.jpeg', title: 'Quiet blue', label: 'smart casual' },
  { image: 'assets/57C060E1-4F0C-4C23-80BE-9385A30E5CE4.jpeg', title: 'Mini city bag', label: 'accent piece' },
  { image: 'assets/0F36B715-45C0-4ECD-AAC0-11D416A3B0FB.jpeg', title: 'Soft mint layers', label: 'romantic day' },
  { image: 'assets/0992F790-F216-4204-AF6F-0042EE5240F7.jpeg', title: 'Gentle base', label: 'daily wear' },
  { image: 'assets/0CB2C0D4-7FC7-4839-8342-D0304F58B272.jpeg', title: 'Denim animal note', label: 'city style' },
  { image: 'assets/E58FEA85-61A6-429D-813B-F7C48DBABB33.jpeg', title: 'Soft olive dress', label: 'feminine mood' }
];

const looksGrid = document.getElementById('looksGrid');
const mosaicGrid = document.getElementById('mosaicGrid');
const occasionTabs = document.getElementById('occasionTabs');
const lookModal = document.getElementById('lookModal');
const lookModalContent = document.getElementById('lookModalContent');
const reserveModal = document.getElementById('reserveModal');
const reserveForm = document.getElementById('reserveForm');
const reserveSuccess = document.getElementById('reserveSuccess');
const reserveSuccessText = document.getElementById('reserveSuccessText');
const reserveHeading = document.getElementById('reserveHeading');
const builderResult = document.getElementById('builderResult');
const occasionSelect = document.getElementById('occasionSelect');
const moodSelect = document.getElementById('moodSelect');
const buildLooksBtn = document.getElementById('buildLooks');
const clearBuilderBtn = document.getElementById('clearBuilder');
const mobileMenu = document.querySelector('.mobile-menu');
const burger = document.querySelector('.burger');

let currentOccasion = 'all';
let activeNeeds = new Set(['top', 'bottom']);

function renderLooks(filter = 'all') {
  if (!looksGrid) return;
  looksGrid.innerHTML = '';
  const filtered = filter === 'all' ? looks : looks.filter(item => item.occasion === filter);
  filtered.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'look-card reveal tilt-card';
    card.style.transitionDelay = `${index * 50}ms`;
    card.innerHTML = `
      <div class="look-card__media">
        <img src="${item.image}" alt="${item.title}">
        <span class="look-card__badge">${labelForOccasion(item.occasion)}</span>
      </div>
      <div class="look-card__body">
        <span class="look-card__eyebrow">${item.mood === 'accent' ? 'accent edit' : item.mood === 'light' ? 'light selection' : item.mood === 'soft' ? 'soft signature' : 'quiet luxury'}</span>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <div class="look-card__meta"><span>${item.sizes}</span><span class="look-card__price">${item.price}</span></div>
        <div class="look-card__actions">
          <button class="ghost" data-open-look="${item.id}">Открыть</button>
          <button class="solid" data-open-reserve data-product="${item.title}">Отложить</button>
        </div>
      </div>
    `;
    looksGrid.appendChild(card);
  });
  observeReveals();
}

function renderMosaic() {
  if (!mosaicGrid) return;
  mosaicGrid.innerHTML = mosaicData.map(item => `
    <article class="mosaic-card tilt-card">
      <img src="${item.image}" alt="${item.title}">
      <div class="mosaic-card__caption">
        <span>${item.label}</span>
        <strong>${item.title}</strong>
      </div>
    </article>
  `).join('');
}

function labelForOccasion(key) {
  return ({ office: 'office', city: 'city', day: 'daily', soft: 'soft' }[key]) || 'edit';
}

function openLook(id) {
  const item = looks.find(x => x.id === id);
  if (!item || !lookModalContent || !lookModal) return;
  lookModalContent.innerHTML = `
    <img src="${item.image}" alt="${item.title}">
    <div class="modal__look-copy">
      <p class="eyebrow">${labelForOccasion(item.occasion)}</p>
      <h2>${item.title}</h2>
      <p>${item.desc}</p>
      <div class="modal__look-meta">
        <div><span>Стоимость</span><strong>${item.price}</strong></div>
        <div><span>Размеры</span><strong>${item.sizes}</strong></div>
        ${item.composition.map(part => `<div><span>Состав образа</span><strong>${part}</strong></div>`).join('')}
      </div>
      <div class="modal__look-actions">
        <button class="button button--dark" data-open-reserve data-product="${item.title}">Отложить к приезду</button>
        <button class="button button--light" data-scroll="#concierge">Подобрать похожий</button>
      </div>
    </div>
  `;
  lookModal.showModal();
}

function openReserve(productName) {
  if (!reserveForm || !reserveModal || !reserveHeading) return;
  reserveForm.reset();
  reserveSuccess.hidden = true;
  reserveForm.hidden = false;
  reserveForm.product.value = productName || 'Образ';
  reserveHeading.textContent = `Бронь: ${productName || 'выбранная позиция'}`;
  reserveModal.showModal();
}

async function saveReserve(formData) {
  const payload = {
    product: formData.get('product'),
    name: formData.get('name'),
    phone: formData.get('phone'),
    size: formData.get('size'),
    time: formData.get('time'),
    comment: formData.get('comment')
  };

  if (API_BASE) {
    const response = await fetch(`${API_BASE}/api/reserves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Не удалось сохранить бронь на сервере');
    const data = await response.json();
    return data.bookingId;
  }

  const reserves = JSON.parse(localStorage.getItem('kuba_reserves') || '[]');
  const bookingId = `KUBA-${Math.floor(1000 + Math.random() * 9000)}`;
  reserves.unshift({ ...payload, bookingId, createdAt: new Date().toISOString() });
  localStorage.setItem('kuba_reserves', JSON.stringify(reserves));
  return bookingId;
}

function buildLooks() {
  if (!builderResult || !occasionSelect || !moodSelect) return;
  const occasion = occasionSelect.value;
  const mood = moodSelect.value;
  const needs = Array.from(activeNeeds);

  const matches = looks.filter(item => {
    const occasionMatch = item.occasion === occasion;
    const moodMatch = mood === item.mood || (mood === 'calm' && item.mood !== 'accent');
    const tagsMatch = needs.every(need => need === 'accessory' ? (item.tags.includes('accessory') || item.tags.includes('bag')) : item.tags.includes(need));
    return occasionMatch && moodMatch && tagsMatch;
  });

  const fallback = looks.filter(item => item.occasion === occasion).slice(0, 3);
  const results = matches.length ? matches.slice(0, 3) : fallback;

  if (!results.length) {
    builderResult.innerHTML = `<div class="builder-placeholder glass"><strong>Пока нет точного совпадения</strong><p>Попробуйте убрать часть пожеланий — так сайт покажет больше близких вариантов.</p></div>`;
    return;
  }

  builderResult.innerHTML = `
    <div class="builder-grid">
      ${results.map(item => `
        <article class="builder-item tilt-card">
          <img src="${item.image}" alt="${item.title}">
          <div class="builder-item__body">
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
            <div class="builder-item__meta">
              <span>${item.sizes}</span>
              <span>${item.price}</span>
            </div>
            <div class="look-card__actions" style="margin-top:16px;">
              <button class="ghost" data-open-look="${item.id}">Открыть</button>
              <button class="solid" data-open-reserve data-product="${item.title}">Отложить</button>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
  observeReveals();
}

function observeReveals() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length || typeof IntersectionObserver === 'undefined') return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  items.forEach(item => observer.observe(item));
}

function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      if (window.innerWidth < 980) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateY = (x - .5) * 7;
      const rotateX = (.5 - y) * 7;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });
}

occasionTabs?.addEventListener('click', e => {
  const chip = e.target.closest('[data-occasion]');
  if (!chip) return;
  document.querySelectorAll('#occasionTabs .chip').forEach(btn => btn.classList.remove('is-active'));
  chip.classList.add('is-active');
  currentOccasion = chip.dataset.occasion;
  renderLooks(currentOccasion);
  initTilt();
});

document.addEventListener('click', e => {
  const openLookBtn = e.target.closest('[data-open-look]');
  const openReserveBtn = e.target.closest('[data-open-reserve]');
  const closeModalBtn = e.target.closest('[data-close-modal]');
  const scrollBtn = e.target.closest('[data-scroll]');
  const toggleNeed = e.target.closest('[data-need]');

  if (openLookBtn) openLook(openLookBtn.dataset.openLook);
  if (openReserveBtn) openReserve(openReserveBtn.dataset.product);
  if (closeModalBtn) closeModalBtn.closest('dialog').close();
  if (scrollBtn) {
    document.querySelector(scrollBtn.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' });
    if (lookModal?.open) lookModal.close();
  }
  if (toggleNeed) {
    const need = toggleNeed.dataset.need;
    if (activeNeeds.has(need)) {
      if (activeNeeds.size > 1) activeNeeds.delete(need);
    } else {
      activeNeeds.add(need);
    }
    document.querySelectorAll('.toggle-chip').forEach(btn => btn.classList.toggle('is-active', activeNeeds.has(btn.dataset.need)));
  }
});

buildLooksBtn?.addEventListener('click', buildLooks);
clearBuilderBtn?.addEventListener('click', () => {
  if (!occasionSelect || !moodSelect || !builderResult) return;
  occasionSelect.value = 'office';
  moodSelect.value = 'light';
  activeNeeds = new Set(['top', 'bottom']);
  document.querySelectorAll('.toggle-chip').forEach(btn => btn.classList.toggle('is-active', activeNeeds.has(btn.dataset.need)));
  builderResult.innerHTML = `<div class="builder-placeholder glass"><strong>Ваш персональный подбор появится здесь</strong><p>Сайт покажет образы, которые совпадают по поводу и настроению.</p></div>`;
});

reserveForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(reserveForm);
  try {
    const bookingId = await saveReserve(formData);
    reserveForm.hidden = true;
    reserveSuccess.hidden = false;
    reserveSuccessText.textContent = `${formData.get('name')}, бронь ${bookingId} сохранена для позиции «${formData.get('product')}». Покажите номер в магазине или назовите его продавцу.`;
  } catch (error) {
    alert('Не удалось отправить бронь. Проверь подключение backend или попробуй ещё раз.');
    console.error(error);
  }
});

burger?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(open));
});
mobileMenu?.addEventListener('click', e => {
  if (e.target.matches('a')) mobileMenu.classList.remove('is-open');
});

[lookModal, reserveModal].filter(Boolean).forEach(modal => modal.addEventListener('click', e => {
  const rect = modal.getBoundingClientRect();
  const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
  if (!inside) modal.close();
}));

renderLooks();
renderMosaic();
observeReveals();
initTilt();
