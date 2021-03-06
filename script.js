'use strict';

// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

// Tabbed Component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// Fade Menu
const nav = document.querySelector('.nav');

///////////////////////////////////////

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  const s1coord = section1.getBoundingClientRect();
  console.log('S1COORD', s1coord);

  console.log('BUTTON COORD', e.target.getBoundingClientRect());

  // Find Current Scroll
  console.log('Current Scroll X/Y', window.pageXOffset, window.pageYOffset);

  // Client (Browser Heigth and Width)
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling

  // window.scrollTo(
  //   s1coord.left + window.pageXOffset,
  //   s1coord.top + window.pageYOffset
  // );

  // Scrolling Smoothly
  // window.scrollTo({
  //   left: s1coord.left + window.pageXOffset,
  //   top: s1coord.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Modern Way
  section1.scrollIntoView({ behavior: 'smooth' });
});

/*
 * Navigation
 */

// 1. Create Event Delegation for common parent element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// 2. Determine the target element that returns events

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard Clause
  if (!clicked) return;

  // Removing initial class
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // Activate tabs
  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu Fade Animation
// Refactoring
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    // Determine on which happended event
    const link = e.target;
    // Select sibling elements
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibling.forEach(el => {
      if (link !== el) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

// REFACTORING: We're going to change this value by bind method.
nav.addEventListener('mouseover', handleHover.bind(0.5));

// We need opposite one to get back everything
nav.addEventListener('mouseout', handleHover.bind(1));

/* 
  * Example Intersection Observer API
 
const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};

const obsOptions = {
  root: null, // It's viewport
  threshold: 0.2, // 10%
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1); */

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  // Entries means thresholds in options

  // It's the same entry = entries[0];
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  // rootMargin: '-90px', // When intersection is gone. Example: Before 90px target element (header)
  rootMargin: `-${navHeight}px`, // Get dynamically nav height. Note: Just works px not rem or percentage
});
headerObserver.observe(header);

// Reveal Element

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

// Observer all section
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  // We will remove blur when load img not before
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  // Stop Observing
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  // Start function before reached the imgs
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  const slider = document.querySelector('.slider');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  const createDots = function () {
    slides.forEach((_, i) =>
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide='${i}'></button>`
      )
    );
  };

  const activateDot = function (value) {
    // Remove active class on all of dots
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    // Add active class that selected dots
    document
      .querySelector(`.dots__dot[data-slide='${value}']`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (value) {
    slides.forEach(
      (slide, indexNumber) =>
        (slide.style.transform = `translateX(${100 * (indexNumber - value)}%)`)
    );
  };

  const init = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };

  init();

  // Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) curSlide = slides.length - 1;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dots__dot')) return;

    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  });
};
slider();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// LECTURES

/* 
// LECTURE #183: SELECTING, CREATING AND DELETING ELEMENTS

// # SELECTING ELEMENTS

// Select Document Elements
console.log(document.documentElement);

// Select Head Node
console.log(document.head);

// Select Body Node
console.log(document.body);

// Difference querySelector and getElements...

console.log(document.querySelectorAll('.section'));

const buttons = document.getElementsByTagName('button');

// ## Creating and Inserting Elements

// 1- Create Element
const message = document.createElement('div');
// 2- Adding Style to Created Element
message.classList.add('cookie-message');
// 3- Create Element Body
message.innerHTML = `We use cookies for improved functionaluty and analytics. <button class="btn btn--close-cookie">Got it!</button>`;

// 4- Insert Created Element to HTML Document
const header = document.querySelector('header');
header.prepend(message);
header.append(message);

// ## Deleting Elements in DOM Tree
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

// Adding Element with AdjacentHtml
// const section1 = document.querySelector('#section--1');
// section1.insertAdjacentHTML(
//   'afterbegin',
//   `<div><p>Hi there! I hope you're doing well.</p></div>`
// );

*/

/* 
// LECTURE #184: STYLES, ATTRIBUTES AND CLASSES

// ## STYLES
message.style.backgroundColor = '#37383d';
message.style.width = '105%';

// We can't see something because there is no any inner class like below. Below code doesn't display CSS codes for the element that comes external css file.
console.log(message.style.color);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = parseFloat(getComputedStyle(message).height) + 40 + 'px';

// ## ATTRIBUTES
const logo = document.querySelector('.nav__logo');

// Getting attributes

// 1. Way
console.log(logo.alt);

// Absolute src path
console.log(logo.src);

// 2. Way
// Relative src path exact the same with in index.html
console.log(logo.getAttribute('src'));

// We can change attributes
logo.alt = 'Amazing minimalist logo';

// It doesn't work because of not standart for Javascript
console.log(logo.designer);
console.log(logo.getAttribute('designer'));

// See element's className
console.log(logo.className);

// Data Attributes

// 1- Add data for element that is in index.html. We're going to add data attribute for '.nav__logo'
console.log(logo.dataset.versionNumber);

// ## CLASSES
logo.classList.add('c', 'j'); // Adding two class
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); // Attention: Not includes
*/
/* 
// LECTURE #185: IMPLEMENTING SMOOTH SCROLLING
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1coord = section1.getBoundingClientRect();
  console.log('S1COORD', s1coord);

  console.log('BUTTON COORD', e.target.getBoundingClientRect());

  // Find Current Scroll
  console.log('Current Scroll X/Y', window.pageXOffset, window.pageYOffset);

  // Client (Browser Heigth and Width)
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling

  // window.scrollTo(
  //   s1coord.left + window.pageXOffset,
  //   s1coord.top + window.pageYOffset
  // );

  // Scrolling Smoothly
  // window.scrollTo({
  //   left: s1coord.left + window.pageXOffset,
  //   top: s1coord.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Modern Way
  section1.scrollIntoView({ behavior: 'smooth' });
});
 */
/* // LECTURE #186: TYPES OF EVENT AND EVENT HANDLER

const h1 = document.querySelector('h1');

Modern Way to add eventListener
h1.addEventListener('mouseenter', function (e) {
  alert("Great! You 're reading the heading");
});

Old School on JS File
h1.onclick(alert('Hi!'));

Stopping Event Listener after the run once
You have to export Event Handler

const alertH1 = function () {
  alert("Great! You 're reading the heading");

  h1.removeEventListener('click', alertH1);
};

h1.addEventListener('click', alertH1); */

// LECTURE #188: EVENT PROPAGATION IN PRACTISE

/* 
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) - min);

const randomColor = () =>
  `rgb(${randomInt(0, 155)}, ${randomInt(0, 155)}, ${randomInt(0, 155)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  
    ? How can we stop propagation?
    * e.stopPropagation();
  
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});
*/

/* LECTURE 190: DOM TRAVERSING 

const h1 = document.querySelector('h1');

// Going Downwards: Child

// Select child based on class
console.log(h1.querySelectorAll('.highlight'));

// Select all nodes. Comment nodes, element nodes etc.
console.log(h1.childNodes);

// Select just child as html element - It creates HTMLCollection
console.log(h1.children);

// Select first element and last element child
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'brown';

// Going Upwards: Parents
console.log(h1.parentNode);
console.log(h1.parentElement);

// Selecet the closest parent that has defined class

// Basically it's opposite the querySelector. It search towards up.
h1.closest('.header').style.backgroundColor = 'green';

// Going Sideways: Sibling
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
*/
