/**
 * data.js
 * Lapisan data bersama antara viewer (index.html) dan admin (admin.html).
 * Menggunakan localStorage sehingga admin & viewer harus dibuka di
 * browser/origin yang sama agar datanya nyambung.
 *
 * Untuk portofolio publik sungguhan (multi-device), ganti getData/saveData
 * dengan fetch() ke backend + database asli.
 */

const STORAGE_KEY = 'portfolio_data_v1';
const MESSAGES_KEY = 'portfolio_messages_v1';
const ADMIN_PASSWORD = 'haytsam2026'; // ganti sesuai keinginanmu
const SESSION_KEY = 'portfolio_admin_session';

const defaultData = {
  profile: {
    name: 'Haytsam Suchandra Wiranegara',
    roles: ['Frontend Developer', 'Web Enthusiast', 'Lifelong Learner'],
  },
  about: {
    p1: 'Halo! Saya Haytsam, seorang pelajar sekaligus web developer yang senang membangun antarmuka web yang rapi dan fungsional.',
    p2: 'Portofolio ini adalah tempat saya belajar sambil praktik — kontennya bisa diperbarui langsung lewat panel admin tanpa mengubah kode.',
  },
  projects: [
    { id: 'p1', ext: '.html', title: 'Landing Page UMKM', desc: 'Halaman promosi produk lokal, responsif dan ringan.', tags: ['HTML', 'CSS', 'JS'], link: '#' },
    { id: 'p2', ext: '.js', title: 'To-Do List App', desc: 'Aplikasi daftar tugas dengan penyimpanan lokal.', tags: ['JavaScript', 'LocalStorage'], link: '#' },
    { id: 'p3', ext: '.css', title: 'Landing Page Kreatif', desc: 'Eksperimen animasi CSS dan layout grid.', tags: ['CSS', 'Animation'], link: '#' },
  ],
  contact: {
    email: 'haytsam@example.com',
    github: 'github.com/haytsam',
    linkedin: 'linkedin.com/in/haytsam',
  },
};

function getData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return JSON.parse(JSON.stringify(defaultData));
  try { return JSON.parse(raw); } catch (e) { return JSON.parse(JSON.stringify(defaultData)); }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function resetData() {
  localStorage.removeItem(STORAGE_KEY);
}

function getMessages() {
  const raw = localStorage.getItem(MESSAGES_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch (e) { return []; }
}

function addMessage(msg) {
  const list = getMessages();
  list.unshift({ id: 'm' + Date.now(), date: new Date().toISOString(), ...msg });
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(list));
}

function deleteMessage(id) {
  const list = getMessages().filter(m => m.id !== id);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(list));
}

function isAdminLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

function login(password) {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

function uid() {
  return 'p' + Date.now() + Math.floor(Math.random() * 1000);
}