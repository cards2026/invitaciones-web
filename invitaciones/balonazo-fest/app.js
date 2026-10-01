// ── AUDIO ────────────────────────────────────────────────────
const audio = document.getElementById('bg-audio');

// ── OPEN INVITATION ──────────────────────────────────────────
document.getElementById('btn-open').addEventListener('click', () => {
  document.getElementById('welcome-overlay').style.display = 'none';
  document.getElementById('invitation').style.display = 'block';
  startCountdown();
  buildGallery();
  initReveal();
  initScrollBar();
  // Reproducir música al abrir la invitación
  audio.volume = 0.5;
  audio.currentTime = 19.1;
  audio.play().catch(() => {});
  document.getElementById('music-btn').textContent = '⏸';
});

// ── COUNTDOWN ────────────────────────────────────────────────
function startCountdown() {
  const target = new Date('2026-10-24T17:00:00');
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      ['days','hours','mins','secs'].forEach(u => document.getElementById('cd-'+u).textContent = '00');
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('cd-days').textContent  = String(d).padStart(2,'0');
    document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
    document.getElementById('cd-mins').textContent  = String(m).padStart(2,'0');
    document.getElementById('cd-secs').textContent  = String(s).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);
}

// ── GALLERY ───────────────────────────────────────────────────
const PHOTOS = [
  'img/foto1.jpeg',  'img/foto2.jpeg',  'img/foto3.jpeg',
  'img/foto4.jpeg',  'img/foto5.jpeg',  'img/foto6.jpeg',
  'img/foto7.jpeg',  'img/foto8.jpeg',  'img/foto9.jpeg',
  'img/foto10.jpeg', 'img/foto11.jpeg', 'img/foto12.jpeg',
  'img/foto13.jpeg', 'img/foto14.jpeg', 'img/foto15.jpeg',
  'img/foto16.jpeg', 'img/foto17.jpeg', 'img/foto18.jpeg',
  'img/foto19.jpeg', 'img/foto20.jpeg', 'img/foto21.jpeg',
  'img/foto22.jpeg', 'img/foto23.jpeg', 'img/foto24.jpeg',
  'img/foto25.jpeg', 'img/foto26.jpeg', 'img/foto27.jpeg',
  'img/foto28.jpeg', 'img/foto29.jpeg', 'img/foto30.jpeg',
  'img/foto31.jpeg', 'img/foto32.jpeg',
];
const VISIBLE_INIT = 6;
let lightboxIndex = 0;

function buildGallery() {
  const grid = document.getElementById('photo-grid');
  const btnMore = document.getElementById('btn-more-photos');

  PHOTOS.forEach((src, i) => {
    const card = document.createElement('div');
    card.className = 'photo-card' + (i >= VISIBLE_INIT ? ' hidden' : '');
    card.innerHTML = `
      <img src="${src}" alt="Foto ${i+1}" loading="lazy">
      <div class="photo-card-overlay">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" width="32" height="32"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
      </div>`;
    card.addEventListener('click', () => openLightbox(i));
    grid.appendChild(card);
  });

  if (PHOTOS.length > VISIBLE_INIT) {
    btnMore.style.display = 'flex';
    btnMore.addEventListener('click', () => {
      grid.querySelectorAll('.photo-card.hidden').forEach(c => c.classList.remove('hidden'));
      btnMore.style.display = 'none';
    });
  }
}

// ── LIGHTBOX ──────────────────────────────────────────────────
function openLightbox(index) {
  lightboxIndex = index;
  document.getElementById('lightbox').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  updateLightbox();
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
  document.body.style.overflow = '';
}

function updateLightbox() {
  document.getElementById('lightbox-img').src = PHOTOS[lightboxIndex];
  document.getElementById('lightbox-img').alt = 'Foto ' + (lightboxIndex + 1);
  document.getElementById('lightbox-counter').textContent = (lightboxIndex + 1) + ' / ' + PHOTOS.length;
}

document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
document.getElementById('lightbox-backdrop').addEventListener('click', closeLightbox);
document.getElementById('lightbox-prev').addEventListener('click', () => {
  lightboxIndex = (lightboxIndex - 1 + PHOTOS.length) % PHOTOS.length;
  updateLightbox();
});
document.getElementById('lightbox-next').addEventListener('click', () => {
  lightboxIndex = (lightboxIndex + 1) % PHOTOS.length;
  updateLightbox();
});
document.addEventListener('keydown', e => {
  if (document.getElementById('lightbox').style.display === 'none') return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft')  { lightboxIndex = (lightboxIndex - 1 + PHOTOS.length) % PHOTOS.length; updateLightbox(); }
  if (e.key === 'ArrowRight') { lightboxIndex = (lightboxIndex + 1) % PHOTOS.length; updateLightbox(); }
});

// ── REVEAL ON SCROLL ──────────────────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── SCROLL BAR ────────────────────────────────────────────────
function initScrollBar() {
  const bar = document.getElementById('scroll-bar');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    bar.style.transform = `scaleX(${pct})`;
    bar.style.width = '100%';
  });
}

