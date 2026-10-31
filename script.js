/* Code hiệu ứng. Nội dung (chữ, ảnh, mã khoá) nằm trong noi-dung.js. */

const $ = id => document.getElementById(id);

/* ================= ĐỔ NỘI DUNG VÀO TRANG ================= */
const ND = window.NOI_DUNG || {};
const MA_KHOA = String(ND.maKhoa || '1210');
const LA_THU = ND.laThu || '';
document.title = 'Gửi ' + (ND.ten || 'cậu');
document.querySelectorAll('[data-text]').forEach(el => { if (ND[el.dataset.text] != null) el.textContent = ND[el.dataset.text]; });
$('s1hint').textContent = ND.huongDanDen || '';
$('envLetter').textContent = 'Gửi ' + (ND.ten || 'cậu') + '…';
$('yes1').textContent = (ND.nutTraLoi || [])[0] || 'Có';
$('yes2').textContent = (ND.nutTraLoi || [])[1] || 'Có chứ';
$('sigText').textContent = ND.chuViet || '';
$('sig').setAttribute('aria-label', ND.chuViet || '');
if ((ND.chuViet || '').length > 12){ $('sigText').setAttribute('textLength', 300); $('sigText').setAttribute('lengthAdjust', 'spacingAndGlyphs'); }
const setPhoto = (el, src) => { if (src){ el.className = 'photo'; el.style.background = `url("${encodeURI(src)}") center/cover no-repeat`; } };
const MAU_MINH_HOA = ['ph-cafe','ph-rain','ph-park','ph-night'];
(ND.cuonPhim || []).forEach((m, i) => {
  const f = document.createElement('div'); f.className = 'frame';
  const ph = document.createElement('div'); ph.className = 'photo ' + MAU_MINH_HOA[i % MAU_MINH_HOA.length]; setPhoto(ph, m.anh);
  const p = document.createElement('p'); p.textContent = m.chuThich || '';
  f.append(ph, p); $('strip').appendChild(f);
});
const app = $('app');
const order = ['s1','s2','s3','s4','s5','s6','s7'];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let cur = 0, z = 1;
const rand = (a,b) => a + Math.random()*(b-a);
const buzz = ms => {try{navigator.vibrate && navigator.vibrate(ms)}catch(e){}};

order.forEach(()=>$('dots').appendChild(document.createElement('i')));
function dots(){[...$('dots').children].forEach((d,i)=>d.classList.toggle('on',i===cur));}
dots();
const centerOf = el => {const b = el.getBoundingClientRect(); return [b.left + b.width/2, b.top + b.height/2];};

/* ================= CHUYỂN TRANG ================= */
function showInstant(el){
  el.style.transition = 'none'; el.classList.add('on'); void el.offsetWidth; el.style.transition = '';
}
function go(id, x, y, type='circle'){
  const el = $(id), from = $(order[cur]), r = app.getBoundingClientRect();
  const lx = x - r.left, ly = y - r.top;
  cur = order.indexOf(id); dots(); setAmbient(id);
  setTimeout(() => playTitle(el), type === 'petals' ? 750 : 300);
  if (reduce) type = 'circle';

  if (type === 'circle'){
    el.style.setProperty('--x', lx+'px'); el.style.setProperty('--y', ly+'px');
    el.style.zIndex = ++z; el.classList.add('on');
  }
  else if (type === 'page'){            // lật trang sách
    el.style.zIndex = ++z; showInstant(el);
    from.style.zIndex = ++z; from.classList.add('turn');
    tone(300,0,.5,.04); setTimeout(()=>noise(.35), 100);
    setTimeout(()=>{from.classList.remove('turn','on'); from.style.zIndex = 0;}, 1350);
  }
  else if (type === 'unfold'){          // mở tờ thư từ giữa ra
    el.style.zIndex = ++z; el.style.transition = 'none';
    el.style.clipPath = 'inset(50% 0 50% 0)'; el.classList.add('on'); void el.offsetWidth;
    el.style.transition = 'clip-path 1.1s cubic-bezier(.6,0,.2,1)'; el.style.clipPath = 'inset(0 0 0 0)';
  }
  else if (type === 'heart'){           // trái tim phóng to từ điểm chạm
    el.style.zIndex = ++z; el.style.transition = 'none'; el.classList.add('on');
    const t0 = performance.now(), maxS = Math.hypot(r.width, r.height) / 9;
    (function step(t){
      const k = Math.min(1, (t - t0) / 1300), e = k < .5 ? 4*k*k*k : 1 - Math.pow(-2*k+2,3)/2, s = e * maxS;
      const pts = [];
      for (let i = 0; i < 48; i++){
        const a = i / 48 * Math.PI * 2;
        const hx = 16*Math.pow(Math.sin(a),3), hy = -(13*Math.cos(a) - 5*Math.cos(2*a) - 2*Math.cos(3*a) - Math.cos(4*a));
        pts.push(`${(lx + hx*s).toFixed(1)}px ${(ly + hy*s).toFixed(1)}px`);
      }
      el.style.clipPath = `polygon(${pts.join(',')})`;
      if (k < 1) requestAnimationFrame(step); else el.style.clipPath = 'inset(0)';
    })(t0);
  }
  else if (type === 'petals'){          // bão cánh hoa che màn hình rồi cuốn đi
    petalStorm(() => {el.style.zIndex = ++z; showInstant(el);});
  }
  if (enter[id]) setTimeout(enter[id], type === 'petals' ? 900 : 500);
}

