// logo animation
(function() {
  let logo = document.querySelector('.logo');
  if (!logo) {
    return;
  }

  gsap.set('.path', {
    drawSVG: '0% 0%'
  });
  gsap.set('.dot-group', {
    yPercent: 100
  });

  CustomBounce.create('myBounce', {strength: 0.6, squash: 2});

  const logoTl = gsap.timeline({paused: true});

  logoTl
    .addLabel('i', 3.1)
    .set('.logo', {autoAlpha: 1})
    .timeScale(0.9)
    .staggerTo('.cPath', 0.5, {drawSVG: '100%', ease: Linear.easeNone}, 0.2, 1)
    .staggerTo('.a1Path', 0.25, {drawSVG: '100%', ease: Linear.easeNone}, 0.1, '-=0.4')
    .staggerTo('.a2Path', 0.25, {drawSVG: '100%', ease: Linear.easeNone}, 0.1, '-=0.2')
    .staggerTo('.s1Path', 0.4, {drawSVG: '100%', ease: Linear.easeNone}, 0.1, '-=0.4')
    .staggerTo('.s2Path', 0.3, {drawSVG: '100%', ease: Linear.easeNone}, 0.07, '-=0.2')
    .staggerTo('.s3Path', 0.4, {drawSVG: '100%', ease: Linear.easeNone}, 0.1, '-=0.3')
    .staggerTo('.s4Path', 0.2, {drawSVG: '100%', ease: Linear.easeNone}, 0.07, '-=0.1')
    .from('#dot', 0.01, {autoAlpha: 0}, '-=0.08')
    .to('#dot', 0.4, {yPercent: -300, ease: Power4.easeOut}, '-=0.05')
    .to('.dot-group', 0.4, {scale: 1.4, ease: Power4.easeOut}, '-=0.4')
    .to('#dot', 0.9, {yPercent: -150, ease: 'myBounce'})
    .to('#dot', 0.9, {
      scaleY: 0.6,
      scaleX: 1.2,
      ease: 'myBounce-squash',
      transformOrigin: 'bottom',
      delay: -0.9
    })
    .staggerTo('.iPath', 0.5, {drawSVG: '100%', ease: Linear.easeNone}, 0.05, 'i')
    .staggerTo('.ePath', 0.5, {drawSVG: '100%', ease: Linear.easeNone}, 0.001, '-=0.4')
    .to('#strokes', 0.2, {
      opacity: 0
    });

  const safeToAnimate = window.matchMedia('(prefers-reduced-motion: no-preference)')
    .matches;

  if (safeToAnimate) {
    logoTl.play();
  } else {
    logoTl.progress(1).pause();
  }
})();

// night mode toggle
(function() {
  let light = document.querySelector('#light');
  let toggle = document.querySelector('.js-night-toggle');
  let checkbox = document.querySelector('.js-night-checkbox');

  function toggleMode() {
    document.body.classList.toggle('night');
    document.body.classList.toggle('day');
  }

  let systemDarkModeOn = window.matchMedia('(prefers-color-scheme: dark)').matches
  let localDarkMode = window.localStorage.darkMode 

  if(localDarkMode === "true") {

    checkbox.checked = true;
    document.body.classList.add('night');
    document.body.classList.remove('day');

  } else if (localDarkMode === "false") {

    document.body.classList.add('day');
    document.body.classList.remove('night');

  } else if(systemDarkModeOn) {

    checkbox.checked = true;
    document.body.classList.add('night');
    document.body.classList.remove('day');

  }

  if (!toggle) {
    return;
  }

  if (light) {
    light.addEventListener('mouseup', e => {
      toggleMode();
      checkbox.checked = checkbox.checked ? false : true;

      localStorage.setItem('darkMode', checkbox.checked);
    });
  }

  toggle.addEventListener('change', e => {
    toggleMode();
    localStorage.setItem('darkMode', checkbox.checked ? true : false);
  });
})();

