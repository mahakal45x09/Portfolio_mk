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
  const numParticles = 900;
  
  // Projection variables
  const tiltAngle = 68 * Math.PI / 180; // 68 degree Y-axis tilt for perspective grid
  const scale = 1.1;

  // Log sequence checkpoints
  const bootLogs = [
    { threshold: 0, text: "&gt; INITIALIZING SYNAPSE-NX7 DIAGNOSTICS BOOT..." },
    { threshold: 10, text: "&gt; ESTABLISHING QUANTUM CORE TELEMETRY PORT..." },
    { threshold: 22, text: "&gt; PARSING CONVOLUTIONAL SYNAPTIC PATHWAYS... OK" },
    { threshold: 38, text: "&gt; LOADING ATTENTION LAYERS DECODING BUFFER... [64 HEADS]" },
    { threshold: 55, text: "&gt; ALLOCATING RESIDUAL CONNECTION MEMORY MATRIX... [SUCCESS]" },
    { threshold: 72, text: "&gt; VERIFYING INFERENCE Latency: NOMINAL // 2.4ms" },
    { threshold: 85, text: "&gt; ALIGNING HOLOGRAM TELEMETRY GRID MATRIX..." },
    { threshold: 97, text: "&gt; SYNAPSTIC CORE NOMINAL. INITIALIZING OVERVIEW DISPLAY..." }
  ];
  let activeLogIndex = -1;

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
      // Core density distribution: distribute points closer to the center
      const r = Math.pow(Math.random(), 2.2) * 230 + 5;
      const arm = Math.floor(Math.random() * 2); // 2 Spiral Arms
      const baseAngle = arm * Math.PI + r * 0.02; // Spiral math
      const spread = (Math.random() - 0.5) * 0.45;
      
      // Vertical core thickness (fluffiness) decays farther out
      const maxZ = Math.max(2, 28 * (1 - r / 245));
      const z = (Math.random() - 0.5) * maxZ;

      particles.push({
        r: r,
        theta: baseAngle + spread,
        z: z,
        speed: 0.003 + (1 / (r + 20)) * 0.35, // Keplerian orbit: closer rotates faster
        size: 0.6 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  // Define vertical indicators (similar to reference image HUD labels)
  let hudIndicators = [
    { r: 40, arm: 0, height: 100, label: "CORE_ACTIVE: 99.8%", angleOffset: 0.2 },
    { r: 120, arm: 1, height: 160, label: "MAPPING_SYNAPSES: 73%", angleOffset: 0.8 },
    { r: 70, arm: 0, height: 80, label: "SYS_TEMP: NOMINAL", angleOffset: 1.4 },
    { r: 160, arm: 1, height: 120, label: "LATENCY: 2.4ms", angleOffset: -0.5 }
  ];

  // 3. Render Loop
  function draw() {
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    const cx = w / 2;
    const cy = h / 2 - 30; // Shift center up slightly for layout aesthetics

    ctx.clearRect(0, 0, w, h);

    // Grid details
    const cosTilt = Math.cos(tiltAngle);
    const sinTilt = Math.sin(tiltAngle);

    // Coordinate Projection Function
    function project(rx, ry, rz) {
      // Perspective projection parameters
      const px = rx * scale;
      // orthographic scale with Y compressed by tilt
      const py = (ry * cosTilt + rz * sinTilt) * scale;
      return { x: cx + px, y: cy + py };
    }

    // A. Draw concentric grid ellipses underneath the galaxy core
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
    ctx.lineWidth = 1;
    for (let radius = 50; radius <= 250; radius += 50) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * scale, radius * scale * cosTilt, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // B. Draw Concentric Radar Circular Dials at Galaxy Core
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 15]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, 35 * scale, 35 * scale * cosTilt, 0, progress * 0.015, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(244, 63, 94, 0.12)';
    ctx.setLineDash([40, 20]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, 80 * scale, 80 * scale * cosTilt, 0, -progress * 0.008, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // C. Draw Particles (Stars)
    particles.forEach(p => {
      p.theta += p.speed; // Rotation

      // Local 3D Coordinates
      const rx = p.r * Math.cos(p.theta);
      const ry = p.r * Math.sin(p.theta);
      
      const pt = project(rx, ry, p.z);

      // Render star particle
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, p.size, 0, Math.PI * 2);
      
      // Give core stars and white stars slight glows
      if (p.r < 30 || p.color === '#ffffff') {
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = p.color;
      }
      
      ctx.fill();
      ctx.shadowBlur = 0; // Reset
    });

    // D. Draw vertical hologram HUD lines (rising indicators)
    hudIndicators.forEach((ind, idx) => {
      // Calculate target indicator angle
      const theta = ind.arm * Math.PI + ind.r * 0.02 + progress * 0.005 + ind.angleOffset;
      const rx = ind.r * Math.cos(theta);
      const ry = ind.r * Math.sin(theta);

      // Bottom projection point (base of galaxy)
      const ptBase = project(rx, ry, 0);
      // Top projection point (height offset)
      const ptTop = project(rx, ry, -ind.height);

      // Color scheme alternate
      const accentColor = idx % 2 === 0 ? '#06b6d4' : '#f43f5e';
      const accentGlow = idx % 2 === 0 ? 'rgba(6, 182, 212, 0.5)' : 'rgba(244, 63, 94, 0.5)';

      // Draw vertical stem line
      ctx.beginPath();
      ctx.moveTo(ptBase.x, ptBase.y);
      ctx.lineTo(ptTop.x, ptTop.y);
      ctx.strokeStyle = idx % 2 === 0 ? 'rgba(6, 182, 212, 0.25)' : 'rgba(244, 63, 94, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw top horizontal branching indicator line
      const branchLength = idx % 2 === 0 ? 30 : -35;
      ctx.beginPath();
      ctx.moveTo(ptTop.x, ptTop.y);
      ctx.lineTo(ptTop.x + branchLength, ptTop.y);
      ctx.stroke();

      // Draw anchor indicator rings
      ctx.beginPath();
      ctx.arc(ptBase.x, ptBase.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(ptTop.x, ptTop.y, 2, 0, Math.PI * 2);
      ctx.fill();

      // Print indicator text label next to branch line
      ctx.fillStyle = '#f8fafc';
      ctx.font = '700 8px Share Tech Mono, monospace';
      ctx.textAlign = branchLength > 0 ? 'left' : 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(ind.label, ptTop.x + branchLength + (branchLength > 0 ? 4 : -4), ptTop.y);
    });

    // E. Draw bright glowing Core Center
    ctx.beginPath();
    const corePt = project(0, 0, 0);
    const grad = ctx.createRadialGradient(corePt.x, corePt.y, 0, corePt.x, corePt.y, 40 * scale);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.2, 'rgba(6, 182, 212, 0.7)');
    grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.arc(corePt.x, corePt.y, 40 * scale, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // F. Progress logic (count up loader)
    progress += 0.45; // Approximately 3.7 seconds to reach 100
    if (progress > 100) progress = 100;

    // Update Percentage elements
    const formatPct = String(Math.floor(progress)).padStart(2, '0');
    if (pctElem) pctElem.textContent = formatPct;
    if (barElem) barElem.style.width = `${progress}%`;

    // Process typewriter log terminal lines
    bootLogs.forEach((log, logIdx) => {
      if (progress >= log.threshold && logIdx > activeLogIndex) {
        activeLogIndex = logIdx;
        // Append new line to logs screen
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
        // Trigger fade out
        container.classList.add('fade-out');
        cancelAnimationFrame(animationId);
        
        // Remove panel from HTML layout after transition ends
        setTimeout(() => {
          container.remove();
        }, 1000);
      }, 500);
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

