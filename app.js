const slider = document.getElementById("familySlider");
const nextBtn = document.querySelector(".carousel-btn.next");
const prevBtn = document.querySelector(".carousel-btn.prev");

nextBtn.addEventListener("click", () => {
  slider.scrollBy({
    left: slider.clientWidth,
    behavior: "smooth",
  });
});

prevBtn.addEventListener("click", () => {
  slider.scrollBy({
    left: -slider.clientWidth,
    behavior: "smooth",
  });
});
const groupSlider = document.getElementById("groupSlider");
const groupPrev = document.querySelector(".group-prev");
const groupNext = document.querySelector(".group-next");
const groupDots = document.getElementById("groupDots");

const groupCards = document.querySelectorAll(".group-card");

let currentGroupSlide = 0;

// Create dots
groupCards.forEach((_, index) => {
  const dot = document.createElement("button");

  dot.classList.add("group-dot");

  if (index === 0) {
    dot.classList.add("active");
  }

  dot.setAttribute("aria-label", `Slide ${index + 1}`);

  dot.addEventListener("click", () => {
    currentGroupSlide = index;
    scrollToGroupSlide();
  });

  groupDots.appendChild(dot);
});

const groupDotElements = document.querySelectorAll(".group-dot");

function scrollToGroupSlide() {
  const card = groupCards[currentGroupSlide];

  if (!card) return;

  groupSlider.scrollTo({
    left: card.offsetLeft - groupSlider.offsetLeft,
    behavior: "smooth",
  });

  groupDotElements.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentGroupSlide);
  });
}

// NEXT
groupNext.addEventListener("click", () => {
  currentGroupSlide++;

  if (currentGroupSlide >= groupCards.length) {
    currentGroupSlide = 0;
  }

  scrollToGroupSlide();
});

// PREVIOUS
groupPrev.addEventListener("click", () => {
  currentGroupSlide--;

  if (currentGroupSlide < 0) {
    currentGroupSlide = groupCards.length - 1;
  }

  scrollToGroupSlide();
});

// Update dots when user swipes / scrolls
groupSlider.addEventListener("scroll", () => {
  let closestIndex = 0;
  let closestDistance = Infinity;

  groupCards.forEach((card, index) => {
    const distance = Math.abs(card.offsetLeft - groupSlider.scrollLeft);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  currentGroupSlide = closestIndex;

  groupDotElements.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentGroupSlide);
  });
});
