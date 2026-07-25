/* ==========================================================================
   AI/ML PORTFOLIO — FUTURISTIC HUD INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Start Preloader first
  initPreloader();

  // Start HUD elements
  initUptimeClock();
  initTabNavigation();
  initNeuralNetworkCanvas();
  initLossGraph();
  initAttentionGrid();
  initInferenceEngine();
  initContactForm();

  // Highlight blog posts clicks from alerts
  document.querySelectorAll('[data-alert-tab]').forEach(elem => {
    elem.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = elem.getAttribute('data-alert-tab');
      activateTab(targetTab);
    });
  });
});

/* ==========================================================================
   1. UTC CLOCK & UPTIME COUNTER
   ========================================================================== */
function initUptimeClock() {
  const clockElem = document.getElementById('hudClock');
  const uptimeElem = document.getElementById('uptimeCounter');
  const startTime = Date.now();

  function update() {
    // 1. UTC Clock
    const now = new Date();
    const hrs = String(now.getUTCHours()).padStart(2, '0');
    const mins = String(now.getUTCMinutes()).padStart(2, '0');
    const secs = String(now.getUTCSeconds()).padStart(2, '0');
    if (clockElem) {
      clockElem.textContent = `${hrs}:${mins}:${secs} UTC`;
    }

    // 2. Session Uptime
    const diff = Date.now() - startTime;
    const s = Math.floor(diff / 1000) % 60;
    const m = Math.floor(diff / (1000 * 60)) % 60;
    const h = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));

    const sStr = String(s).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    const hStr = String(h).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');

    if (uptimeElem) {
      uptimeElem.textContent = `${dStr}d ${hStr}h ${mStr}m ${sStr}s`;
    }
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   2. TAB NAVIGATION & OVERLAY CONTROLS
   ========================================================================== */
let activePanelId = null;