// me
(function() {
  let me = document.querySelector('#me');

  if (!me) {
    return;
  }

  gsap.registerPlugin(CustomEase, CustomWiggle);

  // animation - paused as default
  const meTl = gsap.timeline({
    onComplete: addMouseEvent,
    paused: true
  });

  gsap.set('#bg', {transformOrigin: '50% 50%'});
  gsap.set('#ear-right', {transformOrigin: '0% 50%'});
  gsap.set('#ear-left', {transformOrigin: '100% 50%'});
  gsap.set('#me', {opacity: 1});

  meTl
    .from(
      '#me',
      {duration: 1, yPercent: 100, ease: Elastic.easeOut.config(0.5, 0.4)},
      0.5
    )
    .from(
      ['#head', '.hair', '.shadow'],
      {duration: 0.9, yPercent: 20, ease: Elastic.easeOut.config(0.58, 0.25)},
      0.6
    )
    .from(
      '#ear-right',
      {duration: 1, rotate: 40, yPercent: 10, ease: Elastic.easeOut.config(0.5, 0.2)},
      0.7
    )
    .from(
      '#ear-left',
      {duration: 1, rotate: -40, yPercent: 10, ease: Elastic.easeOut.config(0.5, 0.2)},
      0.7
    )
    .to(
      '#glasses',
      {
        duration: 1,
        keyframes: [{yPercent: -10}, {yPercent: -0}],
        ease: Elastic.easeOut.config(0.5, 0.2)
      },
      0.75
    )
    .from(
      ['#eyebrow-right', '#eyebrow-left'],
      {duration: 1, yPercent: 300, ease: Elastic.easeOut.config(0.5, 0.2)},
      0.7
    )
    .to(['#eye-right', '#eye-left'], {duration: 0.01, opacity: 1}, 0.85)
    .to(['#eye-right-2', '#eye-left-2'], {duration: 0.01, opacity: 0}, 0.85);
  // end animation

  // check for intersection
  // Had to observe the last card because the contact section is sticky so always in VRFieldOfView. bummer
  let mainContent = document.querySelector('.js-last-card');
  let hasBeenInView = false;
  let night = document.querySelector('.night');

  let observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        const isScrollingDown = entry.boundingClientRect.y < entry.rootBounds.y;

        if (entry.intersectionRatio != 0) {
          hasBeenInView = true;
        } else if (hasBeenInView && isScrollingDown) {
          meTl.play().timeScale(0.8);
        } else {
          // rewind and pause animations
          meTl.progress(0).pause();
          blink.progress(0).pause();

          // and remove event listener for mouse
          document.removeEventListener('mousemove', updateScreenCoords);

          //remove the gsap listener controlling animation
          gsap.ticker.remove(animateFace);
        }
      });
    },
    {
      threshold: 0
    }
  );
  observer.observe(mainContent);

  // mouse coords

  let xPosition;
  let yPosition;

  let xPercent;
  let yPercent;

  let height;
  let width;

  function percentage(partialValue, totalValue) {
    return ((100 * partialValue) / totalValue).toFixed(2) * 1;
  }

  function updateWindowSize() {
    height = window.innerHeight;
    width = window.innerWidth;
  }
  updateWindowSize();

  let dizzyIsPlaying;

  function updateScreenCoords(event) {
    if (event && !dizzyIsPlaying) {
      xPosition = event.clientX;
      yPosition = event.clientY;
    }
    if ((event.movementX > 500 || event.movementX < -500) && !dizzyIsPlaying) {
      dizzyIsPlaying = true;
      dizzy.restart();
    }
  }

  let storedXPosition = 0;
  let storedYPosition = 0;

  function animateFace() {
    if (xPosition) {
      // important, only recalculating if the value changes
      if (storedXPosition != xPosition && storedYPosition != yPosition) {
        // console.log(xPosition, yPosition);

        xPercent = percentage(xPosition, width) - 50;
        yPercent = percentage(yPosition, height) - 20;

        yPercentLow = percentage(yPosition, height) - 80;
        yPercentHigh = percentage(yPosition, width) - 50;

        gsap.to('#face', {yPercent: yPercentLow / 30, xPercent: xPercent / 30});
        gsap.to('.eye', {yPercent: yPercent / 3, xPercent: xPercent / 2});
        gsap.to('#inner-face', {yPercent: yPercentHigh / 6, xPercent: xPercent / 8});
        gsap.to('#hair-front', {yPercent: yPercent / 15, xPercent: xPercent / 22});
        gsap.to(['#hair-back', '.shadow'], {
          yPercent: (yPercentLow / 20) * -1,
          xPercent: (xPercent / 20) * -1
        });
        gsap.to('.ear', {
          yPercent: (yPercentHigh / 1.5) * -1,
          xPercent: (xPercent / 10) * -1
        });
        gsap.to(['#eyebrow-left', '#eyebrow-right'], {yPercent: yPercentHigh * 2.5});

        storedXPosition = xPosition;
        storedYPosition = yPosition;
      }
    }
  }

  const blink = gsap.timeline({repeat: -1, repeatDelay: 5, paused: true});
  blink
    .to(['#eye-right', '#eye-left'], {duration: 0.01, opacity: 0}, 0)
    .to(['#eye-right-2', '#eye-left-2'], {duration: 0.01, opacity: 1}, 0)
    .to(['#eye-right', '#eye-left'], {duration: 0.01, opacity: 1}, 0.15)
    .to(['#eye-right-2', '#eye-left-2'], {duration: 0.01, opacity: 0}, 0.15);

  const smile = gsap.timeline({paused: true});
  smile
    .to('#mouth', {duration: 0.01, opacity: 1}, 0)
    .to('#mouth-2', {duration: 0.01, opacity: 0}, 0);

  CustomWiggle.create('myWiggle', {wiggles: 6, type: 'ease-out'});
  CustomWiggle.create('lessWiggle', {wiggles: 4, type: 'ease-in-out'});

  const dizzy = gsap.timeline({paused: true, onComplete: dizzyIsNotPlaying});
  dizzy
    .to('#eyes', {duration: 0.01, opacity: 0}, 0)
    .to('.dizzy', {duration: 0.01, opacity: 0.3}, 0)
    .to('.mouth-g', {duration: 0.01, opacity: 0}, 0)
    .to('#oh', {duration: 0.01, opacity: 0.85}, 0)
    .to(
      ['#head', '#hair-back', '.shadow'],
      {
        duration: 6,
        rotate: 2,
        transformOrigin: '50% 50%',
        ease: 'myWiggle'
      },
      0
    )
    .to(
      '#me',
      {
        duration: 6,
        rotate: -2,
        transformOrigin: '50% 100%',
        ease: 'myWiggle'
      },
      0
    )
    .to(
      '#me',
      {
        duration: 4,
        scale: 0.99,
        transformOrigin: '50% 100%',
        ease: 'lessWiggle'
      },
      0
    )
    .to(
      '.dizzy-1',
      {
        rotate: -360,
        duration: 1,
        repeat: 5,
        transformOrigin: '50% 50%',
        ease: Linear.easeNone
      },
      0.01
    )
    .to(
      '.dizzy-2',
      {
        rotate: 360,
        duration: 1,
        repeat: 5,
        transformOrigin: '50% 50%',
        ease: Linear.easeNone
      },
      0.01
    )
    .to('#eyes', {duration: 0.01, opacity: 1}, 4)
    .to('.dizzy', {duration: 0.01, opacity: 0}, 4)
    .to('#oh', {duration: 0.01, opacity: 0}, 4)
    .to('.mouth-g', {duration: 0.01, opacity: 1}, 4);

  function dizzyIsNotPlaying() {
    dizzyIsPlaying = false;
  }

  let hover = document.querySelectorAll('.js-hover');

  function playSmile() {
    smile.play();
  }

  function stopSmile() {
    smile.progress(0).pause();
  }

  hover.forEach(item => {
    item.addEventListener('mouseover', playSmile);
    item.addEventListener('mouseout', stopSmile);
  });

  // function being called at the end of main timeline
  function addMouseEvent() {
    const safeToAnimate = window.matchMedia('(prefers-reduced-motion: no-preference)')
      .matches;

    if (safeToAnimate) {
      document.addEventListener('mousemove', updateScreenCoords);

      // gsap's RAF, falls back to set timeout
      gsap.ticker.add(animateFace);

      blink.play();
    }
  }

  window.addEventListener('resize', updateWindowSize);
})();

