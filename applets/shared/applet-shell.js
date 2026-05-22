(function () {
  const applets = [
    {
      title: "Quadrilateral Diagonals",
      description:
        "Drag point C and watch the four diagonal segment lengths change around their intersection.",
      url: "quadrilateral-diagonals/",
      status: "ready",
      preview: `
        <svg viewBox="0 0 240 132" aria-hidden="true">
          <path d="M28 110H214M42 86H214M42 62H214M42 38H214M58 24V116M98 24V116M138 24V116M178 24V116"></path>
          <path d="M64 96 90 38 178 48 202 96Z" fill="rgba(153, 51, 0, 0.1)" stroke="#993300"></path>
          <path d="M64 96 178 48M90 38 202 96"></path>
          <path d="M64 96 126 70" stroke="#ff7f00"></path>
          <path d="M90 38 126 70" stroke="#004dff"></path>
          <path d="M178 48 126 70" stroke="#ff00cc"></path>
          <path d="M202 96 126 70" stroke="#1f7a32"></path>
          <circle cx="178" cy="48" r="7" fill="#ff0000" stroke="#ff0000"></circle>
          <path d="M166 28c17-15 35-13 46 0"></path>
        </svg>`,
    },
    {
      title: "Function Diagram",
      description:
        "See a function as a mapping from input values to output values, with iteration and wrapping views.",
      url: "function-diagram/",
      status: "new",
      preview: `
        <svg viewBox="0 0 240 132" aria-hidden="true">
          <path d="M38 34H204M38 98H204"></path>
          <path d="M62 34 86 98M94 34 94 98M126 34 166 98M158 34 126 98M190 34 198 98" stroke="#0b54b9"></path>
          <path d="M54 28v12M94 28v12M134 28v12M174 28v12M54 92v12M94 92v12M134 92v12M174 92v12"></path>
          <circle cx="126" cy="34" r="6" fill="#d01818" stroke="#d01818"></circle>
        </svg>`,
    },
    {
      title: "Catenary Chain",
      description:
        "Drag point B and change the chain length to see how a hanging catenary moves.",
      url: "catenary-chain/",
      status: "new",
      preview: `
        <svg viewBox="0 0 240 132" aria-hidden="true">
          <path d="M26 112H214M42 88H214M42 64H214M42 40H214M58 24V116M98 24V116M138 24V116M178 24V116"></path>
          <path d="M54 44a62 62 0 0 1 122 0" stroke="rgba(11, 84, 185, 0.42)" stroke-dasharray="7 7"></path>
          <path d="M54 44c25 58 77 62 122 18" stroke="#121212" stroke-width="5"></path>
          <path d="M54 44 176 62" stroke="#0b54b9" stroke-dasharray="7 8"></path>
          <circle cx="54" cy="44" r="6" fill="#121212" stroke="#121212"></circle>
          <circle cx="176" cy="62" r="7" fill="#d01818" stroke="#d01818"></circle>
          <circle cx="112" cy="89" r="6" fill="#ff7f00" stroke="#ff7f00"></circle>
        </svg>`,
    },
  ];

  function renderAppletGallery(selector) {
    const gallery = document.querySelector(selector);

    if (!gallery) {
      return;
    }

    gallery.innerHTML = [
      ...applets.map(
        (applet) => `
          <a class="applet-card" href="${applet.url}">
            <span class="applet-card-preview">${applet.preview}</span>
            <h2>${applet.title}</h2>
            <p>${applet.description}</p>
            <span class="applet-card-meta">${applet.status}</span>
          </a>
        `,
      ),
      `
        <article class="applet-card applet-placeholder-card">
          <span class="applet-card-preview" aria-hidden="true">
            <svg viewBox="0 0 240 132">
              <path d="M36 96c26-46 56-58 88-36 25 17 48 7 78-34"></path>
              <circle cx="84" cy="72" r="9"></circle>
              <circle cx="146" cy="66" r="9"></circle>
              <path d="M64 104h120M202 36h22M213 25v22"></path>
            </svg>
          </span>
          <h2>More Applets</h2>
          <p>This gallery is ready for the next small math manipulative.</p>
          <span class="applet-card-meta">next up</span>
        </article>
      `,
    ].join("");
  }

  window.MathApplets = {
    ...(window.MathApplets || {}),
    applets,
    renderAppletGallery,
  };
})();
