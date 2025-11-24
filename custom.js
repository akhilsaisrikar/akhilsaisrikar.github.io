
  (function ($) {
  
  "use strict";

    // MENU
    $('.navbar-collapse a').on('click',function(){
      $(".navbar-collapse").collapse('hide');
    });
    
    // CUSTOM LINK
    $('.smoothscroll').click(function(){
      var el = $(this).attr('href');
      var elWrapped = $(el);
      var header_height = $('.navbar').height();
  
      scrollToDiv(elWrapped,header_height);
      return false;
  
      function scrollToDiv(element,navheight){
        var offset = element.offset();
        var offsetTop = offset.top;
        var totalScroll = offsetTop-navheight;
  
        $('body,html').animate({
        scrollTop: totalScroll
        }, 300);
      }
    });

    $(window).on('scroll', function(){
      function isScrollIntoView(elem, index) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(window).height()*.5;
        if(elemBottom <= docViewBottom && elemTop >= docViewTop) {
          $(elem).addClass('active');
        }
        if(!(elemBottom <= docViewBottom)) {
          $(elem).removeClass('active');
        }
        var MainTimelineContainer = $('#vertical-scrollable-timeline')[0];
        var MainTimelineContainerBottom = MainTimelineContainer.getBoundingClientRect().bottom - $(window).height()*.5;
        $(MainTimelineContainer).find('.inner').css('height',MainTimelineContainerBottom+'px');
      }
      var timeline = $('#vertical-scrollable-timeline li');
      Array.from(timeline).forEach(isScrollIntoView);
    });
  
  })(window.jQuery);
  // custom.js: Enhanced Course Marquee Stop/Resume

document.addEventListener('DOMContentLoaded', function() {
    const scrollingLines = document.querySelectorAll('.course-scrolling-line');
    
    scrollingLines.forEach(line => {
        const wrapper = line.querySelector('.course-list-wrapper');
        
        // Pause animation when mouse enters the line (covers both line and card hover)
        line.addEventListener('mouseenter', () => {
            wrapper.style.animationPlayState = 'paused';
        });

        // Resume animation when mouse leaves the line
        line.addEventListener('mouseleave', () => {
            wrapper.style.animationPlayState = 'running';
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
  const portfolioData = [
    { id: 1, title: 'Neural Network', description: 'AI with deep learning.', image: 'https://picsum.photos/id/1011/800/600', tech: ['TensorFlow','Python'] },
    { id: 2, title: 'Quantum Cloud', description: 'Quantum computing cloud.', image: 'https://picsum.photos/id/1027/800/600', tech: ['AWS','Docker'] },
    { id: 3, title: 'Blockchain Vault', description: 'Decentralized storage.', image: 'https://picsum.photos/id/1043/800/600', tech: ['Solidity','Web3'] },
    { id: 4, title: 'Cyber Defense', description: 'Real-time threat detection.', image: 'https://picsum.photos/id/1057/800/600', tech: ['AI Defense','Encryption'] },
    { id: 5, title: 'Vision Engine', description: 'AI-based image analysis.', image: 'https://picsum.photos/id/1062/800/600', tech: ['OpenCV','PyTorch'] },
    { id: 6, title: 'DataSphere', description: 'Global data visualization.', image: 'https://picsum.photos/id/1074/800/600', tech: ['BigQuery','Kubernetes'] },
    { id: 7, title: 'MetaVerse Core', description: 'Immersive 3D experiences.', image: 'https://picsum.photos/id/1084/800/600', tech: ['Unity','VR'] }
  ];

  let currentIndex = 0;
  const carousel = document.getElementById('carousel');

  function createCarouselItem(data) {
    const item = document.createElement('div');
    item.className = 'hero-carousel-item';
    item.innerHTML = `
      <div class="hero-carousel-card">
        <div class="hero-carousel-card-image"><img src="${data.image}" alt="${data.title}"></div>
        <h3 class="hero-carousel-card-title">${data.title}</h3>
        <p class="hero-carousel-card-description">${data.description}</p>
        <div class="hero-carousel-card-tech">${data.tech.map(t => `<span class='hero-carousel-tech-badge'>${t}</span>`).join('')}</div>
        <button class="hero-carousel-card-cta">Explore</button>
      </div>`;
    return item;
  }

  function initCarousel() {
    portfolioData.forEach(d => carousel.appendChild(createCarouselItem(d)));
    updateCarousel();
  }

  function updateCarousel() {
    const items = document.querySelectorAll('.hero-carousel-item');
    const total = items.length;
    const isMobile = window.innerWidth <= 768;
    let spacing = isMobile ? 220 : 260;
    let depth = isMobile ? 160 : 200;
    let rotateY = 15;

    items.forEach((item, i) => {
      let offset = i - currentIndex;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;
      const abs = Math.abs(offset);
      const sign = offset < 0 ? -1 : 1;
      item.style.transition = 'all 0.8s ease';

      if (abs === 0) {
        item.style.transform = 'translate(-50%, -50%) translateZ(0) scale(1)';
        item.style.opacity = '1';
        item.style.zIndex = '10';
      } else if (abs <= 3) {
        const x = sign * spacing * abs;
        const z = -depth * abs;
        const r = -sign * rotateY * abs;
        const s = 1 - abs * 0.1;
        const o = 1 - abs * 0.15;
        item.style.transform = `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${r}deg) scale(${s})`;
        item.style.opacity = o;
        item.style.zIndex = `${10 - abs}`;
      } else {
        item.style.transform = 'translate(-50%, -50%) translateZ(-600px) scale(0.5)';
        item.style.opacity = '0';
        item.style.zIndex = '1';
      }
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % portfolioData.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + portfolioData.length) % portfolioData.length;
    updateCarousel();
  }

  document.getElementById('nextBtn').addEventListener('click', nextSlide);
  document.getElementById('prevBtn').addEventListener('click', prevSlide);
  window.addEventListener('resize', () => setTimeout(updateCarousel, 300));
  setInterval(nextSlide, 5000);

  initCarousel();
});

