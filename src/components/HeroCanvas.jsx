import { useEffect, useRef } from 'react';

// Animation de l'accueil : des lignes de données (groupes de petits points, comme les cellules
// d'une ligne de tableau) circulent vers un petit réseau de neurones qui s'illumine, puis
// l'activation atteint le bord de l'assistant. Canvas 2D natif, aucune bibliothèque.
//
// Sur grand écran, le flux va de gauche à droite (texte → assistant).
// Sur petit écran, il descend (texte en haut, assistant en bas).
// Coordonnées internes : u = axe du flux, v = axe transversal.

const CYAN = '61, 217, 235';
const AMBER = '255, 181, 71';
const BREAKPOINT = 900;

function rand(a, b) {
  return a + Math.random() * (b - a);
}

export default function HeroCanvas({ heroRef, sourceRef, targetRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    const source = sourceRef.current;
    const target = targetRef.current;
    if (!canvas || !hero || !source || !target) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = motionQuery.matches;

    let W = 0;
    let H = 0;
    let horizontal = true;
    let layers = []; // [[{u, v, act}]]
    let edges = []; // {from, to, layerIndex}
    let lanes = []; // {v, node}
    let packets = []; // lignes de données en vol
    let pulses = []; // impulsions sur les arêtes
    let outGlow = []; // {v, act} sur le bord de l'assistant
    let flowEnd = 0; // u de la couche d'entrée
    let dimUntil = 0; // u jusqu'où on passe sous le texte (points atténués)
    let spawnClock = 0;

    const P = (u, v) => (horizontal ? [u, v] : [v, u]);

    function layout() {
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 600 ? 1.5 : 2);
      const hr = hero.getBoundingClientRect();
      W = hr.width;
      H = hr.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      horizontal = window.innerWidth > BREAKPOINT;
      const sr = source.getBoundingClientRect();
      const tr = target.getBoundingClientRect();

      // a = fin du texte, b = début de l'assistant, le long du flux.
      let a;
      let b;
      let vMin; // étendue transversale de l'assistant
      let vMax;
      let vSpan; // étendue transversale totale
      if (horizontal) {
        a = sr.right - hr.left;
        b = tr.left - hr.left;
        vMin = tr.top - hr.top;
        vMax = tr.bottom - hr.top;
        vSpan = H;
      } else {
        a = sr.bottom - hr.top;
        b = tr.top - hr.top;
        vMin = tr.left - hr.left;
        vMax = tr.right - hr.left;
        vSpan = W;
      }
      if (b - a < 90) a = b - 90;

      const small = vSpan < 520;
      const counts = small ? [5, 4, 3] : [6, 5, 4];
      const us = [a + (b - a) * 0.12, a + (b - a) * 0.55, b - 8];
      // Couche d'entrée large, couches suivantes resserrées vers l'assistant : un entonnoir.
      const spreads = horizontal
        ? [
            [vSpan * 0.16, vSpan * 0.84],
            [vMin + (vMax - vMin) * 0.12, vMax - (vMax - vMin) * 0.12],
            [vMin + (vMax - vMin) * 0.22, vMax - (vMax - vMin) * 0.22],
          ]
        : [
            [vSpan * 0.1, vSpan * 0.9],
            [vMin + (vMax - vMin) * 0.12, vMax - (vMax - vMin) * 0.12],
            [vMin + (vMax - vMin) * 0.22, vMax - (vMax - vMin) * 0.22],
          ];

      layers = counts.map((n, li) => {
        const [lo, hi] = spreads[li];
        return Array.from({ length: n }, (_, i) => ({
          u: us[li],
          v: n === 1 ? (lo + hi) / 2 : lo + ((hi - lo) * i) / (n - 1),
          act: 0,
        }));
      });

      edges = [];
      for (let li = 0; li < layers.length - 1; li += 1) {
        layers[li].forEach((from) => {
          layers[li + 1].forEach((to) => edges.push({ from, to, layerIndex: li }));
        });
      }

      outGlow = layers[2].map((n) => ({ v: n.v, act: 0 }));
      flowEnd = us[0];
      dimUntil = a;
      lanes = layers[0].map((node) => ({ v: node.v, node }));
      packets = [];
      pulses = [];

      // Remplit la scène dès le départ, pour que la première image soit déjà « vivante ».
      const initial = small ? 6 : 9;
      for (let i = 0; i < initial; i += 1) spawnPacket(rand(0, flowEnd * 0.95));
      if (reduced) {
        layers.forEach((layer) => layer.forEach((n) => (n.act = Math.random() < 0.4 ? rand(0.5, 1) : 0)));
        outGlow.forEach((g) => (g.act = Math.random() < 0.5 ? 0.8 : 0));
      }
    }

    function spawnPacket(u0 = -40) {
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      if (!lane) return;
      const cells = 3 + Math.floor(Math.random() * 3);
      packets.push({
        u: u0,
        lane,
        // Décalage transversal de départ : la ligne converge vers son neurone d'entrée.
        v0: lane.v + rand(-60, 60),
        speed: rand(55, 95),
        cells,
      });
    }

    function fire(node, layerIndex) {
      node.act = 1;
      if (layerIndex >= layers.length - 1) {
        const g = outGlow[layers[layerIndex].indexOf(node)];
        if (g) g.act = 1;
        return;
      }
      const next = layers[layerIndex + 1];
      const k = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < k; i += 1) {
        const to = next[Math.floor(Math.random() * next.length)];
        pulses.push({ from: node, to, t: 0, layerIndex: layerIndex + 1, speed: rand(1.3, 1.9) });
      }
    }

    function update(dt) {
      spawnClock -= dt;
      const maxPackets = W < 600 ? 10 : 16;
      if (spawnClock <= 0 && packets.length < maxPackets) {
        spawnPacket();
        spawnClock = rand(0.35, 0.8);
      }

      for (let i = packets.length - 1; i >= 0; i -= 1) {
        const p = packets[i];
        p.u += p.speed * dt;
        if (p.u >= flowEnd) {
          fire(p.lane.node, 0);
          packets.splice(i, 1);
        }
      }

      for (let i = pulses.length - 1; i >= 0; i -= 1) {
        const p = pulses[i];
        p.t += p.speed * dt;
        if (p.t >= 1) {
          fire(p.to, p.layerIndex);
          pulses.splice(i, 1);
        }
      }

      const decay = Math.exp(-dt * 2.2);
      layers.forEach((layer) => layer.forEach((n) => (n.act *= decay)));
      outGlow.forEach((g) => (g.act *= Math.exp(-dt * 1.6)));
    }

    function packetV(p) {
      // Ligne droite puis convergence douce vers le neurone dans le dernier tiers.
      const k = Math.max(0, Math.min(1, (p.u - flowEnd * 0.6) / (flowEnd * 0.4)));
      const e = k * k * (3 - 2 * k);
      return p.v0 + (p.lane.v - p.v0) * e;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Arêtes du réseau, très discrètes au repos.
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${CYAN}, 0.08)`;
      ctx.beginPath();
      edges.forEach(({ from, to }) => {
        const [x1, y1] = P(from.u, from.v);
        const [x2, y2] = P(to.u, to.v);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      });
      ctx.stroke();

      // Impulsions : un trait lumineux qui parcourt l'arête.
      pulses.forEach((p) => {
        const [x1, y1] = P(p.from.u, p.from.v);
        const [x2, y2] = P(p.to.u, p.to.v);
        const t0 = Math.max(0, p.t - 0.25);
        ctx.strokeStyle = `rgba(${AMBER}, 0.55)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x1 + (x2 - x1) * t0, y1 + (y2 - y1) * t0);
        ctx.lineTo(x1 + (x2 - x1) * p.t, y1 + (y2 - y1) * p.t);
        ctx.stroke();
      });

      // Lignes de données : 3 à 5 « cellules » alignées dans le sens du flux.
      packets.forEach((p) => {
        const v = packetV(p);
        const fade = Math.min(1, Math.max(0, (p.u + 40) / 80));
        const under = p.u < dimUntil ? 0.3 : 0.75; // atténuées sous le texte
        ctx.fillStyle = `rgba(${CYAN}, ${under * fade})`;
        for (let c = 0; c < p.cells; c += 1) {
          const [x, y] = P(p.u - c * 7, v);
          ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        }
      });

      // Neurones : halo ambre selon l'activation.
      layers.forEach((layer) =>
        layer.forEach((n) => {
          const [x, y] = P(n.u, n.v);
          if (n.act > 0.02) {
            ctx.fillStyle = `rgba(${AMBER}, ${0.18 * n.act})`;
            ctx.beginPath();
            ctx.arc(x, y, 6 + 10 * n.act, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = n.act > 0.05 ? `rgba(${AMBER}, ${0.35 + 0.65 * n.act})` : '#0a1024';
          ctx.strokeStyle = `rgba(${CYAN}, 0.55)`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }),
      );

      // Le bord de l'assistant s'éclaire là où l'activation arrive.
      const edgeU = layers[2]?.[0]?.u + 8;
      outGlow.forEach((g) => {
        if (g.act < 0.02) return;
        const [x, y] = P(edgeU, g.v);
        const len = 46;
        const grad = horizontal
          ? ctx.createLinearGradient(x, y - len, x, y + len)
          : ctx.createLinearGradient(x - len, y, x + len, y);
        grad.addColorStop(0, `rgba(${AMBER}, 0)`);
        grad.addColorStop(0.5, `rgba(${AMBER}, ${0.8 * g.act})`);
        grad.addColorStop(1, `rgba(${AMBER}, 0)`);
        ctx.fillStyle = grad;
        if (horizontal) ctx.fillRect(x - 2, y - len, 3, len * 2);
        else ctx.fillRect(x - len, y - 2, len * 2, 3);
      });
    }

    let raf = 0;
    let last = 0;
    let onScreen = true;

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      update(dt);
      draw();
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (raf || reduced || !onScreen || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    function relayout() {
      layout();
      draw();
    }

    relayout();
    start();

    // Recalcule quand la taille change (fenêtre, polices chargées, assistant qui s'agrandit).
    let pending = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(relayout);
    });
    ro.observe(hero);
    ro.observe(target);

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    io.observe(hero);

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    document.addEventListener('visibilitychange', onVisibility);

    function onMotionChange(e) {
      reduced = e.matches;
      if (reduced) {
        stop();
        relayout();
      } else {
        start();
      }
    }
    motionQuery.addEventListener('change', onMotionChange);

    return () => {
      stop();
      cancelAnimationFrame(pending);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      motionQuery.removeEventListener('change', onMotionChange);
    };
  }, [heroRef, sourceRef, targetRef]);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
