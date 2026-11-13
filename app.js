/**
 * ============================================================================
 * HARRY POTTER BÜYÜCÜ DÜELLOSU - OYUN MOTORU & DENGELİ ZORLUK MANTIĞI
 * ============================================================================
 */

(function () {
  'use strict';

  // --- HOUSE CONFIGURATION ---
  const HOUSES = {
    gryffindor: {
      name: 'Gryffindor',
      icon: '🦁',
      color: '#e5b73b',
      bgBadge: 'rgba(143, 19, 21, 0.4)',
      borderColor: '#e5b73b'
    },
    slytherin: {
      name: 'Slytherin',
      icon: '🐍',
      color: '#2ecc71',
      bgBadge: 'rgba(26, 77, 46, 0.4)',
      borderColor: '#2ecc71'
    },
    ravenclaw: {
      name: 'Ravenclaw',
      icon: '🦅',
      color: '#3498db',
      bgBadge: 'rgba(21, 50, 91, 0.4)',
      borderColor: '#3498db'
    },
    hufflepuff: {
      name: 'Hufflepuff',
      icon: '🦡',
      color: '#f1c40f',
      bgBadge: 'rgba(220, 161, 29, 0.4)',
      borderColor: '#f1c40f'
    }
  };

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    }

    playCorrect() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Magic bell chime (C5, E5, G5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.18, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.45);
      });
    }

    playWrong() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }

    playVictory() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 783.99, 880];
      const times = [0, 0.15, 0.30, 0.45, 0.70, 0.90];
      const durations = [0.13, 0.13, 0.13, 0.22, 0.18, 0.6];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + times[i]);
        gain.gain.setValueAtTime(0.2, now + times[i]);
        gain.gain.linearRampToValueAtTime(0.01, now + times[i] + durations[i]);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + times[i]);
        osc.stop(now + times[i] + durations[i]);
      });
    }

    playTick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    }
  }

  const sfx = new SoundFX();

  // --- CONFETTI PARTICLES ---
  class Confetti {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.animId = null;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    start() {
      this.particles = [];
      const colors = ['#d4af37', '#f7e089', '#e5b73b', '#2ecc71', '#3498db', '#e74c3c', '#ffffff'];
      for (let i = 0; i < 120; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height - this.canvas.height,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 4 + 3,
          rotation: Math.random() * 360,
          vrot: (Math.random() - 0.5) * 8
        });
      }

      const animate = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let alive = false;
        this.particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vrot;
          if (p.y < this.canvas.height + 20) {
            alive = true;
          }
          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate((p.rotation * Math.PI) / 180);
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          this.ctx.restore();
        });

        if (alive) {
          this.animId = requestAnimationFrame(animate);
        } else {
          this.stop();
        }
      };

      if (this.animId) cancelAnimationFrame(this.animId);
      animate();
    }

    stop() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  // --- GAME STATE ---
  const state = {
    p1: { name: 'Büyücü 1', house: 'gryffindor', score: 0 },
    p2: { name: 'Büyücü 2', house: 'slytherin', score: 0 },
    totalQuestions: 20, // 10 per player (3 Kolay + 7 Orta)
    timerSecs: 0, // 0 = off
    passDeviceModal: true,
    currentRound: 0, // 0 to totalQuestions - 1
    selectedQuestions: [],
    history: [], // records each turn
    timerInterval: null,
    timeLeft: 0,
    hasAnswered: false
  };

  let confetti = null;

  // --- DOM ELEMENTS ---
  const el = {
    app: document.getElementById('app-container'),
    confettiCanvas: document.getElementById('confetti-canvas'),
    soundToggleBtn: document.getElementById('sound-toggle-btn')
  };

  // --- INITIALIZATION ---
  function init() {
    confetti = new Confetti(el.confettiCanvas);

    el.soundToggleBtn.addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      el.soundToggleBtn.textContent = sfx.enabled ? '🔊' : '🔇';
    });

    renderSetupScreen();
  }

  // ==========================================================================
  // SCREEN 1: SETUP SCREEN
  // ==========================================================================
  function renderSetupScreen() {
    const totalPoolCount = (window.HP_QUESTIONS && window.HP_QUESTIONS.length) || 560;

    el.app.innerHTML = `
      <div class="top-nav">
        <div class="brand-badge">
          <span>⚡</span> HOGWARTS BÜYÜCÜ DÜELLOSU
        </div>
        <div class="nav-actions">
          <button class="icon-btn" id="sound-btn-dyn" title="Ses Aç/Kapat">${sfx.enabled ? '🔊' : '🔇'}</button>
        </div>
      </div>

      <div class="game-card">
        <h1 class="screen-title">BÜYÜCÜ DÜELLOSU</h1>
        <p class="screen-subtitle">2 Kişilik Sıra Tabanlı Harry Potter Quizi<br>Her oyuncuya 10'ar soru, kim çok bilirse kazanır!</p>

        <!-- Player 1 Setup -->
        <div class="player-setup-box p1-box">
          <div class="player-header">
            <span class="player-tag">1. OYUNCU (BÜYÜCÜ 1)</span>
            <span class="house-name-display" id="p1-house-name">🦁 Gryffindor</span>
          </div>
          <input type="text" id="p1-name-input" class="player-input" value="${escapeHtml(state.p1.name)}" placeholder="1. Oyuncu Adı" maxlength="15">
          <div class="house-selector" id="p1-house-selector">
            ${renderHouseButtons('p1', state.p1.house)}
          </div>
        </div>

        <!-- Player 2 Setup -->
        <div class="player-setup-box p2-box">
          <div class="player-header">
            <span class="player-tag">2. OYUNCU (BÜYÜCÜ 2)</span>
            <span class="house-name-display" id="p2-house-name">🐍 Slytherin</span>
          </div>
          <input type="text" id="p2-name-input" class="player-input" value="${escapeHtml(state.p2.name)}" placeholder="2. Oyuncu Adı" maxlength="15">
          <div class="house-selector" id="p2-house-selector">
            ${renderHouseButtons('p2', state.p2.house)}
          </div>
        </div>

        <!-- Match Settings -->
        <div class="settings-section">
          <div class="setting-row">
            <span class="setting-label">🎯 Toplam Soru:</span>
            <div class="setting-segmented" id="q-count-seg">
              <button class="seg-btn ${state.totalQuestions === 10 ? 'active' : ''}" data-val="10">10 (5'er)</button>
              <button class="seg-btn ${state.totalQuestions === 20 ? 'active' : ''}" data-val="20">20 (10'ar)</button>
              <button class="seg-btn ${state.totalQuestions === 30 ? 'active' : ''}" data-val="30">30 (15'er)</button>
            </div>
          </div>

          <div class="setting-row">
            <span class="setting-label">⏱️ Soru Süresi:</span>
            <div class="setting-segmented" id="timer-seg">
              <button class="seg-btn ${state.timerSecs === 0 ? 'active' : ''}" data-val="0">Süresiz</button>
              <button class="seg-btn ${state.timerSecs === 20 ? 'active' : ''}" data-val="20">20 sn</button>
              <button class="seg-btn ${state.timerSecs === 30 ? 'active' : ''}" data-val="30">30 sn</button>
            </div>
          </div>

          <div class="setting-row">
            <span class="setting-label">📱 Cihazı Arkadaşa Verme Ekranı:</span>
            <div class="setting-segmented" id="pass-seg">
              <button class="seg-btn ${state.passDeviceModal ? 'active' : ''}" data-val="true">Açık</button>
              <button class="seg-btn ${!state.passDeviceModal ? 'active' : ''}" data-val="false">Kapalı</button>
            </div>
          </div>
        </div>

        <div class="difficulty-flow-badge">
          ✨ <strong>Dengeli Zorluk Düzeni:</strong> İki oyuncunun da ilk <strong>3 sorusu Kolay</strong>, sonraki tüm soruları <strong>Orta zorlukta</strong> gelir!
        </div>

        <button class="btn-primary" id="start-game-btn">
          <span>🪄</span> DÜELLOYU BAŞLAT
        </button>
      </div>
    `;

    document.getElementById('sound-btn-dyn').addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      document.getElementById('sound-btn-dyn').textContent = sfx.enabled ? '🔊' : '🔇';
    });

    document.querySelectorAll('#p1-house-selector .house-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sfx.playClick();
        state.p1.house = btn.dataset.house;
        document.querySelectorAll('#p1-house-selector .house-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('p1-house-name').textContent = `${HOUSES[state.p1.house].icon} ${HOUSES[state.p1.house].name}`;
      });
    });

    document.querySelectorAll('#p2-house-selector .house-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sfx.playClick();
        state.p2.house = btn.dataset.house;
        document.querySelectorAll('#p2-house-selector .house-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('p2-house-name').textContent = `${HOUSES[state.p2.house].icon} ${HOUSES[state.p2.house].name}`;
      });
    });

    setupSegmentedControl('q-count-seg', val => {
      state.totalQuestions = parseInt(val, 10);
    });

    setupSegmentedControl('timer-seg', val => {
      state.timerSecs = parseInt(val, 10);
    });

    setupSegmentedControl('pass-seg', val => {
      state.passDeviceModal = (val === 'true');
    });

    document.getElementById('start-game-btn').addEventListener('click', () => {
      sfx.playClick();
      const p1Input = document.getElementById('p1-name-input').value.trim();
      const p2Input = document.getElementById('p2-name-input').value.trim();

      state.p1.name = p1Input || 'Büyücü 1';
      state.p2.name = p2Input || 'Büyücü 2';

      startMatch();
    });
  }

  function renderHouseButtons(playerPrefix, selectedHouse) {
    return Object.keys(HOUSES).map(houseKey => {
      const h = HOUSES[houseKey];
      const isActive = houseKey === selectedHouse ? 'active' : '';
      return `
        <button type="button" class="house-btn ${isActive}" data-house="${houseKey}">
          <span class="house-icon">${h.icon}</span>
          <span class="house-lbl">${h.name}</span>
        </button>
      `;
    }).join('');
  }

  function setupSegmentedControl(containerId, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll('.seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sfx.playClick();
        container.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        callback(btn.dataset.val);
      });
    });
  }

  // ==========================================================================
  // MATCH CONTROLLER & BALANCED QUESTION SELECTION
  // ==========================================================================
  function startMatch() {
    state.p1.score = 0;
    state.p2.score = 0;
    state.currentRound = 0;
    state.history = [];

    const allQuestions = (window.HP_QUESTIONS && window.HP_QUESTIONS.slice()) || [];
    if (allQuestions.length < state.totalQuestions) {
      alert("Yeterli soru havuzu bulunamadı!");
      return;
    }

    // Split into Kolay and Orta pools
    const easyPool = allQuestions.filter(q => q.difficulty === 'Kolay');
    const mediumPool = allQuestions.filter(q => q.difficulty === 'Orta');

    shuffleArray(easyPool);
    shuffleArray(mediumPool);

    // Number of questions per player
    const perPlayerTotal = state.totalQuestions / 2;
    // User requirement: First 3 questions for each player are Kolay, remainder are Orta
    const easyPerPlayer = Math.min(3, perPlayerTotal);
    const mediumPerPlayer = perPlayerTotal - easyPerPlayer;

    // Pick 3 Kolay for P1, 3 Kolay for P2
    const p1Easy = easyPool.slice(0, easyPerPlayer);
    const p2Easy = easyPool.slice(easyPerPlayer, easyPerPlayer * 2);

    // Pick remaining Orta for P1, remaining Orta for P2
    const p1Medium = mediumPool.slice(0, mediumPerPlayer);
    const p2Medium = mediumPool.slice(mediumPerPlayer, mediumPerPlayer * 2);

    // Combine player question lists
    const p1Questions = [...p1Easy, ...p1Medium];
    const p2Questions = [...p2Easy, ...p2Medium];

    // Interleave in alternating order:
    // Turn 0: P1 Q1 (Kolay)
    // Turn 1: P2 Q1 (Kolay)
    // Turn 2: P1 Q2 (Kolay)
    // Turn 3: P2 Q2 (Kolay)
    // Turn 4: P1 Q3 (Kolay)
    // Turn 5: P2 Q3 (Kolay)
    // Turn 6: P1 Q4 (Orta)
    // Turn 7: P2 Q4 (Orta)
    // ...
    state.selectedQuestions = [];
    for (let i = 0; i < perPlayerTotal; i++) {
      state.selectedQuestions.push(p1Questions[i]);
      state.selectedQuestions.push(p2Questions[i]);
    }

    if (state.passDeviceModal) {
      showTurnHandoffModal(0, () => {
        renderQuestionScreen();
      });
    } else {
      renderQuestionScreen();
    }
  }

  function getActivePlayerNumber() {
    return (state.currentRound % 2 === 0) ? 1 : 2;
  }

  function getActivePlayer() {
    return getActivePlayerNumber() === 1 ? state.p1 : state.p2;
  }

  // ==========================================================================
  // SCREEN 2: QUESTION & GAMEPLAY SCREEN
  // ==========================================================================
  function renderQuestionScreen() {
    clearInterval(state.timerInterval);
    state.hasAnswered = false;

    const q = state.selectedQuestions[state.currentRound];
    const activeNum = getActivePlayerNumber();
    const activeP = getActivePlayer();
    const houseInfo = HOUSES[activeP.house];

    // Progress dots
    let dotsHtml = '';
    for (let i = 0; i < state.totalQuestions; i++) {
      let dotClass = 'dot';
      if (i === state.currentRound) {
        dotClass += ' current';
      } else if (i < state.history.length) {
        dotClass += state.history[i].isCorrect ? ' correct' : ' wrong';
      }
      dotsHtml += `<div class="${dotClass}"></div>`;
    }

    // Atmospheric photo markup with error fallback & click-to-zoom
    let imageMarkup = '';
    if (q.image) {
      imageMarkup = `
        <div class="question-image-wrap" id="q-img-wrap" title="Büyütmek için tıklayın">
          <img src="${escapeHtml(q.image)}" alt="Harry Potter Soru Atmosferi" 
               onerror="this.closest('.question-image-wrap').style.display='none'">
        </div>
      `;
    }

    const playerQuestionCount = Math.floor(state.currentRound / 2) + 1;
    const maxPerPlayer = state.totalQuestions / 2;
    const isEasy = (q.difficulty === 'Kolay');

    el.app.innerHTML = `
      <div class="top-nav">
        <div class="brand-badge">
          <span>⚡</span> HOGWARTS BÜYÜCÜ DÜELLOSU
        </div>
        <div class="nav-actions">
          <button class="icon-btn" id="game-sound-btn" title="Ses Aç/Kapat">${sfx.enabled ? '🔊' : '🔇'}</button>
        </div>
      </div>

      <!-- Top Scoreboard Bar -->
      <div class="scoreboard-top">
        <div class="p-score-card ${activeNum === 1 ? 'active-turn' : ''}">
          <div class="p-avatar" style="border-color:${HOUSES[state.p1.house].color}">${HOUSES[state.p1.house].icon}</div>
          <div class="p-info">
            <span class="p-name">${escapeHtml(state.p1.name)}</span>
            <span class="p-points">${state.p1.score}</span>
          </div>
        </div>

        <div class="score-center-meta">
          <div class="round-pill">SORU ${state.currentRound + 1}/${state.totalQuestions}</div>
          <div class="timer-display" id="timer-box">
            ${state.timerSecs > 0 ? `<span>⏳</span> <span id="timer-num">${state.timerSecs}</span>s` : '<span>∞</span>'}
          </div>
        </div>

        <div class="p-score-card p2-align ${activeNum === 2 ? 'active-turn' : ''}">
          <div class="p-avatar" style="border-color:${HOUSES[state.p2.house].color}">${HOUSES[state.p2.house].icon}</div>
          <div class="p-info">
            <span class="p-name">${escapeHtml(state.p2.name)}</span>
            <span class="p-points">${state.p2.score}</span>
          </div>
        </div>
      </div>

      <!-- Progress Dots -->
      <div class="progress-dots">
        ${dotsHtml}
      </div>

      <div class="game-card">
        <!-- Active Turn Banner -->
        <div class="turn-banner" style="background:${houseInfo.bgBadge}; border-color:${houseInfo.borderColor}">
          <div class="turn-banner-left">
            <span class="turn-wand-icon">🪄</span>
            <div>
              <div class="turn-text" style="color:${houseInfo.color}">SIRA: ${escapeHtml(activeP.name)}</div>
              <div class="turn-subtext">${houseInfo.name} • ${playerQuestionCount}. Sorun (${playerQuestionCount}/${maxPerPlayer})</div>
            </div>
          </div>
          <span style="font-size:1.4rem">${houseInfo.icon}</span>
        </div>

        <!-- Question Meta Row (Category + Difficulty Badge) -->
        <div class="q-meta-row">
          <div class="category-tag">
            <span>${q.icon || '🎬'}</span> ${escapeHtml(q.category || q.film)}
          </div>
          <div class="difficulty-pill ${isEasy ? 'kolay' : 'orta'}">
            <span>${isEasy ? '🟢' : '🟡'}</span> ${escapeHtml(q.difficulty)}
          </div>
        </div>

        <!-- Atmospheric Photo -->
        ${imageMarkup}

        <!-- Question Text -->
        <div class="question-text">${escapeHtml(q.question)}</div>

        <!-- Options List -->
        <div class="options-list" id="options-container">
          ${renderOptionButtons(q.options)}
        </div>

        <!-- Explanation Card (revealed upon answering) -->
        <div id="explanation-box" style="display:none"></div>

        <!-- Next Question Action Button (revealed upon answering) -->
        <div class="action-area" id="action-area" style="display:none">
          <button class="btn-primary" id="next-question-btn">
            SONRAKİ SORU ➔
          </button>
        </div>
      </div>
    `;

    document.getElementById('game-sound-btn').addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      document.getElementById('game-sound-btn').textContent = sfx.enabled ? '🔊' : '🔇';
    });

    // Image click-to-zoom Lightbox
    const imgWrap = document.getElementById('q-img-wrap');
    if (imgWrap && q.image) {
      imgWrap.addEventListener('click', () => {
        openLightbox(q.image);
      });
    }

    document.querySelectorAll('#options-container .option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (state.hasAnswered) return;
        handleAnswer(parseInt(btn.dataset.idx, 10));
      });
    });

    document.getElementById('next-question-btn').addEventListener('click', () => {
      sfx.playClick();
      advanceTurn();
    });

    if (state.timerSecs > 0) {
      startTimer();
    }
  }

  function renderOptionButtons(options) {
    const letters = ['A', 'B', 'C', 'D'];
    return options.map((opt, idx) => `
      <button type="button" class="option-btn" data-idx="${idx}">
        <span class="option-letter">${letters[idx]}</span>
        <span class="option-label">${escapeHtml(opt)}</span>
      </button>
    `).join('');
  }

  // --- LIGHTBOX ZOOM MODAL ---
  function openLightbox(imgSrc) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `<img src="${escapeHtml(imgSrc)}" alt="Büyütülmüş Görsel">`;
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  }

  // --- TIMER HANDLING ---
  function startTimer() {
    state.timeLeft = state.timerSecs;
    const timerNumEl = document.getElementById('timer-num');
    const timerBoxEl = document.getElementById('timer-box');

    clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
      state.timeLeft--;
      if (timerNumEl) {
        timerNumEl.textContent = state.timeLeft;
      }

      if (state.timeLeft <= 5 && timerBoxEl) {
        timerBoxEl.classList.add('danger');
        sfx.playTick();
      }

      if (state.timeLeft <= 0) {
        clearInterval(state.timerInterval);
        handleAnswer(-1); // Timeout
      }
    }, 1000);
  }

  // --- ANSWER PROCESSING ---
  function handleAnswer(selectedIndex) {
    if (state.hasAnswered) return;
    state.hasAnswered = true;
    clearInterval(state.timerInterval);

    const q = state.selectedQuestions[state.currentRound];
    const isCorrect = (selectedIndex === q.correct);
    const activeP = getActivePlayer();

    if (isCorrect) {
      activeP.score++;
      sfx.playCorrect();
    } else {
      sfx.playWrong();
    }

    state.history.push({
      round: state.currentRound + 1,
      player: getActivePlayerNumber(),
      playerName: activeP.name,
      house: activeP.house,
      question: q,
      selectedIndex: selectedIndex,
      isCorrect: isCorrect
    });

    const optionButtons = document.querySelectorAll('#options-container .option-btn');
    optionButtons.forEach((btn, idx) => {
      btn.classList.add('disabled');
      if (idx === q.correct) {
        btn.classList.add('correct');
      } else if (idx === selectedIndex && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    const scoreDisplays = document.querySelectorAll('.p-points');
    if (scoreDisplays[0]) scoreDisplays[0].textContent = state.p1.score;
    if (scoreDisplays[1]) scoreDisplays[1].textContent = state.p2.score;

    const expBox = document.getElementById('explanation-box');
    if (expBox) {
      const resultTitle = isCorrect ? '✨ TEBRİKLER! DOĞRU CEVAP' : (selectedIndex === -1 ? '⏱️ SÜRE DOLDU!' : '❌ YANLIŞ CEVAP!');
      const resultColor = isCorrect ? 'var(--correct-green)' : 'var(--wrong-red)';
      expBox.className = 'explanation-card';
      expBox.style.borderLeftColor = resultColor;
      expBox.innerHTML = `
        <div class="exp-header" style="color:${resultColor}">
          <span>${isCorrect ? '✓' : '✗'}</span> ${resultTitle}
        </div>
        <div class="exp-body">
          <strong>Doğru Cevap:</strong> ${escapeHtml(q.options[q.correct])}
          ${q.explanation ? `<br><span style="opacity:0.9; margin-top:4px; display:inline-block;">💡 <em>${escapeHtml(q.explanation)}</em></span>` : ''}
        </div>
      `;
      expBox.style.display = 'block';
    }

    const actionArea = document.getElementById('action-area');
    if (actionArea) {
      actionArea.style.display = 'block';
      actionArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function advanceTurn() {
    state.currentRound++;
    if (state.currentRound >= state.totalQuestions) {
      endGame();
    } else {
      if (state.passDeviceModal) {
        showTurnHandoffModal(state.currentRound, () => {
          renderQuestionScreen();
        });
      } else {
        renderQuestionScreen();
      }
    }
  }

  // ==========================================================================
  // TURN HANDOFF MODAL ("Cihazı Arkadaşına Ver")
  // ==========================================================================
  function showTurnHandoffModal(turnIndex, onConfirm) {
    const nextPlayerNum = (turnIndex % 2 === 0) ? 1 : 2;
    const nextPlayer = nextPlayerNum === 1 ? state.p1 : state.p2;
    const houseInfo = HOUSES[nextPlayer.house];
    const playerQIndex = Math.floor(turnIndex / 2) + 1;
    const maxPerPlayer = state.totalQuestions / 2;
    const nextQ = state.selectedQuestions[turnIndex];
    const isEasy = (nextQ && nextQ.difficulty === 'Kolay');

    const overlay = document.createElement('div');
    overlay.className = 'handoff-overlay';
    overlay.innerHTML = `
      <div class="handoff-modal" style="border-color:${houseInfo.color}">
        <div class="handoff-icon">🪄</div>
        <div class="handoff-prompt">CİHAZI SIRADAKİ OYUNCUYA VERİN</div>
        <div class="handoff-name" style="color:${houseInfo.color}">
          ${escapeHtml(nextPlayer.name)}
        </div>
        <div class="handoff-house">
          ${houseInfo.icon} ${houseInfo.name} Binası • ${playerQIndex}. Sorun Hazır (${playerQIndex}/${maxPerPlayer})
          <br><span style="color:${isEasy ? '#34d399' : '#fbbf24'}; font-weight:700;">Zorluk: ${isEasy ? '🟢 Kolay' : '🟡 Orta'}</span>
        </div>
        <button class="btn-primary" id="confirm-handoff-btn">
          HAZIRIM, SORUYU AÇ!
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#confirm-handoff-btn').addEventListener('click', () => {
      sfx.playClick();
      overlay.remove();
      onConfirm();
    });
  }

  // ==========================================================================
  // SCREEN 3: VICTORY & GAME OVER SCREEN
  // ==========================================================================
  function endGame() {
    clearInterval(state.timerInterval);
    sfx.playVictory();
    confetti.start();

    const maxQuestionsPerPlayer = state.totalQuestions / 2;
    const p1 = state.p1;
    const p2 = state.p2;

    let winnerHeadline = '';
    let winnerSubtitle = '';
    let p1IsWinner = false;
    let p2IsWinner = false;

    if (p1.score > p2.score) {
      p1IsWinner = true;
      winnerHeadline = `🏆 ZAFER ${escapeHtml(p1.name.toUpperCase())}'İN!`;
      winnerSubtitle = `${HOUSES[p1.house].icon} ${HOUSES[p1.house].name} Hanedanı Düelloyu Kazandı!`;
    } else if (p2.score > p1.score) {
      p2IsWinner = true;
      winnerHeadline = `🏆 ZAFER ${escapeHtml(p2.name.toUpperCase())}'İN!`;
      winnerSubtitle = `${HOUSES[p2.house].icon} ${HOUSES[p2.house].name} Hanedanı Düelloyu Kazandı!`;
    } else {
      winnerHeadline = '🤝 EFSANEVİ BÜYÜCÜ BERABERLİĞİ!';
      winnerSubtitle = 'İkiniz de Hogwarts Tarihine Geçecek Kadar Kusursuz Yarıştınız!';
    }

    const p1Pct = Math.round((p1.score / maxQuestionsPerPlayer) * 100);
    const p2Pct = Math.round((p2.score / maxQuestionsPerPlayer) * 100);

    const logItemsHtml = state.history.map((h) => {
      const chosenText = h.selectedIndex >= 0 ? h.question.options[h.selectedIndex] : 'Süre Doldu';
      const correctText = h.question.options[h.question.correct];
      const house = HOUSES[h.house];
      const isEasy = (h.question.difficulty === 'Kolay');
      return `
        <div class="log-item ${h.isCorrect ? 'correct' : 'wrong'}">
          <div>
            <div class="log-q-title">#${h.round} [${isEasy ? 'Kolay' : 'Orta'}] ${escapeHtml(h.question.question)}</div>
            <div class="log-q-who">
              ${house.icon} <strong>${escapeHtml(h.playerName)}:</strong> 
              ${h.isCorrect ? `✓ ${escapeHtml(chosenText)}` : `✗ Senin: ${escapeHtml(chosenText)} | Doğru: ${escapeHtml(correctText)}`}
            </div>
          </div>
          <span style="font-size:1.1rem">${h.isCorrect ? '🟢' : '🔴'}</span>
        </div>
      `;
    }).join('');

    el.app.innerHTML = `
      <div class="top-nav">
        <div class="brand-badge">
          <span>⚡</span> DÜELLO SONUÇLARI
        </div>
      </div>

      <div class="game-card victory-card">
        <div class="winner-crown">${p1IsWinner || p2IsWinner ? '👑' : '⚖️'}</div>
        <h1 class="winner-title">${winnerHeadline}</h1>
        <p class="winner-rank">${winnerSubtitle}</p>

        <!-- Final Score Comparison -->
        <div class="final-duel-box">
          <div class="final-player ${p1IsWinner ? 'winner-highlight' : ''}">
            <div class="final-avatar">${HOUSES[p1.house].icon}</div>
            <div class="final-name" style="color:${HOUSES[p1.house].color}">${escapeHtml(p1.name)}</div>
            <div class="final-score">${p1.score} / ${maxQuestionsPerPlayer}</div>
            <div class="final-pct">%${p1Pct} Başarı</div>
          </div>

          <div class="final-vs">VS</div>

          <div class="final-player ${p2IsWinner ? 'winner-highlight' : ''}">
            <div class="final-avatar">${HOUSES[p2.house].icon}</div>
            <div class="final-name" style="color:${HOUSES[p2.house].color}">${escapeHtml(p2.name)}</div>
            <div class="final-score">${p2.score} / ${maxQuestionsPerPlayer}</div>
            <div class="final-pct">%${p2Pct} Başarı</div>
          </div>
        </div>

        <!-- Question Review Log Accordion -->
        <div class="log-accordion">
          <button type="button" class="log-toggle-btn" id="log-toggle-btn">
            <span>📜 Tüm Soruları & Cevapları İncele (${state.totalQuestions} Soru)</span>
            <span id="log-arrow">▼</span>
          </button>
          <div class="log-list" id="log-list" style="display:none">
            ${logItemsHtml}
          </div>
        </div>

        <!-- Action Buttons -->
        <button class="btn-primary" id="play-again-btn">
          <span>⚡</span> YENİ DÜELLO (YENİ 20 SORU)
        </button>

        <button class="btn-secondary" id="change-players-btn">
          <span>⚙️</span> OYUNCULARI VEYA AYARLARI DEĞİŞTİR
        </button>
      </div>
    `;

    const logToggleBtn = document.getElementById('log-toggle-btn');
    const logList = document.getElementById('log-list');
    const logArrow = document.getElementById('log-arrow');
    logToggleBtn.addEventListener('click', () => {
      const isHidden = logList.style.display === 'none';
      logList.style.display = isHidden ? 'flex' : 'none';
      logArrow.textContent = isHidden ? '▲' : '▼';
    });

    document.getElementById('play-again-btn').addEventListener('click', () => {
      confetti.stop();
      sfx.playClick();
      startMatch();
    });

    document.getElementById('change-players-btn').addEventListener('click', () => {
      confetti.stop();
      sfx.playClick();
      renderSetupScreen();
    });
  }

  // --- UTILITY FUNCTIONS ---
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
