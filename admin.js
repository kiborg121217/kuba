const API_BASE = (window.KUBA_API_BASE || '').replace(/\/$/, '');
const defaultPin = '2012';
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
  if (API_BASE) {
    const pin = sessionStorage.getItem('kuba_admin_pin') || '';
    const response = await fetch(`${API_BASE}/api/reserves`, {
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
  const looks = window.KUBA_LOOKS || [];
  kpiLooks.textContent = looks.length;
  productsGrid.innerHTML = looks.map(item => `
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

  if (!API_BASE) {
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
  if (API_BASE) {
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