/* ---- bão cánh hoa ---- */
const fx = $('fx'), fc = fx.getContext('2d');
function fitCanvas(c){const r = app.getBoundingClientRect(); c.width = r.width * devicePixelRatio; c.height = r.height * devicePixelRatio; c.getContext('2d').setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); return r;}
function drawPetal(ctx, x, y, s, rot, color, alpha=1){
  ctx.save(); ctx.translate(x,y); ctx.rotate(rot); ctx.globalAlpha = alpha; ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(0,-s); ctx.bezierCurveTo(s*.9,-s*.6, s*.7,s*.6, 0,s); ctx.bezierCurveTo(-s*.7,s*.6, -s*.9,-s*.6, 0,-s); ctx.fill(); ctx.restore();
}
function petalStorm(mid){
  const r = fitCanvas(fx), W = r.width, H = r.height, cols = ['#d9577a','#e8839b','#f4a6b8','#f7dfe3','#c94468'];
  const ps = Array.from({length:220}, () => ({x:rand(-W*1.4,-20), y:rand(-40,H+40), s:rand(9,20), vx:rand(9,15), vy:rand(-1.5,1.5), rot:rand(0,6), vr:rand(-.2,.2), c:cols[Math.floor(Math.random()*cols.length)]}));
  let swapped = false, t0 = performance.now(); noise(1.2);
  (function f(t){
    fc.clearRect(0,0,W,H); let alive = 0;
    ps.forEach(p => {p.x += p.vx; p.y += p.vy + Math.sin((t+p.x)/180)*1.6; p.rot += p.vr; if (p.x < W+40) alive++; drawPetal(fc,p.x,p.y,p.s,p.rot,p.c);});
    if (!swapped && t - t0 > 650){swapped = true; mid();}
    if (alive) requestAnimationFrame(f); else fc.clearRect(0,0,W,H);
  })(t0);
}

/* ================= ÂM THANH ================= */
let ac, muted = ND.batAmThanh === false;
if (muted){ $('mute').textContent = '×'; $('mute').setAttribute('aria-label', 'Bật âm thanh'); }
function ctx(){ac = ac || new (window.AudioContext||window.webkitAudioContext)(); return ac;}
function tone(f, t=0, d=1.2, v=.12, type='sine'){
  if (muted) return;
  try{
    const a = ctx(), o = a.createOscillator(), g = a.createGain(), s = a.currentTime + t;
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(v, s+.02); g.gain.exponentialRampToValueAtTime(.0001, s+d);
    o.connect(g).connect(a.destination); o.start(s); o.stop(s+d);
  }catch(e){}
}
function noise(d=.5, v=.05){              // tiếng gió / sột soạt giấy
  if (muted) return;
  try{
    const a = ctx(), len = a.sampleRate*d, b = a.createBuffer(1,len,a.sampleRate), ch = b.getChannelData(0);
    for (let i=0;i<len;i++) ch[i] = (Math.random()*2-1) * Math.sin(Math.PI*i/len);
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    f.type = 'bandpass'; f.frequency.value = 1800; g.gain.value = v; s.buffer = b;
    s.connect(f).connect(g).connect(a.destination); s.start();
  }catch(e){}
}
const chord = () => [523,659,784,1047].forEach((f,i)=>tone(f,i*.09,1.6,.08));
/* hộp nhạc cho cảnh cuối */
const MELODY = [659,784,880,784,659,587,523,587,659,659,587,0, 659,784,880,1047,988,880,784,659,698,659,587,0];
let mbTimer = null, mbStep = 0;
function musicBox(on){
  clearInterval(mbTimer); mbTimer = null;
  if (!on) return;
  mbStep = 0;
  mbTimer = setInterval(() => {
    const n = MELODY[mbStep++ % MELODY.length];
    if (n){ tone(n,0,1.4,.07,'triangle'); tone(n*2,0,.6,.015); }
    if (mbStep % 4 === 1) tone(MELODY[(mbStep-1) % MELODY.length]/2 || 262,0,1.8,.03,'sine');
  }, 330);
}
$('mute').onclick = () => {
  muted = !muted; $('mute').textContent = muted ? '×' : '♪';
  $('mute').setAttribute('aria-label', muted ? 'Bật âm thanh' : 'Tắt âm thanh');
  if (muted) musicBox(false); else if (cur === 6 && $('ans').classList.contains('hide')) musicBox(true);
};