// video player
(function() {
  const video = document.querySelector('#js-featured-video');
  const loader = document.querySelector('#js-featured-loader');
  const tabs = document.querySelectorAll('#js-featured-tab');

  if (!video || !tabs) {
    return;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();

      const clickedTab = event.target;
      var previousTab = document.querySelector('[aria-selected="true"]');

      previousTab.setAttribute('aria-selected', false);
      clickedTab.setAttribute('aria-selected', true);

      const url = clickedTab.getAttribute('data-href');
      const title = clickedTab.getAttribute('data-title');

      video.style.opacity = '0';
      loader.style.opacity = '1';
      loader.style.animationPlayState = 'running';

      video.src = url;
      video.title = `Video player: ${title}`;

      setTimeout(function() {
        loader.style.animationPlayState = 'paused';
        video.style.opacity = '1';
        loader.style.opacity = '0';
      }, 800);
    });
  });
})();

// computer
(function() {
  let illustration = document.querySelector('.Illustration');
  if (!illustration) {
    return;
  }

  const safeToAnimate = window.matchMedia('(prefers-reduced-motion: no-preference)')
    .matches;

  if (!safeToAnimate || window.innerWidth < 800) {
    return;
  }

  let fun = document.querySelector('.js-fun');

  let isPlaying = false;

  function playShapes() {
    if (!isPlaying) {
      isPlaying = true;

      gsap.to('#shapes > *', {
        ease: Sine.easeOut,
        onComplete: isFinished,
        keyframes: [
          {x: 0, y: 0, opacity: 0},
          {
            opacity: 1,
            duration: 0.001
          },
          {
            x: '+=random(-150, 150)',
            y: '+=random(-200, 20)',
            rotate: '+=random(-360, 360)',
            duration: 2
          },
          {
            opacity: 0,
            delay: -0.4,
            duration: 0.4
          }
        ]
      });
    }

    function isFinished() {
      isPlaying = false;
    }
  }

  fun.addEventListener('mouseover', playShapes);

  const computer = gsap.timeline({
    scrollTrigger: {
      trigger: '.Illustration',
      toggleActions: 'play reset resume none',
      start: 'top top', // when the top of the trigger hits the top of the viewport
      end: '+=1000' // end after scrolling 500px beyond the start
    }
  });

  computer
    .to(
      '#cursor',
      {
        repeat: 20,
        keyframes: [
          {
            opacity: 0,
            duration: 0.01,
            delay: 0.4
          },
          {
            opacity: 1,
            duration: 0.01,
            delay: 0.4
          }
        ]
      },
      0
    )
    .from(
      '.line',
      {
        scaleX: 0,
        ease: Sine.easeOut,
        stagger: {
          duration: 3,
          amount: 3
        }
      },
      0
    )
    .to(
      '#website',
      {
        ease: Sine.easeInOut,
        yPercent: -60,
        duration: 4
      },
      1
    )
    .to(
      '#scrollbar',
      {
        ease: Sine.easeInOut,
        yPercent: 260,
        duration: 4
      },
      1
    )
    .to(
      '#iterm',
      {
        opacity: 1,
        delay: -0.1,
        duration: 0.01
      },
      2
    )
    .from(
      '#iterm',
      {
        ease: Elastic.easeOut.config(0.17, 0.2),
        transformOrigin: '50% 50%',
        y: 60,
        x: -20,
        duration: 1,
        scale: 0
      },
      2
    )
    .fromTo(
      '.steam',
      {
        opacity: 1,
        drawSVG: '0%'
      },
      {
        drawSVG: '100%',
        duration: 3,
        stagger: {
          each: 0.5
        }
      },
      2
    )
    .to(
      '.steam',
      {
        opacity: 0,
        duration: 4,
        stagger: {
          each: 0.5
        }
      },
      3
    );
})();