function initTabNavigation() {
  const tabs = document.querySelectorAll('.hud-tab');
  const mobileLinks = document.querySelectorAll('.hud-mobile-link');
  const panels = document.querySelectorAll('.hud-overlay-panel');
  const closeBtns = document.querySelectorAll('.hud-overlay-close');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileMenuDrawer');
  const mobileClose = document.getElementById('mobileMenuClose');

  function openTab(tabName) {
    // Deactivate all tabs
    tabs.forEach(t => t.classList.remove('active'));
    mobileLinks.forEach(l => l.classList.remove('active'));

    // Deactivate panels
    panels.forEach(p => p.classList.remove('active'));

    // Set active tab buttons
    const targetTab = Array.from(tabs).find(t => t.getAttribute('data-tab') === tabName);
    if (targetTab) targetTab.classList.add('active');

    const targetMobileLink = Array.from(mobileLinks).find(l => l.getAttribute('data-tab-mobile') === tabName);
    if (targetMobileLink) targetMobileLink.classList.add('active');

    if (tabName === 'overview') {
      activePanelId = null;
      return;
    }

    // Open target panel
    const targetPanel = document.getElementById(`panel-${tabName}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
      activePanelId = tabName;
    }
  }

  // Click on main tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      openTab(tabName);
    });
  });

  // Click on mobile drawer links
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      const tabName = link.getAttribute('data-tab-mobile');
      openTab(tabName);
      if (mobileDrawer) mobileDrawer.classList.remove('active');
    });
  });

  // Close buttons
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      openTab('overview');
    });
  });

  // Mobile menu controls
  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.add('active');
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('active');
    });
  }

  // Close overlays with Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activePanelId) {
      openTab('overview');
    }
  });

  // Wire project filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Alerts View All triggers diagnostics/contact tab
  const alertsViewAll = document.getElementById('alertsViewAll');
  if (alertsViewAll) {
    alertsViewAll.addEventListener('click', () => {
      openTab('transmission');
    });
  }
}

// Global accessor to change tabs programmatically
function activateTab(tabName) {
  const tabs = document.querySelectorAll('.hud-tab');
  const tabBtn = Array.from(tabs).find(t => t.getAttribute('data-tab') === tabName);
  if (tabBtn) tabBtn.click();
}

/* ==========================================================================
   3. ANIMATED NEURAL NETWORK CANVAS
   ========================================================================== */
function initNeuralNetworkCanvas() {
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId = null;

  // Nodes per layer configurations
  const layersConfig = [5, 8, 10, 7, 10, 8, 5];
  let layers = [];
  let connections = [];
  let particles = [];
  let logoHex = { x: 0, y: 0, rotation: 0, size: 22 };

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    buildNetwork(rect.width, rect.height);
  }

  function buildNetwork(width, height) {
    layers = [];
    connections = [];
    
    // 1. Build Node Coordinates
    const xStep = width / (layersConfig.length - 1);
    for (let i = 0; i < layersConfig.length; i++) {
      const numNodes = layersConfig[i];
      const x = i * xStep;
      const layerNodes = [];
      const yStep = height / (numNodes + 1);

      for (let j = 0; j < numNodes; j++) {
        const y = (j + 1) * yStep;
        layerNodes.push({
          x: x,
          y: y,
          id: `${i}-${j}`,
          pulse: Math.random() * Math.PI,
          activity: Math.random()
        });
      }
      layers.push(layerNodes);
    }

    // Capture center point for the logo overlay
    logoHex.x = width / 2;
    logoHex.y = height / 2;

    // 2. Build Layer connections
    for (let i = 0; i < layers.length - 1; i++) {
      const layerA = layers[i];
      const layerB = layers[i + 1];

      layerA.forEach(nodeA => {
        layerB.forEach(nodeB => {
          // Connect nodes randomly or selectively for cleaner visual density
          const randomFactor = Math.random();
          // We connect more heavily in critical bottlenecks, lighter overall to avoid canvas crowding
          if (randomFactor > 0.65 || (i === 2 && randomFactor > 0.45) || (i === 3 && randomFactor > 0.45)) {
            connections.push({
              from: nodeA,
              to: nodeB,
              type: Math.random() > 0.85 ? 'residual' : 'forward'
            });
          }
        });
      });
    }
  }

  // Particle emission
  function spawnParticle() {
    if (connections.length === 0) return;
    // Choose a random connection path
    const conn = connections[Math.floor(Math.random() * connections.length)];
    particles.push({
      connection: conn,
      progress: 0,
      speed: 0.008 + Math.random() * 0.015,
      color: Math.random() > 0.5 ? 'cyan' : 'magenta',
      size: 1 + Math.random() * 2
    });
  }

  function drawHexagon(x, y, size, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(244, 63, 94, 0.6)';
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const hx = Math.cos(a) * size;
      const hy = Math.sin(a) * size;
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();

    // Draw inner K logo
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 11px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 3;
    ctx.shadowColor = 'rgba(255,255,255,0.4)';
    ctx.fillText('K', 0, 0.5);
    ctx.restore();
  }

  function animate() {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);

    // 1. Draw connections
    connections.forEach(conn => {
      ctx.beginPath();
      ctx.moveTo(conn.from.x, conn.from.y);
      if (conn.type === 'residual') {
        // Residual path curves slightly
        const cx = (conn.from.x + conn.to.x) / 2;
        const cy = ((conn.from.y + conn.to.y) / 2) - 30;
        ctx.quadraticCurveTo(cx, cy, conn.to.x, conn.to.y);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
        ctx.lineWidth = 1;
      } else {
        ctx.lineTo(conn.to.x, conn.to.y);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
        ctx.lineWidth = 0.7;
      }
      ctx.stroke();
    });

    // 2. Draw and update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.progress += p.speed;

      if (p.progress >= 1) {
        particles.splice(i, 1);
        continue;
      }

      const from = p.connection.from;
      const to = p.connection.to;
      let x, y;

      if (p.connection.type === 'residual') {
        const t = p.progress;
        const cx = (from.x + to.x) / 2;
        const cy = ((from.y + to.y) / 2) - 30;
        // Quadratic bezier interpolation
        x = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * cx + t * t * to.x;
        y = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * cy + t * t * to.y;
      } else {
        x = from.x + (to.x - from.x) * p.progress;
        y = from.y + (to.y - from.y) * p.progress;
      }

      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color === 'cyan' ? '#06b6d4' : '#f43f5e';
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color === 'cyan' ? 'rgba(6, 182, 212, 0.8)' : 'rgba(244, 63, 94, 0.8)';
      ctx.fill();
      ctx.shadowBlur = 0; // Reset
    }

    // Spawn new particles periodically
    if (Math.random() < 0.18) {
      spawnParticle();
    }

    // 3. Clear backdrop behind the logo
    ctx.save();
    ctx.beginPath();
    ctx.arc(logoHex.x, logoHex.y, logoHex.size + 8, 0, Math.PI * 2);
    ctx.fillStyle = '#05050b'; // Clear overlay
    ctx.fill();
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // 4. Draw Layer Nodes
    layers.forEach((layer, layerIdx) => {
      layer.forEach(node => {
        node.pulse += 0.02;
        const nodeSize = 3;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
        
        // Input vs hidden layers vs output color schemes
        if (layerIdx === 0) {
          ctx.fillStyle = '#06b6d4';
        } else if (layerIdx === layers.length - 1) {
          ctx.fillStyle = '#f43f5e';
        } else {
          ctx.fillStyle = '#8b5cf6';
        }
        
        ctx.shadowBlur = 4 + Math.sin(node.pulse) * 3;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      });
    });

    // 5. Draw Neural Central Logo
    logoHex.rotation += 0.005;
    drawHexagon(logoHex.x, logoHex.y, logoHex.size, logoHex.rotation);

    animationId = requestAnimationFrame(animate);
  }

  // Handle window sizes
  window.addEventListener('resize', resize);
  resize();
  animate();
}

/* ==========================================================================
   4. LIVE LOSS CURVE Telemetry GRAPH
   ========================================================================== */
function initLossGraph() {
  const canvas = document.getElementById('lossCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let trainLoss = [];
  let valLoss = [];
  const maxPoints = 40;

  // Initialize initial decaying values
  let currentTrainVal = 1.6;
  let currentValVal = 1.8;
  for (let i = 0; i < maxPoints; i++) {
    const factor = (maxPoints - i) / maxPoints;
    const noiseT = (Math.random() - 0.5) * 0.05;
    const noiseV = (Math.random() - 0.5) * 0.05;
    
    // Decay curve formula
    currentTrainVal = 0.2 + (1.4 * Math.pow(factor, 1.8)) + noiseT;
    currentValVal = 0.35 + (1.45 * Math.pow(factor, 1.6)) + noiseV;

    trainLoss.push(Math.max(0.1, currentTrainVal));
    valLoss.push(Math.max(0.2, currentValVal));
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    drawGraph();
  }

  function drawGraph() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // 1. Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    const gridCols = 8;
    const gridRows = 4;

    for (let i = 1; i < gridCols; i++) {
      const x = (i * w) / gridCols;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    for (let i = 1; i < gridRows; i++) {
      const y = (i * h) / gridRows;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Coordinate mapping functions (Loss limits: 0.0 to 2.0)
    function getX(index) {
      return (index / (maxPoints - 1)) * w;
    }
    function getY(value) {
      const pct = value / 2.0; // Scale relative to 2.0
      return h - (pct * h * 0.8) - (h * 0.1); // Add padding borders
    }

    // 2. Draw Training Loss Path (neon magenta)
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(trainLoss[0]));
    for (let i = 1; i < trainLoss.length; i++) {
      ctx.lineTo(getX(i), getY(trainLoss[i]));
    }
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 4;
    ctx.shadowColor = 'rgba(244, 63, 94, 0.4)';
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset

    // 3. Draw Validation Loss Path (neon cyan)
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(valLoss[0]));
    for (let i = 1; i < valLoss.length; i++) {
      ctx.lineTo(getX(i), getY(valLoss[i]));
    }
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 4;
    ctx.shadowColor = 'rgba(6, 182, 212, 0.4)';
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset
  }

  // Slowly simulate step inputs
  setInterval(() => {
    // Generate next decay point with tiny noise
    const noiseT = (Math.random() - 0.5) * 0.03;
    const noiseV = (Math.random() - 0.5) * 0.04;
    
    // Stable convergence target limits
    const nextT = Math.max(0.12, 0.22 + noiseT);
    const nextV = Math.max(0.24, 0.38 + noiseV);

    trainLoss.shift();
    trainLoss.push(nextT);

    valLoss.shift();
    valLoss.push(nextV);

    drawGraph();
  }, 1500);

  window.addEventListener('resize', resize);
  resize();
}

/* ==========================================================================
   5. ATTENTION MAP GRID (Layer 32 Active Matrix)
   ========================================================================== */
function initAttentionGrid() {
  const container = document.getElementById('attentionGrid');
  if (!container) return;

  const totalCells = 64; // 8x8
  let cells = [];

  // Generate cells programmatically
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.classList.add('attention-cell');
    
    const row = Math.floor(i / 8);
    const col = i % 8;
    
    // Diagonal matrix activation simulation
    const distToDiag = Math.abs(row - col);
    const baseVal = Math.max(0.02, 1.0 - (distToDiag * 0.28) + (Math.random() - 0.5) * 0.12);
    const finalVal = Math.min(1.0, Math.max(0.01, baseVal));

    cell.style.backgroundColor = `rgba(139, 92, 246, ${finalVal * 0.55})`;
    cell.setAttribute('data-val', finalVal.toFixed(3));
    cell.setAttribute('data-coord', `[L32:${row},${col}]`);

    // On hover telemetry
    cell.addEventListener('mouseenter', () => {
      const term = document.getElementById('inferenceTerminal');
      if (term) {
        term.innerHTML = `<span style="color: var(--neon-magenta); font-weight: bold;">[TELEMETRY_SCAN]</span> Synaptic attention matrix trace:<br/>Coordinates: ${cell.getAttribute('data-coord')}<br/>Activation strength: ${cell.getAttribute('data-val')}<br/>Status: Nominally loaded`;
      }
    });

    container.appendChild(cell);
    cells.push(cell);
  }

  // Periodically fluctuate matrix layers slightly
  setInterval(() => {
    cells.forEach((cell, idx) => {
      const row = Math.floor(idx / 8);
      const col = idx % 8;
      const distToDiag = Math.abs(row - col);
      
      const fluctuation = (Math.random() - 0.5) * 0.08;
      const baseVal = Math.max(0.02, 1.0 - (distToDiag * 0.28) + fluctuation);
      const finalVal = Math.min(1.0, Math.max(0.01, baseVal));

      cell.style.backgroundColor = `rgba(139, 92, 246, ${finalVal * 0.55})`;
      cell.setAttribute('data-val', finalVal.toFixed(3));
    });
  }, 3000);
}

/* ==========================================================================
   6. INFERENCE ENGINE (Interactive Q&A console)
   ========================================================================== */
function initInferenceEngine() {
  const input = document.getElementById('inferenceInput');
  const largeInput = document.getElementById('largeInferenceInput');
  const term = document.getElementById('inferenceTerminal');
  const largeTerm = document.getElementById('largeTerminal');
  const pills = document.querySelectorAll('.inference-pill');

  const predBars = {
    ai: document.getElementById('predBar-ai'),
    web: document.getElementById('predBar-web'),
    cloud: document.getElementById('predBar-cloud')
  };

  const predVals = {
    ai: document.getElementById('predVal-ai'),
    web: document.getElementById('predVal-web'),
    cloud: document.getElementById('predVal-cloud')
  };

  const latencyIndicator = document.getElementById('latencyIndicator');

  // Command database responses
  const qaDatabase = {
    '/skills': `<strong>[SYNAPSE_DECODE] Ketan Core Capabilities Decrypted:</strong><br/>
                &gt; AI/ML Frameworks: PyTorch, Hugging Face, LangChain, OpenAI API, TensorRT<br/>
                &gt; Languages: Python (Expert), JavaScript/TypeScript, C++, SQL<br/>
                &gt; Systems & Web: Next.js, Node.js, FastAPI, Docker, PostgreSQL, AWS, Git<br/>
                &gt; Focus Areas: LLM fine-tuning, RAG system pipelines, MLOps orchestration`,
    
    '/projects': `<strong>[ARCHITECTURE_METRICS] Core Project Modules Found:</strong><br/>
                  &gt; Sentiment Analysis Engine (Transformer fine-tuning)<br/>
                  &gt; AI Dashboard Platform (Full-stack real-time analytics panel)<br/>
                  &gt; Efficient Attention Mechanisms (CUDA kernels sequence models research)<br/>
                  &gt; RAG Knowledge Assistant (Vector indexes data-synthesis QA)`,
    
    '/experience': `<strong>[TRAINING_LOGS] Training Epoch Milestones:</strong><br/>
                    &gt; 2024-Present: AI/ML Engineer // Core Deep Learning Corp<br/>
                    &gt; 2022-2024: MS in Computer Science (Specializing in AI)<br/>
                    &gt; 2023: Software Developer Intern (React, Node full-stack)<br/>
                    &gt; 2018-2022: B.Tech in Computer Engineering`,
    
    '/contact': `<strong>[COMMUNICATION_LINK] Opening transmission channel transmitter...</strong><br/>
                 Initializing direct feedback nodes. Launching transmission panel.`,
    
    '/cv': `<strong>[TRANSMITTING_PACKETS] Transmitting CV stream sequence:</strong><br/>
            &gt; Initializing protocol payload: PORTFOLIO_RESUME_STREAM.pdf<br/>
            &gt; Link established. Opening resume telemetry source: <a href="#" style="color: var(--neon-cyan); text-decoration: underline;" onclick="alert('Mock Resume Stream Transmitted!')">Download PDF Spec Document</a>`,
    
    '/help': `<strong>[COMMAND_PROTOCOL] Valid Diagnostic Signals:</strong><br/>
              &gt; /skills - Core competencies & developer stacks<br/>
              &gt; /projects - Deep-dives into developed models<br/>
              &gt; /experience - Training timeline and background logs<br/>
              &gt; /contact - Open transmission portal<br/>
              &gt; /cv - Fetch developer resume spec sheet`
  };

  function processQuery(queryText) {
    const query = queryText.toLowerCase().trim();
    
    // Simulate thinking latency
    const randLatency = (1.2 + Math.random() * 2.8).toFixed(1);
    if (latencyIndicator) latencyIndicator.textContent = `${randLatency} ms`;

    let response = '';
    let predictions = { ai: 50, web: 50, cloud: 50 };

    if (query.startsWith('/')) {
      if (qaDatabase[query]) {
        response = qaDatabase[query];
        // Adjust predictions dynamically according to commands
        if (query === '/skills' || query === '/projects') {
          predictions = { ai: 98, web: 92, cloud: 81 };
        } else if (query === '/experience') {
          predictions = { ai: 85, web: 82, cloud: 88 };
        } else if (query === '/contact') {
        predictions = { ai: 60, web: 80, cloud: 95 };
        setTimeout(() => {
          activateTab('transmission');
        }, 1200);
        } else if (query === '/cv') {
          predictions = { ai: 90, web: 90, cloud: 90 };
        } else if (query === '/help') {
          predictions = { ai: 73, web: 73, cloud: 73 };
        }
      } else {
        response = `<strong>[ERROR_CODE: 404]</strong> Unknown operational signal: "${queryText}". Type "/help" to view system core command formats.`;
      }
    } else {
      // Free text matching search simulation
      if (query.includes('skill') || query.includes('language') || query.includes('code') || query.includes('tech')) {
        response = qaDatabase['/skills'];
        predictions = { ai: 97, web: 94, cloud: 79 };
      } else if (query.includes('project') || query.includes('build') || query.includes('work')) {
        response = qaDatabase['/projects'];
        predictions = { ai: 95, web: 88, cloud: 74 };
      } else if (query.includes('job') || query.includes('employ') || query.includes('experience') || query.includes('education')) {
        response = qaDatabase['/experience'];
        predictions = { ai: 88, web: 81, cloud: 87 };
      } else if (query.includes('mail') || query.includes('contact') || query.includes('message') || query.includes('hire')) {
        response = qaDatabase['/contact'];
        predictions = { ai: 70, web: 75, cloud: 96 };
      } else if (query.includes('cv') || query.includes('resume')) {
        response = qaDatabase['/cv'];
        predictions = { ai: 91, web: 91, cloud: 91 };
      } else {
        response = `<strong>[DECIPHERING_QUERY] System response for: "${queryText}":</strong><br/>
                    Query received. Model confidence indicates searching for Developer Profile...<br/>
                    Ketan specializes in AI architectures & full-stack applications. View the <a href="#" onclick="activateTab('profile')">Profile section</a> for profile data.`;
        predictions = { 
          ai: Math.floor(60 + Math.random() * 30), 
          web: Math.floor(55 + Math.random() * 35), 
          cloud: Math.floor(50 + Math.random() * 30) 
        };
      }
    }

    // Typeout animation simulator
    typeTerminal(response);
    
    // Update confidence bar visuals
    Object.keys(predictions).forEach(key => {
      if (predBars[key]) predBars[key].style.width = `${predictions[key]}%`;
      if (predVals[key]) predVals[key].textContent = `${predictions[key].toFixed(1)}%`;
    });
  }

  function typeTerminal(htmlContent) {
    // Sync both dashboard and full panels
    [term, largeTerm].forEach(targetTerm => {
      if (!targetTerm) return;
      targetTerm.innerHTML = '';
      
      let i = 0;
      const textArray = htmlContent.split(/(<[^>]*>|&[^;]*;)/); // Splitting preserving tags/entities
      
      function type() {
        if (i < textArray.length) {
          const chunk = textArray[i];
          if (chunk.startsWith('<') || chunk.startsWith('&')) {
            // Write tags or html entities immediately
            targetTerm.innerHTML += chunk;
            i++;
            type();
          } else {
            // Character-by-character animation
            let charIndex = 0;
            function typeChar() {
              if (charIndex < chunk.length) {
                targetTerm.innerHTML += chunk.charAt(charIndex);
                charIndex++;
                targetTerm.scrollTop = targetTerm.scrollHeight;
                setTimeout(typeChar, 3); // Faster typewriter
              } else {
                i++;
                setTimeout(type, 15);
              }
            }
            typeChar();
          }
        }
      }
      type();
    });
  }

  // Main input triggers
  [input, largeInput].forEach(inp => {
    if (!inp) return;
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = inp.value;
        if (!val.trim()) return;
        processQuery(val);
        inp.value = '';
        
        // Sync values to other input
        if (inp === input && largeInput) largeInput.value = val;
        if (inp === largeInput && input) input.value = val;
      }
    });
  });

  // Pills triggers
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const command = pill.getAttribute('data-command');
      if (input) input.value = command;
      if (largeInput) largeInput.value = command;
      processQuery(command);
    });
  });
}

/* ==========================================================================
   7. DIAGNOSTICS CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('hudContactForm');
  const successMsg = document.getElementById('formSuccessAlert');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Change button status
    if (submitBtn) {
      submitBtn.innerHTML = '<span class="btn-loader"></span> Transmitting packets...';
      submitBtn.disabled = true;
    }

    // Simulate submission delay
    setTimeout(() => {
      form.style.display = 'none';
      if (successMsg) successMsg.classList.add('show');
    }, 1500);
  });
}

/* ==========================================================================
   8. HUD GALAXY PRELOADER ANIMATION (BOOT SEQUENCE)
   ========================================================================== */
function initPreloader() {
  const container = document.getElementById('hud-preloader');
  const canvas = document.getElementById('preloaderCanvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  const pctElem = document.getElementById('preloaderPct');
  const barElem = document.getElementById('preloaderBar');
  const logsElem = document.getElementById('preloaderLogs');

  let progress = 0;
  let particles = [];
  let animationId = null;
  const numParticles = 850;
  
  // Projection variables
  const tiltAngle = 65 * Math.PI / 180; // 65 degree tilt
  const scale = 1.15;

  // Log sequence checkpoints matching progress milestones
  const bootLogs = [
    { threshold: 0, text: "&gt; INITIALIZING SYNAPSE-NX7 DIAGNOSTICS BOOT..." },
    { threshold: 12, text: "&gt; MAPPING COGNITIVE MEMORY SECTORS... OK" },
    { threshold: 22, text: "&gt; ESTABLISHING NEURAL PORTFOLIO DATA STREAM..." },
    { threshold: 35, text: "&gt; SYNAPSE PIPELINES LOADED. TRIGGERING CONVERGENCE..." },
    { threshold: 45, text: "&gt; CORE CONVERGENCE ACTIVE. COLLAPSING ORBITAL SHAPES..." },
    { threshold: 62, text: "&gt; RADAR CORE ALIGNMENT LOCKED. STABILIZING DISK GRID..." },
    { threshold: 82, text: "&gt; TELEMETRY BEAM PROJECTED. RESOLVING FLOATING WIDGETS..." },
    { threshold: 96, text: "&gt; SYNAPSTIC CORE NOMINAL. PORTFOLIO ACTIVATED." }
  ];
  let activeLogIndex = -1;

  // Vertical data stream line arrays for Phase 1
  let dataStreams = [];
  for (let i = 0; i < 22; i++) {
    dataStreams.push({
      r: Math.random() * 180 + 15,
      angle: Math.random() * Math.PI * 2,
      maxHeight: Math.random() * 100 + 40,
      currentHeight: 0,
      packets: [Math.random(), Math.random(), Math.random()] // Vertical particle offsets
    });
  }

  // 1. Resize Handler
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  // 2. Build Galaxy Core Particles
  function buildGalaxy() {
    particles = [];
    const colors = ['#06b6d4', '#8b5cf6', '#f43f5e', '#ffffff', '#3b82f6'];

    for (let i = 0; i < numParticles; i++) {
      const r = Math.pow(Math.random(), 2.2) * 220 + 5;
      const arm = Math.floor(Math.random() * 2); // 2 Spiral Arms
      const baseAngle = arm * Math.PI + r * 0.022;
      const spread = (Math.random() - 0.5) * 0.42;
      
      const maxZ = Math.max(2, 26 * (1 - r / 235));
      const z = (Math.random() - 0.5) * maxZ;

      particles.push({
        r: r,
        theta: baseAngle + spread,
        z: z,
        speed: 0.002 + (1 / (r + 15)) * 0.28,
        size: 0.5 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  // 3. Main Render Loop
  function draw() {
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    const cx = w / 2;
    const cy = h / 2 - 20;

    ctx.clearRect(0, 0, w, h);

    const cosTilt = Math.cos(tiltAngle);
    const sinTilt = Math.sin(tiltAngle);

    // Projection calculation
    function project(rx, ry, rz) {
      const px = rx * scale;
      const py = (ry * cosTilt + rz * sinTilt) * scale;
      return { x: cx + px, y: cy + py };
    }

    // Determine current phase based on progress
    let phase = 0;
    if (progress < 20) phase = 0;          // 0:00 - START
    else if (progress < 40) phase = 1;     // 0:01 - DATA STREAM
    else if (progress < 60) phase = 2;     // 0:02 - CONVERGING (Imploding)
    else if (progress < 80) phase = 3;     // 0:03 - FORMATION (Circular Radar Grid)
    else if (progress < 95) phase = 4;     // 0:04 - STRUCTURE READY (Telemetry Beam)
    else phase = 5;                        // 0:05 - ACTIVATED

    // ==========================================
    // PHASE DRAWING STAGES
    // ==========================================

    // A. Perspective grid background (Drawn in Phase 0, 1, and fades out in Phase 2)
    let gridAlpha = 0.04;
    if (phase === 2) {
      gridAlpha = 0.04 * (1 - (progress - 40) / 20);
    } else if (phase > 2) {
      gridAlpha = 0;
    }
    
    if (gridAlpha > 0) {
      ctx.strokeStyle = `rgba(6, 182, 212, ${gridAlpha})`;
      ctx.lineWidth = 1;
      for (let radius = 50; radius <= 250; radius += 50) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius * scale, radius * scale * cosTilt, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // B. PHASE 1: DATA STREAM - Draw vertical neon blue stems and particles rising
    if (phase >= 1 && phase <= 2) {
      const streamFade = phase === 2 ? (1 - (progress - 40) / 20) : 1;
      
      dataStreams.forEach(stream => {
        // Line calculations
        const rx = stream.r * Math.cos(stream.angle + progress * 0.003);
        const ry = stream.r * Math.sin(stream.angle + progress * 0.003);
        
        const ptBase = project(rx, ry, 0);
        
        // Rise line height over Phase 1
        const lineFactor = Math.min(1, (progress - 20) / 20);
        const currentHeight = stream.maxHeight * lineFactor;
        const ptTop = project(rx, ry, -currentHeight);

        // Draw line stem
        ctx.beginPath();
        ctx.moveTo(ptBase.x, ptBase.y);
        ctx.lineTo(ptTop.x, ptTop.y);
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 * streamFade})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Draw ascending particles along stems
        stream.packets.forEach((offset, idx) => {
          stream.packets[idx] += 0.015; // Move packet up
          if (stream.packets[idx] > 1) stream.packets[idx] = 0;
          
          const packetHeight = currentHeight * stream.packets[idx];
          const ptPacket = project(rx, ry, -packetHeight);

          ctx.beginPath();
          ctx.arc(ptPacket.x, ptPacket.y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6, 182, 212, ${0.7 * streamFade})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#06b6d4';
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      });
    }

    // C. PHASE 2: CONVERGING - Implosion logic collapsing radii of stars
    let collapseFactor = 1.0;
    let speedMult = 1.0;
    if (phase === 2) {
      const t = (progress - 40) / 20; // 0 to 1
      const ease = t * t * (3 - 2 * t); // Smoothstep easing
      collapseFactor = 1.0 - ease * 0.92; // Contract to 8% radius
      speedMult = 1.0 + ease * 6.5; // Spin faster
    } else if (phase >= 3) {
      collapseFactor = 0.08;
      speedMult = 7.5;
    }

    // D. Particles Drawing
    particles.forEach(p => {
      p.theta += p.speed * speedMult;

      const currentR = p.r * collapseFactor;
      const rx = currentR * Math.cos(p.theta);
      const ry = currentR * Math.sin(p.theta);
      const pt = project(rx, ry, p.z * collapseFactor);

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, p.size, 0, Math.PI * 2);
      
      // Dense glow elements
      if (currentR < 15 || p.color === '#ffffff') {
        ctx.shadowBlur = p.size * 3.5;
        ctx.shadowColor = p.color;
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw faint imploding radial lines to core in Phase 2
      if (phase === 2 && Math.random() < 0.005) {
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        const corePt = project(0, 0, 0);
        ctx.lineTo(corePt.x, corePt.y);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.05)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });

    // E. PHASE 3: FORMATION - Concentric circular radar lines expanding outwards
    if (phase >= 3) {
      const maxRadius = 240;
      const ringSpeed = 2.4;
      
      // Calculate concentric waves based on progress
      const factor1 = (progress - 60) / 20; // 0 to 1
      const R1 = factor1 * maxRadius;
      const alpha1 = Math.max(0, 0.3 * (1 - factor1));

      // Wave 1
      if (alpha1 > 0) {
        ctx.strokeStyle = `rgba(6, 182, 212, ${alpha1})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, R1 * scale, R1 * scale * cosTilt, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Wave 2 (delayed offset)
      if (progress > 68) {
        const factor2 = (progress - 68) / 12; // 0 to 1
        const R2 = factor2 * maxRadius;
        const alpha2 = Math.max(0, 0.25 * (1 - factor2));
        if (alpha2 > 0) {
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha2})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(cx, cy, R2 * scale, R2 * scale * cosTilt, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Base concentric solid indicators at core
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 32 * scale, 32 * scale * cosTilt, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 60 * scale, 60 * scale * cosTilt, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // F. PHASE 4 & 5: STRUCTURE READY & ACTIVATED - Vertical Volumetric Telemetry Energy Beam
    if (phase >= 4) {
      const ptBase = project(0, 0, 0);
      
      // Rise beam height over Phase 4
      const beamFactor = Math.min(1, (progress - 80) / 15);
      const beamHeight = 220 * beamFactor;
      const ptTop = project(0, 0, -beamHeight);

      // Beam pulse factor on Phase 5
      let pulseAlpha = 1.0;
      if (phase === 5) {
        pulseAlpha = 0.7 + Math.sin(Date.now() * 0.012) * 0.3; // Intense flickering
      }

      // Layered volumetric line glow
      const widths = [38, 22, 8, 2];
      const alphas = [0.03, 0.08, 0.28, 0.85];
      const colors = ['#f43f5e', '#f43f5e', '#ffffff', '#ffffff'];

      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(ptBase.x, ptBase.y);
        ctx.lineTo(ptTop.x, ptTop.y);
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = widths[i];
        ctx.globalAlpha = alphas[i] * pulseAlpha;
        if (i === 3) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#f43f5e';
        }
        ctx.stroke();
        ctx.restore();
      }

      // Render floating dashboard indicators (widget maps)
      if (beamFactor >= 0.7) {
        const widgetAlpha = Math.min(1, (progress - 85) / 10);
        ctx.save();
        ctx.globalAlpha = widgetAlpha;

        // Widget 1: Left Float [SYS_LKD]
        const w1Start = project(0, 0, -60);
        const w1End = { x: w1Start.x - 70, y: w1Start.y - 15 };
        ctx.beginPath();
        ctx.moveTo(w1Start.x, w1Start.y);
        ctx.lineTo(w1End.x, w1End.y);
        ctx.lineTo(w1End.x - 10, w1End.y);
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        
        // Draw little panel box
        const box1 = { x: w1End.x - 75, y: w1End.y - 12, w: 60, h: 22 };
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.strokeRect(box1.x, box1.y, box1.w, box1.h);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.05)';
        ctx.fillRect(box1.x, box1.y, box1.w, box1.h);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 7px Share Tech Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText("SYS_LKD: 99", box1.x + 4, box1.y + 8);
        ctx.fillText("L-COR: nominal", box1.x + 4, box1.y + 16);

        // Widget 2: Right Float [SYN_MAP]
        const w2Start = project(0, 0, -130);
        const w2End = { x: w2Start.x + 70, y: w2Start.y - 20 };
        ctx.beginPath();
        ctx.moveTo(w2Start.x, w2Start.y);
        ctx.lineTo(w2End.x, w2End.y);
        ctx.lineTo(w2End.x + 10, w2End.y);
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)';
        ctx.stroke();

        const box2 = { x: w2End.x + 10, y: w2End.y - 14, w: 68, h: 24 };
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
        ctx.strokeRect(box2.x, box2.y, box2.w, box2.h);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.05)';
        ctx.fillRect(box2.x, box2.y, box2.w, box2.h);

        ctx.fillStyle = '#ffffff';
        ctx.fillText("SYN_MAP: 73%", box2.x + 4, box2.y + 9);
        ctx.fillText("LATENCY: 2.4", box2.x + 4, box2.y + 17);

        // Widget 3: Top Left [SECTOR-NX]
        const w3Start = project(0, 0, -190);
        const w3End = { x: w3Start.x - 50, y: w3Start.y - 10 };
        ctx.beginPath();
        ctx.moveTo(w3Start.x, w3Start.y);
        ctx.lineTo(w3End.x, w3End.y);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
        ctx.stroke();

        ctx.fillStyle = '#8b5cf6';
        ctx.font = '700 6.5px Share Tech Mono, monospace';
        ctx.textAlign = 'right';
        ctx.fillText("[SECTOR-NX7 LOCKED]", w3End.x - 4, w3End.y + 2);

        ctx.restore();
      }
    }

    // G. Core center glowing ball (fades in Phase 2, is maximum bright in Phase 3/4)
    ctx.beginPath();
    const corePt = project(0, 0, 0);
    const radiusScale = phase >= 3 ? 1.6 : (phase === 2 ? (1 + (progress - 40) / 20 * 0.6) : 1);
    const coreGrad = ctx.createRadialGradient(corePt.x, corePt.y, 0, corePt.x, corePt.y, 35 * scale * radiusScale);
    
    // Gradient coloring shifts from Cyan -> Violet -> White Core
    coreGrad.addColorStop(0, '#ffffff');
    if (phase >= 3) {
      coreGrad.addColorStop(0.15, '#ffffff');
      coreGrad.addColorStop(0.35, 'rgba(244, 63, 94, 0.85)'); // Pink/magenta glow core
      coreGrad.addColorStop(0.7, 'rgba(139, 92, 246, 0.2)');
    } else {
      coreGrad.addColorStop(0.2, 'rgba(6, 182, 212, 0.8)'); // Cyan core
      coreGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.25)');
    }
    coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.arc(corePt.x, corePt.y, 35 * scale * radiusScale, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.fill();

    // H. Progress loader logic
    progress += 0.42; // Speeds: takes about 4 seconds to boot
    if (progress > 100) progress = 100;

    // Update Percentage elements
    const formatPct = String(Math.floor(progress)).padStart(2, '0');
    if (pctElem) pctElem.textContent = formatPct;
    if (barElem) barElem.style.width = `${progress}%`;

    // Process logs text outputs
    bootLogs.forEach((log, logIdx) => {
      if (progress >= log.threshold && logIdx > activeLogIndex) {
        activeLogIndex = logIdx;
        const line = document.createElement('div');
        line.innerHTML = log.text;
        if (logsElem) {
          logsElem.appendChild(line);
          logsElem.scrollTop = logsElem.scrollHeight;
        }
      }
    });

    // Check preloader completion
    if (progress >= 100) {
      setTimeout(() => {
        container.classList.add('fade-out');
        cancelAnimationFrame(animationId);
        
        setTimeout(() => {
          container.remove();
        }, 1000);
      }, 600);
      return;
    }

    animationId = requestAnimationFrame(draw);
  }

  // Bind resizers & Initializers
  window.addEventListener('resize', resize);
  resize();
  buildGalaxy();
  draw();
}