/* ================= NỀN TRÔI NHẸ ================= */
const amb = $('ambient'), actx = amb.getContext('2d');
const AMB = {
  s1:{kind:'dust',  n:30, c:['#f3e9de'], a:.3},
  s2:{kind:'petal', n:10, c:['#e8839b','#f2c46d'], a:.4},
  s3:{kind:'dust',  n:40, c:['#f3e9de'], a:.35},
  s4:{kind:'fly',   n:22, c:['#f2c46d'], a:1},
  s5:{kind:'petal', n:10, c:['#d76a7c','#f2c46d'], a:.45},
  s6:{kind:'petal', n:6,  c:['#f4a6b8'], a:.3},
  s7:{kind:'none',  n:0,  c:[], a:0},
};
let ambP = [], ambCfg = AMB.s1, AW = 0, AH = 0;
function setAmbient(id){
  ambCfg = AMB[id];
  const r = fitCanvas(amb); AW = r.width; AH = r.height;
  ambP = Array.from({length:ambCfg.n}, () => ({x:rand(0,AW), y:rand(0,AH), s:rand(4,9), vx:rand(-.3,.3), vy:rand(.2,.7), rot:rand(0,6), vr:rand(-.02,.02), ph:rand(0,6), c:ambCfg.c[Math.floor(Math.random()*ambCfg.c.length)]}));
}
function ambLoop(t){
  actx.clearRect(0,0,AW,AH);
  if (!reduce) ambP.forEach(p => {
    if (ambCfg.kind === 'petal'){
      p.x += p.vx + Math.sin(t/1400 + p.ph)*.4; p.y += p.vy; p.rot += p.vr;
      if (p.y > AH+20){p.y = -20; p.x = rand(0,AW);}
      drawPetal(actx,p.x,p.y,p.s,p.rot,p.c,ambCfg.a);
    } else if (ambCfg.kind === 'dust'){
      p.x += p.vx*.6; p.y -= p.vy*.3; if (p.y < -5){p.y = AH+5; p.x = rand(0,AW);}
      actx.globalAlpha = ambCfg.a * (.5 + .5*Math.sin(t/700+p.ph)); actx.fillStyle = p.c;
      actx.beginPath(); actx.arc(p.x,p.y,p.s/5,0,7); actx.fill();
    } else if (ambCfg.kind === 'fly'){
      p.x += Math.cos(t/1800 + p.ph)*.5; p.y += Math.sin(t/1500 + p.ph*2)*.4;
      const g = .3 + .7*Math.max(0, Math.sin(t/600 + p.ph*3));
      const grd = actx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.s*1.6);
      grd.addColorStop(0, `rgba(242,196,109,${g})`); grd.addColorStop(1,'rgba(242,196,109,0)');
      actx.globalAlpha = 1; actx.fillStyle = grd; actx.beginPath(); actx.arc(p.x,p.y,p.s*1.6,0,7); actx.fill();
    }
  });
  trail = trail.filter(p => {
    p.x += p.vx; p.y += p.vy; p.life -= .025; p.rot += .05;
    actx.globalAlpha = Math.max(0, p.life); actx.fillStyle = p.c;
    const s = p.s * (.6 + p.life*.4);
    if (p.kind === 'heart') drawHeart(actx, p.x, p.y - s/2, s); else drawStar(actx, p.x, p.y, s, p.rot);
    return p.life > 0;
  });
  actx.globalAlpha = 1;
  requestAnimationFrame(ambLoop);
}
setAmbient('s1'); requestAnimationFrame(ambLoop);
addEventListener('resize', () => setAmbient(order[cur]));

/* nghiêng ảnh / phong bì theo tay */
let trail = [], lastTX = -99, lastTY = -99;
app.addEventListener('pointermove', e => {
  if (reduce) return;
  const r = app.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, nx = x/r.width - .5, ny = y/r.height - .5;
  document.querySelectorAll('.tilt').forEach(t => {
    t.style.setProperty('--rx', (nx*16).toFixed(1)+'deg'); t.style.setProperty('--ry', (-ny*16).toFixed(1)+'deg');
    t.style.setProperty('--gx', (50 - nx*120).toFixed(0)+'%');
  });
  /* vệt tim / ánh sao theo ngón tay */
  if (Math.hypot(x - lastTX, y - lastTY) > 14 && $('curtain').classList.contains('open')){
    lastTX = x; lastTY = y;
    const dark = ['s1','s3','s4'].includes(order[cur]) || $('s7').classList.contains('night');
    trail.push({x, y, vx:rand(-.6,.6), vy:rand(-1.2,-.3), life:1, s:rand(5,9), rot:rand(-.5,.5), kind: dark ? 'star' : 'heart', c: dark ? '#f2c46d' : ['#d9577a','#e8839b','#f4a6b8'][Math.floor(Math.random()*3)]});
    if (trail.length > 60) trail.shift();
  }
});
function drawHeart(c, x, y, s){
  c.beginPath(); c.moveTo(x, y + s*.3);
  c.bezierCurveTo(x, y, x - s*.5, y, x - s*.5, y + s*.3);
  c.bezierCurveTo(x - s*.5, y + s*.6, x, y + s*.8, x, y + s);
  c.bezierCurveTo(x, y + s*.8, x + s*.5, y + s*.6, x + s*.5, y + s*.3);
  c.bezierCurveTo(x + s*.5, y, x, y, x, y + s*.3); c.fill();
}
function drawStar(c, x, y, s, rot){
  c.save(); c.translate(x, y); c.rotate(rot); c.beginPath();
  for (let i = 0; i < 8; i++){ const rr = i % 2 ? s*.22 : s; const a = i * Math.PI/4; c.lineTo(Math.cos(a)*rr, Math.sin(a)*rr); }
  c.closePath(); c.fill(); c.restore();
}