// browser draggable
(function() {
  const safeToAnimate = window.matchMedia('(prefers-reduced-motion: no-preference)')
    .matches;

  if (!safeToAnimate || window.innerWidth < 800) {
    return;
  }

  let browsers = document.querySelectorAll('.js-browser');

  if (!browsers) {
    return;
  }

  Draggable.create('.js-browser', {
    bounds: document.querySelector('.js-browsers')
  });
})();

(function() {
  let hoverTalk = document.querySelector('.js-hover-talk');

  if (!hoverTalk) {
    return;
  }

  const safeToAnimate = window.matchMedia('(prefers-reduced-motion: no-preference)')
    .matches;

  if (!safeToAnimate || window.innerWidth < 800) {
    return;
  }

  const tl = gsap.timeline({paused: true});

  tl.to(
    '.gsap-swipe',
    {
      opacity: 1,
      duration: 0.0001
    },
    0
  )
    .from(
      '.gsap-swipe',
      {
        rotate: -30,
        duration: 3,
        transformOrigin: '30% 80%',
        ease: Elastic.easeOut.config(1, 0.5)
      },
      0
    )
    .fromTo(
      '.swipe',
      {
        xPercent: -100
      },
      {
        duration: 1,
        xPercent: 100,
        ease: Sine.easeInOut,
        stagger: {
          each: 0.15
        }
      },
      0
    )
    .from(
      '.maskSwipe',
      {
        xPercent: -100,
        ease: Sine.easeInOut
      },
      0.4
    )
    .from(
      '#hello',
      {
        duration: 1.5,
        drawSVG: '0%'
      },
      1
    )
    .from(
      '.swoop',
      {
        duration: 2,
        drawSVG: '0%'
      },
      1
    )
    .from(
      '.line',
      {
        drawSVG: '0%',
        duration: 0.5,
        stagger: {
          each: 0.2
        }
      },
      1
    )
    .from(
      '.shape',
      {
        scale: 0,
        duration: 1.3,
        transformOrigin: '50% 50%',
        rotate: '+=random(-60, 60)',
        ease: Elastic.easeOut.config(1, 0.8),
        stagger: {
          each: 0.2
        }
      },
      0.2
    );

  hoverTalk.addEventListener('mouseover', playTl);
  hoverTalk.addEventListener('mouseout', resetTl);

  function playTl() {
    tl.timeScale(1.2).restart();
  }

  function resetTl() {
    tl.progress(0).pause();
  }
})();

(function() {
  let hoverWrite = document.querySelector('.js-hover-write');

  if (!hoverWrite) {
    return;
  }

  const safeToAnimate = window.matchMedia('(prefers-reduced-motion: no-preference)')
    .matches;

  if (!safeToAnimate || window.innerWidth < 800) {
    return;
  }

  gsap.registerPlugin(Physics2DPlugin);

  const tl = gsap.timeline({paused: true});

  for (let i = 0; i < 20; i++) {
    hoverWrite.insertAdjacentHTML('beforeend', `<span class="js-pencil${i}">✏️</span>`);
    tl.to(
      `.js-pencil${i}`,
      {
        keyframes: [
          {
            opacity: 1,
            duration: 0.01
          },
          {
            duration: 3,
            physics2D: {
              velocity: Math.random() * 400 + 150,
              angle: Math.random() * 40 + 250,
              gravity: 600
            }
          },
          {
            opacity: 0,
            duration: 0.3,
            delay: -0.3
          }
        ]
      },
      Math.random() * 1
    );
  }

  hoverWrite.addEventListener('mouseover', playTl);

  function playTl() {
    tl.restart();
  }
})();
