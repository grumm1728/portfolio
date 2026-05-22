const projects = [
  {
    title: "Algebuds",
    description:
      "A learning design case study on flipping the chatbot tutor relationship: the student teaches Dot.",
    url: "algebuds.html",
    thumbnail: "algebuds",
    local: true,
  },
  {
    title: "Teacher Flow Interactive Slides",
    description:
      "A product case study on keeping interactive lessons inside the rhythm of classroom instruction.",
    url: "teacher-flow.html",
    thumbnail: "teacherFlow",
    local: true,
  },
  {
    title: "Kids Parents Contact App",
    description:
      "A double diamond case study on connecting with the parents behind kids' friendships.",
    url: "kidlinks.html",
    thumbnail: "kidlinksArt",
    local: true,
  },
  {
    title: "Math Applets",
    description:
      "A growing shelf of small interactive math manipulatives for dragging, tracing, and noticing.",
    url: "applets/",
    thumbnail: "quadrilateral",
    local: true,
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
      <path d="M54 30h126v70H54z"></path>
      <path d="M44 100h146l12 18H32z"></path>
      <path d="M96 112c12-4 28-4 40 0"></path>
      <path d="M64 40h106M64 88h106"></path>
      <defs>
        <radialGradient id="ppt-gradient" cx="65%" cy="35%" r="72%">
          <stop offset="0%" stop-color="#ff9a2f"></stop>
          <stop offset="100%" stop-color="#d8214b"></stop>
        </radialGradient>
      </defs>
      <rect x="96" y="52" width="42" height="42" rx="12" fill="url(#ppt-gradient)" stroke="none"></rect>
      <text x="117" y="82" fill="#fff" font-size="28" font-weight="700" text-anchor="middle" stroke="none">P</text>
    </svg>`,
  quadrilateral: `
    <svg viewBox="0 0 240 132" aria-hidden="true">
      <g transform="translate(26 38) rotate(-7 54 34)">
        <rect x="0" y="0" width="92" height="62" fill="#fff" stroke="#121212" stroke-width="3"></rect>
        <path d="M10 52H82M18 38H82M18 24H82M24 8V56M48 8V56M72 8V56" stroke="rgba(78, 166, 224, 0.46)" stroke-width="1.4"></path>
        <path d="M18 46 34 16 66 18 78 46Z" fill="rgba(153, 51, 0, 0.12)" stroke="#993300" stroke-width="2"></path>
        <path d="M18 46 66 18M34 16 78 46" stroke="#121212" stroke-width="2"></path>
        <path d="M18 46 47 31" stroke="#ff7f00" stroke-width="2"></path>
        <path d="M34 16 47 31" stroke="#004dff" stroke-width="2"></path>
        <path d="M66 18 47 31" stroke="#ff00cc" stroke-width="2"></path>
        <path d="M78 46 47 31" stroke="#1f7a32" stroke-width="2"></path>
        <circle cx="66" cy="18" r="4" fill="#d01818" stroke="#d01818"></circle>
      </g>
      <g transform="translate(76 18) rotate(3 54 34)">
        <rect x="0" y="0" width="96" height="64" fill="#fff" stroke="#121212" stroke-width="3"></rect>
        <path d="M12 18H84M12 46H84" stroke="#121212" stroke-width="2.4"></path>
        <path d="M24 18 36 46M44 18 44 46M56 18 72 46M70 18 58 46" stroke="#0b54b9" stroke-width="2"></path>
        <path d="M20 13v10M44 13v10M68 13v10M20 41v10M44 41v10M68 41v10" stroke="#121212" stroke-width="2"></path>
        <circle cx="56" cy="18" r="4" fill="#d01818" stroke="#d01818"></circle>
      </g>
      <g transform="translate(122 40) rotate(8 54 34)">
        <rect x="0" y="0" width="92" height="62" fill="#fff" stroke="#121212" stroke-width="3"></rect>
        <path d="M10 52H82M18 38H82M18 24H82M24 8V56M48 8V56M72 8V56" stroke="rgba(78, 166, 224, 0.46)" stroke-width="1.4"></path>
        <path d="M18 20a31 31 0 0 1 62 8" stroke="rgba(11, 84, 185, 0.42)" stroke-dasharray="5 5" stroke-width="2"></path>
        <path d="M18 20c17 31 43 34 62 8" stroke="#121212" stroke-width="4"></path>
        <path d="M18 20 80 28" stroke="#0b54b9" stroke-dasharray="5 6" stroke-width="2"></path>
        <circle cx="18" cy="20" r="4" fill="#121212" stroke="#121212"></circle>
        <circle cx="80" cy="28" r="5" fill="#d01818" stroke="#d01818"></circle>
        <circle cx="47" cy="47" r="4" fill="#ff7f00" stroke="#ff7f00"></circle>
      </g>
    </svg>`,
  kidlinksArt: `
    <img src="images/kidlinks-family-network.png" alt="" aria-hidden="true">`,
  algebuds: `
    <img class="algebuds-card-image" src="images/algebuds-pdf-page3-3.png" alt="" aria-hidden="true">`,
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

if (window.MathApplets) {
  window.MathApplets.initQuadrilateralDiagonals("#diagonal-canvas");
}