/* ================= 1. KÉO DÂY BẬT ĐÈN ================= */
const lc = $('lights'), lx = lc.getContext('2d'), cord = $('cord');
const BULB_COLORS = ['#ffd27a','#ff9db5','#9fe0ff','#c9a7ff','#ffe9c2'];
let lit = false, bulbs = [], nameDots = [], lightT0 = 0, lightRaf = 0, LW = 0, LH = 0;
/* vẽ sẵn 1 bóng đèn phát sáng cho mỗi màu để vẽ nhanh */
const sprites = {};
BULB_COLORS.forEach(c => {
  const s = document.createElement('canvas'); s.width = s.height = 32; const g = s.getContext('2d');
  const grd = g.createRadialGradient(16,16,0,16,16,16);
  grd.addColorStop(0,'#fffaf0'); grd.addColorStop(.18,c); grd.addColorStop(.45,c+'66'); grd.addColorStop(1,c+'00');
  g.fillStyle = grd; g.fillRect(0,0,32,32); sprites[c] = s;
});

/* kéo dây: kéo xuống quá 40px hoặc chạm 1 cái là bật */
let pull = null;
const baseLen = () => cord.querySelector('.cord-line').offsetHeight;
cord.addEventListener('pointerdown', e => {
  if (lit) return; ctx();
  pull = {y: e.clientY, base: baseLen(), dy: 0};
  cord.classList.add('dragging'); cord.setPointerCapture(e.pointerId);
});
cord.addEventListener('pointermove', e => {
  if (!pull) return;
  pull.dy = Math.max(0, Math.min(110, e.clientY - pull.y));
  cord.style.setProperty('--len', (pull.base + pull.dy) + 'px');
});
const release = () => {
  if (!pull) return;
  const dy = pull.dy; pull = null;
  cord.classList.remove('dragging'); cord.style.removeProperty('--len');   // dây bật ngược lên
  if (dy > 40 || dy < 6) switchOn();
};
cord.addEventListener('pointerup', release);
cord.addEventListener('pointercancel', release);
cord.addEventListener('keydown', e => {if (e.key === 'Enter' || e.key === ' '){e.preventDefault(); switchOn();}});

async function switchOn(){
  if (lit) return; lit = true;
  noise(.06, .12); tone(2400, 0, .04, .05, 'square'); buzz(20);     // tiếng "tách"
  $('s1').classList.add('lit');
  const r = fitCanvas(lc); LW = r.width; LH = r.height;
  /* dây đèn nháy võng ngang phía trên */
  bulbs = [];
  const n = Math.max(8, Math.round(LW / 34)), sag = Math.min(70, LH * .09), y0 = LH * .1;
  for (let i = 0; i <= n; i++){
    const t = i / n, x = 12 + t * (LW - 24), y = y0 + 4 * sag * t * (1 - t);
    bulbs.push({x, y, c: BULB_COLORS[i % BULB_COLORS.length], at: t * 520, ph: rand(0, 6)});
  }
  /* tên viết bằng đèn */
  const ten = ND.chuDen || ND.ten || 'cậu';
  try { await document.fonts.load('700 80px "Dancing Script"'); } catch(e){}
  const off = document.createElement('canvas'), o = off.getContext('2d');
  off.width = Math.round(LW); off.height = Math.round(LH * .4);
  let fs = Math.min(off.height * .8, 140);
  o.font = `700 ${fs}px "Dancing Script", cursive`;
  const tw = o.measureText(ten).width; if (tw > LW * .86){ fs *= LW * .86 / tw; o.font = `700 ${fs}px "Dancing Script", cursive`; }
  o.fillStyle = '#000'; o.textAlign = 'center'; o.textBaseline = 'middle';
  o.fillText(ten, off.width / 2, off.height / 2);
  const data = o.getImageData(0, 0, off.width, off.height).data, step = Math.max(4, Math.round(fs / 22));
  const top = LH * .42 - off.height / 2;
  nameDots = [];
  for (let y = 0; y < off.height; y += step) for (let x = 0; x < off.width; x += step){
    if (data[(y * off.width + x) * 4 + 3] > 140)
      nameDots.push({x: x + rand(-.6,.6), y: top + y + rand(-.6,.6), c: BULB_COLORS[(x / step + y / step) % 2 ? 0 : 1], at: 600 + (x / off.width) * 950 + rand(0, 140), ph: rand(0, 6)});
  }
  /* nhạc đi theo dây đèn rồi theo tên */
  [523,587,659,784,880].forEach((f, i) => tone(f, .05 + i * .1, .5, .05));
  [659,784,880,1047,1175,1319].forEach((f, i) => tone(f, .65 + i * .17, .9, .06, 'triangle'));
  setTimeout(chord, 1650);
  lightT0 = performance.now(); cancelAnimationFrame(lightRaf); drawLights(lightT0);
  setTimeout(() => go('s2', LW / 2 + app.getBoundingClientRect().left, LH * .42 + app.getBoundingClientRect().top, 'circle'), 2900);
}
function drawLights(t){
  const e = t - lightT0;
  lx.clearRect(0, 0, LW, LH);
  /* sợi dây */
  lx.strokeStyle = 'rgba(201,184,166,.5)'; lx.lineWidth = 1.2; lx.beginPath();
  bulbs.forEach((b, i) => i ? lx.lineTo(b.x, b.y) : lx.moveTo(b.x, b.y)); lx.stroke();
  const draw = (d, size) => {
    const k = Math.max(0, Math.min(1, (e - d.at) / 180));
    if (k <= 0){ lx.globalAlpha = .25; lx.fillStyle = '#4a3f52'; lx.beginPath(); lx.arc(d.x, d.y, size * .12, 0, 7); lx.fill(); return; }
    lx.globalAlpha = k * (.78 + .22 * Math.sin(t / 380 + d.ph));
    const s = size * (k < 1 ? 1 + (1 - k) * .8 : 1);
    lx.drawImage(sprites[d.c], d.x - s / 2, d.y - s / 2, s, s);
  };
  bulbs.forEach(b => draw(b, 34));
  nameDots.forEach(d => draw(d, 16));
  lx.globalAlpha = 1;
  if (e < 6000) lightRaf = requestAnimationFrame(drawLights);
}
function resetLights(){
  lit = false; cancelAnimationFrame(lightRaf); lx.clearRect(0, 0, lc.width, lc.height);
  $('s1').classList.remove('lit'); $('s1hint').textContent = ND.huongDanDen || '';
}

