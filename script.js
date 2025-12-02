"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const allSections = document.querySelectorAll(".section");
const feautureImgs = document.querySelectorAll("img[data-src]");

// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach(btn => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// Smooth scrolling
btnScrollTo.addEventListener("click", function () {
  section1.scrollIntoView({ behavior: "smooth" });
});

// Page navigation
document
  .querySelector(".nav__links")
  .addEventListener("click", function (event) {
    event.preventDefault();

    if (
      event.target.classList.contains("nav__link") &&
      !event.target.classList.contains("nav__link--btn")
    ) {
      const id = event.target.getAttribute("href");
      document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    }
  });

// Tabbed component
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  if (!clicked) return;

  // Activate tab
  tabs.forEach(tab => tab.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  // Activate content area
  tabsContent.forEach(tabContent =>
    tabContent.classList.remove("operations__content--active")
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const links = e.target.closest(".nav").querySelectorAll(".nav__link");
    const logo = e.target.closest(".nav").querySelector("img");

    links.forEach(link => {
      if (link !== e.target) {
        link.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

// Sticky nav
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (entry.isIntersecting) nav.classList.remove("sticky");
  else nav.classList.add("sticky");
};

const options = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(stickyNav, options);
headerObserver.observe(header);

// Reveal sections
const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// Lazy loading images
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

feautureImgs.forEach(img => imgObserver.observe(img));

// Slider
const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");

let currentSlide = 0;
const maxSlide = slides.length;

// Functions
const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class = "dots__dot" data-slide = "${i}"></button>`
    );
  });
};

const activateDot = function (slide) {
  document.querySelectorAll(".dots__dot").forEach(dot => {
    dot.classList.remove("dots__dot--active");
  });

  document
    .querySelector(`.dots__dot[data-slide = "${slide}"]`)
    .classList.add("dots__dot--active");
};

const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${(i - slide) * 100}%)`;
  });
};

const nextSlide = function () {
  if (currentSlide === maxSlide - 1) currentSlide = -1;
  currentSlide++;
  goToSlide(currentSlide);
  activateDot(currentSlide);
};

const previousSlide = function () {
  if (currentSlide === 0) currentSlide = maxSlide;
  currentSlide--;
  goToSlide(currentSlide);
  activateDot(currentSlide);
};

const init = function () {
  goToSlide(0);
  createDots();
  activateDot(0);
};
init();

// Event Listeners
btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", previousSlide);

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") previousSlide();
});

dotContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("dots__dot")) {
    currentSlide = Number(e.target.dataset.slide);
    goToSlide(currentSlide);
    activateDot(currentSlide);
  }
});
