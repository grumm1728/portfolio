const stickyIllustration = document.querySelector(".classroom-sticky");
const scrollSteps = [...document.querySelectorAll(".scroll-step")];

if (stickyIllustration && scrollSteps.length) {
  const setActiveState = (state) => {
    stickyIllustration.dataset.state = state;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (activeEntry) {
        setActiveState(activeEntry.target.dataset.state);
      }
    },
    {
      rootMargin: "-30% 0px -45% 0px",
      threshold: [0.15, 0.35, 0.6, 0.85],
    },
  );

  scrollSteps.forEach((step) => observer.observe(step));
}
