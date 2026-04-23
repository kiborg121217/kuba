const ADMIN_API_BASE = (window.KUBA_API_BASE || '').replace(/\/$/, '');
const defaultPin = '2012';

const adminLooks = [
  { title: 'Футболка с вышивкой', price: '1800₽', sizes: '42–48', image: 'assets/0992F790-F216-4204-AF6F-0042EE5240F7.jpeg', desc: 'Нежная база с мягким акцентом — спокойный верх на каждый день.' },
  { title: 'Жакет в клетку', price: '3800₽', sizes: '42, 44, 48', image: 'assets/347906FC-A487-43A1-BCCD-0D5F87D774DB.jpeg', desc: 'Структурный жакет для офиса, города и современной капсулы.' },
  { title: 'Сумка mini city', price: '1300₽', sizes: 'универсально', image: 'assets/57C060E1-4F0C-4C23-80BE-9385A30E5CE4.jpeg', desc: 'Компактная городская сумка для повседневных образов.' },
  { title: 'Леопард + деним', price: '5670₽', sizes: 'комплект', image: 'assets/0CB2C0D4-7FC7-4839-8342-D0304F58B272.jpeg', desc: 'Городской образ с принтом и расслабленным денимом.' },
  { title: 'Мятная воздушная капсула', price: '7200₽', sizes: 'капсула', image: 'assets/0F36B715-45C0-4ECD-AAC0-11D416A3B0FB.jpeg', desc: 'Мягкая многослойная капсула в светлой гамме.' },
  { title: 'Костюм soft power', price: '6000₽', sizes: '42, 48', image: 'assets/93DABBE5-81E8-4863-B35F-EE08C53E91CA.jpeg', desc: 'Женственный костюм для офиса и выхода.' },
  { title: 'Платье olive day', price: '3800₽', sizes: '44, 46, 48', image: 'assets/E58FEA85-61A6-429D-813B-F7C48DBABB33.jpeg', desc: 'Спокойное платье на каждый день.' }
];

const loginCard = document.getElementById('loginCard');
const sidePanel = document.getElementById('sidePanel');
const adminApp = document.getElementById('adminApp');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const reserveWrap = document.getElementById('reserveWrap');
const productsGrid = document.getElementById('productsGrid');
const kpiTotal = document.getElementById('kpiTotal');
const kpiLatest = document.getElementById('kpiLatest');
const kpiLooks = document.getElementById('kpiLooks');
const exportBtn = document.getElementById('exportBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');

async function getReserves() {
  if (ADMIN_API_BASE) {
    const pin = sessionStorage.getItem('kuba_admin_pin') || '';
    const response = await fetch(`${ADMIN_API_BASE}/api/reserves`, {
      headers: { 'x-admin-pin': pin }
    });
    if (response.status === 401) throw new Error('Неверный PIN-код');
    if (!response.ok) throw new Error('Не удалось получить брони с сервера');
    return response.json();
  }
  return JSON.parse(localStorage.getItem('kuba_reserves') || '[]');
}

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  return new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short' }).format(d);
}

async function renderReserves() {
  try {
    const reserves = await getReserves();
    kpiTotal.textContent = reserves.length;
    kpiLatest.textContent = reserves.length ? formatDate(reserves[0].createdAt) : '—';

    if (!reserves.length) {
      reserveWrap.innerHTML = '<div class="empty-state">Пока нет сохранённых броней.</div>';
      return;
    }

    reserveWrap.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Номер</th>
            <th>Позиция</th>
            <th>Клиент</th>
            <th>Телефон</th>
            <th>Размер</th>
            <th>Время визита</th>
            <th>Комментарий</th>
            <th>Создано</th>
          </tr>
        </thead>
        <tbody>
          ${reserves.map(item => `
            <tr>
              <td><span class="admin-pill">${item.bookingId}</span></td>
              <td>${item.product || '—'}</td>
              <td>${item.name || '—'}</td>
              <td>${item.phone || '—'}</td>
              <td>${item.size || '—'}</td>
              <td>${item.time || '—'}</td>
              <td>${item.comment || '—'}</td>
              <td>${formatDate(item.createdAt)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    reserveWrap.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
}

function renderProducts() {
  kpiLooks.textContent = adminLooks.length;
  productsGrid.innerHTML = adminLooks.map(item => `
    <article class="admin-product">
      <img src="${item.image}" alt="${item.title}">
      <div>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <div class="admin-actions">
          <span class="admin-pill">${item.price}</span>
          <span class="admin-pill">${item.sizes}</span>
        </div>
      </div>
    </article>
  `).join('');
}

async function openPanel() {
  loginCard.classList.add('admin-hidden');
  sidePanel.classList.remove('admin-hidden');
  adminApp.classList.remove('admin-hidden');
  await renderReserves();
  renderProducts();
}

function closePanel() {
  sessionStorage.removeItem('kuba_admin_auth');
  sessionStorage.removeItem('kuba_admin_pin');
  sidePanel.classList.add('admin-hidden');
  adminApp.classList.add('admin-hidden');
  loginCard.classList.remove('admin-hidden');
}

loginForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const pin = document.getElementById('adminPin').value.trim();

  if (!ADMIN_API_BASE) {
    if (pin !== defaultPin) {
      alert('Неверный PIN-код');
      return;
    }
    sessionStorage.setItem('kuba_admin_auth', '1');
    sessionStorage.setItem('kuba_admin_pin', pin);
    openPanel();
    return;
  }

  try {
    sessionStorage.setItem('kuba_admin_pin', pin);
    await getReserves();
    sessionStorage.setItem('kuba_admin_auth', '1');
    openPanel();
  } catch (error) {
    sessionStorage.removeItem('kuba_admin_pin');
    alert(error.message || 'Не удалось войти');
  }
});

logoutBtn?.addEventListener('click', closePanel);

exportBtn?.addEventListener('click', async () => {
  const data = await getReserves();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kuba-reserves-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

copyBtn?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(await getReserves(), null, 2));
    alert('JSON скопирован в буфер обмена');
  } catch {
    alert('Не удалось скопировать');
  }
});

clearBtn?.addEventListener('click', async () => {
  if (ADMIN_API_BASE) {
    alert('Очистку лучше делать в базе или отдельной серверной командой. На этом шаге кнопка отключена.');
    return;
  }
  if (!confirm('Удалить все брони из этого браузера?')) return;
  localStorage.removeItem('kuba_reserves');
  renderReserves();
});

if (sessionStorage.getItem('kuba_admin_auth') === '1') {
  openPanel();
}
