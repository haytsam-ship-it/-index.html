/**
 * admin.js — logika halaman admin (admin.html)
 * Login sederhana (password disimpan di data.js) + panel CRUD
 * untuk profil, about, kontak, proyek, dan daftar pesan masuk.
 */

const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');

function showDashboard() {
  loginScreen.style.display = 'none';
  dashboard.style.display = 'block';
  renderAll();
}

/* ---------------- login / logout ---------------- */
document.getElementById('login-btn').addEventListener('click', doLogin);
document.getElementById('pw').addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); });

function doLogin() {
  const pw = document.getElementById('pw').value;
  if (login(pw)) {
    showDashboard();
  } else {
    document.getElementById('login-error').textContent = 'Password salah, coba lagi.';
  }
}

document.getElementById('logout-btn').addEventListener('click', () => {
  logout();
  location.reload();
});

if (isAdminLoggedIn()) showDashboard();

/* ---------------- toast ---------------- */
let toastTimer;
function toast(msg) {
  const el = document.getElementById('save-toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

/* ---------------- render semua panel ---------------- */
let data = getData();

function renderAll() {
  data = getData();

  document.getElementById('f-name').value = data.profile.name;
  document.getElementById('f-roles').value = data.profile.roles.join(', ');
  document.getElementById('f-about1').value = data.about.p1;
  document.getElementById('f-about2').value = data.about.p2;
  document.getElementById('f-email').value = data.contact.email;
  document.getElementById('f-github').value = data.contact.github;
  document.getElementById('f-linkedin').value = data.contact.linkedin;

  renderProjects();
  renderMessages();
}

/* ---------------- simpan profil / about / kontak ---------------- */
document.getElementById('save-profile-btn').addEventListener('click', () => {
  data.profile.name = document.getElementById('f-name').value.trim() || data.profile.name;
  data.profile.roles = document.getElementById('f-roles').value.split(',').map(s => s.trim()).filter(Boolean);
  data.about.p1 = document.getElementById('f-about1').value.trim();
  data.about.p2 = document.getElementById('f-about2').value.trim();
  data.contact.email = document.getElementById('f-email').value.trim();
  data.contact.github = document.getElementById('f-github').value.trim();
  data.contact.linkedin = document.getElementById('f-linkedin').value.trim();
  saveData(data);
  toast('Profil tersimpan ✓');
});

/* ---------------- proyek: render + CRUD ---------------- */
function renderProjects() {
  const list = document.getElementById('project-list');
  document.getElementById('project-count').textContent = data.projects.length;

  if (data.projects.length === 0) {
    list.innerHTML = '<p class="empty-note">Belum ada proyek. Klik "+ Tambah Proyek" di bawah.</p>';
    return;
  }

  list.innerHTML = data.projects.map(p => `
    <div class="admin-project-item" data-id="${p.id}">
      <div class="row2">
        <div class="field" style="margin:0;">
          <label>Judul</label>
          <input class="p-title" value="${escapeAttr(p.title)}">
        </div>
        <div class="field" style="margin:0;">
          <label>Ekstensi (mis. .html)</label>
          <input class="p-ext" value="${escapeAttr(p.ext)}">
        </div>
      </div>
      <div class="field" style="margin:0;">
        <label>Deskripsi</label>
        <textarea class="p-desc">${p.desc}</textarea>
      </div>
      <div class="row2">
        <div class="field" style="margin:0;">
          <label>Tags (pisahkan koma)</label>
          <input class="p-tags" value="${escapeAttr(p.tags.join(', '))}">
        </div>
        <div class="field" style="margin:0;">
          <label>Link</label>
          <input class="p-link" value="${escapeAttr(p.link)}">
        </div>
      </div>
      <div class="item-actions">
        <button class="btn btn-danger btn-delete-project">Hapus</button>
        <button class="btn btn-primary btn-save-project">Simpan</button>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.admin-project-item').forEach(item => {
    const id = item.dataset.id;

    item.querySelector('.btn-save-project').addEventListener('click', () => {
      const proj = data.projects.find(p => p.id === id);
      proj.title = item.querySelector('.p-title').value.trim();
      proj.ext = item.querySelector('.p-ext').value.trim() || '.js';
      proj.desc = item.querySelector('.p-desc').value.trim();
      proj.tags = item.querySelector('.p-tags').value.split(',').map(s => s.trim()).filter(Boolean);
      proj.link = item.querySelector('.p-link').value.trim() || '#';
      saveData(data);
      toast('Proyek tersimpan ✓');
    });

    item.querySelector('.btn-delete-project').addEventListener('click', () => {
      if (!confirm('Hapus proyek ini?')) return;
      data.projects = data.projects.filter(p => p.id !== id);
      saveData(data);
      renderProjects();
      toast('Proyek dihapus');
    });
  });
}

document.getElementById('add-project-btn').addEventListener('click', () => {
  data.projects.push({
    id: uid(), ext: '.js', title: 'Proyek Baru',
    desc: 'Deskripsi proyek…', tags: ['Tag'], link: '#'
  });
  saveData(data);
  renderProjects();
});

/* ---------------- pesan masuk ---------------- */
function renderMessages() {
  const messages = getMessages();
  document.getElementById('msg-count').textContent = messages.length;
  const box = document.getElementById('message-list');

  if (messages.length === 0) {
    box.innerHTML = '<p class="empty-note">Belum ada pesan masuk.</p>';
    return;
  }

  box.innerHTML = messages.map(m => `
    <div class="msg-item" data-id="${m.id}">
      <div class="msg-meta"><b>${escapeAttr(m.name)}</b> · ${escapeAttr(m.email)} · ${new Date(m.date).toLocaleString('id-ID')}</div>
      <p>${m.msg}</p>
      <div class="item-actions" style="margin-top:10px;">
        <button class="btn btn-danger btn-delete-msg">Hapus</button>
      </div>
    </div>
  `).join('');

  box.querySelectorAll('.btn-delete-msg').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.closest('.msg-item').dataset.id;
      deleteMessage(id);
      renderMessages();
    });
  });
}

/* ---------------- util ---------------- */
function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;');
}