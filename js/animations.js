/* ============================================================
   ANIMATIONS.JS — Circuit Board Background (Black + Green)
   ============================================================ */

(function () {
  const canvas = document.getElementById('ai-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, nodes, pulses, animId;
  const NODE_CNT = 22;      // circuit junction nodes
  const SEGMENT_L = 60;      // max segment length
  const GRID = 40;      // snap grid

  /* ---------- helpers ---------- */
  function snap(v) { return Math.round(v / GRID) * GRID; }
  function rand(n) { return Math.floor(Math.random() * n); }
  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  function isDark() { return document.body.classList.contains('dark-mode'); }

  /* ---------- Node ---------- */
  class Node {
    constructor() { this.reset(); }
    reset() {
      this.x = snap(rand(Math.ceil(W / GRID)) * GRID);
      this.y = snap(rand(Math.ceil(H / GRID)) * GRID);
      this.r = Math.random() * 2.5 + 1;
      this.a = Math.random() * 0.5 + 0.2;
      // Build 2-4 axis-aligned path segments
      this.segments = [];
      let cx = this.x, cy = this.y;
      const segCount = rand(3) + 2;
      for (let i = 0; i < segCount; i++) {
        const horiz = rand(2) === 0;
        const dir = rand(2) === 0 ? 1 : -1;
        const len = (rand(4) + 2) * GRID * 0.5 * dir;
        const nx = snap(horiz ? cx + len : cx);
        const ny = snap(horiz ? cy : cy + len);
        if (nx >= 0 && nx <= W && ny >= 0 && ny <= H) {
          this.segments.push({ x1: cx, y1: cy, x2: nx, y2: ny });
          cx = nx; cy = ny;
        }
      }
      this.endX = cx; this.endY = cy;
    }
  }

  /* ---------- Pulse (glowing dot traveling along a segment) ---------- */
  class Pulse {
    constructor(node, segIdx) {
      this.node = node;
      this.seg = node.segments[segIdx];
      this.t = 0;
      this.speed = Math.random() * 0.006 + 0.003;
      this.r = Math.random() * 2 + 1.5;
      this.done = false;
    }
    update() {
      this.t += this.speed;
      if (this.t >= 1) this.done = true;
    }
    draw() {
      if (!this.seg) return;
      const x = this.seg.x1 + (this.seg.x2 - this.seg.x1) * this.t;
      const y = this.seg.y1 + (this.seg.y2 - this.seg.y1) * this.t;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, this.r * 4);
      grad.addColorStop(0, 'rgba(34,197,94,0.9)');
      grad.addColorStop(0.4, 'rgba(34,197,94,0.3)');
      grad.addColorStop(1, 'rgba(34,197,94,0)');
      ctx.beginPath();
      ctx.arc(x, y, this.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, this.r * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.fill();
    }
  }

  /* ---------- Build initial scene ---------- */
  function init() {
    resize();
    nodes = Array.from({ length: NODE_CNT }, () => new Node());
    pulses = [];
  }

  /* ---------- Draw one frame ---------- */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw circuit lines
    nodes.forEach(node => {
      node.segments.forEach(seg => {
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.strokeStyle = isDark()
          ? 'rgba(34,197,94,0.12)'
          : 'rgba(34,197,94,0.18)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // Junction dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark()
        ? `rgba(34,197,94,${node.a})`
        : `rgba(34,197,94,${node.a * 0.8})`;
      ctx.fill();

      // End dot
      if (node.endX !== node.x || node.endY !== node.y) {
        ctx.beginPath();
        ctx.arc(node.endX, node.endY, node.r * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = isDark() ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.15)';
        ctx.fill();
      }
    });

    // Spawn new pulses randomly
    if (Math.random() < 0.04 && nodes.length) {
      const node = nodes[rand(nodes.length)];
      if (node.segments.length) {
        pulses.push(new Pulse(node, rand(node.segments.length)));
      }
    }

    // Update + draw pulses
    pulses = pulses.filter(p => !p.done);
    pulses.forEach(p => { p.update(); p.draw(); });

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    nodes.forEach(n => n.reset());
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { init(); draw(); });
  } else { init(); draw(); }
})();