/* ================= 2. LỌ SAO GIẤY ================= */
const SAO = (ND.saoGiay && ND.saoGiay.length) ? ND.saoGiay : ['Tớ thích cậu'];
const STAR_COLORS = ['#f4a6b8','#f2c46d','#a8d5c9','#c9b6f0','#f7b98a','#9fc6f0','#e8839b'];
let taken = 0, jarBusy = false, realStars = [];
function fillJar(){
  const g = $('glass'); g.querySelectorAll('.pstar').forEach(s => s.remove());
  realStars = []; taken = 0; jarBusy = false;
  $('collected').innerHTML = ''; $('note').className = 'note'; $('b2').classList.remove('show');
  const total = SAO.length + 16;
  /* xếp sao từ đáy lọ lên; các sao "thật" (có lời nhắn) nằm trên cùng */
  for (let i = 0; i < total; i++){
    const s = document.createElement('div'); s.className = 'pstar';
    const row = Math.floor(i / 6), x = 14 + (i % 6) * 25 + (row % 2) * 10 + rand(-5, 5), y = 218 - 34 - row * 17 + rand(-5, 5);
    s.style.left = Math.max(6, Math.min(156, x)) + 'px'; s.style.top = Math.max(20, y) + 'px';
    s.style.transform = `rotate(${rand(0, 72).toFixed(0)}deg)`;
    s.style.background = STAR_COLORS[i % STAR_COLORS.length];
    g.appendChild(s);
    if (i >= total - SAO.length){ s.classList.add('real'); s.style.setProperty('--d', rand(0, 2).toFixed(2) + 's'); realStars.push(s); }
  }
  realStars.reverse();                         // lấy sao trên cùng trước
}
const wait = ms => new Promise(r => setTimeout(r, ms));
async function takeStar(){
  if (jarBusy || taken >= SAO.length) return;
  jarBusy = true;
  const note = $('note'), jar = $('jar');
  /* mẩu giấy cũ bay xuống hàng sao đã mở */
  if (note.classList.contains('open')){
    note.classList.remove('open'); note.classList.add('away');
    const c = document.createElement('i'); c.style.background = note.dataset.color;
    setTimeout(() => $('collected').appendChild(c), 380);
    await wait(reduce ? 20 : 480); note.classList.remove('away');
  }
  const s = realStars[taken], color = s.style.background;
  jar.classList.remove('shake'); void jar.offsetWidth; jar.classList.add('shake');
  $('lid').classList.add('pop'); noise(.2, .04); tone(880, 0, .3, .05); buzz(10);
  const r = app.getBoundingClientRect(), b = s.getBoundingClientRect(), lb = $('lid').getBoundingClientRect(), ab = note.parentElement.getBoundingClientRect();
  s.style.visibility = 'hidden';
  const f = document.createElement('div'); f.className = 'flystar'; f.style.background = color;
  f.style.left = (b.left - r.left) + 'px'; f.style.top = (b.top - r.top) + 'px'; app.appendChild(f);
  const dx1 = lb.left + lb.width / 2 - b.left - 13, dy1 = lb.top - 50 - b.top;
  const dx2 = ab.left + ab.width / 2 - b.left - 13, dy2 = ab.top + 70 - b.top;
  f.animate([
    {transform: 'translate(0,0) rotate(0deg) scale(1)'},
    {transform: `translate(${dx1}px,${dy1}px) rotate(360deg) scale(1.5)`, offset: .45},
    {transform: `translate(${dx2}px,${dy2}px) rotate(700deg) scale(3.4)`, opacity: 1, offset: .85},
    {transform: `translate(${dx2}px,${dy2}px) rotate(740deg) scale(5)`, opacity: 0}
  ], {duration: reduce ? 10 : 1300, easing: 'cubic-bezier(.3,.7,.3,1)', fill: 'forwards'});
  setTimeout(() => $('lid').classList.remove('pop'), 650);
  await wait(reduce ? 20 : 1050);
  $('noteN').textContent = `Điều thứ ${taken + 1} / ${SAO.length}`;
  $('noteText').textContent = SAO[taken];
  note.dataset.color = color; note.style.borderTop = `4px solid ${color}`;
  note.classList.add('open'); noise(.3, .05); tone(1047, 0, 1, .06); tone(1319, .08, 1, .04);
  setTimeout(() => f.remove(), 400);
  taken++;
  if (taken >= SAO.length) setTimeout(() => {$('b2').classList.add('show'); chord();}, 900);
  jarBusy = false;
}
$('jar').onclick = takeStar;
$('note').onclick = takeStar;
$('jar').onkeydown = e => {if (e.key === 'Enter' || e.key === ' '){e.preventDefault(); takeStar();}};
$('b2').onclick = e => go('s3', e.clientX, e.clientY, 'circle');

