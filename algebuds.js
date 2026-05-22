const logoWriter = document.querySelector(".logo-writer");
const logoCommands = document.querySelectorAll("[data-logo-command]");

function restartLogoAnimation(command) {
  if (!logoWriter) return;

  const activeClass = command === "long" ? "is-long" : "is-short";
  logoWriter.classList.remove(activeClass);

  requestAnimationFrame(() => {
    logoWriter.classList.add(activeClass);
  });
}

logoCommands.forEach((button) => {
  button.addEventListener("click", () => {
    restartLogoAnimation(button.dataset.logoCommand);
  });
});
