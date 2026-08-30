/**
 * view.js — logika halaman publik (index.html)
 * Membaca data dari data.js (localStorage) dan menampilkannya.
 * Tidak ada kemampuan edit di sini — murni tampilan untuk pengunjung.
 */

document.getElementById('year').textContent = new Date().getFullYear();

const data = getData();

/* ---------- isi konten dari data ---------- */
document.getElementById('hero-name').textContent = data.profile.name;
document.getElementById('footer-name').textContent = data.profile.name;
document.getElementById('about-p1').textContent = data.about.p1;
document.getElementById('about-p2').textContent = data.about.p2;

document.getElementById('contact-info').innerHTML = `
  <div class="fc-row"><b>Email</b> ${data.contact.email}</div>
  <div class="fc-row"><b>GitHub</b> ${data.contact.github}</div>
  <div class="fc-row"><b>LinkedIn</b> ${data.contact.linkedin}</div>
`;

const grid = document.getElementById('projects-grid');
if (data.projects.length === 0) {
  grid.innerHTML = '<p class="empty-note">Belum ada proyek yang ditambahkan.</p>';
} else {
  grid.innerHTML = data.projects.map(p => `
    <div class="project-card">
      <div class="project-head">
        <div class="project-title">${p.title}</div>
        <div class="project-ext">${p.ext}</div>
      </div>
      <div class="project-desc">${p.desc}</div>
      <div class="tag-row">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <a class="project-link" href="${p.link}" target="_blank" rel="noopener">Lihat detail →</a>
    </div>
  `).join('');
}

/* ---------- efek mengetik peran ---------- */
const roles = data.profile.roles;
let ri = 0, ci = 0, deleting = false;
const roleEl = document.getElementById('typed-role');
function typeLoop() {
  const word = roles[ri];
  roleEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
  if (!deleting && ci === word.length + 1) { deleting = true; setTimeout(typeLoop, 1200); return; }
  if (deleting && ci < 0) { deleting = false; ri = (ri + 1) % roles.length; ci = 0; }
  setTimeout(typeLoop, deleting ? 45 : 90);
}
typeLoop();

/* ---------- nav aktif saat scroll ---------- */
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const sections = [...navLinks].map(l => document.querySelector(l.getAttribute('href')));
window.addEventListener('scroll', () => {
  let idx = 0;
  sections.forEach((s, i) => { if (window.scrollY >= s.offsetTop - 120) idx = i; });
  navLinks.forEach(l => l.classList.remove('active'));
  navLinks[idx].classList.add('active');
});

/* ---------- form kontak ---------- */
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('c-name').value.trim();
  const email = document.getElementById('c-email').value.trim();
  const msg = document.getElementById('c-msg').value.trim();
  addMessage({ name, email, msg });
  document.getElementById('form-status').textContent = 'Pesan terkirim, terima kasih!';
  e.target.reset();
});