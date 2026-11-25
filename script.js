/* script.js */
(() => {
  'use strict';

  /* =========================================================================
     1. CONFIGURAÇÕES DE BALANCEAMENTO, PERSONAGENS, ENGRENAGENS E MAPAS
     ========================================================================= */

  const GEAR_RARITIES = {
    common:    { id: 'common',    name: 'Comum',    mult: 1.0,  duration: 4.0, cooldown: 10.0, color: '#94a3b8' },
    rare:      { id: 'rare',      name: 'Rara',     mult: 1.35, duration: 4.5, cooldown: 16.0, color: '#3a86ff' },
    epic:      { id: 'epic',      name: 'Épica',    mult: 1.7,  duration: 5.0, cooldown: 23.0, color: '#9b5de5' },
    legendary: { id: 'legendary', name: 'Lendária', mult: 2.1,  duration: 5.5, cooldown: 32.0, color: '#ffb703' }
  };

  const GEARS_CATALOG = {
    speed: {
      id: 'speed',
      name: 'Engrenagem de Velocidade',
      shortName: 'VELOCIDADE',
      icon: '👟',
      baseBonus: 0.22,
      desc: 'Aumenta temporariamente a velocidade de movimentação na arena.'
    },
    strength: {
      id: 'strength',
      name: 'Engrenagem de Força',
      shortName: 'FORÇA',
      icon: '⚔️',
      baseBonus: 0.20,
      desc: 'Amplifica temporariamente o dano de todos os seus ataques.'
    },
    resistance: {
      id: 'resistance',
      name: 'Engrenagem de Resistência',
      shortName: 'RESISTÊNCIA',
      icon: '🛡️',
      baseBonus: 0.22,
      desc: 'Cria um escudo energético que reduz temporariamente o dano recebido.'
    },
    precision: {
      id: 'precision',
      name: 'Engrenagem de Precisão',
      shortName: 'PRECISÃO',
      icon: '🎯',
      baseBonus: 0.25,
      desc: 'Aumenta a velocidade dos projéteis e reduz a dispersão dos disparos.'
    },
    recovery: {
      id: 'recovery',
      name: 'Engrenagem de Recuperação',
      shortName: 'RECUPERAÇÃO',
      icon: '💚',
      baseBonus: 0.16,
      desc: 'Regenera continuamente uma parcela da sua vida máxima.'
    },
    reload: {
      id: 'reload',
      name: 'Engrenagem de Recarga',
      shortName: 'RECARGA',
      icon: '⚡',
      baseBonus: 0.28,
      desc: 'Acelera temporariamente a recarga dos seus ataques básicos.'
    }
  };

  const MODE_META = {
    '3v3':      { label: 'EQUIPE 3v3',      title: 'BATALHA EM EQUIPE 3v3' },
    'survival': { label: 'SOBREVIVÊNCIA',   title: 'SOBREVIVÊNCIA' },
    'ffa':      { label: 'BATALHA LIVRE',   title: 'BATALHA LIVRE' },
    'zone':     { label: 'ZONA ESTRATÉGICA',title: 'ZONA ESTRATÉGICA' },
    'brawlball':{ label: 'FUTBRAWL',        title: 'FUTBRAWL' },
    'gemgrab':  { label: 'PIQUE-GEMA',      title: 'PIQUE-GEMA' }
  };

  const HEROES = [
    {
      id: 'ana',
      name: 'Ana',
      role: 'INVESTIDA SOMBRIA',
      archetype: 'Curta Distância / Mobilidade',
      color: '#9b5de5',
      accent: '#f15bb5',
      hp: 4600,
      speed: 255,
      damage: 1150,
      range: 210,
      reloadTime: 1.55,
      maxAmmo: 3,
      style: 'ana_dash',
      desc: 'Avança como um relâmpago violeta atravessando inimigos próximos com sua lâmina espectral.',
      atkText: 'Investida veloz na direção escolhida que causa dano em área ao longo do trajeto.',
      ultText: 'Vórtice Escarlate: Onda de morcegos energéticos que causa dano e cura 60% do dano causado.',
      statsUI: { hp: 78, dmg: 76, spd: 95, rng: 38 }
    },
    {
      id: 'jose',
      name: 'José',
      role: 'ATIRADOR DE ELITE',
      archetype: 'Rajada Linear / Precisão',
      color: '#3a86ff',
      accent: '#00f5d4',
      hp: 3600,
      speed: 230,
      damage: 340,
      range: 520,
      reloadTime: 1.4,
      maxAmmo: 3,
      style: 'jose_burst',
      desc: 'Dispara rajadas precisas de energia azul em linha reta, punindo adversários fora de cobertura.',
      atkText: 'Sequência rápida de 6 projéteis alinhados na direção da mira.',
      ultText: 'Rajada Perfurante: 12 disparos pesados de longo alcance que destroem obstáculos leves.',
      statsUI: { hp: 58, dmg: 92, spd: 76, rng: 84 }
    },
    {
      id: 'gustavo',
      name: 'Gustavo',
      role: 'ESTRATEGISTA CAÓTICO',
      archetype: 'Efeitos Aleatórios / Versátil',
      color: '#f77f00',
      accent: '#fcbf49',
      hp: 4100,
      speed: 232,
      damage: 980,
      range: 440,
      reloadTime: 1.45,
      maxAmmo: 3,
      style: 'gustavo_random',
      desc: 'Manipula cápsulas imprevisíveis: cada disparo sorteia um efeito elemental distinto.',
      atkText: 'Alterna aleatoriamente entre Esfera Flamejante (dano alto), Leque Triplo ou Orbe Congelante (lentidão).',
      ultText: 'Explosão Surpresa: Detona uma nova prismática ao redor que atordoa e empurra inimigos.',
      statsUI: { hp: 70, dmg: 82, spd: 78, rng: 72 }
    },
    {
      id: 'jorge',
      name: 'Jorge',
      role: 'ARTILHEIRO DE FRAGMENTAÇÃO',
      archetype: 'Explosão com Estilhaços',
      color: '#06d6a0',
      accent: '#ffd166',
      hp: 3700,
      speed: 225,
      damage: 780,
      range: 460,
      reloadTime: 1.5,
      maxAmmo: 3,
      style: 'jorge_split',
      desc: 'Lança esferas cristalinas que se fragmentam em 6 espinhos radiais ao impactar.',
      atkText: 'Projétil principal explode ao atingir alvo, obstáculo ou alcance máximo, liberando 6 estilhaços.',
      ultText: 'Campo Cristalino: Cria uma zona de espinhos no chão que causa dano contínuo e lentidão.',
      statsUI: { hp: 60, dmg: 85, spd: 72, rng: 76 }
    },
    {
      id: 'davi',
      name: 'Davi',
      role: 'FRANCO-ATIRADOR',
      archetype: 'Longo Alcance / Escala por Distância',
      color: '#00b4d8',
      accent: '#caf0f8',
      hp: 3300,
      speed: 222,
      damage: 1580,
      range: 640,
      reloadTime: 1.75,
      maxAmmo: 3,
      style: 'davi_sniper',
      desc: 'Especialista em abates à distância. Seus disparos ganham potência conforme viajam pelo ar.',
      atkText: 'Disparo de altíssima velocidade: causa de 35% (curta distância) até 100% (alcance máximo) de dano.',
      ultText: 'Salto Tático: Impulsiona-se para longe deixando 3 minas explosivas na posição anterior.',
      statsUI: { hp: 50, dmg: 96, spd: 70, rng: 100 }
    },
    {
      id: 'gabriela',
      name: 'Gabriela',
      role: 'ESPECIALISTA EM DEMOLIÇÃO',
      archetype: 'Arremesso em Área / Controle',
      color: '#ef476f',
      accent: '#ffd166',
      hp: 3800,
      speed: 228,
      damage: 1220,
      range: 450,
      reloadTime: 1.55,
      maxAmmo: 3,
      style: 'gabriela_lob',
      desc: 'Arremessa cargas explosivas por cima de paredes, detonando em área após breve atraso.',
      atkText: 'Lança cargas aéreas que ignoram muros e explodem em área após 0.75s.',
      ultText: 'Megabomba Sísmica: Grande explosivo de raio amplo que causa dano massivo em área.',
      statsUI: { hp: 62, dmg: 90, spd: 75, rng: 74 }
    },
    {
      id: 'iarly',
      name: 'Iarly',
      role: 'PILOTO TURBO',
      archetype: 'Cadência Rápida / Arrancada Instantânea',
      color: '#ff5400',
      accent: '#ffbd00',
      hp: 3950,
      speed: 248,
      damage: 560,
      range: 430,
      reloadTime: 1.25,
      maxAmmo: 3,
      style: 'iarly_turbo',
      desc: 'Dispara foguetes duplos velozes e recarrega sua arrancada a cada acerto no alvo.',
      atkText: 'Disparo duplo de alta velocidade. Acertar um inimigo carrega 100% da sua Habilidade Especial!',
      ultText: 'Propulsão Nitro: Arrancada instantânea na direção do movimento deixando rastro de fogo.',
      statsUI: { hp: 66, dmg: 78, spd: 90, rng: 70 }
    }
  ];

  // 3 Mapas Originais com identidade visual e geometria distintas
  const MAPS = [
    {
      id: 'solar',
      name: 'TEMPLO SOLAR',
      width: 1800,
      height: 1200,
      floorColor: '#2b2416',
      tileAltColor: '#332a19',
      gridColor: 'rgba(255, 214, 102, 0.09)',
      wallColor: '#b45309',
      wallTopColor: '#f59e0b',
      decorColor: 'rgba(251, 191, 36, 0.16)',
      pattern: 'solar',
      obstacles: [
        { x: 420, y: 260, w: 90, h: 160, destructible: false },
        { x: 420, y: 780, w: 90, h: 160, destructible: false },
        { x: 1290, y: 260, w: 90, h: 160, destructible: false },
        { x: 1290, y: 780, w: 90, h: 160, destructible: false },
        { x: 840, y: 340, w: 120, h: 70, destructible: true },
        { x: 840, y: 790, w: 120, h: 70, destructible: true },
        { x: 670, y: 540, w: 70, h: 120, destructible: false },
        { x: 1060, y: 540, w: 70, h: 120, destructible: false }
      ],
      spawnsBlue: [
        { x: 180, y: 340 },
        { x: 160, y: 600 },
        { x: 180, y: 860 }
      ],
      spawnsRed: [
        { x: 1620, y: 340 },
        { x: 1640, y: 600 },
        { x: 1620, y: 860 }
      ],
      spawnsFFA: [
        { x: 200, y: 220 }, { x: 1600, y: 220 },
        { x: 200, y: 980 }, { x: 1600, y: 980 },
        { x: 900, y: 150 }, { x: 900, y: 1050 },
        { x: 220, y: 600 }, { x: 1580, y: 600 }
      ]
    },
    {
      id: 'cyber',
      name: 'LABORATÓRIO NEON',
      width: 1800,
      height: 1200,
      floorColor: '#0c1528',
      tileAltColor: '#111e38',
      gridColor: 'rgba(6, 182, 212, 0.14)',
      wallColor: '#0369a1',
      wallTopColor: '#22d3ee',
      decorColor: 'rgba(34, 211, 238, 0.14)',
      pattern: 'cyber',
      obstacles: [
        { x: 350, y: 480, w: 70, h: 240, destructible: false },
        { x: 1380, y: 480, w: 70, h: 240, destructible: false },
        { x: 620, y: 240, w: 180, h: 65, destructible: false },
        { x: 1000, y: 240, w: 180, h: 65, destructible: false },
        { x: 620, y: 895, w: 180, h: 65, destructible: false },
        { x: 1000, y: 895, w: 180, h: 65, destructible: false },
        { x: 855, y: 555, w: 90, h: 90, destructible: true }
      ],
      spawnsBlue: [
        { x: 170, y: 280 },
        { x: 170, y: 600 },
        { x: 170, y: 920 }
      ],
      spawnsRed: [
        { x: 1630, y: 280 },
        { x: 1630, y: 600 },
        { x: 1630, y: 920 }
      ],
      spawnsFFA: [
        { x: 180, y: 180 }, { x: 1620, y: 180 },
        { x: 180, y: 1020 }, { x: 1620, y: 1020 },
        { x: 900, y: 140 }, { x: 900, y: 1060 },
        { x: 480, y: 600 }, { x: 1320, y: 600 }
      ]
    },
    {
      id: 'canyon',
      name: 'CÂNION VULCÂNICO',
      width: 1800,
      height: 1200,
      floorColor: '#241212',
      tileAltColor: '#2e1616',
      gridColor: 'rgba(249, 115, 22, 0.11)',
      wallColor: '#991b1b',
      wallTopColor: '#fb7185',
      decorColor: 'rgba(251, 113, 133, 0.14)',
      pattern: 'canyon',
      obstacles: [
        { x: 480, y: 220, w: 130, h: 110, destructible: false },
        { x: 1190, y: 220, w: 130, h: 110, destructible: false },
        { x: 480, y: 870, w: 130, h: 110, destructible: false },
        { x: 1190, y: 870, w: 130, h: 110, destructible: false },
        { x: 740, y: 450, w: 90, h: 90, destructible: true },
        { x: 970, y: 660, w: 90, h: 90, destructible: true },
        { x: 320, y: 550, w: 80, h: 100, destructible: false },
        { x: 1400, y: 550, w: 80, h: 100, destructible: false }
      ],
      spawnsBlue: [
        { x: 160, y: 320 },
        { x: 150, y: 600 },
        { x: 160, y: 880 }
      ],
      spawnsRed: [
        { x: 1640, y: 320 },
        { x: 1650, y: 600 },
        { x: 1640, y: 880 }
      ],
      spawnsFFA: [
        { x: 190, y: 200 }, { x: 1610, y: 200 },
        { x: 190, y: 1000 }, { x: 1610, y: 1000 },
        { x: 900, y: 160 }, { x: 900, y: 1040 },
        { x: 520, y: 600 }, { x: 1280, y: 600 }
      ]
    }
  ];

  /* =========================================================================
     2. ARQUITETURA DE REDE PREPARADA PARA FUTURO MULTIPLAYER ONLINE
     ========================================================================= */
  class NetworkAdapter {
    constructor() {
      this.mode = 'offline_bots';
      this.socket = null;
      this.roomId = null;
    }
    sendInput(inputPacket) {
      if (this.mode === 'websocket' && this.socket && this.socket.readyState === 1) {
        this.socket.send(JSON.stringify({ roomId: this.roomId, ...inputPacket }));
      }
    }
    syncMatchState(snapshot) {
      if (this.mode === 'websocket' && this.socket && this.socket.readyState === 1) {
        this.socket.send(JSON.stringify({ type: 'snapshot', ...snapshot }));
      }
    }
  }
  const netAdapter = new NetworkAdapter();

  /* =========================================================================
     3. SINTETIZADOR DE ÁUDIO (WEBAUDIO API SEM DEPENDÊNCIAS EXTERNAS)
     ========================================================================= */
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }
    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }
    play(type) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'shoot') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'dash') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.16);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'explosion') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(38, now + 0.25);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'super') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.28);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'gear') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(900, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'gem') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(740, now);
        osc.frequency.exponentialRampToValueAtTime(1240, now + 0.14);
        gain.gain.setValueAtTime(0.13, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === 'kick') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.11);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
        osc.start(now);
        osc.stop(now + 0.11);
      } else if (type === 'goal') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(392, now);
        osc.frequency.setValueAtTime(523, now + 0.12);
        osc.frequency.setValueAtTime(784, now + 0.24);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    }
  }
  const sfx = new SoundEngine();

  /* =========================================================================
     4. ESTADO GLOBAL DO JOGADOR & ARMAZENAMENTO LOCAL (LOCALSTORAGE)
     ========================================================================= */
  const DEFAULT_HUD_LAYOUT = {
    joystick: { xPct: 14, yPct: 74, scale: 1.0 },
    attack:   { xPct: 86, yPct: 75, scale: 1.0 },
    super:    { xPct: 73, yPct: 62, scale: 1.0 },
    gear0:    { xPct: 73, yPct: 84, scale: 1.0 },
    gear1:    { xPct: 87, yPct: 52, scale: 1.0 }
  };

  const STORAGE_KEY = 'arena_clash_save_v1';

  function loadSavedState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const validMode = MODE_META[parsed.selectedMode] ? parsed.selectedMode : '3v3';
        return {
          selectedHeroId: parsed.selectedHeroId || 'ana',
          selectedMode: validMode,
          touchMode: parsed.touchMode || 'auto',
          soundEnabled: parsed.soundEnabled !== undefined ? parsed.soundEnabled : true,
          heroGears: parsed.heroGears || createDefaultHeroGears(),
          hudLayout: Object.assign({}, DEFAULT_HUD_LAYOUT, parsed.hudLayout || {})
        };
      }
    } catch (e) {}
    return {
      selectedHeroId: 'ana',
      selectedMode: '3v3',
      touchMode: 'auto',
      soundEnabled: true,
      heroGears: createDefaultHeroGears(),
      hudLayout: JSON.parse(JSON.stringify(DEFAULT_HUD_LAYOUT))
    };
  }

  function createDefaultHeroGears() {
    const map = {};
    HEROES.forEach(h => {
      map[h.id] = [
        { gearId: 'speed', rarity: 'rare' },
        { gearId: 'strength', rarity: 'common' }
      ];
    });
    return map;
  }

  const appState = loadSavedState();
  sfx.enabled = appState.soundEnabled;

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {}
  }

  /* =========================================================================
     5. NAVEGAÇÃO DE TELAS, ORIENTAÇÃO E TELA CHEIA
     ========================================================================= */
  const screens = document.querySelectorAll('.screen');

  function showScreen(id) {
    screens.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
    if (id === 'screen-menu') updateMenuUI();
    if (id === 'screen-hud-editor') renderHudEditorPositions();
    if (id === 'screen-battle') applyBattleHudLayout();
  }

  document.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', () => showScreen(btn.dataset.back));
  });

  function requestFullAndLandscape() {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      requestFullAndLandscape();
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  }

  document.getElementById('btn-fullscreen-menu').addEventListener('click', toggleFullscreen);
  document.getElementById('btn-fullscreen-settings').addEventListener('click', toggleFullscreen);
  document.getElementById('btn-battle-fs').addEventListener('click', toggleFullscreen);
  document.getElementById('btn-force-landscape').addEventListener('click', () => {
    requestFullAndLandscape();
    checkOrientation();
  });

  function checkOrientation() {
    const isMobileLike = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const isPortrait = window.innerHeight > window.innerWidth;
    const warning = document.getElementById('portrait-warning');
    if (isMobileLike && isPortrait) {
      warning.classList.remove('hidden');
    } else {
      warning.classList.add('hidden');
    }
  }

  window.addEventListener('resize', () => {
    checkOrientation();
    resizeGameCanvas();
  });
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      checkOrientation();
      resizeGameCanvas();
    }, 150);
  });
  checkOrientation();

  /* =========================================================================
     6. INTERFACE DO MENU, SELEÇÃO DE PERSONAGENS, ENGRENAGENS E MODOS
     ========================================================================= */
  let previewHeroId = appState.selectedHeroId;
  let activeGearSlotIdx = 0;

  function getHeroById(id) {
    return HEROES.find(h => h.id === id) || HEROES[0];
  }

  function updateMenuUI() {
    const hero = getHeroById(appState.selectedHeroId);
    document.getElementById('menu-avatar').textContent = hero.name[0];
    document.getElementById('menu-avatar').style.background = hero.color;
    document.getElementById('menu-hero-role').textContent = hero.role;
    document.getElementById('menu-hero-name').textContent = hero.name.toUpperCase();
    document.getElementById('card-hero-val').textContent = hero.name.toUpperCase();

    const equipped = appState.heroGears[hero.id];
    const g0 = GEARS_CATALOG[equipped[0].gearId].shortName;
    const g1 = GEARS_CATALOG[equipped[1].gearId].shortName;
    document.getElementById('card-gears-val').textContent = `${g0} • ${g1}`;

    const modeInfo = MODE_META[appState.selectedMode] || MODE_META['3v3'];
    document.getElementById('card-mode-val').textContent = modeInfo.label;
  }

  const showcaseCanvas = document.getElementById('showcase-canvas');
  const sCtx = showcaseCanvas.getContext('2d');
  let showcaseTime = 0;

  function animateShowcase() {
    if (document.getElementById('screen-menu').classList.contains('active')) {
      showcaseTime += 0.04;
      sCtx.clearRect(0, 0, showcaseCanvas.width, showcaseCanvas.height);
      const hero = getHeroById(appState.selectedHeroId);
      // Sombra no chão do showcase
      sCtx.fillStyle = 'rgba(0,0,0,0.35)';
      sCtx.beginPath();
      sCtx.ellipse(130, 184, 48, 12, 0, 0, Math.PI * 2);
      sCtx.fill();
      drawCharacterModel(sCtx, 130, 135 + Math.sin(showcaseTime * 2) * 5, 46, hero, showcaseTime, false, 0, 0);
    }
    requestAnimationFrame(animateShowcase);
  }
  requestAnimationFrame(animateShowcase);

  // Tela de Seleção de Personagens
  document.getElementById('btn-open-heroes').addEventListener('click', () => {
    previewHeroId = appState.selectedHeroId;
    renderHeroGrid();
    renderHeroDetails(previewHeroId);
    showScreen('screen-heroes');
  });

  function renderHeroGrid() {
    const grid = document.getElementById('hero-grid');
    grid.innerHTML = '';
    HEROES.forEach(hero => {
      const card = document.createElement('div');
      card.className = 'hero-card' + (hero.id === previewHeroId ? ' selected' : '');
      card.innerHTML = `
        <div class="hero-swatch" style="background:${hero.color}; box-shadow: 0 0 12px ${hero.accent}88;">
          ${hero.name[0]}
        </div>
        <strong>${hero.name.toUpperCase()}</strong>
        <small>${hero.archetype}</small>
      `;
      card.addEventListener('click', () => {
        previewHeroId = hero.id;
        renderHeroGrid();
        renderHeroDetails(hero.id);
      });
      grid.appendChild(card);
    });
  }

  function renderHeroDetails(heroId) {
    const h = getHeroById(heroId);
    document.getElementById('det-name').textContent = h.name.toUpperCase();
    document.getElementById('det-archetype').textContent = h.role;
    document.getElementById('det-desc').textContent = h.desc;
    document.getElementById('det-atk').textContent = h.atkText;
    document.getElementById('det-ult').textContent = h.ultText;

    document.getElementById('stat-hp').style.width = h.statsUI.hp + '%';
    document.getElementById('val-hp').textContent = h.hp;
    document.getElementById('stat-dmg').style.width = h.statsUI.dmg + '%';
    document.getElementById('val-dmg').textContent = h.style === 'jose_burst' ? `${h.damage}x6` : h.damage;
    document.getElementById('stat-spd').style.width = h.statsUI.spd + '%';
    document.getElementById('val-spd').textContent = h.speed;
    document.getElementById('stat-rng').style.width = h.statsUI.rng + '%';
    document.getElementById('val-rng').textContent = h.range;
  }

  document.getElementById('btn-confirm-hero').addEventListener('click', () => {
    appState.selectedHeroId = previewHeroId;
    saveState();
    showScreen('screen-menu');
  });

  // Tela de Engrenagens
  document.getElementById('btn-open-gears').addEventListener('click', () => {
    activeGearSlotIdx = 0;
    renderGearsScreen();
    showScreen('screen-gears');
  });

  function renderGearsScreen() {
    const hero = getHeroById(appState.selectedHeroId);
    document.getElementById('gears-hero-title').textContent = hero.name.toUpperCase();
    const equipped = appState.heroGears[hero.id];

    [0, 1].forEach(idx => {
      const slotEl = document.getElementById(`slot-gear-${idx}`);
      slotEl.classList.toggle('active-slot', idx === activeGearSlotIdx);
      const gear = GEARS_CATALOG[equipped[idx].gearId];
      const rar = GEAR_RARITIES[equipped[idx].rarity];
      document.getElementById(`slot-${idx}-name`).textContent = `${gear.icon} ${gear.shortName}`;
      const pill = document.getElementById(`slot-${idx}-rarity`);
      pill.textContent = `${rar.name.toUpperCase()} (${rar.cooldown}s)`;
      pill.style.background = rar.color;
      pill.style.color = rar.id === 'legendary' ? '#111' : '#fff';
    });

    const currentRar = equipped[activeGearSlotIdx].rarity;
    document.querySelectorAll('.rar-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.rarity === currentRar);
    });

    const catalogEl = document.getElementById('gears-catalog');
    catalogEl.innerHTML = '';
    Object.values(GEARS_CATALOG).forEach(gear => {
      const card = document.createElement('div');
      card.className = 'gear-item-card';
      card.innerHTML = `
        <h4>${gear.icon} ${gear.name}</h4>
        <p>${gear.desc}</p>
      `;
      card.addEventListener('click', () => {
        const otherIdx = activeGearSlotIdx === 0 ? 1 : 0;
        if (equipped[otherIdx].gearId === gear.id) {
          equipped[otherIdx].gearId = equipped[activeGearSlotIdx].gearId;
        }
        equipped[activeGearSlotIdx].gearId = gear.id;
        saveState();
        renderGearsScreen();
      });
      catalogEl.appendChild(card);
    });
  }

  document.querySelectorAll('.gear-slot').forEach(el => {
    el.addEventListener('click', () => {
      activeGearSlotIdx = Number(el.dataset.slot);
      renderGearsScreen();
    });
  });

  document.querySelectorAll('.rar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const hero = getHeroById(appState.selectedHeroId);
      appState.heroGears[hero.id][activeGearSlotIdx].rarity = btn.dataset.rarity;
      saveState();
      renderGearsScreen();
    });
  });

  // Tela de Seleção de Modos (6 Modos)
  document.getElementById('btn-open-modes').addEventListener('click', () => {
    document.querySelectorAll('.mode-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.mode === appState.selectedMode);
    });
    showScreen('screen-modes');
  });

  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      appState.selectedMode = card.dataset.mode;
      saveState();
      showScreen('screen-menu');
    });
  });

  // Configurações
  document.getElementById('btn-open-settings').addEventListener('click', () => {
    document.getElementById('select-touch-mode').value = appState.touchMode;
    document.getElementById('chk-sound').checked = appState.soundEnabled;
    showScreen('screen-settings');
  });

  document.getElementById('select-touch-mode').addEventListener('change', (e) => {
    appState.touchMode = e.target.value;
    saveState();
  });

  document.getElementById('chk-sound').addEventListener('change', (e) => {
    appState.soundEnabled = e.target.checked;
    sfx.enabled = appState.soundEnabled;
    saveState();
  });

  /* =========================================================================
     7. SISTEMA DE PERSONALIZAÇÃO DO HUD (ARRASTAR, ESCALAR, SALVAR)
     ========================================================================= */
  let selectedHudCtrl = 'joystick';
  let draggingHudEl = null;

  document.getElementById('btn-open-hud-editor').addEventListener('click', () => {
    selectHudControl('joystick');
    showScreen('screen-hud-editor');
  });

  function renderHudEditorPositions() {
    Object.keys(appState.hudLayout).forEach(key => {
      const el = document.getElementById(`edit-ctrl-${key}`);
      const cfg = appState.hudLayout[key];
      if (!el || !cfg) return;
      el.style.left = cfg.xPct + '%';
      el.style.top = cfg.yPct + '%';
      el.style.transform = `translate(-50%, -50%) scale(${cfg.scale})`;
    });
  }

  function selectHudControl(ctrlKey) {
    selectedHudCtrl = ctrlKey;
    document.querySelectorAll('.hud-draggable').forEach(el => {
      el.classList.toggle('selected-ctrl', el.dataset.ctrl === ctrlKey);
    });
    const scale = appState.hudLayout[ctrlKey].scale;
    document.getElementById('hud-size-slider').value = scale;
    document.getElementById('hud-size-val').textContent = Math.round(scale * 100) + '%';
  }

  document.querySelectorAll('.hud-draggable').forEach(el => {
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      selectHudControl(el.dataset.ctrl);
      draggingHudEl = el;
      el.setPointerCapture(e.pointerId);
    });

    el.addEventListener('pointermove', (e) => {
      if (draggingHudEl !== el) return;
      const xPct = Math.max(5, Math.min(95, (e.clientX / window.innerWidth) * 100));
      const yPct = Math.max(14, Math.min(94, (e.clientY / window.innerHeight) * 100));
      const key = el.dataset.ctrl;
      appState.hudLayout[key].xPct = Number(xPct.toFixed(1));
      appState.hudLayout[key].yPct = Number(yPct.toFixed(1));
      renderHudEditorPositions();
    });

    el.addEventListener('pointerup', () => {
      draggingHudEl = null;
      saveState();
    });
  });

  document.getElementById('hud-size-slider').addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    appState.hudLayout[selectedHudCtrl].scale = val;
    document.getElementById('hud-size-val').textContent = Math.round(val * 100) + '%';
    renderHudEditorPositions();
    saveState();
  });

  document.getElementById('btn-hud-reset').addEventListener('click', () => {
    appState.hudLayout = JSON.parse(JSON.stringify(DEFAULT_HUD_LAYOUT));
    saveState();
    renderHudEditorPositions();
    selectHudControl(selectedHudCtrl);
  });

  document.getElementById('btn-hud-back').addEventListener('click', () => {
    saveState();
    showScreen('screen-settings');
  });

  function applyBattleHudLayout() {
    const touchLayer = document.getElementById('touch-controls-layer');
    const pcHint = document.getElementById('pc-controls-hint');
    const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

    if (appState.touchMode === 'hidden') {
      touchLayer.classList.add('hidden');
      pcHint.classList.remove('hidden');
    } else if (appState.touchMode === 'always' || isTouchDevice) {
      touchLayer.classList.remove('hidden');
      pcHint.classList.toggle('hidden', isTouchDevice);
    } else {
      touchLayer.classList.add('hidden');
      pcHint.classList.remove('hidden');
    }

    Object.keys(appState.hudLayout).forEach(key => {
      const el = document.getElementById(`ctrl-${key}`);
      const cfg = appState.hudLayout[key];
      if (!el || !cfg) return;
      el.style.left = cfg.xPct + '%';
      el.style.top = cfg.yPct + '%';
      el.style.transform = `translate(-50%, -50%) scale(${cfg.scale})`;
    });
  }

  /* =========================================================================
     8. SISTEMA DE SELEÇÃO ALEATÓRIA DE MAPAS (1/3 DE PROBABILIDADE REAL)
     ========================================================================= */
  function pickUniformRandomMapIndex() {
    if (window.crypto && window.crypto.getRandomValues) {
      const arr = new Uint32Array(1);
      window.crypto.getRandomValues(arr);
      return arr[0] % MAPS.length;
    }
    return Math.floor(Math.random() * MAPS.length);
  }

  document.getElementById('btn-play').addEventListener('click', () => {
    sfx.init();
    startMapRoulette();
  });

  function startMapRoulette() {
    showScreen('screen-map-roulette');
    const chosenIndex = pickUniformRandomMapIndex();
    const cards = document.querySelectorAll('.r-card');
    const statusEl = document.getElementById('roulette-status');
    cards.forEach(c => c.classList.remove('highlight', 'winner'));
    statusEl.textContent = 'SORTEANDO ARENA...';

    let step = 0;
    const totalSteps = 12 + chosenIndex;
    const interval = setInterval(() => {
      cards.forEach(c => c.classList.remove('highlight'));
      const currentIdx = step % MAPS.length;
      cards[currentIdx].classList.add('highlight');
      sfx.play('shoot');

      if (step >= totalSteps) {
        clearInterval(interval);
        cards.forEach(c => c.classList.remove('highlight'));
        cards[chosenIndex].classList.add('winner');
        statusEl.textContent = `ARENA SELECIONADA: ${MAPS[chosenIndex].name}!`;
        sfx.play('super');
        setTimeout(() => {
          startBattleMatch(MAPS[chosenIndex]);
        }, 1050);
      }
      step++;
    }, 105);
  }

  /* =========================================================================
     9. MOTOR DE COMBATE, MODOS (3V3, SOBREVIVÊNCIA, FFA, ZONA, FUTBRAWL, GEMAS)
     ========================================================================= */
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  function resizeGameCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeGameCanvas();

  let match = null;
  let animFrameId = null;
  let lastTimestamp = 0;

  const inputState = {
    moveX: 0,
    moveY: 0,
    keys: {},
    isAiming: false,
    aimAngle: 0,
    aimPower: 1,
    mouseScreenX: 0,
    mouseScreenY: 0,
    joyPointerId: null,
    atkPointerId: null
  };

  function startBattleMatch(mapTemplate) {
    const mode = appState.selectedMode;

    // Clona obstáculos; no Futbrawl, libera a região central e das áreas de gol para fluidez da bola
    const clonedObstacles = mapTemplate.obstacles.map(o => ({ ...o, alive: true }));
    if (mode === 'brawlball') {
      clonedObstacles.forEach(obs => {
        const cx = obs.x + obs.w / 2;
        const cy = obs.y + obs.h / 2;
        if (Math.hypot(cx - mapTemplate.width / 2, cy - mapTemplate.height / 2) < 230 || cx < 240 || cx > mapTemplate.width - 240) {
          obs.alive = false;
        }
      });
    }

    const mapInstance = {
      ...mapTemplate,
      obstacles: clonedObstacles
    };

    const playerHero = getHeroById(appState.selectedHeroId);
    const entities = [];
    const teamModes = ['3v3', 'zone', 'brawlball', 'gemgrab'];

    if (teamModes.includes(mode)) {
      const blueHeroes = [playerHero, ...pickRandomBots(2, [playerHero.id])];
      const redHeroes = pickRandomBots(3, []);
      blueHeroes.forEach((h, i) => {
        entities.push(createFighter(h, i === 0, 'blue', mapInstance.spawnsBlue[i], i === 0 ? 'VOCÊ' : `${h.name} (Bot)`));
      });
      redHeroes.forEach((h, i) => {
        entities.push(createFighter(h, false, 'red', mapInstance.spawnsRed[i], `${h.name} (Bot)`));
      });
    } else if (mode === 'survival') {
      const roster = [playerHero, ...pickRandomBots(7, [])];
      roster.forEach((h, i) => {
        entities.push(createFighter(h, i === 0, `solo_${i}`, mapInstance.spawnsFFA[i], i === 0 ? 'VOCÊ' : `${h.name} (Bot)`));
      });
    } else {
      // Batalha Livre ('ffa')
      const roster = [playerHero, ...pickRandomBots(5, [])];
      roster.forEach((h, i) => {
        entities.push(createFighter(h, i === 0, `solo_${i}`, mapInstance.spawnsFFA[i], i === 0 ? 'VOCÊ' : `${h.name} (Bot)`));
      });
    }

    // Estado específico dos novos modos
    const zoneState = {
      x: mapInstance.width / 2,
      y: mapInstance.height / 2,
      radius: 195,
      captureProgress: 0, // -100 (totalmente Vermelho) a +100 (totalmente Azul)
      controller: null, // 'blue' | 'red' | null
      pointsBlue: 0,
      pointsRed: 0,
      tickAccum: 0
    };

    const ballState = {
      x: mapInstance.width / 2,
      y: mapInstance.height / 2,
      vx: 0,
      vy: 0,
      radius: 20,
      lastTouchTeam: null,
      goalBannerTimer: 0,
      goalText: ''
    };

    const gemState = {
      gems: [], // { id, x, y, vx, vy, bobPhase, collectCooldown }
      spawnTimer: 1.5,
      gemsBlue: 0,
      gemsRed: 0,
      countdownTeam: null, // 'blue' | 'red' | null
      countdownTimer: 10.0
    };

    // Nasce 2 gemas iniciais no centro para ação imediata
    if (mode === 'gemgrab') {
      spawnGemAt(mapInstance.width / 2 - 35, mapInstance.height / 2, gemState);
      spawnGemAt(mapInstance.width / 2 + 35, mapInstance.height / 2, gemState);
    }

    const durationByMode = {
      '3v3': 120,
      'survival': 150,
      'ffa': 120,
      'zone': 150,
      'brawlball': 150,
      'gemgrab': 150
    };

    match = {
      active: true,
      mode,
      map: mapInstance,
      entities,
      projectiles: [],
      delayedBombs: [],
      hazardZones: [],
      particles: [],
      floatingTexts: [],
      shockwaves: [],
      scoreBlue: 0,
      scoreRed: 0,
      timeLeft: durationByMode[mode] || 120,
      zoneRadius: 1100,
      zoneState,
      ballState,
      gemState,
      camera: { x: entities[0].x, y: entities[0].y },
      celebrationTimer: 0
    };

    const pGears = appState.heroGears[playerHero.id];
    document.getElementById('gear0-icon').textContent = GEARS_CATALOG[pGears[0].gearId].icon;
    document.getElementById('gear1-icon').textContent = GEARS_CATALOG[pGears[1].gearId].icon;
    document.getElementById('hud-map-title').textContent = `${mapInstance.name} • ${MODE_META[mode].label}`;
    document.getElementById('kill-feed').innerHTML = '';
    document.getElementById('respawn-banner').classList.add('hidden');
    document.getElementById('mode-alert-banner').classList.add('hidden');

    resetInputs();
    showScreen('screen-battle');
    resizeGameCanvas();

    lastTimestamp = performance.now();
    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(gameLoop);
  }

  function pickRandomBots(count, excludeIds) {
    const pool = HEROES.filter(h => !excludeIds.includes(h.id));
    const result = [];
    for (let i = 0; i < count; i++) {
      const h = pool[Math.floor(Math.random() * pool.length)];
      result.push(h);
    }
    return result;
  }

  function createFighter(hero, isPlayer, team, spawnPos, label) {
    const equipped = isPlayer
      ? appState.heroGears[hero.id]
      : [
          { gearId: 'speed', rarity: 'common' },
          { gearId: 'strength', rarity: 'common' }
        ];

    return {
      id: Math.random().toString(36).slice(2, 9),
      hero,
      isPlayer,
      team,
      label,
      x: spawnPos.x,
      y: spawnPos.y,
      spawnX: spawnPos.x,
      spawnY: spawnPos.y,
      radius: 24,
      facing: team === 'red' ? Math.PI : 0,
      hp: hero.hp,
      maxHp: hero.hp,
      alive: true,
      respawnTimer: 0,
      ammo: hero.maxAmmo,
      maxAmmo: hero.maxAmmo,
      reloadProgress: 0,
      superCharge: 0,
      kills: 0,
      deaths: 0,
      damageDealt: 0,
      gemsCarried: 0,
      slowTimer: 0,
      hitFlashTimer: 0,
      dashState: null,
      burstQueue: [],
      gears: equipped.map(g => ({
        gearId: g.gearId,
        rarity: g.rarity,
        activeTime: 0,
        cooldownTime: 0
      })),
      ai: {
        thinkTimer: 0,
        moveAngle: Math.random() * Math.PI * 2,
        strafeDir: Math.random() < 0.5 ? 1 : -1,
        stuckTimer: 0,
        lastX: spawnPos.x,
        lastY: spawnPos.y
      },
      animPhase: Math.random() * 6,
      moveIntensity: 0
    };
  }

  function resetInputs() {
    inputState.moveX = 0;
    inputState.moveY = 0;
    inputState.keys = {};
    inputState.isAiming = false;
    inputState.joyPointerId = null;
    inputState.atkPointerId = null;
    const knob = document.getElementById('joystick-knob');
    if (knob) knob.style.transform = 'translate(0px, 0px)';
  }

  /* =========================================================================
     10. CONTROLES DE TOQUE (SEGURAR PARA MIRAR, SOLTAR PARA ATACAR) E PC
     ========================================================================= */
  const joyEl = document.getElementById('ctrl-joystick');
  const joyKnob = document.getElementById('joystick-knob');
  const atkEl = document.getElementById('ctrl-attack');
  const supEl = document.getElementById('ctrl-super');
  const gear0El = document.getElementById('ctrl-gear0');
  const gear1El = document.getElementById('ctrl-gear1');

  joyEl.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    inputState.joyPointerId = e.pointerId;
    joyEl.setPointerCapture(e.pointerId);
    updateJoystickFromEvent(e);
  });

  joyEl.addEventListener('pointermove', (e) => {
    if (e.pointerId !== inputState.joyPointerId) return;
    updateJoystickFromEvent(e);
  });

  function releaseJoystick(e) {
    if (e.pointerId !== inputState.joyPointerId) return;
    inputState.joyPointerId = null;
    inputState.moveX = 0;
    inputState.moveY = 0;
    joyKnob.style.transform = 'translate(0px, 0px)';
  }
  joyEl.addEventListener('pointerup', releaseJoystick);
  joyEl.addEventListener('pointercancel', releaseJoystick);

  function updateJoystickFromEvent(e) {
    const rect = joyEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxR = rect.width * 0.38;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > maxR) {
      dx = (dx / dist) * maxR;
      dy = (dy / dist) * maxR;
    }
    joyKnob.style.transform = `translate(${dx}px, ${dy}px)`;
    inputState.moveX = dx / maxR;
    inputState.moveY = dy / maxR;
  }

  atkEl.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (!match || !match.active) return;
    const player = getPlayerFighter();
    if (!player || !player.alive) return;

    inputState.atkPointerId = e.pointerId;
    inputState.isAiming = true;
    atkEl.setPointerCapture(e.pointerId);

    const nearest = findNearestEnemy(player, player.hero.range * 1.3);
    inputState.aimAngle = nearest ? Math.atan2(nearest.y - player.y, nearest.x - player.x) : player.facing;
    inputState.aimPower = 0.85;
  });

  atkEl.addEventListener('pointermove', (e) => {
    if (e.pointerId !== inputState.atkPointerId || !inputState.isAiming) return;
    const rect = atkEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > 8) {
      inputState.aimAngle = Math.atan2(dy, dx);
      inputState.aimPower = Math.max(0.25, Math.min(1, dist / (rect.width * 0.75)));
    }
  });

  function releaseTouchAttack(e) {
    if (e.pointerId !== inputState.atkPointerId) return;
    inputState.atkPointerId = null;
    if (inputState.isAiming) {
      inputState.isAiming = false;
      const player = getPlayerFighter();
      if (player && player.alive) {
        triggerBasicAttack(player, inputState.aimAngle, inputState.aimPower);
      }
    }
  }
  atkEl.addEventListener('pointerup', releaseTouchAttack);
  atkEl.addEventListener('pointercancel', releaseTouchAttack);

  supEl.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const player = getPlayerFighter();
    if (player && player.alive) {
      triggerSuperAbility(player, inputState.isAiming ? inputState.aimAngle : player.facing);
    }
  });

  gear0El.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const player = getPlayerFighter();
    if (player && player.alive) activateGear(player, 0);
  });

  gear1El.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const player = getPlayerFighter();
    if (player && player.alive) activateGear(player, 1);
  });

  window.addEventListener('keydown', (e) => {
    const code = e.code;
    inputState.keys[code] = true;
    if (!match || !match.active) return;
    const player = getPlayerFighter();
    if (!player || !player.alive) return;

    if (code === 'Space') {
      e.preventDefault();
      triggerSuperAbility(player, inputState.aimAngle);
    } else if (code === 'Digit1' || code === 'KeyQ') {
      activateGear(player, 0);
    } else if (code === 'Digit2' || code === 'KeyE') {
      activateGear(player, 1);
    }
  });

  window.addEventListener('keyup', (e) => {
    inputState.keys[e.code] = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    inputState.mouseScreenX = e.clientX;
    inputState.mouseScreenY = e.clientY;
    updateMouseAimAngle();
  });

  canvas.addEventListener('mousedown', (e) => {
    if (!match || !match.active) return;
    const player = getPlayerFighter();
    if (!player || !player.alive) return;

    inputState.mouseScreenX = e.clientX;
    inputState.mouseScreenY = e.clientY;
    updateMouseAimAngle();

    if (e.button === 0) {
      inputState.isAiming = true;
    } else if (e.button === 2) {
      triggerSuperAbility(player, inputState.aimAngle);
    }
  });

  window.addEventListener('mouseup', (e) => {
    if (e.button === 0 && inputState.isAiming) {
      inputState.isAiming = false;
      const player = getPlayerFighter();
      if (player && player.alive) {
        triggerBasicAttack(player, inputState.aimAngle, inputState.aimPower);
      }
    }
  });

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  function updateMouseAimAngle() {
    if (!match || !match.active) return;
    const player = getPlayerFighter();
    if (!player) return;
    const worldX = inputState.mouseScreenX - canvas.width / 2 + match.camera.x;
    const worldY = inputState.mouseScreenY - canvas.height / 2 + match.camera.y;
    const dx = worldX - player.x;
    const dy = worldY - player.y;
    inputState.aimAngle = Math.atan2(dy, dx);
    const dist = Math.hypot(dx, dy);
    inputState.aimPower = Math.max(0.25, Math.min(1, dist / player.hero.range));
  }

  document.getElementById('btn-quit-match').addEventListener('click', () => {
    if (match) match.active = false;
    showScreen('screen-menu');
  });

  /* =========================================================================
     11. MECÂNICAS DE ENGRENAGENS, ATAQUES, CHUTE NO FUTBRAWL E ESPECIAIS
     ========================================================================= */
  function getPlayerFighter() {
    return match ? match.entities.find(e => e.isPlayer) : null;
  }

  function getGearBonus(fighter, gearType) {
    let totalBonus = 0;
    fighter.gears.forEach(slot => {
      if (slot.gearId === gearType && slot.activeTime > 0) {
        const cat = GEARS_CATALOG[gearType];
        const rar = GEAR_RARITIES[slot.rarity];
        totalBonus += cat.baseBonus * rar.mult;
      }
    });
    return totalBonus;
  }

  function activateGear(fighter, slotIdx) {
    const slot = fighter.gears[slotIdx];
    if (!slot || slot.activeTime > 0 || slot.cooldownTime > 0) return;

    const rar = GEAR_RARITIES[slot.rarity];
    slot.activeTime = rar.duration;
    if (fighter.isPlayer) sfx.play('gear');

    const cat = GEARS_CATALOG[slot.gearId];
    spawnFloatingText(fighter.x, fighter.y - 38, `${cat.icon} ${cat.shortName}!`, '#38bdf8');
  }

  function tryKickBallWithAttack(fighter, angle, power = 1) {
    if (!match || match.mode !== 'brawlball') return false;
    const ball = match.ballState;
    const dist = Math.hypot(ball.x - fighter.x, ball.y - fighter.y);
    if (dist <= fighter.radius + ball.radius + 48) {
      const kickSpeed = 540 + 440 * power;
      ball.vx = Math.cos(angle) * kickSpeed;
      ball.vy = Math.sin(angle) * kickSpeed;
      ball.lastTouchTeam = fighter.team;
      sfx.play('kick');
      spawnExplosionParticles(ball.x, ball.y, '#ffffff', 10);
      spawnFloatingText(ball.x, ball.y - 24, '⚽ CHUTE!', '#ffd166');
      return true;
    }
    return false;
  }

  function triggerBasicAttack(fighter, angle, power = 1) {
    if (fighter.ammo < 1 || fighter.dashState) return;
    fighter.ammo -= 1;
    fighter.facing = angle;

    // No Futbrawl, se o lutador estiver perto da bola ao atacar, chuta a bola com força
    tryKickBallWithAttack(fighter, angle, power);

    const dmgMult = 1 + getGearBonus(fighter, 'strength');
    const precBonus = getGearBonus(fighter, 'precision');
    const speedMult = 1 + precBonus * 0.7;
    const spreadMult = Math.max(0.2, 1 - precBonus * 0.8);
    const h = fighter.hero;

    if (h.style === 'ana_dash') {
      if (fighter.isPlayer) sfx.play('dash');
      const dashDist = h.range * (0.7 + 0.3 * power);
      const dashDuration = 0.18;
      fighter.dashState = {
        vx: Math.cos(angle) * (dashDist / dashDuration),
        vy: Math.sin(angle) * (dashDist / dashDuration),
        timeLeft: dashDuration,
        damage: Math.round(h.damage * dmgMult),
        hitSet: new Set(),
        trailFire: false
      };
    } else if (h.style === 'jose_burst') {
      for (let i = 0; i < 6; i++) {
        fighter.burstQueue.push({
          delay: i * 0.055,
          angle: angle + (Math.random() - 0.5) * 0.04 * spreadMult,
          speed: 780 * speedMult,
          range: h.range * (1 + precBonus * 0.25),
          damage: Math.round(h.damage * dmgMult),
          radius: 7,
          color: '#38bdf8'
        });
      }
    } else if (h.style === 'gustavo_random') {
      if (fighter.isPlayer) sfx.play('shoot');
      const variant = Math.floor(Math.random() * 3);
      if (variant === 0) {
        spawnProjectile(fighter, angle, 640 * speedMult, h.range, Math.round(h.damage * 1.35 * dmgMult), 13, '#ff5400', 'fire');
        if (fighter.isPlayer) spawnFloatingText(fighter.x, fighter.y - 30, '🔥 FOGO!', '#ff5400');
      } else if (variant === 1) {
        [-0.18 * spreadMult, 0, 0.18 * spreadMult].forEach(off => {
          spawnProjectile(fighter, angle + off, 620 * speedMult, h.range * 0.92, Math.round(h.damage * 0.58 * dmgMult), 9, '#fcbf49', 'normal');
        });
        if (fighter.isPlayer) spawnFloatingText(fighter.x, fighter.y - 30, '✨ TRIPLO!', '#fcbf49');
      } else {
        spawnProjectile(fighter, angle, 600 * speedMult, h.range, Math.round(h.damage * 0.95 * dmgMult), 12, '#00f5d4', 'frost');
        if (fighter.isPlayer) spawnFloatingText(fighter.x, fighter.y - 30, '❄️ GELO!', '#00f5d4');
      }
    } else if (h.style === 'jorge_split') {
      if (fighter.isPlayer) sfx.play('shoot');
      spawnProjectile(fighter, angle, 560 * speedMult, h.range, Math.round(h.damage * dmgMult), 13, '#06d6a0', 'spike_main');
    } else if (h.style === 'davi_sniper') {
      if (fighter.isPlayer) sfx.play('shoot');
      spawnProjectile(fighter, angle, 960 * speedMult, h.range * (1 + precBonus * 0.2), Math.round(h.damage * dmgMult), 8, '#00b4d8', 'sniper');
    } else if (h.style === 'gabriela_lob') {
      if (fighter.isPlayer) sfx.play('shoot');
      const targetDist = Math.max(90, h.range * power);
      const tx = Math.max(40, Math.min(match.map.width - 40, fighter.x + Math.cos(angle) * targetDist));
      const ty = Math.max(40, Math.min(match.map.height - 40, fighter.y + Math.sin(angle) * targetDist));
      match.delayedBombs.push({
        owner: fighter,
        startX: fighter.x,
        startY: fighter.y,
        x: tx,
        y: ty,
        timer: 0.75,
        maxTimer: 0.75,
        blastRadius: 105,
        damage: Math.round(h.damage * dmgMult),
        color: '#ef476f'
      });
    } else if (h.style === 'iarly_turbo') {
      for (let i = 0; i < 2; i++) {
        fighter.burstQueue.push({
          delay: i * 0.08,
          angle: angle + (i === 0 ? -0.04 : 0.04) * spreadMult,
          speed: 740 * speedMult,
          range: h.range,
          damage: Math.round(h.damage * dmgMult),
          radius: 9,
          color: '#ff5400',
          isTurboShot: true
        });
      }
    }
  }

  function triggerSuperAbility(fighter, angle) {
    if (fighter.superCharge < 100) return;
    fighter.superCharge = 0;
    fighter.facing = angle;
    const dmgMult = 1 + getGearBonus(fighter, 'strength');
    const h = fighter.hero;
    if (fighter.isPlayer) sfx.play('super');

    match.shockwaves.push({
      x: fighter.x,
      y: fighter.y,
      radius: 18,
      maxRadius: 120,
      color: h.accent,
      life: 0.35,
      maxLife: 0.35
    });

    if (h.style === 'ana_dash') {
      [-0.25, -0.12, 0, 0.12, 0.25].forEach(off => {
        spawnProjectile(fighter, angle + off, 650, 340, Math.round(520 * dmgMult), 14, '#f15bb5', 'vampire');
      });
    } else if (h.style === 'jose_burst') {
      for (let i = 0; i < 12; i++) {
        fighter.burstQueue.push({
          delay: i * 0.04,
          angle: angle + (Math.random() - 0.5) * 0.05,
          speed: 900,
          range: 640,
          damage: Math.round(380 * dmgMult),
          radius: 9,
          color: '#00f5d4',
          pierceWalls: true
        });
      }
    } else if (h.style === 'gustavo_random') {
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12;
        spawnProjectile(fighter, a, 580, 320, Math.round(680 * dmgMult), 13, '#fcbf49', 'frost');
      }
    } else if (h.style === 'jorge_split') {
      const tx = fighter.x + Math.cos(angle) * 280;
      const ty = fighter.y + Math.sin(angle) * 280;
      match.hazardZones.push({
        owner: fighter,
        x: tx,
        y: ty,
        radius: 135,
        duration: 4.5,
        tickTimer: 0,
        damagePerTick: Math.round(320 * dmgMult),
        color: '#06d6a0'
      });
    } else if (h.style === 'davi_sniper') {
      for (let i = 0; i < 3; i++) {
        const a = (Math.PI * 2 * i) / 3;
        match.delayedBombs.push({
          owner: fighter,
          startX: fighter.x,
          startY: fighter.y,
          x: fighter.x + Math.cos(a) * 45,
          y: fighter.y + Math.sin(a) * 45,
          timer: 0.65,
          maxTimer: 0.65,
          blastRadius: 95,
          damage: Math.round(950 * dmgMult),
          color: '#00b4d8'
        });
      }
      const jumpAngle = angle + Math.PI;
      fighter.dashState = {
        vx: Math.cos(jumpAngle) * 950,
        vy: Math.sin(jumpAngle) * 950,
        timeLeft: 0.22,
        damage: 0,
        hitSet: new Set(),
        trailFire: false
      };
    } else if (h.style === 'gabriela_lob') {
      const tx = fighter.x + Math.cos(angle) * 320;
      const ty = fighter.y + Math.sin(angle) * 320;
      match.delayedBombs.push({
        owner: fighter,
        startX: fighter.x,
        startY: fighter.y,
        x: tx,
        y: ty,
        timer: 0.9,
        maxTimer: 0.9,
        blastRadius: 175,
        damage: Math.round(2100 * dmgMult),
        color: '#ffb703',
        breaksWalls: true
      });
    } else if (h.style === 'iarly_turbo') {
      fighter.dashState = {
        vx: Math.cos(angle) * 1150,
        vy: Math.sin(angle) * 1150,
        timeLeft: 0.22,
        damage: Math.round(450 * dmgMult),
        hitSet: new Set(),
        trailFire: true
      };
    }
  }

  function spawnProjectile(owner, angle, speed, range, damage, radius, color, kind = 'normal', pierceWalls = false) {
    match.projectiles.push({
      owner,
      x: owner.x + Math.cos(angle) * (owner.radius + 8),
      y: owner.y + Math.sin(angle) * (owner.radius + 8),
      startX: owner.x,
      startY: owner.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      maxRange: range,
      traveled: 0,
      damage,
      radius,
      color,
      kind,
      pierceWalls
    });
  }

  /* =========================================================================
     12. LOOP PRINCIPAL, MECÂNICAS DOS NOVOS MODOS E IA TÁTICA DOS BOTS
     ========================================================================= */
  function gameLoop(timestamp) {
    if (!match || !match.active) return;
    const dt = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
    lastTimestamp = timestamp;

    updateMatch(dt);
    renderMatch();

    animFrameId = requestAnimationFrame(gameLoop);
  }

  function updateMatch(dt) {
    match.timeLeft -= dt;
    if (match.timeLeft <= 0) {
      match.timeLeft = 0;
      concludeMatch();
      return;
    }

    if (match.mode === 'survival') {
      match.zoneRadius = Math.max(220, match.zoneRadius - 6.2 * dt);
    } else if (match.mode === 'zone') {
      updateStrategicZone(dt);
    } else if (match.mode === 'brawlball') {
      updateBrawlBall(dt);
    } else if (match.mode === 'gemgrab') {
      updateGemGrab(dt);
    }

    match.entities.forEach(f => {
      f.animPhase += dt * (6 + f.moveIntensity * 7);
      if (f.hitFlashTimer > 0) f.hitFlashTimer -= dt;

      if (!f.alive) {
        if (match.mode !== 'survival') {
          f.respawnTimer -= dt;
          if (f.isPlayer) {
            document.getElementById('respawn-countdown').textContent = Math.max(0, f.respawnTimer).toFixed(1) + 's';
          }
          if (f.respawnTimer <= 0) {
            f.alive = true;
            f.hp = f.maxHp;
            f.ammo = f.maxAmmo;
            f.x = f.spawnX;
            f.y = f.spawnY;
            f.gemsCarried = 0;
            spawnShockwave(f.x, f.y, 70, f.hero.color);
            if (f.isPlayer) document.getElementById('respawn-banner').classList.add('hidden');
          }
        }
        return;
      }

      if (match.mode === 'survival') {
        const distCenter = Math.hypot(f.x - match.map.width / 2, f.y - match.map.height / 2);
        if (distCenter > match.zoneRadius) {
          applyDamage(null, f, 450 * dt, false);
        }
      }

      f.gears.forEach(slot => {
        if (slot.activeTime > 0) {
          slot.activeTime -= dt;
          if (slot.gearId === 'recovery') {
            const rar = GEAR_RARITIES[slot.rarity];
            const healRate = (f.maxHp * GEARS_CATALOG.recovery.baseBonus * rar.mult) / rar.duration;
            f.hp = Math.min(f.maxHp, f.hp + healRate * dt);
          }
          if (slot.activeTime <= 0) {
            slot.activeTime = 0;
            slot.cooldownTime = GEAR_RARITIES[slot.rarity].cooldown;
          }
        } else if (slot.cooldownTime > 0) {
          slot.cooldownTime = Math.max(0, slot.cooldownTime - dt);
        }
      });

      if (f.ammo < f.maxAmmo) {
        const reloadMult = 1 + getGearBonus(f, 'reload');
        f.reloadProgress += (dt * reloadMult) / f.hero.reloadTime;
        if (f.reloadProgress >= 1) {
          f.ammo += 1;
          f.reloadProgress = f.ammo < f.maxAmmo ? f.reloadProgress - 1 : 0;
        }
      }

      for (let i = f.burstQueue.length - 1; i >= 0; i--) {
        const b = f.burstQueue[i];
        b.delay -= dt;
        if (b.delay <= 0) {
          if (f.isPlayer) sfx.play('shoot');
          spawnProjectile(f, b.angle, b.speed, b.range, b.damage, b.radius, b.color, b.isTurboShot ? 'turbo' : 'normal', b.pierceWalls);
          f.burstQueue.splice(i, 1);
        }
      }

      if (f.slowTimer > 0) f.slowTimer -= dt;

      if (f.dashState) {
        f.dashState.timeLeft -= dt;
        f.moveIntensity = 1.4;
        moveEntityWithCollision(f, f.dashState.vx * dt, f.dashState.vy * dt);

        if (f.dashState.trailFire && Math.random() < 0.5) {
          match.hazardZones.push({
            owner: f,
            x: f.x,
            y: f.y,
            radius: 36,
            duration: 2.2,
            tickTimer: 0,
            damagePerTick: 220,
            color: '#ff5400'
          });
        }

        if (f.dashState.damage > 0) {
          match.entities.forEach(target => {
            if (target.alive && isEnemy(f, target) && !f.dashState.hitSet.has(target.id)) {
              if (Math.hypot(target.x - f.x, target.y - f.y) <= f.radius + target.radius + 10) {
                f.dashState.hitSet.add(target.id);
                applyDamage(f, target, f.dashState.damage, true);
              }
            }
          });
        }

        if (f.dashState.timeLeft <= 0) {
          f.dashState = null;
        }
      } else if (f.isPlayer) {
        updatePlayerMovement(f, dt);
      } else {
        updateBotAI(f, dt);
      }
    });

    // Atualiza Projéteis
    for (let i = match.projectiles.length - 1; i >= 0; i--) {
      const p = match.projectiles[i];
      const stepX = p.vx * dt;
      const stepY = p.vy * dt;
      p.x += stepX;
      p.y += stepY;
      p.traveled += Math.hypot(stepX, stepY);

      let removeProj = false;

      if (p.x < 10 || p.x > match.map.width - 10 || p.y < 10 || p.y > match.map.height - 10) {
        removeProj = true;
      }

      if (!removeProj) {
        for (const obs of match.map.obstacles) {
          if (!obs.alive) continue;
          if (circleRectOverlap(p.x, p.y, p.radius, obs)) {
            if (p.pierceWalls && obs.destructible) {
              obs.alive = false;
              spawnExplosionParticles(obs.x + obs.w / 2, obs.y + obs.h / 2, '#38bdf8', 14);
            } else if (!p.pierceWalls) {
              removeProj = true;
            }
            break;
          }
        }
      }

      // No Futbrawl, projéteis também podem empurrar suavemente a bola
      if (!removeProj && match.mode === 'brawlball') {
        const ball = match.ballState;
        if (Math.hypot(ball.x - p.x, ball.y - p.y) <= p.radius + ball.radius) {
          ball.vx += p.vx * 0.35;
          ball.vy += p.vy * 0.35;
          ball.lastTouchTeam = p.owner ? p.owner.team : null;
          removeProj = true;
        }
      }

      if (!removeProj) {
        for (const target of match.entities) {
          if (!target.alive || !isEnemy(p.owner, target)) continue;
          if (Math.hypot(target.x - p.x, target.y - p.y) <= p.radius + target.radius) {
            let finalDmg = p.damage;
            if (p.kind === 'sniper') {
              const ratio = Math.min(1, p.traveled / p.maxRange);
              finalDmg = Math.round(p.damage * (0.35 + 0.65 * ratio));
            }
            applyDamage(p.owner, target, finalDmg, true);

            if (p.kind === 'frost') {
              target.slowTimer = 2.0;
            } else if (p.kind === 'vampire' && p.owner.alive) {
              p.owner.hp = Math.min(p.owner.maxHp, p.owner.hp + finalDmg * 0.6);
            } else if (p.kind === 'turbo') {
              p.owner.superCharge = Math.min(100, p.owner.superCharge + 55);
            }

            removeProj = true;
            break;
          }
        }
      }

      if (!removeProj && p.traveled >= p.maxRange) {
        removeProj = true;
      }

      if (removeProj && p.kind === 'spike_main') {
        sfx.play('explosion');
        spawnExplosionParticles(p.x, p.y, '#06d6a0', 12);
        spawnShockwave(p.x, p.y, 75, '#06d6a0');
        for (let k = 0; k < 6; k++) {
          const splitAngle = (Math.PI * 2 * k) / 6;
          spawnProjectile(p.owner, splitAngle, 640, 210, Math.round(p.damage * 0.48), 6, '#ffd166', 'normal');
        }
      } else if (removeProj) {
        spawnExplosionParticles(p.x, p.y, p.color, 6);
      }

      if (removeProj) {
        match.projectiles.splice(i, 1);
      }
    }

    // Bombas com atraso
    for (let i = match.delayedBombs.length - 1; i >= 0; i--) {
      const b = match.delayedBombs[i];
      b.timer -= dt;
      if (b.timer <= 0) {
        sfx.play('explosion');
        spawnExplosionParticles(b.x, b.y, b.color, 22);
        spawnShockwave(b.x, b.y, b.blastRadius, b.color);
        match.entities.forEach(target => {
          if (target.alive && isEnemy(b.owner, target)) {
            const dist = Math.hypot(target.x - b.x, target.y - b.y);
            if (dist <= b.blastRadius + target.radius) {
              applyDamage(b.owner, target, b.damage, true);
            }
          }
        });
        if (b.breaksWalls) {
          match.map.obstacles.forEach(obs => {
            if (obs.alive && obs.destructible) {
              const cx = obs.x + obs.w / 2;
              const cy = obs.y + obs.h / 2;
              if (Math.hypot(cx - b.x, cy - b.y) <= b.blastRadius + 50) {
                obs.alive = false;
              }
            }
          });
        }
        match.delayedBombs.splice(i, 1);
      }
    }

    // Zonas de perigo
    for (let i = match.hazardZones.length - 1; i >= 0; i--) {
      const z = match.hazardZones[i];
      z.duration -= dt;
      z.tickTimer += dt;
      if (z.tickTimer >= 0.5) {
        z.tickTimer = 0;
        match.entities.forEach(target => {
          if (target.alive && isEnemy(z.owner, target)) {
            if (Math.hypot(target.x - z.x, target.y - z.y) <= z.radius + target.radius) {
              applyDamage(z.owner, target, z.damagePerTick, true);
              target.slowTimer = 0.6;
            }
          }
        });
      }
      if (z.duration <= 0) {
        match.hazardZones.splice(i, 1);
      }
    }

    // Ondas de choque visuais
    for (let i = match.shockwaves.length - 1; i >= 0; i--) {
      const sw = match.shockwaves[i];
      sw.life -= dt;
      const t = 1 - Math.max(0, sw.life / sw.maxLife);
      sw.radius = 18 + (sw.maxRadius - 18) * t;
      if (sw.life <= 0) match.shockwaves.splice(i, 1);
    }

    // Partículas e Textos Flutuantes
    for (let i = match.particles.length - 1; i >= 0; i--) {
      const pt = match.particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.life -= dt;
      if (pt.life <= 0) match.particles.splice(i, 1);
    }

    for (let i = match.floatingTexts.length - 1; i >= 0; i--) {
      const ft = match.floatingTexts[i];
      ft.y -= 36 * dt;
      ft.life -= dt;
      if (ft.life <= 0) match.floatingTexts.splice(i, 1);
    }

    const player = getPlayerFighter();
    if (player) {
      match.camera.x += (player.x - match.camera.x) * 8 * dt;
      match.camera.y += (player.y - match.camera.y) * 8 * dt;
    }

    updateBattleHUD();
    checkWinConditions();
  }

  /* --- MODO 1: ZONA ESTRATÉGICA --- */
  function updateStrategicZone(dt) {
    const z = match.zoneState;
    let blueInside = 0;
    let redInside = 0;

    match.entities.forEach(f => {
      if (!f.alive) return;
      if (Math.hypot(f.x - z.x, f.y - z.y) <= z.radius + f.radius * 0.5) {
        if (f.team === 'blue') blueInside++;
        else if (f.team === 'red') redInside++;
      }
    });

    if (blueInside > redInside) {
      z.captureProgress = Math.min(100, z.captureProgress + (blueInside - redInside) * 32 * dt);
      if (Math.random() < 0.25) {
        match.particles.push({
          x: z.x + (Math.random() - 0.5) * z.radius * 1.4,
          y: z.y + (Math.random() - 0.5) * z.radius * 1.4,
          vx: 0, vy: -35, radius: 4, color: '#60a5fa', life: 0.5
        });
      }
    } else if (redInside > blueInside) {
      z.captureProgress = Math.max(-100, z.captureProgress - (redInside - blueInside) * 32 * dt);
      if (Math.random() < 0.25) {
        match.particles.push({
          x: z.x + (Math.random() - 0.5) * z.radius * 1.4,
          y: z.y + (Math.random() - 0.5) * z.radius * 1.4,
          vx: 0, vy: -35, radius: 4, color: '#f87171', life: 0.5
        });
      }
    }

    if (z.captureProgress >= 60) z.controller = 'blue';
    else if (z.captureProgress <= -60) z.controller = 'red';
    else if (Math.abs(z.captureProgress) < 15) z.controller = null;

    z.tickAccum += dt;
    if (z.tickAccum >= 0.5) {
      z.tickAccum -= 0.5;
      if (z.controller === 'blue') z.pointsBlue = Math.min(100, z.pointsBlue + 2);
      else if (z.controller === 'red') z.pointsRed = Math.min(100, z.pointsRed + 2);
    }
  }

  /* --- MODO 2: FUTBRAWL --- */
  function updateBrawlBall(dt) {
    const ball = match.ballState;
    if (ball.goalBannerTimer > 0) {
      ball.goalBannerTimer -= dt;
    }

    // Drible / toque por contato físico com lutadores
    match.entities.forEach(f => {
      if (!f.alive) return;
      const dx = ball.x - f.x;
      const dy = ball.y - f.y;
      const dist = Math.hypot(dx, dy) || 0.001;
      const minDist = f.radius + ball.radius;
      if (dist < minDist) {
        const nx = dx / dist;
        const ny = dy / dist;
        const overlap = minDist - dist;
        ball.x += nx * overlap;
        ball.y += ny * overlap;
        ball.vx += nx * 240;
        ball.vy += ny * 240;
        ball.lastTouchTeam = f.team;
      }
    });

    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    const friction = Math.pow(0.28, dt);
    ball.vx *= friction;
    ball.vy *= friction;
    if (Math.hypot(ball.vx, ball.vy) < 4) {
      ball.vx = 0;
      ball.vy = 0;
    }

    // Colisão da bola com obstáculos
    match.map.obstacles.forEach(obs => {
      if (!obs.alive) return;
      if (circleRectOverlap(ball.x, ball.y, ball.radius, obs)) {
        const cx = obs.x + obs.w / 2;
        const cy = obs.y + obs.h / 2;
        const angle = Math.atan2(ball.y - cy, ball.x - cx);
        ball.x = cx + Math.cos(angle) * (obs.w / 2 + ball.radius + 2);
        ball.y = cy + Math.sin(angle) * (obs.h / 2 + ball.radius + 2);
        ball.vx = Math.cos(angle) * Math.max(140, Math.hypot(ball.vx, ball.vy) * 0.72);
        ball.vy = Math.sin(angle) * Math.max(140, Math.hypot(ball.vx, ball.vy) * 0.72);
      }
    });

    // Verifica Gols nas extremidades (Gol Esquerdo pertence ao Azul; Gol Direito pertence ao Vermelho)
    const goalHalfH = 125;
    const midY = match.map.height / 2;
    const inGoalY = Math.abs(ball.y - midY) <= goalHalfH;

    if (inGoalY && ball.x - ball.radius <= 36) {
      handleGoalScored('red');
      return;
    }
    if (inGoalY && ball.x + ball.radius >= match.map.width - 36) {
      handleGoalScored('blue');
      return;
    }

    // Rebote nas paredes laterais fora do gol
    if (ball.y - ball.radius < 14) {
      ball.y = 14 + ball.radius;
      ball.vy = Math.abs(ball.vy) * 0.78;
    } else if (ball.y + ball.radius > match.map.height - 14) {
      ball.y = match.map.height - 14 - ball.radius;
      ball.vy = -Math.abs(ball.vy) * 0.78;
    }

    if (ball.x - ball.radius < 14) {
      ball.x = 14 + ball.radius;
      ball.vx = Math.abs(ball.vx) * 0.78;
    } else if (ball.x + ball.radius > match.map.width - 14) {
      ball.x = match.map.width - 14 - ball.radius;
      ball.vx = -Math.abs(ball.vx) * 0.78;
    }
  }

  function handleGoalScored(scoringTeam) {
    sfx.play('goal');
    const ball = match.ballState;
    spawnExplosionParticles(ball.x, ball.y, scoringTeam === 'blue' ? '#60a5fa' : '#f87171', 35);
    spawnShockwave(ball.x, ball.y, 180, scoringTeam === 'blue' ? '#60a5fa' : '#f87171');

    if (scoringTeam === 'blue') {
      match.scoreBlue += 1;
      ball.goalText = '⚽ GOL DA EQUIPE AZUL!';
    } else {
      match.scoreRed += 1;
      ball.goalText = '⚽ GOL DA EQUIPE VERMELHA!';
    }
    ball.goalBannerTimer = 1.6;
    addKillFeed(ball.goalText);

    // Reposiciona bola e lutadores para reiniciar a rodada
    ball.x = match.map.width / 2;
    ball.y = match.map.height / 2;
    ball.vx = 0;
    ball.vy = 0;

    let bIdx = 0;
    let rIdx = 0;
    match.entities.forEach(f => {
      f.alive = true;
      f.hp = f.maxHp;
      f.ammo = f.maxAmmo;
      f.dashState = null;
      if (f.team === 'blue') {
        const sp = match.map.spawnsBlue[bIdx++ % match.map.spawnsBlue.length];
        f.x = sp.x; f.y = sp.y;
      } else {
        const sp = match.map.spawnsRed[rIdx++ % match.map.spawnsRed.length];
        f.x = sp.x; f.y = sp.y;
      }
    });
  }

  /* --- MODO 3: PIQUE-GEMA --- */
  function spawnGemAt(x, y, gemState, scatterVx = 0, scatterVy = 0) {
    gemState.gems.push({
      id: Math.random().toString(36).slice(2, 8),
      x,
      y,
      vx: scatterVx,
      vy: scatterVy,
      bobPhase: Math.random() * Math.PI * 2,
      collectCooldown: 0.35
    });
  }

  function dropFighterGems(fighter) {
    if (fighter.gemsCarried <= 0) return;
    const count = fighter.gemsCarried;
    fighter.gemsCarried = 0;
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const spd = 110 + Math.random() * 90;
      spawnGemAt(fighter.x, fighter.y, match.gemState, Math.cos(a) * spd, Math.sin(a) * spd);
    }
  }

  function updateGemGrab(dt) {
    const gs = match.gemState;
    gs.spawnTimer -= dt;
    if (gs.spawnTimer <= 0) {
      gs.spawnTimer = 4.2;
      const spreadA = Math.random() * Math.PI * 2;
      const dist = Math.random() * 48;
      spawnGemAt(
        match.map.width / 2 + Math.cos(spreadA) * dist,
        match.map.height / 2 + Math.sin(spreadA) * dist,
        gs
      );
      spawnShockwave(match.map.width / 2, match.map.height / 2, 75, '#c084fc');
    }

    // Atualiza física das gemas e coleta
    for (let i = gs.gems.length - 1; i >= 0; i--) {
      const g = gs.gems[i];
      g.bobPhase += dt * 5;
      if (g.collectCooldown > 0) g.collectCooldown -= dt;

      g.x = Math.max(30, Math.min(match.map.width - 30, g.x + g.vx * dt));
      g.y = Math.max(30, Math.min(match.map.height - 30, g.y + g.vy * dt));
      g.vx *= Math.pow(0.08, dt);
      g.vy *= Math.pow(0.08, dt);

      if (g.collectCooldown <= 0) {
        for (const f of match.entities) {
          if (!f.alive) continue;
          if (Math.hypot(f.x - g.x, f.y - g.y) <= f.radius + 22) {
            f.gemsCarried += 1;
            if (f.isPlayer) sfx.play('gem');
            spawnExplosionParticles(g.x, g.y, '#c084fc', 10);
            spawnFloatingText(f.x, f.y - 34, '💎 +1 GEMA!', '#e879f9');
            gs.gems.splice(i, 1);
            break;
          }
        }
      }
    }

    // Soma gemas por equipe
    let blueGems = 0;
    let redGems = 0;
    match.entities.forEach(f => {
      if (!f.alive) return;
      if (f.team === 'blue') blueGems += f.gemsCarried;
      else if (f.team === 'red') redGems += f.gemsCarried;
    });
    gs.gemsBlue = blueGems;
    gs.gemsRed = redGems;

    // Regra de contagem regressiva de 10s ao alcançar 10+ gemas
    let qualifyingTeam = null;
    if (blueGems >= 10 && blueGems > redGems) qualifyingTeam = 'blue';
    else if (redGems >= 10 && redGems > blueGems) qualifyingTeam = 'red';
    else if (blueGems >= 10 && gs.countdownTeam === 'blue') qualifyingTeam = 'blue';
    else if (redGems >= 10 && gs.countdownTeam === 'red') qualifyingTeam = 'red';

    if (qualifyingTeam) {
      if (gs.countdownTeam !== qualifyingTeam) {
        gs.countdownTeam = qualifyingTeam;
        gs.countdownTimer = 10.0;
      } else {
        gs.countdownTimer -= dt;
      }
    } else {
      gs.countdownTeam = null;
      gs.countdownTimer = 10.0;
    }
  }

  /* --- MOVIMENTAÇÃO E IA TÁTICA POR MODO --- */
  function updatePlayerMovement(player, dt) {
    let vx = inputState.moveX;
    let vy = inputState.moveY;

    let kx = 0, ky = 0;
    if (inputState.keys['KeyW'] || inputState.keys['ArrowUp']) ky -= 1;
    if (inputState.keys['KeyS'] || inputState.keys['ArrowDown']) ky += 1;
    if (inputState.keys['KeyA'] || inputState.keys['ArrowLeft']) kx -= 1;
    if (inputState.keys['KeyD'] || inputState.keys['ArrowRight']) kx += 1;

    if (kx !== 0 || ky !== 0) {
      const len = Math.hypot(kx, ky);
      vx = kx / len;
      vy = ky / len;
    }

    const mag = Math.hypot(vx, vy);
    player.moveIntensity = Math.min(1, mag);

    if (mag > 0.05) {
      const spdBonus = 1 + getGearBonus(player, 'speed');
      const slowMult = player.slowTimer > 0 ? 0.65 : 1.0;
      const moveSpeed = player.hero.speed * spdBonus * slowMult;
      moveEntityWithCollision(player, vx * moveSpeed * dt, vy * moveSpeed * dt);
      if (!inputState.isAiming) {
        player.facing = Math.atan2(vy, vx);
      }
      netAdapter.sendInput({ t: Date.now(), vx, vy });
    }

    if (inputState.isAiming) {
      player.facing = inputState.aimAngle;
    }
  }

  function updateBotAI(bot, dt) {
    bot.ai.thinkTimer -= dt;
    const enemy = findNearestEnemy(bot, 920);

    // Anti-travamento em obstáculos
    const movedDist = Math.hypot(bot.x - bot.ai.lastX, bot.y - bot.ai.lastY);
    bot.ai.lastX = bot.x;
    bot.ai.lastY = bot.y;
    if (movedDist < 0.8) {
      bot.ai.stuckTimer += dt;
      if (bot.ai.stuckTimer > 0.45) {
        bot.ai.moveAngle += Math.PI * 0.65 * bot.ai.strafeDir;
        bot.ai.thinkTimer = 0.45;
        bot.ai.stuckTimer = 0;
      }
    } else {
      bot.ai.stuckTimer = 0;
    }

    if (bot.ai.thinkTimer <= 0) {
      bot.ai.thinkTimer = 0.28 + Math.random() * 0.25;

      if (match.mode === 'zone') {
        // Prioriza entrar e disputar a zona central
        const z = match.zoneState;
        const distZone = Math.hypot(z.x - bot.x, z.y - bot.y);
        if (distZone > z.radius * 0.65) {
          bot.ai.moveAngle = Math.atan2(z.y - bot.y, z.x - bot.x) + (Math.random() - 0.5) * 0.25;
        } else {
          bot.ai.moveAngle = Math.atan2(z.y - bot.y, z.x - bot.x) + (Math.PI / 2) * bot.ai.strafeDir;
        }
      } else if (match.mode === 'brawlball') {
        const ball = match.ballState;
        const enemyGoalX = bot.team === 'blue' ? match.map.width - 30 : 30;
        const goalY = match.map.height / 2;
        const distBall = Math.hypot(ball.x - bot.x, ball.y - bot.y);

        if (distBall < 62) {
          // Chuta em direção ao gol adversário
          const kickAng = Math.atan2(goalY - ball.y, enemyGoalX - ball.x);
          bot.facing = kickAng;
          if (bot.ammo >= 1) triggerBasicAttack(bot, kickAng, 1);
          bot.ai.moveAngle = kickAng;
        } else {
          // Posiciona-se atrás da bola em direção ao gol adversário
          const angleToGoal = Math.atan2(goalY - ball.y, enemyGoalX - ball.x);
          const behindX = ball.x - Math.cos(angleToGoal) * 34;
          const behindY = ball.y - Math.sin(angleToGoal) * 34;
          bot.ai.moveAngle = Math.atan2(behindY - bot.y, behindX - bot.x);
        }
      } else if (match.mode === 'gemgrab') {
        // Se carrega muitas gemas e está em contagem, recua para proteger; caso contrário busca gemas ou foca portadores inimigos
        const allyCarrier = match.entities.find(a => a.alive && a.team === bot.team && a.id !== bot.id && a.gemsCarried >= 4);
        const enemyCarrier = match.entities.find(e => e.alive && isEnemy(bot, e) && e.gemsCarried >= 3);

        if (bot.gemsCarried >= 6) {
          const safeX = bot.team === 'blue' ? 280 : match.map.width - 280;
          const safeY = match.map.height / 2 + bot.ai.strafeDir * 140;
          bot.ai.moveAngle = Math.atan2(safeY - bot.y, safeX - bot.x);
        } else if (match.gemState.gems.length > 0 && bot.gemsCarried < 8) {
          let nearestGem = match.gemState.gems[0];
          let bestD = Infinity;
          match.gemState.gems.forEach(g => {
            const d = Math.hypot(g.x - bot.x, g.y - bot.y);
            if (d < bestD) { bestD = d; nearestGem = g; }
          });
          bot.ai.moveAngle = Math.atan2(nearestGem.y - bot.y, nearestGem.x - bot.x);
        } else if (enemyCarrier) {
          bot.ai.moveAngle = Math.atan2(enemyCarrier.y - bot.y, enemyCarrier.x - bot.x);
        } else if (allyCarrier && enemy) {
          // Escolta aliado carregando gemas
          const midX = (allyCarrier.x + enemy.x) * 0.5;
          const midY = (allyCarrier.y + enemy.y) * 0.5;
          bot.ai.moveAngle = Math.atan2(midY - bot.y, midX - bot.x);
        } else if (enemy) {
          bot.ai.moveAngle = Math.atan2(enemy.y - bot.y, enemy.x - bot.x);
        }
      } else if (match.mode === 'survival') {
        // Evita zona tóxica e procura inimigos
        const distCenter = Math.hypot(bot.x - match.map.width / 2, bot.y - match.map.height / 2);
        if (distCenter > match.zoneRadius * 0.78) {
          bot.ai.moveAngle = Math.atan2(match.map.height / 2 - bot.y, match.map.width / 2 - bot.x);
        } else if (enemy) {
          const d = Math.hypot(enemy.x - bot.x, enemy.y - bot.y);
          const ang = Math.atan2(enemy.y - bot.y, enemy.x - bot.x);
          bot.ai.moveAngle = d > bot.hero.range * 0.7 ? ang : ang + (Math.PI / 2) * bot.ai.strafeDir;
        } else {
          bot.ai.moveAngle += (Math.random() - 0.5) * 1.2;
        }
      } else {
        // 3v3 e Batalha Livre
        if (enemy) {
          const angleToEnemy = Math.atan2(enemy.y - bot.y, enemy.x - bot.x);
          const dist = Math.hypot(enemy.x - bot.x, enemy.y - bot.y);
          const preferredDist = bot.hero.range * 0.65;

          if (dist > preferredDist + 40) {
            bot.ai.moveAngle = angleToEnemy + (Math.random() - 0.5) * 0.45;
          } else if (dist < preferredDist - 60 && bot.hero.style !== 'ana_dash') {
            bot.ai.moveAngle = angleToEnemy + Math.PI + (Math.random() - 0.5) * 0.5;
          } else {
            bot.ai.moveAngle = angleToEnemy + (Math.PI / 2) * bot.ai.strafeDir;
          }
        } else {
          bot.ai.moveAngle += (Math.random() - 0.5) * 1.4;
        }
      }

      if (enemy && bot.hp < bot.maxHp * 0.6) {
        activateGear(bot, 0);
      }
      if (enemy && Math.hypot(enemy.x - bot.x, enemy.y - bot.y) < bot.hero.range) {
        activateGear(bot, 1);
      }
    }

    const spdBonus = 1 + getGearBonus(bot, 'speed');
    const slowMult = bot.slowTimer > 0 ? 0.65 : 1.0;
    const speed = bot.hero.speed * 0.92 * spdBonus * slowMult;
    bot.moveIntensity = 0.9;
    moveEntityWithCollision(bot, Math.cos(bot.ai.moveAngle) * speed * dt, Math.sin(bot.ai.moveAngle) * speed * dt);

    if (enemy) {
      const dist = Math.hypot(enemy.x - bot.x, enemy.y - bot.y);
      const aimAngle = Math.atan2(enemy.y - bot.y, enemy.x - bot.x);
      bot.facing = aimAngle;

      if (bot.superCharge >= 100 && dist <= bot.hero.range * 0.95) {
        triggerSuperAbility(bot, aimAngle);
      } else if (bot.ammo >= 1 && dist <= bot.hero.range * 0.95 && Math.random() < 0.085) {
        const power = Math.min(1, dist / bot.hero.range);
        triggerBasicAttack(bot, aimAngle + (Math.random() - 0.5) * 0.14, power);
      }
    }
  }

  function moveEntityWithCollision(entity, dx, dy) {
    entity.x = Math.max(entity.radius + 12, Math.min(match.map.width - entity.radius - 12, entity.x + dx));
    resolveObstacleCollision(entity);
    entity.y = Math.max(entity.radius + 12, Math.min(match.map.height - entity.radius - 12, entity.y + dy));
    resolveObstacleCollision(entity);
  }

  function resolveObstacleCollision(entity) {
    for (const obs of match.map.obstacles) {
      if (!obs.alive) continue;
      const closestX = Math.max(obs.x, Math.min(entity.x, obs.x + obs.w));
      const closestY = Math.max(obs.y, Math.min(entity.y, obs.y + obs.h));
      const dx = entity.x - closestX;
      const dy = entity.y - closestY;
      const distSq = dx * dx + dy * dy;
      if (distSq < entity.radius * entity.radius) {
        const dist = Math.sqrt(distSq) || 0.001;
        const overlap = entity.radius - dist;
        entity.x += (dx / dist) * overlap;
        entity.y += (dy / dist) * overlap;
      }
    }
  }

  function circleRectOverlap(cx, cy, cr, rect) {
    const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
    const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return (dx * dx + dy * dy) <= cr * cr;
  }

  function isEnemy(a, b) {
    if (!a || !b || a.id === b.id) return false;
    const teamModes = ['3v3', 'zone', 'brawlball', 'gemgrab'];
    if (teamModes.includes(match.mode)) return a.team !== b.team;
    return true;
  }

  function findNearestEnemy(source, maxDist) {
    let best = null;
    let bestDist = maxDist;
    match.entities.forEach(e => {
      if (e.alive && isEnemy(source, e)) {
        const d = Math.hypot(e.x - source.x, e.y - source.y);
        if (d < bestDist) {
          bestDist = d;
          best = e;
        }
      }
    });
    return best;
  }

  function applyDamage(attacker, target, rawDamage, chargeSuper) {
    if (!target.alive) return;
    const resBonus = Math.min(0.65, getGearBonus(target, 'resistance'));
    const finalDamage = Math.max(1, Math.round(rawDamage * (1 - resBonus)));
    target.hp -= finalDamage;
    target.hitFlashTimer = 0.12;

    if (attacker) {
      attacker.damageDealt += finalDamage;
      if (chargeSuper) {
        attacker.superCharge = Math.min(100, attacker.superCharge + (finalDamage / target.maxHp) * 42);
      }
    }

    if (finalDamage >= 15) {
      spawnFloatingText(target.x, target.y - 26, `-${finalDamage}`, '#ff4d6d');
    }

    if (target.hp <= 0) {
      target.hp = 0;
      target.alive = false;
      target.deaths += 1;
      target.respawnTimer = 3.5;
      spawnExplosionParticles(target.x, target.y, target.hero.color, 26);
      spawnShockwave(target.x, target.y, 95, target.hero.accent);

      if (match.mode === 'gemgrab' && target.gemsCarried > 0) {
        dropFighterGems(target);
      }

      if (attacker) {
        attacker.kills += 1;
        if (match.mode === '3v3') {
          if (attacker.team === 'blue') match.scoreBlue += 1;
          else match.scoreRed += 1;
        }
        addKillFeed(`${attacker.label} eliminou ${target.label}`);
      } else {
        addKillFeed(`${target.label} foi eliminado pela arena`);
      }

      if (target.isPlayer && match.mode !== 'survival') {
        document.getElementById('respawn-banner').classList.remove('hidden');
      }
    }
  }

  function spawnExplosionParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 60 + Math.random() * 190;
      match.particles.push({
        x, y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        radius: 3 + Math.random() * 4,
        color,
        life: 0.35 + Math.random() * 0.25
      });
    }
  }

  function spawnShockwave(x, y, maxRadius, color) {
    match.shockwaves.push({
      x, y,
      radius: 14,
      maxRadius,
      color,
      life: 0.35,
      maxLife: 0.35
    });
  }

  function spawnFloatingText(x, y, text, color) {
    match.floatingTexts.push({ x, y, text, color, life: 0.75 });
  }

  function addKillFeed(text) {
    const feed = document.getElementById('kill-feed');
    const div = document.createElement('div');
    div.className = 'kill-msg';
    div.textContent = text;
    feed.prepend(div);
    while (feed.children.length > 4) feed.removeChild(feed.lastChild);
    setTimeout(() => { if (div.parentNode) div.remove(); }, 3500);
  }

  function checkWinConditions() {
    if (!match || !match.active) return;
    if (match.mode === '3v3') {
      if (match.scoreBlue >= 10 || match.scoreRed >= 10) {
        concludeMatch();
      }
    } else if (match.mode === 'survival') {
      const aliveList = match.entities.filter(e => e.alive);
      const player = getPlayerFighter();
      if (aliveList.length <= 1 || (player && !player.alive)) {
        concludeMatch();
      }
    } else if (match.mode === 'ffa') {
      const leader = match.entities.reduce((best, cur) => cur.kills > best.kills ? cur : best, match.entities[0]);
      if (leader.kills >= 8) {
        concludeMatch();
      }
    } else if (match.mode === 'zone') {
      if (match.zoneState.pointsBlue >= 100 || match.zoneState.pointsRed >= 100) {
        concludeMatch();
      }
    } else if (match.mode === 'brawlball') {
      if (match.scoreBlue >= 3 || match.scoreRed >= 3) {
        concludeMatch();
      }
    } else if (match.mode === 'gemgrab') {
      if (match.gemState.countdownTeam && match.gemState.countdownTimer <= 0) {
        concludeMatch();
      }
    }
  }

  function concludeMatch() {
    match.active = false;
    const player = getPlayerFighter();
    let isVictory = false;
    let summary = '';

    if (match.mode === '3v3') {
      isVictory = match.scoreBlue >= match.scoreRed;
      summary = `Placar Final — Equipe Azul ${match.scoreBlue} x ${match.scoreRed} Equipe Vermelha`;
    } else if (match.mode === 'zone') {
      const pb = match.zoneState.pointsBlue;
      const pr = match.zoneState.pointsRed;
      isVictory = pb >= pr;
      summary = `Zona Estratégica — Azul ${pb} pts x ${pr} pts Vermelho`;
    } else if (match.mode === 'brawlball') {
      isVictory = match.scoreBlue >= match.scoreRed;
      summary = `Placar de Gols — Equipe Azul ${match.scoreBlue} x ${match.scoreRed} Equipe Vermelha`;
    } else if (match.mode === 'gemgrab') {
      const gb = match.gemState.gemsBlue;
      const gr = match.gemState.gemsRed;
      if (match.gemState.countdownTeam) {
        isVictory = match.gemState.countdownTeam === 'blue';
      } else {
        isVictory = gb >= gr;
      }
      summary = `Gemas Finais — Azul ${gb} 💎 x ${gr} 💎 Vermelho`;
    } else if (match.mode === 'survival') {
      const aliveList = match.entities.filter(e => e.alive);
      isVictory = player && player.alive && aliveList.length === 1;
      const rank = aliveList.length + (player && !player.alive ? 1 : 0);
      summary = isVictory ? 'Você foi o último sobrevivente da arena!' : `Você terminou na ${rank}ª colocação.`;
    } else {
      const sorted = [...match.entities].sort((a, b) => b.kills - a.kills);
      isVictory = sorted[0].id === player.id;
      summary = `1º Lugar: ${sorted[0].label} (${sorted[0].kills} eliminações)`;
    }

    const card = document.getElementById('result-card-box');
    card.classList.toggle('defeat', !isVictory);
    document.getElementById('result-title').textContent = isVictory ? 'VITÓRIA!' : 'DERROTA';
    document.getElementById('result-summary').textContent = summary;

    const modeTitle = (MODE_META[match.mode] && MODE_META[match.mode].title) || match.mode.toUpperCase();
    document.getElementById('result-mode-label').textContent = `${modeTitle} • ${match.map.name}`;

    document.getElementById('result-stats').innerHTML = `
      <div class="r-stat"><strong>${player.kills}</strong><span>ELIMINAÇÕES</span></div>
      <div class="r-stat"><strong>${player.damageDealt}</strong><span>DANO TOTAL</span></div>
      <div class="r-stat"><strong>${player.deaths}</strong><span>DERROTAS</span></div>
    `;

    showScreen('screen-result');
  }

  document.getElementById('btn-play-again').addEventListener('click', startMapRoulette);
  document.getElementById('btn-result-menu').addEventListener('click', () => showScreen('screen-menu'));

  /* =========================================================================
     13. ATUALIZAÇÃO DO HUD DE BATALHA E RENDERIZAÇÃO EM CANVAS 2D
     ========================================================================= */
  const RING_CIRCUMFERENCE = 276.46;

  function updateBattleHUD() {
    const mins = String(Math.floor(match.timeLeft / 60)).padStart(2, '0');
    const secs = String(Math.floor(match.timeLeft % 60)).padStart(2, '0');
    document.getElementById('hud-timer').textContent = `${mins}:${secs}`;

    const leftEl = document.getElementById('hud-score-left');
    const rightEl = document.getElementById('hud-score-right');
    const alertBanner = document.getElementById('mode-alert-banner');
    alertBanner.classList.add('hidden');
    alertBanner.classList.remove('countdown-urgent');

    if (match.mode === '3v3' || match.mode === 'brawlball') {
      leftEl.textContent = `AZUL: ${match.scoreBlue}`;
      rightEl.textContent = `VERM: ${match.scoreRed}`;
      if (match.mode === 'brawlball' && match.ballState.goalBannerTimer > 0) {
        alertBanner.textContent = match.ballState.goalText;
        alertBanner.classList.remove('hidden');
      }
    } else if (match.mode === 'zone') {
      const z = match.zoneState;
      leftEl.textContent = `AZUL: ${z.pointsBlue}/100`;
      rightEl.textContent = `VERM: ${z.pointsRed}/100`;
      const ctrlText = z.controller === 'blue' ? 'ZONA DOMINADA: AZUL' : (z.controller === 'red' ? 'ZONA DOMINADA: VERMELHO' : `CAPTURA: ${Math.round(z.captureProgress)}%`);
      alertBanner.textContent = ctrlText;
      alertBanner.classList.remove('hidden');
    } else if (match.mode === 'gemgrab') {
      const gs = match.gemState;
      leftEl.textContent = `AZUL: ${gs.gemsBlue} 💎`;
      rightEl.textContent = `VERM: ${gs.gemsRed} 💎`;
      if (gs.countdownTeam) {
        const tName = gs.countdownTeam === 'blue' ? 'EQUIPE AZUL' : 'EQUIPE VERMELHA';
        alertBanner.textContent = `💎 ${tName} VENCE EM ${Math.max(0, gs.countdownTimer).toFixed(1)}s!`;
        alertBanner.classList.remove('hidden');
        alertBanner.classList.add('countdown-urgent');
      }
    } else if (match.mode === 'survival') {
      const aliveCount = match.entities.filter(e => e.alive).length;
      leftEl.textContent = `VIVOS: ${aliveCount}/${match.entities.length}`;
      rightEl.textContent = `ABATES: ${getPlayerFighter().kills}`;
    } else {
      const leader = match.entities.reduce((a, b) => b.kills > a.kills ? b : a, match.entities[0]);
      leftEl.textContent = `SEUS ABATES: ${getPlayerFighter().kills}`;
      rightEl.textContent = `LÍDER: ${leader.kills}/8`;
    }

    const player = getPlayerFighter();
    if (!player) return;

    const ammoRatio = (player.ammo + player.reloadProgress) / player.maxAmmo;
    document.getElementById('ammo-ring').style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - ammoRatio);
    document.getElementById('ammo-count-label').textContent = `${player.ammo}/${player.maxAmmo}`;

    const supRatio = player.superCharge / 100;
    document.getElementById('super-ring').style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - supRatio);
    document.getElementById('super-pct-label').textContent = player.superCharge >= 100 ? 'PRONTA!' : `${Math.floor(player.superCharge)}%`;
    supEl.classList.toggle('ready', player.superCharge >= 100);
    supEl.classList.toggle('locked', player.superCharge < 100);

    [0, 1].forEach(idx => {
      const slot = player.gears[idx];
      const rar = GEAR_RARITIES[slot.rarity];
      const btn = document.getElementById(`ctrl-gear${idx}`);
      const ring = document.getElementById(`gear${idx}-ring`);
      const lbl = document.getElementById(`gear${idx}-timer`);

      btn.classList.remove('active-buff', 'cooldown');
      if (slot.activeTime > 0) {
        btn.classList.add('active-buff');
        const ratio = slot.activeTime / rar.duration;
        ring.style.stroke = '#06d6a0';
        ring.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - ratio);
        lbl.textContent = slot.activeTime.toFixed(1) + 's';
      } else if (slot.cooldownTime > 0) {
        btn.classList.add('cooldown');
        const ratio = 1 - (slot.cooldownTime / rar.cooldown);
        ring.style.stroke = '#64748b';
        ring.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - ratio);
        lbl.textContent = Math.ceil(slot.cooldownTime) + 's';
      } else {
        ring.style.stroke = rar.color;
        ring.style.strokeDashoffset = 0;
        lbl.textContent = 'PRONTO';
      }
    });
  }

  function renderMatch() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w / 2 - match.camera.x, h / 2 - match.camera.y);

    const map = match.map;

    // Piso da Arena com padrão temático de cada mapa
    ctx.fillStyle = map.floorColor;
    ctx.fillRect(0, 0, map.width, map.height);

    const step = 80;
    for (let gx = 0; gx < map.width; gx += step) {
      for (let gy = 0; gy < map.height; gy += step) {
        if (((gx / step + gy / step) & 1) === 0) {
          ctx.fillStyle = map.tileAltColor;
          ctx.fillRect(gx, gy, step, step);
        }
      }
    }

    ctx.strokeStyle = map.gridColor;
    ctx.lineWidth = 2;
    for (let x = 0; x <= map.width; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, map.height); ctx.stroke();
    }
    for (let y = 0; y <= map.height; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(map.width, y); ctx.stroke();
    }

    // Elementos decorativos específicos de cada mapa
    drawMapDecorations(ctx, map);

    // Marcações especiais do Modo Zona Estratégica
    if (match.mode === 'zone') {
      const z = match.zoneState;
      const zoneColor = z.controller === 'blue' ? 'rgba(96, 165, 250, 0.25)' : (z.controller === 'red' ? 'rgba(248, 113, 113, 0.25)' : 'rgba(255, 183, 3, 0.16)');
      const strokeColor = z.controller === 'blue' ? '#60a5fa' : (z.controller === 'red' ? '#f87171' : '#ffb703');

      ctx.fillStyle = zoneColor;
      ctx.beginPath();
      ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Arco de progresso de captura
      const progRatio = Math.min(1, Math.abs(z.captureProgress) / 100);
      if (progRatio > 0.01) {
        ctx.strokeStyle = z.captureProgress >= 0 ? '#60a5fa' : '#f87171';
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.arc(z.x, z.y, z.radius - 10, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progRatio);
        ctx.stroke();
      }
    }

    // Marcações especiais do Modo Futbrawl (Gols e Meio de Campo)
    if (match.mode === 'brawlball') {
      const goalH = 250;
      const midY = map.height / 2;

      // Linha central e círculo
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(map.width / 2, 0); ctx.lineTo(map.width / 2, map.height); ctx.stroke();
      ctx.beginPath(); ctx.arc(map.width / 2, midY, 110, 0, Math.PI * 2); ctx.stroke();

      // Gol Esquerdo (Azul)
      ctx.fillStyle = 'rgba(58, 134, 255, 0.22)';
      ctx.fillRect(0, midY - goalH / 2, 42, goalH);
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 4;
      ctx.strokeRect(0, midY - goalH / 2, 42, goalH);

      // Gol Direito (Vermelho)
      ctx.fillStyle = 'rgba(255, 0, 85, 0.22)';
      ctx.fillRect(map.width - 42, midY - goalH / 2, 42, goalH);
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 4;
      ctx.strokeRect(map.width - 42, midY - goalH / 2, 42, goalH);
    }

    // Bordas da Arena
    ctx.strokeStyle = map.wallTopColor;
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, map.width, map.height);

    // Zonas de Perigo
    match.hazardZones.forEach(z => {
      ctx.fillStyle = z.color + '44';
      ctx.beginPath();
      ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = z.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Ondas de choque
    match.shockwaves.forEach(sw => {
      const alpha = Math.max(0, sw.life / sw.maxLife);
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;

    // Obstáculos com sombra
    map.obstacles.forEach(obs => {
      if (!obs.alive) return;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
      ctx.fillRect(obs.x + 5, obs.y + 8, obs.w, obs.h);

      ctx.fillStyle = obs.destructible ? '#78350f' : map.wallColor;
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      ctx.fillStyle = obs.destructible ? '#d97706' : map.wallTopColor;
      ctx.fillRect(obs.x + 4, obs.y + 4, obs.w - 8, obs.h - 12);
    });

    // Gemas no chão (Modo Pique-Gema)
    if (match.mode === 'gemgrab') {
      match.gemState.gems.forEach(g => {
        const bob = Math.sin(g.bobPhase) * 4;
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(g.x, g.y + 10, 12, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(g.x, g.y + bob);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(-10, -10, 20, 20);
        ctx.strokeStyle = '#f5d0fe';
        ctx.lineWidth = 2;
        ctx.strokeRect(-10, -10, 20, 20);
        ctx.restore();
      });
    }

    // Indicador de Mira do Jogador
    const player = getPlayerFighter();
    if (player && player.alive && inputState.isAiming) {
      drawAimIndicator(ctx, player, inputState.aimAngle, inputState.aimPower);
    }

    // Bombas aéreas
    match.delayedBombs.forEach(b => {
      const progress = 1 - (b.timer / b.maxTimer);
      ctx.strokeStyle = b.color + 'aa';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.blastRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = b.color + '33';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.blastRadius * progress, 0, Math.PI * 2);
      ctx.fill();

      const curX = b.startX + (b.x - b.startX) * progress;
      const curY = b.startY + (b.y - b.startY) * progress - Math.sin(progress * Math.PI) * 75;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(curX, curY, 10, 0, Math.PI * 2);
      ctx.fill();
    });

    // Lutadores
    match.entities.forEach(f => {
      if (!f.alive) return;
      drawFighterInArena(ctx, f);
    });

    // Bola (Modo Futbrawl)
    if (match.mode === 'brawlball') {
      const ball = match.ballState;
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.ellipse(ball.x, ball.y + 8, ball.radius, ball.radius * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius * 0.42, 0, Math.PI * 2);
      ctx.fill();
    }

    // Projéteis
    match.projectiles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 0.45, 0, Math.PI * 2);
      ctx.fill();
    });

    // Partículas
    match.particles.forEach(pt => {
      ctx.globalAlpha = Math.max(0, pt.life * 2);
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Zona tóxica no modo Sobrevivência
    if (match.mode === 'survival') {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(map.width / 2, map.height / 2, match.zoneRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Textos Flutuantes
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    match.floatingTexts.forEach(ft => {
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
    });

    ctx.restore();
  }

  function drawMapDecorations(ctx, map) {
    ctx.save();
    ctx.fillStyle = map.decorColor;
    ctx.strokeStyle = map.decorColor;
    ctx.lineWidth = 3;

    if (map.pattern === 'solar') {
      // Anéis solares concêntricos no centro
      ctx.beginPath(); ctx.arc(map.width / 2, map.height / 2, 175, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(map.width / 2, map.height / 2, 95, 0, Math.PI * 2); ctx.fill();
    } else if (map.pattern === 'cyber') {
      // Circuito retangular tecnológico
      ctx.strokeRect(map.width / 2 - 220, map.height / 2 - 150, 440, 300);
      ctx.fillRect(map.width / 2 - 40, map.height / 2 - 40, 80, 80);
    } else {
      // Crateras do Cânion Vulcânico
      [[600, 500, 65], [1200, 700, 75], [900, 260, 55]].forEach(([cx, cy, rad]) => {
        ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill();
      });
    }
    ctx.restore();
  }

  function drawAimIndicator(ctx, player, angle, power) {
    const h = player.hero;
    const range = h.range * (h.style === 'gabriela_lob' || h.style === 'ana_dash' ? Math.max(0.4, power) : 1);
    const endX = player.x + Math.cos(angle) * range;
    const endY = player.y + Math.sin(angle) * range;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = h.style === 'ana_dash' ? 28 : 10;
    ctx.lineCap = 'round';
    ctx.setLineDash([14, 10]);
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.setLineDash([]);

    if (h.style === 'gabriela_lob') {
      ctx.strokeStyle = '#ef476f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(endX, endY, 105, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawFighterInArena(ctx, f) {
    const teamModes = ['3v3', 'zone', 'brawlball', 'gemgrab'];
    const isAlly = f.isPlayer || (teamModes.includes(match.mode) && f.team === 'blue');
    const ringColor = f.isPlayer ? '#ffb703' : (isAlly ? '#3a86ff' : '#ff0055');

    // Sombra no chão
    ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
    ctx.beginPath();
    ctx.ellipse(f.x, f.y + 9, f.radius * 0.95, f.radius * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();

    // Anel de equipe
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(f.x, f.y + 4, f.radius + 5, 0, Math.PI * 2);
    ctx.stroke();

    // Aura de Engrenagem ativa
    const hasActiveGear = f.gears.some(g => g.activeTime > 0);
    if (hasActiveGear) {
      ctx.strokeStyle = '#06d6a0';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius + 11, f.animPhase, f.animPhase + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    const bobY = Math.sin(f.animPhase) * 2.2 * f.moveIntensity;
    drawCharacterModel(ctx, f.x, f.y + bobY, f.radius, f.hero, f.animPhase, f.slowTimer > 0, f.facing, f.hitFlashTimer > 0);

    // Indicador de gemas carregadas sobre o personagem (Modo Pique-Gema)
    if (match.mode === 'gemgrab' && f.gemsCarried > 0) {
      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.arc(f.x, f.y - f.radius - 34, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(f.gemsCarried), f.x, f.y - f.radius - 30);
    }

    // Barra de Vida
    const barW = 56;
    const barH = 7;
    const bx = f.x - barW / 2;
    const by = f.y - f.radius - 20;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(bx - 1, by - 1, barW + 2, barH + 2);
    ctx.fillStyle = isAlly ? '#06d6a0' : '#ff0055';
    ctx.fillRect(bx, by, barW * (f.hp / f.maxHp), barH);

    if (f.isPlayer) {
      const slotW = (barW - 4) / f.maxAmmo;
      for (let i = 0; i < f.maxAmmo; i++) {
        ctx.fillStyle = i < f.ammo ? '#ffb703' : '#334155';
        ctx.fillRect(bx + i * (slotW + 2), by + barH + 2, slotW, 4);
      }
    }

    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.fillText(f.label, f.x, by - 5);
  }

  function drawCharacterModel(ctx, x, y, r, hero, phase, isSlowed, facingAngle, isFlashing = false) {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = isFlashing ? '#ffffff' : (isSlowed ? '#38bdf8' : hero.color);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isFlashing ? '#ffffff' : hero.accent;
    if (hero.id === 'ana') {
      ctx.beginPath();
      ctx.moveTo(-r, 0); ctx.lineTo(0, -r * 1.25); ctx.lineTo(r, 0);
      ctx.fill();
    } else if (hero.id === 'jose') {
      ctx.fillRect(-r * 0.65, -r * 0.45, r * 1.3, r * 0.35);
    } else if (hero.id === 'gustavo') {
      ctx.beginPath();
      ctx.arc(-r * 0.6, -r * 0.8, 7, 0, Math.PI * 2);
      ctx.arc(r * 0.6, -r * 0.8, 7, 0, Math.PI * 2);
      ctx.fill();
    } else if (hero.id === 'jorge') {
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.arc(i * 10, -r * 0.85, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (hero.id === 'davi') {
      ctx.beginPath();
      ctx.arc(r * 0.35, -r * 0.15, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (hero.id === 'gabriela') {
      ctx.fillRect(-r * 0.7, -r * 0.65, r * 1.4, r * 0.4);
    } else if (hero.id === 'iarly') {
      ctx.fillRect(-r * 0.25, -r, r * 0.5, r * 2);
    }

    if (facingAngle !== null) {
      ctx.rotate(facingAngle);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(r * 0.75, 0, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  updateMenuUI();
})();