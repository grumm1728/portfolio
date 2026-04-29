const projects = [
  {
    title: "Kids Parents Contact App (work in progress)",
    description: "Exploring views of your kids' friends' parents contact info.",
    url: "https://grumm1728.github.io/myKidsFriendsParents/",
    thumbnail: "phone",
  },
  {
    title: "Velocity Game",
    description: "Can AI build a Calculus manipulative on the fly?",
    url: "https://grumm1728.github.io/velocitygame/",
    thumbnail: "game",
  },
  {
    title: "Split Coins",
    description:
      "How might we take ideas from Bret Victor's Ladder of Abstraction and interactively illustrate problems and solutions?",
    url: "https://grumm1728.github.io/splitcoins/",
    thumbnail: "coins",
  },
  {
    title: "Write Spacer",
    description:
      "Teachers want to turn problems into worksheets. An experiment in improving teacher workflow.",
    url: "https://grumm1728.github.io/writespacer/",
    thumbnail: "writing",
  },
  {
    title: "Teacher Flow Interactive Slides",
    description:
      "A product case study on keeping interactive lessons inside the rhythm of classroom instruction.",
    url: "teacher-flow.html",
    thumbnail: "teacherFlow",
    local: true,
  },
];

const thumbnails = {
  phone: `
    <svg viewBox="0 0 240 132" aria-hidden="true">
      <rect x="38" y="12" width="58" height="108" rx="6"></rect>
      <circle cx="67" cy="48" r="10"></circle>
      <path d="M52 72h30M52 88h30M52 104h30M112 36h82M112 58h70M112 80h88M112 102h62"></path>
    </svg>`,
  chart: `
    <svg viewBox="0 0 240 132" aria-hidden="true">
      <path d="M20 108h196"></path>
      <path d="M32 96 82 70l42-24 34 14 50-34"></path>
      <rect x="44" y="78" width="22" height="30"></rect>
      <rect x="94" y="64" width="22" height="44"></rect>
      <rect x="144" y="48" width="22" height="60"></rect>
    </svg>`,
  network: `
    <svg viewBox="0 0 240 132" aria-hidden="true">
      <circle cx="52" cy="62" r="18"></circle>
      <circle cx="124" cy="34" r="18"></circle>
      <circle cx="180" cy="86" r="18"></circle>
      <circle cx="92" cy="100" r="14"></circle>
      <path d="M69 56 107 40M139 46l27 27M68 75l14 16M106 94l56-7M118 52l-20 36"></path>
    </svg>`,
  game: `
    <svg viewBox="0 0 240 132" aria-hidden="true">
      <path d="M32 96c24-46 46-58 66-36 14 16 27 17 42 1 20-21 41-13 68 28"></path>
      <circle cx="72" cy="74" r="10"></circle>
      <path d="M166 36h28M180 22v28M46 106h148"></path>
    </svg>`,
  coins: `
    <svg viewBox="0 0 240 132" aria-hidden="true">
      <ellipse cx="74" cy="52" rx="36" ry="18"></ellipse>
      <path d="M38 52v34c0 10 16 18 36 18s36-8 36-18V52"></path>
      <ellipse cx="154" cy="44" rx="36" ry="18"></ellipse>
      <path d="M118 44v42c0 10 16 18 36 18s36-8 36-18V44M74 64c20 0 36-8 36-18M154 58c20 0 36-8 36-18"></path>
    </svg>`,
  writing: `
    <svg viewBox="0 0 240 132" aria-hidden="true">
      <path d="M38 28h122M38 50h164M38 72h142M38 94h96"></path>
      <path d="m150 100 48-48 16 16-48 48-24 8zM190 60l16 16"></path>
    </svg>`,
  teacherFlow: `
    <svg viewBox="0 0 240 132" aria-hidden="true">
      <path d="M24 98h88M138 98h78"></path>
      <path d="M42 32h70v50H42zM136 22h78v58h-78z"></path>
      <path d="M54 46h42M54 60h32M148 38h52M148 52h38"></path>
      <path d="M112 56c16-8 16-8 24-8"></path>
      <path d="m128 41 10 7-10 7"></path>
      <circle cx="74" cy="108" r="11"></circle>
      <circle cx="176" cy="108" r="11"></circle>
    </svg>`,
};