/* ================= 3. CUỘN PHIM ================= */
const strip = $('strip'), frames = [...strip.children];
let lastFrame = -1;
function seen(){
  /* đo theo vị trí bố cục (không bị ảnh hưởng bởi hiệu ứng xoay 3D) */
  const mid = strip.scrollLeft + strip.clientWidth/2; let best = 0, bd = 1e9;
  frames.forEach((f,i) => {
    const c = f.offsetLeft + f.offsetWidth/2, ad = Math.abs(c - mid);
    if (ad < bd){bd = ad; best = i;}
    /* cuộn phim 3D: tấm ở giữa nổi lên, hai bên xoay vào trong */
    const d = Math.max(-1.5, Math.min(1.5, (c - mid) / (f.offsetWidth || 1))), a = Math.min(1, Math.abs(d));
    f.style.transform = reduce ? '' : `rotateY(${(-d*40).toFixed(1)}deg) translateZ(${(-a*90).toFixed(0)}px)`;
    f.style.filter = `grayscale(${a.toFixed(2)}) brightness(${(1 - a*.35).toFixed(2)})`;
  });
  frames[best].classList.add('seen');
  if (best !== lastFrame && lastFrame !== -1){ tone(1200,0,.06,.04,'square'); }
  lastFrame = best;
  $('cnt').textContent = (best+1) + ' / ' + frames.length;
  if (best === frames.length-1) $('b3').classList.add('show');
}
strip.addEventListener('scroll', () => {seen(); navState();}, {passive:true});

/* chuyển tấm bằng nút, chuột, bàn phím (để máy tính cũng xem được) */
function goFrame(i){
  i = Math.max(0, Math.min(frames.length - 1, i));
  const f = frames[i], target = f.offsetLeft - (strip.clientWidth - f.offsetWidth) / 2;
  const start = strip.scrollLeft, t0 = performance.now(), dur = reduce ? 1 : 420;
  strip.classList.add('dragging');            // tắt hít tạm thời để tự trượt mượt
  const finish = () => { strip.scrollLeft = target; strip.classList.remove('dragging'); seen(); navState(); };
  (function step(t){
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    strip.scrollLeft = start + (target - start) * e; seen();
    if (k < 1) requestAnimationFrame(step); else finish();
  })(t0);
  clearTimeout(goFrame.t); goFrame.t = setTimeout(finish, dur + 200);   // chốt vị trí dù trình duyệt bỏ khung hình
}
function navState(){
  $('prevF').disabled = lastFrame <= 0;
  $('nextF').disabled = lastFrame >= frames.length - 1;
}
$('prevF').onclick = () => goFrame(lastFrame - 1);
$('nextF').onclick = () => goFrame(lastFrame + 1);
strip.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight'){e.preventDefault(); goFrame(lastFrame + 1);}
  if (e.key === 'ArrowLeft'){e.preventDefault(); goFrame(lastFrame - 1);}
});
/* lăn chuột dọc → cuộn ngang */
let wheelLock = false;
strip.addEventListener('wheel', e => {
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
  e.preventDefault();
  if (wheelLock) return; wheelLock = true; setTimeout(() => wheelLock = false, 450);
  goFrame(lastFrame + (e.deltaY > 0 ? 1 : -1));
}, {passive:false});
/* kéo bằng chuột (điện thoại vẫn dùng vuốt bình thường) */
let drag = null;
strip.addEventListener('pointerdown', e => {
  if (e.pointerType !== 'mouse' || e.button !== 0) return;
  drag = {x: e.clientX, left: strip.scrollLeft, moved: false};
  strip.classList.add('dragging'); strip.setPointerCapture(e.pointerId);
});
strip.addEventListener('pointermove', e => {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  if (Math.abs(dx) > 4) drag.moved = true;
  strip.scrollLeft = drag.left - dx;
});
const endDrag = () => {
  if (!drag) return;
  const moved = drag.moved;
  drag = null; strip.classList.remove('dragging');
  if (moved){
    goFrame(lastFrame);                       // hít vào tấm gần giữa nhất
    strip.dataset.justDragged = '1';
    setTimeout(() => delete strip.dataset.justDragged, 50);
  }
};
strip.addEventListener('pointerup', endDrag);
strip.addEventListener('pointercancel', endDrag);
/* bấm vào tấm bên cạnh thì chuyển sang tấm đó */
frames.forEach((f, i) => f.addEventListener('click', () => {
  if (strip.dataset.justDragged) return;
  if (i !== lastFrame) goFrame(i);
}));
$('b3').onclick = e => go('s4', e.clientX, e.clientY, 'page');

