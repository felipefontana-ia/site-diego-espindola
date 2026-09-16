(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ano no footer
  var anoEl = document.getElementById('ano');
  if(anoEl) anoEl.textContent = new Date().getFullYear();

  // menu mobile
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  if(navToggle && navMenu){
    navToggle.addEventListener('click', function(){
      var open = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navMenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // scrollspy
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = links.map(function(l){ return document.querySelector(l.getAttribute('href')); }).filter(Boolean);
  if('IntersectionObserver' in window && sections.length){
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          links.forEach(function(l){ l.classList.remove('active'); });
          var match = links.find(function(l){ return l.getAttribute('href') === '#' + entry.target.id; });
          if(match) match.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function(s){ spy.observe(s); });
  }

  // Tier 0 fallback (no CDN / reduced-motion / Tier 2 error) — always works
  function revealTier0(){
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold:0.15, rootMargin:'0px 0px -10% 0px' });
      document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
    } else {
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('is-visible'); });
    }
  }

  // Tier 2: GSAP + ScrollTrigger + Lenis — slow smooth scroll + cascading reveal.
  // Falls back cleanly to Tier 0 when the CDN scripts didn't load, when the visitor
  // asked for reduced motion, or if anything here throws (never risk hiding content).
  var tier2ok = false;
  if(!reduce && window.gsap && window.ScrollTrigger && window.Lenis){
    try{
      gsap.registerPlugin(ScrollTrigger);

      // smooth scroll (Lenis)
      var lenis = new Lenis({ duration: 1.7, easing: function(t){ return 1 - Math.pow(1 - t, 4); }, smoothWheel: true, wheelMultiplier: 0.9 });
      gsap.ticker.add(function(t){ lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      lenis.on('scroll', ScrollTrigger.update);

      // content fades in WHILE scrolling — real time, no delay
      var reveals = gsap.utils.toArray('.reveal');
      function updateReveals(){
        reveals.forEach(function(el){
          var rect = el.getBoundingClientRect();
          var viewportHeight = window.innerHeight;
          var triggerPoint = viewportHeight * 0.85; // start fading when 85% down
          var endPoint = viewportHeight * 0.5; // fully visible at 50% down

          if(rect.top < triggerPoint && rect.top > endPoint){
            // in the fade zone — calculate progress
            var progress = (triggerPoint - rect.top) / (triggerPoint - endPoint);
            el.style.opacity = Math.max(0, Math.min(1, progress));
          } else if(rect.top <= endPoint){
            el.style.opacity = '1'; // fully visible
          } else {
            el.style.opacity = '0'; // not yet in view
          }
        });
      }

      window.addEventListener('scroll', updateReveals, { passive:true });
      updateReveals(); // initial check

      // recalculate trigger positions once fonts/images settle layout
      if(document.fonts && document.fonts.ready){
        document.fonts.ready.then(function(){ ScrollTrigger.refresh(); });
      }
      window.addEventListener('load', function(){ ScrollTrigger.refresh(); });

      tier2ok = true;
    }catch(err){
      tier2ok = false;
    }
  }
  if(!tier2ok) revealTier0();

  // Belt-and-suspenders failsafe: only force-reveal a .reveal element that has
  // ALREADY scrolled into view but is stuck at opacity 0 (a broken trigger) —
  // never blanket-reveal everything, or below-the-fold sections would lose the
  // scroll-reveal effect entirely.
  function failsafeReveal(){
    document.querySelectorAll('.reveal').forEach(function(el){
      var r = el.getBoundingClientRect();
      if(r.top < window.innerHeight && getComputedStyle(el).opacity === '0'){
        el.classList.add('is-visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    });
  }
  var failsafeT;
  window.addEventListener('scroll', function(){
    clearTimeout(failsafeT);
    failsafeT = setTimeout(failsafeReveal, 400);
  }, { passive:true });
  setTimeout(failsafeReveal, 1500);

  // formulário -> WhatsApp
  var form = document.getElementById('contatoForm');
  var telInput = document.getElementById('telefone');
  if(form && telInput){
    // phone mask: formats as (XX) XXXXX-XXXX as you type
    telInput.addEventListener('input', function(e){
      var v = e.target.value.replace(/\D/g, '');
      var formatted = '';
      if(v.length > 0) formatted += '(' + v.slice(0,2);
      if(v.length > 2) formatted += ') ' + v.slice(2,7);
      if(v.length > 7) formatted += '-' + v.slice(7,11);
      e.target.value = formatted;
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var errorEl = document.getElementById('formError');
      if(!form.checkValidity()){
        form.reportValidity();
        if(errorEl) errorEl.hidden = false;
        return;
      }

      // validate phone is complete (11 digits for Brazilian number)
      var tel = document.getElementById('telefone').value.trim();
      var telDigits = tel.replace(/\D/g, '').length;
      if(telDigits !== 11){
        if(errorEl){
          errorEl.textContent = 'Preencha o WhatsApp completamente (11 dígitos).';
          errorEl.hidden = false;
        }
        return;
      }

      if(errorEl) errorEl.hidden = true;
      var nome = document.getElementById('nome').value.trim();
      var msg = document.getElementById('mensagem').value.trim();

      // formatted message with line breaks and structure
      var text = '*AGENDAMENTO DE CONSULTA*\n' +
        '━━━━━━━━━━━━━━━━━━━\n\n' +
        '*Nome:* ' + nome + '\n' +
        '*WhatsApp:* ' + tel + '\n' +
        (msg ? '*Mensagem:*\n' + msg : '*Solicitação:*\nGostaria de agendar uma consulta');

      var url = 'https://wa.me/5582994270960?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');
    });
  }

  // cookie banner (LGPD)
  var bar = document.getElementById('cookie-bar');
  if(bar){
    try{
      if(!localStorage.getItem('cookie-consent')) bar.hidden = false;
    }catch(err){ bar.hidden = false; }
    var accept = document.getElementById('cookie-accept');
    var reject = document.getElementById('cookie-reject');
    var setConsent = function(v){
      try{ localStorage.setItem('cookie-consent', v); }catch(err){}
      bar.hidden = true;
    };
    if(accept) accept.addEventListener('click', function(){ setConsent('accept'); });
    if(reject) reject.addEventListener('click', function(){ setConsent('reject'); });
  }
})();