const projectGrid = document.querySelector("#project-grid");

projectGrid.innerHTML = projects
  .map(
    (project) => `
      <a class="project-card" href="${project.url}"${project.local ? "" : ' target="_blank" rel="noreferrer"'}>
        <span class="thumbnail">${thumbnails[project.thumbnail]}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <span class="project-arrow" aria-hidden="true">-&gt;</span>
      </a>
    `,
  )
  .join("");

const diagonalCanvas = document.querySelector("#diagonal-canvas");
const ctx = diagonalCanvas.getContext("2d");

const colors = {
  polygon: "#993300",
  ae: "#ff7f00",
  be: "#004dff",
  ce: "#ff00cc",
  de: "#1f7a32",
  point: "#202020",
};

const applet = {
  A: { x: 0, y: 0 },
  B: { x: 1, y: 2 },
  C: { x: 4.35, y: 2.05 },
  D: { x: 5, y: 0 },
  dragging: false,
  hasDragged: false,
  floatStart: performance.now(),
  floatCenter: { x: 4.35, y: 2.05 },
  transform: null,
};

const snapTargets = [
  { x: 4, y: 2 },
  { x: 6, y: 2 },
];

function resizeDiagonalCanvas() {
  const rect = diagonalCanvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  diagonalCanvas.width = Math.round(rect.width * dpr);
  diagonalCanvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawDiagonalApplet();
}

function getTransform() {
  const rect = diagonalCanvas.getBoundingClientRect();
  const world = { minX: -1.9, maxX: 6.95, minY: -0.45, maxY: 3.25 };
  const pad = { left: 24, right: 20, top: 30, bottom: 28 };
  const scale = Math.min(
    (rect.width - pad.left - pad.right) / (world.maxX - world.minX),
    (rect.height - pad.top - pad.bottom) / (world.maxY - world.minY),
  );
  const extraX = rect.width - pad.left - pad.right - (world.maxX - world.minX) * scale;
  const extraY = rect.height - pad.top - pad.bottom - (world.maxY - world.minY) * scale;
  const offsetX = pad.left + extraX / 2 - world.minX * scale;
  const offsetY = pad.top + extraY / 2 + world.maxY * scale;

  return {
    width: rect.width,
    height: rect.height,
    scale,
    toScreen(point) {
      return {
        x: offsetX + point.x * scale,
        y: offsetY - point.y * scale,
      };
    },
    toWorld(point) {
      return {
        x: (point.x - offsetX) / scale,
        y: (offsetY - point.y) / scale,
      };
    },
  };
}

