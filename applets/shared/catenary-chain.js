(function () {
  function initCatenaryChain(selector) {
    const canvas = document.querySelector(selector);
    const controls = document.querySelector("#catenary-controls");

    if (!canvas || !controls) {
      return null;
    }

    const ctx = canvas.getContext("2d");
    const fields = {
      length: controls.querySelector("#chain-length"),
      lengthValue: controls.querySelector("#chain-length-value"),
      trace: controls.querySelector("#trace-n"),
      clearTrace: controls.querySelector("#clear-trace"),
      reset: controls.querySelector("#reset-chain"),
    };

    const colors = {
      ink: "#121212",
      blue: "#0b54b9",
      grid: "rgba(78, 166, 224, 0.18)",
      gridBold: "rgba(78, 166, 224, 0.26)",
      region: "rgba(11, 84, 185, 0.055)",
      chain: "#121212",
      point: "#d01818",
      trace: "#ff7f00",
      soft: "rgba(18, 18, 18, 0.58)",
    };

    const defaults = {
      S: 6,
      B: { x: 4.1, y: 1.1 },
      traceEnabled: false,
    };

    const state = {
      S: defaults.S,
      B: { ...defaults.B },
      floatCenter: { ...defaults.B },
      floatStart: performance.now(),
      frameId: null,
      hasDragged: false,
      traceEnabled: defaults.traceEnabled,
      trace: [],
      dragging: false,
      transform: null,
    };

    const minX = 0.2;
    const slackRatio = 0.01;
    const maxTracePoints = 1200;

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function getTransform() {
      const rect = canvas.getBoundingClientRect();
      const radius = state.S;
      const world = {
        minX: -0.75,
        maxX: radius + 0.75,
        minY: -radius - 0.75,
        maxY: radius + 0.65,
      };
      const pad = { left: 34, right: 24, top: 26, bottom: 34 };
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
        world,
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

    function clampB(point) {
      const slack = slackForLength();
      const maxRadius = Math.max(minX + 0.02, state.S - slack);
      let x = Math.max(minX, point.x);
      let y = point.y;

      if (Math.hypot(x, y) > maxRadius) {
        const angle = Math.atan2(y, x);
        x = Math.cos(angle) * maxRadius;
        y = Math.sin(angle) * maxRadius;
      }

      if (x < minX) {
        x = minX;
        const maxY = Math.sqrt(Math.max(0, maxRadius * maxRadius - minX * minX));
        y = Math.max(-maxY, Math.min(maxY, y));
      }

      return { x, y };
    }

    function clampCurrentB() {
      state.B = clampB(state.B);
    }

    function slackForLength() {
      return state.S * slackRatio;
    }

    function sinhOver(value) {
      if (Math.abs(value) < 1e-7) {
        return 1 + (value * value) / 6;
      }
      return Math.sinh(value) / value;
    }

    function solveQ(ratio) {
      if (ratio <= 1 + 1e-8) {
        return Math.sqrt(Math.max(0, 6 * (ratio - 1)));
      }

      let low = 0;
      let high = Math.max(1, Math.sqrt(6 * (ratio - 1)));

      while (sinhOver(high) < ratio && high < 80) {
        high *= 2;
      }

      for (let index = 0; index < 70; index += 1) {
        const mid = (low + high) / 2;
        if (sinhOver(mid) < ratio) {
          low = mid;
        } else {
          high = mid;
        }
      }

      return (low + high) / 2;
    }

    function atanh(value) {
      const clamped = Math.max(-0.999999999, Math.min(0.999999999, value));
      return 0.5 * Math.log((1 + clamped) / (1 - clamped));
    }

    function solveCatenary() {
      const h = state.B.x;
      const v = state.B.y;
      const distance = Math.hypot(h, v);
      const slack = slackForLength();
      const S = Math.max(state.S, distance + slack);
      const horizontalLength = Math.sqrt(Math.max(h * h, S * S - v * v));
      const ratio = Math.max(1 + 1e-9, horizontalLength / h);
      const q = solveQ(ratio);
      const a = q > 1e-9 ? h / (2 * q) : h / (2 * 1e-9);
      const c = h / 2 - a * atanh(v / S);
      const b = -a * Math.cosh(c / a);
      const N = lowestPoint({ a, b, c, h, v });

      return {
        a,
        b,
        c,
        h,
        v,
        S,
        N,
        yAt(x) {
          return a * Math.cosh((x - c) / a) + b;
        },
      };
    }

    function lowestPoint(solution) {
      if (solution.c >= 0 && solution.c <= solution.h) {
        return { x: solution.c, y: solution.a + solution.b };
      }
      return solution.c < 0 ? { x: 0, y: 0 } : { x: solution.h, y: solution.v };
    }

    function fmt(value) {
      return Number(value.toFixed(2)).toString();
    }

    function syncControls() {
      fields.length.value = fmt(state.S);
      fields.lengthValue.value = fmt(state.S);
      fields.trace.checked = state.traceEnabled;
    }

    function sampleCurve(solution, count = 150) {
      return Array.from({ length: count + 1 }, (_, index) => {
        const x = (solution.h * index) / count;
        return { x, y: solution.yAt(x) };
      });
    }

    function drawGrid() {
      const { width, height, world, toScreen } = state.transform;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, width, height);
      ctx.lineWidth = 1;

      const xStart = Math.floor(world.minX);
      const xEnd = Math.ceil(world.maxX);
      const yStart = Math.floor(world.minY);
      const yEnd = Math.ceil(world.maxY);

      for (let x = xStart; x <= xEnd; x += 1) {
        const screenX = toScreen({ x, y: 0 }).x;
        ctx.beginPath();
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, height);
        ctx.strokeStyle = colors.gridBold;
        ctx.stroke();
      }

      for (let y = yStart; y <= yEnd; y += 1) {
        const screenY = toScreen({ x: 0, y }).y;
        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(width, screenY);
        ctx.strokeStyle = colors.gridBold;
        ctx.stroke();
      }

      const origin = toScreen({ x: 0, y: 0 });
      ctx.strokeStyle = "rgba(18, 18, 18, 0.32)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, origin.y);
      ctx.lineTo(width, origin.y);
      ctx.moveTo(origin.x, 0);
      ctx.lineTo(origin.x, height);
      ctx.stroke();
    }

    function drawFeasibleRegion() {
      const slack = slackForLength();
      const radius = state.S - slack;
      const theta = Math.acos(Math.min(1, minX / radius));
      const top = { x: minX, y: Math.sin(theta) * radius };
      const bottom = { x: minX, y: -Math.sin(theta) * radius };
      const start = state.transform.toScreen(top);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      for (let i = 0; i <= 96; i += 1) {
        const angle = theta - (2 * theta * i) / 96;
        const point = state.transform.toScreen({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        });
        ctx.lineTo(point.x, point.y);
      }
      const end = state.transform.toScreen(bottom);
      ctx.lineTo(end.x, end.y);
      ctx.closePath();
      ctx.fillStyle = colors.region;
      ctx.fill();
      ctx.strokeStyle = "rgba(11, 84, 185, 0.38)";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 7]);
      ctx.stroke();
      ctx.restore();
    }

    function drawPath(points, color, width, options = {}) {
      if (points.length < 2) {
        return;
      }
      ctx.save();
      ctx.beginPath();
      const first = state.transform.toScreen(points[0]);
      ctx.moveTo(first.x, first.y);
      for (const point of points.slice(1)) {
        const screen = state.transform.toScreen(point);
        ctx.lineTo(screen.x, screen.y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (options.dash) {
        ctx.setLineDash(options.dash);
      }
      ctx.globalAlpha = options.alpha ?? 1;
      ctx.stroke();
      ctx.restore();
    }

    function drawTrace() {
      if (state.trace.length < 2) {
        return;
      }
      drawPath(state.trace, colors.trace, 2.4, { alpha: 0.74 });
      for (const point of state.trace) {
        const screen = state.transform.toScreen(point);
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 127, 0, 0.52)";
        ctx.fill();
      }
    }

    function drawPoint(point, label, options = {}) {
      const screen = state.transform.toScreen(point);
      const radius = options.radius || 5;

      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = options.fill || colors.ink;
      ctx.fill();

      if (options.ring) {
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, radius + 8, 0, Math.PI * 2);
        ctx.strokeStyle = options.ring;
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      ctx.fillStyle = options.labelColor || colors.blue;
      ctx.font = "700 17px Proxima Nova, Helvetica Neue, Arial, sans-serif";
      ctx.fillText(label, screen.x + (options.labelX ?? 9), screen.y + (options.labelY ?? -9));
    }

    function drawDragArrow() {
      if (state.hasDragged) {
        return;
      }

      const b = state.transform.toScreen(state.B);
      const start = { x: state.transform.width - 116, y: 38 };
      const end = { x: b.x + 15, y: b.y - 18 };

      ctx.save();
      ctx.strokeStyle = colors.blue;
      ctx.fillStyle = colors.blue;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.bezierCurveTo(start.x - 56, start.y + 34, end.x + 54, end.y - 44, end.x, end.y);
      ctx.stroke();

      const angle = Math.atan2(end.y - (start.y + 18), end.x - (start.x - 18));
      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(end.x - Math.cos(angle - 0.55) * 14, end.y - Math.sin(angle - 0.55) * 14);
      ctx.lineTo(end.x - Math.cos(angle + 0.55) * 14, end.y - Math.sin(angle + 0.55) * 14);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function drawChain(solution) {
      const curve = sampleCurve(solution);
      drawPath([{ x: 0, y: 0 }, state.B], "rgba(11, 84, 185, 0.38)", 1.8, { dash: [7, 8] });
      drawPath(curve, "rgba(18, 18, 18, 0.18)", 8);
      drawPath(curve, colors.chain, 4.2);

      for (let index = 12; index < curve.length; index += 12) {
        const point = state.transform.toScreen(curve[index]);
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
      }
    }

    function draw() {
      clampCurrentB();
      const solution = solveCatenary();
      state.transform = getTransform();

      drawGrid();
      drawFeasibleRegion();
      drawTrace();
      drawChain(solution);
      drawPoint({ x: 0, y: 0 }, "A", { labelColor: colors.ink, labelX: -18, labelY: -10 });
      drawPoint(state.B, "B", {
        radius: 5,
        fill: colors.point,
        ring: colors.point,
        labelColor: colors.point,
      });
      drawPoint(solution.N, "N", {
        radius: 5,
        fill: colors.trace,
        labelColor: colors.trace,
      });
      drawDragArrow();
    }

    function pointerPosition(event) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }

    function nearB(event) {
      const position = pointerPosition(event);
      const bScreen = state.transform.toScreen(state.B);
      return Math.hypot(position.x - bScreen.x, position.y - bScreen.y) < 30;
    }

    function recordTrace() {
      if (!state.traceEnabled) {
        return;
      }
      const { N } = solveCatenary();
      const last = state.trace[state.trace.length - 1];

      if (!last || Math.hypot(last.x - N.x, last.y - N.y) > 0.035) {
        state.trace.push({ ...N });
        if (state.trace.length > maxTracePoints) {
          state.trace.shift();
        }
      }
    }

    function onPointerDown(event) {
      if (!nearB(event)) {
        return;
      }
      event.preventDefault();
      state.dragging = true;
      state.hasDragged = true;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    }

    function onPointerMove(event) {
      if (!state.dragging) {
        canvas.style.cursor = nearB(event) ? "grab" : "default";
        return;
      }

      event.preventDefault();
      state.B = clampB(state.transform.toWorld(pointerPosition(event)));
      recordTrace();
      draw();
    }

    function stopDragging(event) {
      if (!state.dragging) {
        return;
      }
      state.dragging = false;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      canvas.style.cursor = "grab";
    }

    fields.length.addEventListener("input", () => {
      state.S = Number(fields.length.value);
      fields.lengthValue.value = fmt(state.S);
      state.hasDragged = true;
      clampCurrentB();
      recordTrace();
      draw();
    });

    fields.trace.addEventListener("change", () => {
      state.traceEnabled = fields.trace.checked;
      recordTrace();
      draw();
    });

    fields.clearTrace.addEventListener("click", () => {
      state.trace = [];
      draw();
    });

    fields.reset.addEventListener("click", () => {
      state.S = defaults.S;
      state.B = { ...defaults.B };
      state.floatCenter = { ...defaults.B };
      state.floatStart = performance.now();
      state.hasDragged = false;
      state.traceEnabled = defaults.traceEnabled;
      state.trace = [];
      syncControls();
      draw();
    });

    function floatBeforeDrag() {
      if (!state.hasDragged && !state.dragging) {
        const t = (performance.now() - state.floatStart) / 1000;
        state.B = clampB({
          x: state.floatCenter.x + Math.sin(t * 0.82) * 0.11,
          y: state.floatCenter.y + Math.cos(t * 0.68) * 0.08,
        });
        draw();
      }

      state.frameId = requestAnimationFrame(floatBeforeDrag);
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", stopDragging);
    canvas.addEventListener("pointercancel", stopDragging);
    window.addEventListener("resize", resizeCanvas);

    syncControls();
    resizeCanvas();
    floatBeforeDrag();

    return {
      destroy() {
        cancelAnimationFrame(state.frameId);
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerup", stopDragging);
        canvas.removeEventListener("pointercancel", stopDragging);
        window.removeEventListener("resize", resizeCanvas);
      },
    };
  }

  window.MathApplets = {
    ...(window.MathApplets || {}),
    initCatenaryChain,
  };
})();