/* ================= 4. KHOÁ ================= */
const pins = ['p1','p2','p3','p4'].map($);
pins.forEach((p,i) => {
  p.addEventListener('input', () => {
    p.value = p.value.replace(/\D/g,''); $('err').textContent = '';
    if (p.value){ tone(660 + i*110, 0, .25, .05); if (i < 3) pins[i+1].focus(); }
    if (pins.every(x => x.value)) check();
  });
  p.addEventListener('keydown', e => {if (e.key==='Backspace' && !p.value && i) pins[i-1].focus();});
});
$('lock').addEventListener('submit', e => {e.preventDefault(); check();});
let wrongTries = 0;
function check(){
  if (pins.map(x=>x.value).join('') === MA_KHOA){
    chord(); buzz(30); const [x,y] = centerOf($('lock')); setTimeout(() => go('s5', x, y, 'circle'), 250);
  } else {
    wrongTries++;
    $('err').textContent = wrongTries >= 4 ? 'Tớ điền sẵn 2 số đầu cho cậu rồi đó.'
      : wrongTries >= 2 ? (ND.goiYKhoa2 || 'Gợi ý: 4 số là ngày và tháng ghi trong lọ sao giấy.')
      : 'Chưa đúng rồi. Thử lại nhé.';
    $('lock').classList.remove('shake'); void $('lock').offsetWidth; $('lock').classList.add('shake');
    tone(220,0,.4,.08); buzz([40,40,40]); pins.forEach(x => x.value='');
    if (wrongTries >= 4){ pins[0].value = MA_KHOA[0]; pins[1].value = MA_KHOA[1]; pins[2].focus(); } else pins[0].focus();
  }
}

/* ================= 5. PHONG BÌ ================= */
function openEnv(){
  const env = $('env'); if (env.classList.contains('open')) return;
  env.classList.add('open'); noise(.4,.06); tone(659,.1,.8,.08); tone(880,.25,1,.06);
  setTimeout(() => {const [x,y] = centerOf(env); go('s6', x, y, 'unfold');}, 1600);
}
$('env').onclick = openEnv;
$('env').onkeydown = e => {if (e.key==='Enter'||e.key===' '){e.preventDefault(); openEnv();}};

/* ================= 6. THƯ ================= */
let typeRun = 0;
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function typeLetter(){
  const run = ++typeRun, el = $('tw'), speed = reduce ? 5 : 48;
  el.innerHTML = '';
  const caret = document.createElement('span'); caret.className = 'caret'; el.appendChild(caret);
  const typeInto = async (node, txt) => {
    for (const ch of txt){
      if (run !== typeRun) throw 0;
      node.data += ch;
      if (ch !== ' ' && Math.random() < .35) tone(rand(1400,1700), 0, .05, .015);
      await sleep(ch === ',' || ch === '.' ? speed*5 : speed);
    }
  };
  const plain = () => {const t = document.createTextNode(''); el.insertBefore(t, caret); return t;};
  const parts = LA_THU.split(/(\{[^}]*\})/);
  try{
    for (const part of parts){
      const m = part.match(/^\{([^|}]*)\|([^}]*)\}$/);
      if (!m){ await typeInto(plain(), part); continue; }
      const oops = document.createElement('span'); oops.className = 'oops'; oops.appendChild(document.createTextNode(''));
      el.insertBefore(oops, caret);
      await typeInto(oops.firstChild, m[1]);
      await sleep(reduce ? 50 : 650);
      if (run !== typeRun) throw 0;
      oops.classList.add('x'); noise(.25,.05);
      await sleep(reduce ? 50 : 550);
      await typeInto(plain(), ' ' + m[2]);
    }
    $('b6').classList.add('show');
  }catch(e){}
}
$('b6').onclick = e => go('s7', e.clientX, e.clientY, 'heart');