function intersection(p1, p2, p3, p4) {
  const dx1 = p2.x - p1.x;
  const dy1 = p2.y - p1.y;
  const dx2 = p4.x - p3.x;
  const dy2 = p4.y - p3.y;
  const denominator = dx1 * dy2 - dy1 * dx2;

  if (Math.abs(denominator) < 0.0001) {
    return null;
  }

  const t = ((p3.x - p1.x) * dy2 - (p3.y - p1.y) * dx2) / denominator;
  return {
    x: p1.x + t * dx1,
    y: p1.y + t * dy1,
  };
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function drawLine(a, b, color, width = 2) {
  const transform = applet.transform;
  const start = transform.toScreen(a);
  const end = transform.toScreen(b);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function drawPoint(point, label, options = {}) {
  const screen = applet.transform.toScreen(point);
  const radius = options.radius || 4;
  ctx.beginPath();
  ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = options.fill || colors.point;
  ctx.fill();

  if (options.ring) {
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, radius + 7, 0, Math.PI * 2);
    ctx.strokeStyle = options.ring;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  if (label) {
    ctx.fillStyle = options.labelColor || "#0b54b9";
    ctx.font = "16px Proxima Nova, Helvetica Neue, Arial, sans-serif";
    ctx.fillText(label, screen.x + 7, screen.y - 8);
  }
}

function drawGrid() {
  const { width, height, toScreen } = applet.transform;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  ctx.lineWidth = 1;

  for (let x = Math.floor(-2); x <= 7; x += 0.2) {
    const screenX = toScreen({ x, y: 0 }).x;
    ctx.beginPath();
    ctx.moveTo(screenX, 0);
    ctx.lineTo(screenX, height);
    ctx.strokeStyle = Number.isInteger(Math.round(x * 10) / 10)
      ? "rgba(18, 18, 18, 0.18)"
      : "rgba(18, 18, 18, 0.08)";
    ctx.stroke();
  }

  for (let y = Math.floor(-1); y <= 4; y += 0.2) {
    const screenY = toScreen({ x: 0, y }).y;
    ctx.beginPath();
    ctx.moveTo(0, screenY);
    ctx.lineTo(width, screenY);
    ctx.strokeStyle = Number.isInteger(Math.round(y * 10) / 10)
      ? "rgba(18, 18, 18, 0.18)"
      : "rgba(18, 18, 18, 0.08)";
    ctx.stroke();
  }

  const origin = toScreen({ x: 0, y: 0 });
  ctx.strokeStyle = "rgba(18, 18, 18, 0.24)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, origin.y);
  ctx.lineTo(width, origin.y);
  ctx.moveTo(origin.x, 0);
  ctx.lineTo(origin.x, height);
  ctx.stroke();
}

function drawLengthBar(x, length, color) {
  const base = { x, y: 0 };
  const top = { x, y: length };
  drawLine(base, top, color, 4);
  drawPoint(base, "", { radius: 3, fill: colors.point });
  drawPoint(top, "", { radius: 3, fill: colors.point });
}

function isConcave(A, B, C, D) {
  const lineY = B.y + ((D.y - B.y) * (C.x - B.x)) / (D.x - B.x);
  return C.y < lineY;
}

function snapHint(C) {
  let closest = null;
  for (const target of snapTargets) {
    const d = distance(C, target);
    if (!closest || d < closest.distance) {
      closest = { target, distance: d };
    }
  }
  return closest;
}

function drawSnapTarget(target, distanceToC) {
  const screen = applet.transform.toScreen(target);
  const glow = Math.max(0, 1 - distanceToC / 0.55);
  ctx.beginPath();
  ctx.arc(screen.x, screen.y, 10 + glow * 9, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(11, 84, 185, ${0.22 + glow * 0.46})`;
  ctx.lineWidth = 2 + glow * 2;
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  ctx.setLineDash([]);

}

function drawDragArrow() {
  if (applet.hasDragged) {
    return;
  }

  const start = { x: applet.transform.width - 80, y: 42 };
  const c = applet.transform.toScreen(applet.C);
  const end = { x: c.x + 12, y: c.y - 14 };

  ctx.save();
  ctx.strokeStyle = colors.blue || "#0b54b9";
  ctx.fillStyle = "#0b54b9";
  ctx.lineWidth = 2.5;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.bezierCurveTo(start.x - 30, start.y + 28, end.x + 50, end.y - 32, end.x, end.y);
  ctx.stroke();

  const angle = Math.atan2(end.y - (start.y + 24), end.x - (start.x - 10));
  ctx.beginPath();
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(end.x - Math.cos(angle - 0.55) * 14, end.y - Math.sin(angle - 0.55) * 14);
  ctx.lineTo(end.x - Math.cos(angle + 0.55) * 14, end.y - Math.sin(angle + 0.55) * 14);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDiagonalApplet() {
  applet.transform = getTransform();
  const { A, B, C, D } = applet;
  const E = intersection(B, D, A, C);
  const concave = isConcave(A, B, C, D);

  drawGrid();

  for (const target of snapTargets) {
    drawSnapTarget(target, distance(C, target));
  }

  if (!E) {
    return;
  }

  const poly = [A, B, C, D].map((point) => applet.transform.toScreen(point));
  ctx.beginPath();
  ctx.moveTo(poly[0].x, poly[0].y);
  for (const point of poly.slice(1)) {
    ctx.lineTo(point.x, point.y);
  }
  ctx.closePath();
  ctx.fillStyle = "rgba(153, 51, 0, 0.1)";
  ctx.strokeStyle = colors.polygon;
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  if (!concave) {
    drawLine(A, E, colors.ae, 2);
    drawLine(B, E, colors.be, 2);
    drawLine(C, E, colors.ce, 2);
    drawLine(D, E, colors.de, 2);

    drawLengthBar(-1.5, distance(A, E), colors.ae);
    drawLengthBar(-1.25, distance(C, E), colors.ce);
    drawLengthBar(-0.95, distance(B, E), colors.be);
    drawLengthBar(-0.7, distance(D, E), colors.de);
  }

  drawPoint(A, "A", { labelColor: "#004dff" });
  drawPoint(B, "B", { labelColor: "#004dff" });
  drawPoint(C, "C", { radius: 5, fill: "#ff0000", ring: "#ff0000", labelColor: "#ff0000" });
  drawPoint(D, "D", { labelColor: "#004dff" });
  if (!concave) {
    drawPoint(E, "E", { fill: "#444", labelColor: "#444" });
  }
  drawDragArrow();
}

function pointerPosition(event) {
  const rect = diagonalCanvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function clampC(point) {
  const theta = Math.atan2(applet.B.y - applet.A.y, applet.B.x - applet.A.x);
  const rawAngle = Math.atan2(point.y - applet.A.y, point.x - applet.A.x);
  const angle = Math.max(0, Math.min(theta, rawAngle));
  const maxRadius = 7.1;
  const radius = Math.max(0.08, Math.min(maxRadius, Math.hypot(point.x, point.y)));
  const clamped = {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
  const hint = snapHint(clamped);

  if (hint.distance < 0.22) {
    return { ...hint.target };
  }

  return clamped;
}

diagonalCanvas.addEventListener("pointerdown", (event) => {
  const position = pointerPosition(event);
  const cScreen = applet.transform.toScreen(applet.C);
  const nearC = Math.hypot(position.x - cScreen.x, position.y - cScreen.y) < 28;

  if (nearC) {
    applet.dragging = true;
    applet.hasDragged = true;
    diagonalCanvas.setPointerCapture(event.pointerId);
    diagonalCanvas.style.cursor = "grabbing";
  }
});

diagonalCanvas.addEventListener("pointermove", (event) => {
  if (!applet.dragging) {
    return;
  }

  applet.C = clampC(applet.transform.toWorld(pointerPosition(event)));
  drawDiagonalApplet();
});

function stopDragging(event) {
  if (!applet.dragging) {
    return;
  }

  applet.dragging = false;
  diagonalCanvas.releasePointerCapture(event.pointerId);
  diagonalCanvas.style.cursor = "grab";
}

diagonalCanvas.addEventListener("pointerup", stopDragging);
diagonalCanvas.addEventListener("pointercancel", stopDragging);
window.addEventListener("resize", resizeDiagonalCanvas);

resizeDiagonalCanvas();

function floatBeforeDrag() {
  if (!applet.hasDragged && !applet.dragging) {
    const t = (performance.now() - applet.floatStart) / 1000;
    applet.C = clampC({
      x: applet.floatCenter.x + Math.sin(t * 0.9) * 0.08,
      y: applet.floatCenter.y + Math.cos(t * 0.7) * 0.06,
    });
    drawDiagonalApplet();
  }

  requestAnimationFrame(floatBeforeDrag);
}

floatBeforeDrag();
