(function () {
  const svg = document.querySelector("#function-svg");
  const controls = document.querySelector("#function-controls");

  if (!svg || !controls) {
    return;
  }

  const fields = {
    preset: controls.querySelector("#preset"),
    expression: controls.querySelector("#expression"),
    xValue: controls.querySelector("#x-value"),
    domainWidth: controls.querySelector("#domain-width"),
    segments: controls.querySelector("#segments"),
    iterations: controls.querySelector("#iterations"),
    animate: controls.querySelector("#animate"),
    reset: controls.querySelector("#reset"),
    readout: controls.querySelector("#readout"),
    warning: controls.querySelector("#warning"),
  };

  const state = {
    mode: "single",
    parsed: null,
    warning: "",
    dragging: false,
    animating: false,
    animationId: null,
    animationStart: performance.now(),
    viewRange: null,
  };

  const defaults = {
    expression: "2x - 3",
    domainWidth: 8,
    segments: 16,
    xValue: 3,
    iterations: 1,
    mode: "single",
  };

  const presetSettings = {
    "2x - 3": { x: 3, width: 8, segments: 16, iterations: 1 },
    "-x": { x: 0, width: 8, segments: 16, iterations: 1 },
    "x^2": { x: 1, width: 4, segments: 16, iterations: 1 },
    "sqrt(x)": { x: 1, width: 2, segments: 16, iterations: 1 },
    "1/x": { x: 1, width: 4, segments: 16, iterations: 1 },
    "sin(x)": { x: 0, width: 16, segments: 16, iterations: 1 },
    "3.2*x*(1-x)": { x: 0.6875, width: 1, segments: 16, iterations: 5 },
  };

  class Parser {
    constructor(source) {
      this.source = source.replace(/\s+/g, "").toLowerCase();
      this.index = 0;
    }

    parse() {
      const expression = this.parseExpression();
      if (this.index < this.source.length) {
        throw new Error(`Unexpected "${this.source[this.index]}"`);
      }
      return expression;
    }

    peek() {
      return this.source[this.index] || "";
    }

    eat(char) {
      if (this.peek() === char) {
        this.index += 1;
        return true;
      }
      return false;
    }

    parseExpression() {
      let node = this.parseTerm();
      while (this.peek() === "+" || this.peek() === "-") {
        const operator = this.source[this.index++];
        const right = this.parseTerm();
        node = { type: "binary", operator, left: node, right };
      }
      return node;
    }

    parseTerm() {
      let node = this.parsePower();
      while (true) {
        if (this.peek() === "*" || this.peek() === "/") {
          const operator = this.source[this.index++];
          const right = this.parsePower();
          node = { type: "binary", operator, left: node, right };
        } else if (this.startsImplicitFactor()) {
          const right = this.parsePower();
          node = { type: "binary", operator: "*", left: node, right };
        } else {
          return node;
        }
      }
    }

    startsImplicitFactor() {
      const char = this.peek();
      return char === "(" || char === "." || /\d|[a-z]/.test(char);
    }

    parsePower() {
      let node = this.parseUnary();
      if (this.eat("^")) {
        node = { type: "binary", operator: "^", left: node, right: this.parsePower() };
      }
      return node;
    }

    parseUnary() {
      if (this.eat("+")) {
        return this.parseUnary();
      }
      if (this.eat("-")) {
        return { type: "unary", operator: "-", value: this.parseUnary() };
      }
      return this.parsePrimary();
    }

    parsePrimary() {
      if (this.eat("(")) {
        const node = this.parseExpression();
        if (!this.eat(")")) {
          throw new Error("Missing closing parenthesis");
        }
        return node;
      }

      if (/\d|\./.test(this.peek())) {
        return this.parseNumber();
      }

      if (/[a-z]/.test(this.peek())) {
        return this.parseName();
      }

      throw new Error("Expected a number, x, or a function");
    }

    parseNumber() {
      const start = this.index;
      while (/\d|\./.test(this.peek())) {
        this.index += 1;
      }
      const value = Number(this.source.slice(start, this.index));
      if (!Number.isFinite(value)) {
        throw new Error("Invalid number");
      }
      return { type: "number", value };
    }

    parseName() {
      const start = this.index;
      while (/[a-z]/.test(this.peek())) {
        this.index += 1;
      }
      const name = this.source.slice(start, this.index);

      if (this.eat("(")) {
        const argument = this.parseExpression();
        if (!this.eat(")")) {
          throw new Error(`Missing closing parenthesis after ${name}`);
        }
        return { type: "call", name, argument };
      }

      return { type: "name", name };
    }
  }

  function evaluate(node, scope) {
    if (node.type === "number") {
      return node.value;
    }
    if (node.type === "name") {
      if (node.name === "x") return scope.x;
      if (node.name === "pi") return Math.PI;
      if (node.name === "e") return Math.E;
      throw new Error(`Unknown variable "${node.name}"`);
    }
    if (node.type === "unary") {
      return -evaluate(node.value, scope);
    }
    if (node.type === "binary") {
      const left = evaluate(node.left, scope);
      const right = evaluate(node.right, scope);
      if (node.operator === "+") return left + right;
      if (node.operator === "-") return left - right;
      if (node.operator === "*") return left * right;
      if (node.operator === "/") return left / right;
      if (node.operator === "^") return Math.pow(left, right);
    }
    if (node.type === "call") {
      const value = evaluate(node.argument, scope);
      const functions = {
        sqrt: Math.sqrt,
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        abs: Math.abs,
        exp: Math.exp,
        log: Math.log,
        ln: Math.log,
      };
      if (!functions[node.name]) {
        throw new Error(`Unknown function "${node.name}"`);
      }
      return functions[node.name](value);
    }
    throw new Error("Invalid expression");
  }

  function readNumber(field, fallback) {
    const value = Number(field.value);
    return Number.isFinite(value) ? value : fallback;
  }

  function currentConfig() {
    const preset = presetSettings[fields.preset.value] || inferDomain(fields.expression.value);
    const width = Math.max(0.1, readNumber(fields.domainWidth, preset.width ?? defaults.domainWidth));
    const center = readNumber(fields.xValue, preset.x ?? defaults.xValue);
    const segments = Math.max(2, Math.round(readNumber(fields.segments, preset.segments ?? defaults.segments)));
    const min = center - width / 2;
    const max = center + width / 2;
    const iterations = Math.max(1, Math.min(5, Math.round(readNumber(fields.iterations, defaults.iterations))));
    return {
      min,
      max,
      center,
      width,
      segments,
      samples: segments + 1,
      iterations,
      x: center,
      expression: fields.expression.value.trim() || "x",
    };
  }

  function inferDomain(expression) {
    const text = expression.toLowerCase();
    if (text.includes("sqrt")) {
      return { x: 1, width: 2, segments: defaults.segments };
    }
    if (text.includes("sin") || text.includes("cos") || text.includes("tan")) {
      return { x: 0, width: 16, segments: defaults.segments };
    }
    if (text.includes("1/x") || text.includes("/x")) {
      return { x: 1, width: 4, segments: defaults.segments };
    }
    return { x: defaults.xValue, width: defaults.domainWidth, segments: defaults.segments };
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function fmt(value) {
    if (!Number.isFinite(value)) {
      return "undefined";
    }
    if (Math.abs(value) >= 1000 || Math.abs(value) < 0.001 && value !== 0) {
      return value.toExponential(2);
    }
    return Number(value.toFixed(3)).toString();
  }

  function safeEval(x, config) {
    if (!state.parsed) {
      return NaN;
    }
    try {
      const value = evaluate(state.parsed, { x });
      return Number.isFinite(value) ? value : NaN;
    } catch (error) {
      state.warning = error.message;
      return NaN;
    }
  }

  function sampleStarts(config, count = config.samples) {
    const starts = [];
    const usable = Math.max(2, count - 1);
    for (let index = 0; index < count; index += 1) {
      starts.push(config.min + ((config.max - config.min) * index) / usable);
    }
    return starts;
  }

  function orbit(start, config, depth) {
    const values = [start];
    let current = start;
    for (let index = 0; index < depth; index += 1) {
      current = safeEval(current, config);
      values.push(current);
      if (!Number.isFinite(current)) {
        break;
      }
    }
    return values;
  }

  function valueRange(config, depth) {
    const values = [0, config.min, config.max, config.x];
    for (const start of sampleStarts(config, Math.min(config.samples, 51))) {
      values.push(...orbit(start, config, depth).filter(Number.isFinite));
    }
    const finite = values.filter(Number.isFinite);
    let min = Math.min(...finite);
    let max = Math.max(...finite);
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      min = config.min;
      max = config.max;
    }
    if (min === max) {
      min -= 1;
      max += 1;
    }
    const pad = Math.max((max - min) * 0.08, 0.5);
    return niceRange(min - pad, max + pad);
  }

  function rangeFor(config, depth, preserveRange) {
    if (preserveRange && state.viewRange) {
      return state.viewRange;
    }
    state.viewRange = valueRange(config, depth);
    return state.viewRange;
  }

  function niceRange(min, max) {
    min = Math.min(min, 0);
    max = Math.max(max, 0);
    const rawStep = (max - min) / 6;
    const base = Math.pow(10, Math.floor(Math.log10(rawStep || 1)));
    const choices = [1, 2, 5, 10];
    const step = choices.find((choice) => choice * base >= rawStep) * base;
    return {
      min: Math.floor(min / step) * step,
      max: Math.ceil(max / step) * step,
      step,
    };
  }

  function xMap(value, range, left = 120, right = 800) {
    return left + ((value - range.min) / (range.max - range.min)) * (right - left);
  }

  function clearSvg() {
    svg.replaceChildren();
  }

  function el(name, attrs = {}, text = "") {
    const node = document.createElementNS("http://www.w3.org/2000/svg", name);
    for (const [key, value] of Object.entries(attrs)) {
      node.setAttribute(key, value);
    }
    if (text) {
      node.textContent = text;
    }
    return node;
  }

  function drawAxis(y, label, range) {
    svg.append(
      el("line", { class: "axis-line", x1: 120, y1: y, x2: 800, y2: y }),
      el("text", { class: "axis-label", x: 88, y: y - 14 }, label),
    );
    const step = range.step || 1;
    for (let value = range.min; value <= range.max + step / 2; value += step) {
      const x = xMap(value, range);
      svg.append(
        el("line", { class: "axis-tick", x1: x, y1: y - 8, x2: x, y2: y + 8 }),
        el("text", { class: "tick-label", x: x - 14, y: y + 28 }, fmt(value)),
      );
    }
  }

  function drawLineSegment(x1, y1, x2, y2, className, opacity = 1) {
    svg.append(el("line", { class: className, x1, y1, x2, y2, opacity }));
  }

  function drawSingle(config, options = {}) {
    clearSvg();
    const range = rangeFor(config, 1, options.preserveRange);
    const inputY = 190;
    const outputY = 460;
    const y = safeEval(config.x, config);

    drawAxis(inputY, "x", range);
    drawAxis(outputY, "f(x)", range);

    for (const start of sampleStarts(config)) {
      const out = safeEval(start, config);
      if (Number.isFinite(out)) {
        drawLineSegment(
          xMap(start, range),
          inputY,
          xMap(out, range),
          outputY,
          "mapping-segment dim",
        );
      }
    }

    if (Number.isFinite(y)) {
      drawLineSegment(xMap(config.x, range), inputY, xMap(y, range), outputY, "highlight-line");
      drawDragPoint(xMap(config.x, range), inputY, range, config);
      svg.append(el("circle", { cx: xMap(y, range), cy: outputY, r: 7, fill: "#d01818" }));
    }

    updateReadout(config, [config.x, y]);
  }

  function drawDragPoint(cx, cy, range, config) {
    const point = el("circle", {
      class: "drag-point",
      cx,
      cy,
      r: 8,
      tabindex: 0,
      role: "slider",
      "aria-label": "Highlighted input x",
      "aria-valuemin": config.min,
      "aria-valuemax": config.max,
      "aria-valuenow": fmt(config.x),
    });
    point.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      state.dragging = { range };
      point.setPointerCapture(event.pointerId);
    });
    point.addEventListener("pointermove", (event) => {
      if (!state.dragging) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const rect = svg.getBoundingClientRect();
      const viewX = ((event.clientX - rect.left) / rect.width) * 920;
      const next = range.min + ((viewX - 120) / (800 - 120)) * (range.max - range.min);
      setX(next);
    });
    point.addEventListener("pointerup", () => {
      state.dragging = false;
    });
    point.addEventListener("pointercancel", () => {
      state.dragging = false;
    });
    point.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        event.preventDefault();
        setX(config.x - config.width / 100);
      }
      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        event.preventDefault();
        setX(config.x + config.width / 100);
      }
    });
    svg.append(point);
  }

  svg.addEventListener("pointermove", (event) => {
    if (!state.dragging || !state.dragging.range) {
      return;
    }
    event.preventDefault();
    const config = currentConfig();
    const rect = svg.getBoundingClientRect();
    const viewX = ((event.clientX - rect.left) / rect.width) * 920;
    const range = state.dragging.range;
    const next = range.min + ((viewX - 120) / (800 - 120)) * (range.max - range.min);
    setX(next);
  });

  svg.addEventListener("pointerup", () => {
    state.dragging = false;
  });

  svg.addEventListener("pointercancel", () => {
    state.dragging = false;
  });

  function drawIterate(config, options = {}) {
    clearSvg();
    const depth = config.iterations;
    const range = rangeFor(config, 1, options.preserveRange);
    const top = 92;
    const gap = 96;
    const axisYs = Array.from({ length: depth + 1 }, (_, index) => top + index * gap);

    axisYs.forEach((y, index) => {
      drawAxis(y, iterationLabel(index), range);
    });

    const count = Math.min(config.samples, 41);
    for (const start of sampleStarts(config, count)) {
      const values = orbit(start, config, depth);
      drawOrbit(values, axisYs, range, "mapping-segment dim", 0.3);
    }

    const selected = orbit(config.x, config, depth);
    drawOrbit(selected, axisYs, range, "highlight-line", 1);
    if (Number.isFinite(selected[0])) {
      drawDragPoint(xMap(selected[0], range), axisYs[0], range, config);
    }
    updateReadout(config, selected);
  }

  function drawOrbit(values, axisYs, range, className, opacity) {
    for (let index = 0; index < values.length - 1; index += 1) {
      const start = values[index];
      const end = values[index + 1];
      if (Number.isFinite(start) && Number.isFinite(end)) {
        drawLineSegment(
          xMap(start, range),
          axisYs[index],
          xMap(end, range),
          axisYs[index + 1],
          `${className} depth-${index}`,
          opacity * Math.max(0.28, 1 - index * 0.12),
        );
      }
    }
  }

  function iterationLabel(index) {
    if (index === 0) {
      return "x";
    }
    if (index === 1) {
      return "f(x)";
    }
    let label = "x";
    for (let count = 0; count < index; count += 1) {
      label = `f(${label})`;
    }
    return label;
  }
  function updateReadout(config, values) {
    const y = values[1];
    const orbitText = values
      .slice(0, config.iterations + 1)
      .map((value, index) => `${iterationLabel(index)}=${fmt(value)}`)
      .join(" | ");
    fields.readout.innerHTML = `
      <span>center x = ${fmt(config.x)}</span>
      <span>inputs ${fmt(config.min)} to ${fmt(config.max)}</span>
      <span>f(x) = ${fmt(y)}</span>
      <span>${orbitText}</span>
    `;
  }

  function render(options = {}) {
    state.warning = "";
    const config = currentConfig();
    fields.xValue.value = fmt(config.x);

    try {
      state.parsed = new Parser(config.expression).parse();
    } catch (error) {
      state.parsed = null;
      state.warning = error.message;
    }

    if (state.mode === "single") {
      fields.iterations.value = "1";
      drawSingle({ ...config, iterations: 1 }, options);
    } else {
      drawIterate(config, options);
    }

    fields.warning.textContent = state.warning;
    updateModeButtons();
  }

  function setX(value) {
    fields.xValue.value = fmt(value);
    render({ preserveRange: true });
  }

  function updateModeButtons() {
    controls.querySelectorAll("[data-mode]").forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.mode === state.mode ? "true" : "false");
    });
    fields.animate.setAttribute("aria-pressed", state.animating ? "true" : "false");
  }

  function animate() {
    if (!state.animating) {
      return;
    }
    const config = currentConfig();
    const t = ((performance.now() - state.animationStart) / 5200) % 1;
    const next = config.min + (config.max - config.min) * (0.5 - 0.5 * Math.cos(t * Math.PI * 2));
    fields.xValue.value = fmt(next);
    render({ preserveRange: true });
    state.animationId = requestAnimationFrame(animate);
  }

  fields.preset.addEventListener("change", () => {
    state.viewRange = null;
    const expression = fields.preset.value;
    const settings = presetSettings[expression] || presetSettings[defaults.expression];
    fields.expression.value = expression;
    fields.xValue.value = settings.x;
    fields.domainWidth.value = settings.width;
    fields.segments.value = settings.segments;
    fields.iterations.value = settings.iterations;
    if (settings.iterations > 1) {
      state.mode = "iterate";
    }
    render();
  });

  controls.addEventListener("input", (event) => {
    if (event.target === fields.expression) {
      state.viewRange = null;
      fields.preset.value = fields.expression.value;
      const inferred = inferDomain(fields.expression.value);
      fields.domainWidth.value = nearestOptionValue(fields.domainWidth, inferred.width);
      fields.segments.value = nearestOptionValue(fields.segments, inferred.segments);
    } else if (event.target === fields.xValue) {
      render({ preserveRange: true });
      return;
    } else if (event.target !== fields.xValue) {
      state.viewRange = null;
    }
    render();
  });

  function nearestOptionValue(select, target) {
    const options = Array.from(select.options).map((option) => Number(option.value));
    return options.reduce((closest, value) =>
      Math.abs(value - target) < Math.abs(closest - target) ? value : closest,
    ).toString();
  }

  controls.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.viewRange = null;
      state.mode = button.dataset.mode;
      if (state.mode !== "single" && Number(fields.iterations.value) < 2) {
        fields.iterations.value = "5";
      }
      render();
    });
  });

  fields.animate.addEventListener("click", () => {
    state.animating = !state.animating;
    state.animationStart = performance.now();
    if (state.animating) {
      animate();
    } else {
      cancelAnimationFrame(state.animationId);
      render();
    }
  });

  fields.reset.addEventListener("click", () => {
    state.viewRange = null;
    fields.expression.value = defaults.expression;
    fields.preset.value = defaults.expression;
    fields.xValue.value = defaults.xValue;
    fields.domainWidth.value = defaults.domainWidth;
    fields.segments.value = defaults.segments;
    fields.iterations.value = defaults.iterations;
    state.mode = defaults.mode;
    state.animating = false;
    cancelAnimationFrame(state.animationId);
    render();
  });

  render();
})();