/* ================= 7. PHÁO HOA ================= */
const cf = $('confetti'), cc = cf.getContext('2d'); let rockets = [], sparks = [], fwRaf, fwTimer, CW, CH;
const FW_COLORS = ['#fff8f1','#f2c46d','#ff8fab','#ffd1dc','#c9a7ff','#ffffff'];
function burst(x, y, heart){
  const col = FW_COLORS[Math.floor(Math.random()*FW_COLORS.length)], n = heart ? 70 : 60, size = heart ? rand(.32,.42) : 0;
  for (let i = 0; i < n; i++){
    const a = i / n * Math.PI * 2; let vx, vy;
    if (heart){ vx = 16*Math.pow(Math.sin(a),3)*size; vy = -(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))*size; }
    else { const sp = rand(2,5.5); vx = Math.cos(a)*sp; vy = Math.sin(a)*sp; }
    sparks.push({x, y, vx, vy, life:1, c:col, d:rand(.010,.016)});
  }
  tone(rand(90,140),0,.5,.12,'triangle'); noise(.5,.08); buzz(15);
}
function launch(heart){
  rockets.push({x:rand(CW*.2,CW*.8), y:CH+10, ty:rand(CH*.15,CH*.45), vy:-rand(9,12), heart});
  tone(rand(500,700),0,.4,.02,'sawtooth');
}
function fireworks(){
  const r = fitCanvas(cf); CW = r.width; CH = r.height; rockets = []; sparks = [];
  cancelAnimationFrame(fwRaf); clearInterval(fwTimer);
  burst(CW/2, CH*.38, true);
  let k = 0; fwTimer = setInterval(() => launch(++k % 3 === 0), 900);
  (function f(){
    cc.globalCompositeOperation = 'destination-out'; cc.fillStyle = 'rgba(0,0,0,.22)'; cc.fillRect(0,0,CW,CH);
    cc.globalCompositeOperation = 'lighter';
    rockets = rockets.filter(r => {
      r.y += r.vy; r.vy *= .985;
      cc.fillStyle = '#ffe8b0'; cc.beginPath(); cc.arc(r.x, r.y, 2.2, 0, 7); cc.fill();
      if (r.y <= r.ty || r.vy > -2){ burst(r.x, r.y, r.heart); return false; }
      return true;
    });
    sparks = sparks.filter(s => {
      s.x += s.vx; s.y += s.vy; s.vx *= .975; s.vy = s.vy*.975 + .045; s.life -= s.d;
      cc.globalAlpha = Math.max(0, s.life); cc.fillStyle = s.c; cc.beginPath(); cc.arc(s.x, s.y, 2, 0, 7); cc.fill();
      return s.life > 0;
    });
    cc.globalAlpha = 1; cc.globalCompositeOperation = 'source-over';
    fwRaf = requestAnimationFrame(f);
  })();
}
document.querySelectorAll('.yes').forEach(b => b.onclick = () => {
  chord(); $('s7').classList.add('night');
  $('q').classList.add('hide'); $('ans').classList.add('hide');
  setTimeout(() => {$('q').style.display = 'none'; $('ans').style.display = 'none'; $('sig').hidden = false; $('sig').classList.add('draw');}, 500);
  setTimeout(() => {$('end').classList.add('show'); $('again').classList.add('show');}, 3000);
  fireworks(); setTimeout(() => musicBox(true), 1200);
});

/* ================= VÀO TỪNG CẢNH ================= */
const enter = {
  s2: fillJar,
  s3: () => {strip.scrollLeft = 0; lastFrame = -1; frames.forEach(f=>f.classList.remove('seen')); seen(); navState(); strip.focus({preventScroll:true});},
  s4: () => pins[0].focus({preventScroll:true}),
  s6: typeLetter,
};

$('again').onclick = () => {
  order.slice(1).forEach(id => {const e = $(id); e.classList.remove('on','turn','night'); e.style.zIndex = 0; e.style.clipPath = ''; e.style.transition = '';});
  cancelAnimationFrame(fwRaf); clearInterval(fwTimer); musicBox(false); cc.clearRect(0,0,cf.width,cf.height);
  resetLights();
  $('env').classList.remove('open'); pins.forEach(x=>x.value=''); $('err').textContent=''; wrongTries = 0;
  ['b2','b3','b6','end','again'].forEach(id => $(id).classList.remove('show'));
  $('q').style.display = ''; $('ans').style.display = ''; $('q').classList.remove('hide'); $('ans').classList.remove('hide');
  $('sig').hidden = true; $('sig').classList.remove('draw');
  $('tw').innerHTML = ''; typeRun++;
  frames.forEach(f => {f.style.transform = ''; f.style.filter = '';});
  cur = 0; z = 1; dots(); setAmbient('s1');
  $('curtain').classList.remove('open','gone');
  $('s1').querySelectorAll('.play').forEach(h => h.classList.remove('play'));
};

/* ================= CHỮ BAY LÊN ================= */
function splitTitle(h){
  if (h.dataset.split) return; h.dataset.split = 1;
  const words = h.textContent.trim().split(/\s+/); let i = 0;
  h.textContent = '';
  words.forEach((w, wi) => {
    const ws = document.createElement('span'); ws.className = 'tword';
    for (const ch of w){ const s = document.createElement('span'); s.className = 'tchar'; s.style.setProperty('--i', i++); s.textContent = ch; ws.appendChild(s); }
    h.appendChild(ws); if (wi < words.length - 1) h.appendChild(document.createTextNode(' '));
  });
  h.setAttribute('aria-label', words.join(' '));
}
function playTitle(scene){
  scene.querySelectorAll('h1,h2').forEach(h => {splitTitle(h); h.classList.remove('play'); void h.offsetWidth; h.classList.add('play');});
}
document.querySelectorAll('.scene h1, .scene h2').forEach(splitTitle);

/* ================= MÀN SÂN KHẤU ================= */
function openCurtain(){
  const c = $('curtain'); if (c.classList.contains('open')) return;
  c.classList.add('open'); ctx(); noise(1.6,.05);
  [392,523,659,784].forEach((f,i) => tone(f, .3 + i*.16, 1.4, .07, 'triangle'));
  setTimeout(() => playTitle($('s1')), 700);
  setTimeout(() => c.classList.add('gone'), 2300);
}
$('curtain').onclick = openCurtain;
$('curtain').onkeydown = e => {if (e.key==='Enter'||e.key===' '){e.preventDefault(); openCurtain();}};