// ── SCROLL DOWN BTN ───────────────────────────────────────────
document.getElementById('btn-scroll-down').addEventListener('click', () => {
  window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
});

// ── RSVP ─────────────────────────────────────────────────────
let rsvpGuests = 1;

function selectRsvp(val) {
  document.getElementById('rsvp-yes').classList.toggle('selected', val === 'yes');
  document.getElementById('rsvp-no').classList.toggle('selected', val === 'no');
  document.getElementById('rsvp-fields').style.display = val === 'yes' ? 'flex' : 'none';
}

document.getElementById('rsvp-minus').addEventListener('click', () => {
  if (rsvpGuests > 1) { rsvpGuests--; document.getElementById('rsvp-guests').textContent = rsvpGuests; }
});
document.getElementById('rsvp-plus').addEventListener('click', () => {
  if (rsvpGuests < 20) { rsvpGuests++; document.getElementById('rsvp-guests').textContent = rsvpGuests; }
});

function submitRsvp() {
  const nameEl = document.getElementById('rsvp-name');
  const errEl  = document.getElementById('rsvp-name-error');
  const name   = nameEl.value.trim();
  if (!name) {
    nameEl.classList.add('error');
    errEl.classList.add('visible');
    nameEl.focus();
    return;
  }
  nameEl.classList.remove('error');
  errEl.classList.remove('visible');

  const phone  = document.getElementById('rsvp-phone').value.trim();
  const email  = document.getElementById('rsvp-email').value.trim();

  document.getElementById('rsvp-step-1').style.display = 'none';
  document.getElementById('rsvp-fields').style.display = 'none';
  document.getElementById('rsvp-thanks').style.display = 'block';
  document.getElementById('rsvp-qr-name').textContent = name + ' — ' + rsvpGuests + (rsvpGuests === 1 ? ' persona' : ' personas');

  const qrEl = document.getElementById('rsvp-qr');
  qrEl.innerHTML = '';
  const paseUrl = 'https://cards2026.github.io/invitaciones/balonazo-fest/pase.html?n=' + encodeURIComponent(name) + '&p=' + rsvpGuests + (phone ? '&t=' + encodeURIComponent(phone) : '');
  new QRCode(qrEl, { text: paseUrl, width: 180, height: 180, colorDark: '#1a8f33', colorLight: '#ffffff' });

  if (window.SHEETS_URL) {
    fetch(window.SHEETS_URL, {
      method: 'POST',
      body: JSON.stringify({ tipo: 'rsvp', nombre: name, telefono: phone, email, personas: rsvpGuests, mensaje: '' })
    }).catch(() => {});
  }

  // Guardar localmente para confirmaciones.html
  const rsvpEntry = { nombre: name, personas: rsvpGuests, telefono: phone, email, timestamp: Date.now() };
  const rsvpList  = JSON.parse(localStorage.getItem('balnazo_rsvp') || '[]');
  if (!rsvpList.find(r => r.nombre.toLowerCase() === name.toLowerCase())) {
    rsvpList.push(rsvpEntry);
    localStorage.setItem('balnazo_rsvp', JSON.stringify(rsvpList));
  }
}

function downloadQR() {
  const canvas = document.querySelector('#rsvp-qr canvas');
  if (!canvas) return;
  const a = document.createElement('a');
  a.download = 'mi-pase-balnazo-fest.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
}

function shareQR() {
  const name = document.getElementById('rsvp-name').value.trim();
  if (navigator.share) {
    navigator.share({ title: 'BALNAZO FEST', text: '¡Confirmé mi asistencia! ' + name });
  } else {
    navigator.clipboard.writeText('BALNAZO FEST | ' + name + ' x' + rsvpGuests)
      .then(() => alert('¡Datos copiados al portapapeles!'));
  }
}

function sendMural() {
  const msg = document.getElementById('rsvp-mural').value.trim();
  if (!msg) return;
  document.getElementById('rsvp-mural').disabled = true;
  document.getElementById('rsvp-mural-thanks').style.display = 'block';
}

// ── MUSIC BTN ────────────────────────────────────────────────
document.getElementById('music-btn').addEventListener('click', function() {
  if (audio.paused) {
    audio.play().catch(() => {});
    this.textContent = '⏸';
  } else {
    audio.pause();
    this.textContent = '▶';
  }
});

// ── CALENDAR BTN ─────────────────────────────────────────────
document.getElementById('btn-calendar').addEventListener('click', () => {
  const url = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=Josu%C3%A9+25+%2B+Arturo+1+%7C+BAL%E2%9A%BD%EF%B8%8FNAZO+FEST' +
    '&dates=20261024T170000/20261024T230000' +
    '&details=Fiesta+de+cumplea%C3%B1os+de+Josu%C3%A9+y+Arturo' +
    '&location=Tlatilco+9+Santa+Catarina+Tlahuac+CDMX';
  window.open(url, '_blank');
});
