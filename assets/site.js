// Gadasını Aldığım — ortak scriptler
(function () {
    // Mobil menü
    var btn = document.getElementById('menu-btn');
    var menu = document.getElementById('mobile-menu');
    if (btn && menu) {
        var setOpen = function (open) {
            menu.hidden = !open;
            btn.setAttribute('aria-expanded', String(open));
            btn.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
            btn.querySelector('.icon-open').classList.toggle('hidden', open);
            btn.querySelector('.icon-close').classList.toggle('hidden', !open);
        };
        btn.addEventListener('click', function () { setOpen(menu.hidden); });
        menu.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () { setOpen(false); });
        });
        window.addEventListener('resize', function () {
            if (window.innerWidth >= 768) setOpen(false);
        });
    }

    // Kaydırınca üst menüye ince çizgi/gölge
    var header = document.querySelector('.site-header');
    if (header) {
        var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Görünürken beliren öğeler
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('is-in');
                    io.unobserve(e.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('is-in'); });
    }

    // Ana sayfa: yazı makinesi efekti
    var tw = document.getElementById('typewriter');
    if (tw) {
        var phrases = ['mantı', 'gözleme', 'yağlama', 'içli köfte', 'çi börek'];
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
            tw.textContent = phrases[0];
        } else {
            var p = 0, c = 0, del = false;
            var tick = function () {
                var word = phrases[p];
                c += del ? -1 : 1;
                tw.textContent = word.substring(0, c);
                var wait = del ? 60 : 120;
                if (!del && c === word.length) { del = true; wait = 1800; }
                else if (del && c === 0) { del = false; p = (p + 1) % phrases.length; wait = 400; }
                setTimeout(tick, wait);
            };
            tick();
        }
    }

    // Menü sayfası: kategori çubuğunda aktif bölümü işaretle
    var chips = document.querySelectorAll('.chip[href^="#"]');
    if (chips.length && 'IntersectionObserver' in window) {
        var byId = {};
        chips.forEach(function (ch) { byId[ch.getAttribute('href').slice(1)] = ch; });
        var setActive = function (id) {
            chips.forEach(function (ch) { ch.classList.remove('is-active'); });
            var ch = byId[id];
            if (ch) {
                ch.classList.add('is-active');
                var bar = ch.parentElement;
                bar.scrollTo({ left: ch.offsetLeft - bar.clientWidth / 2 + ch.clientWidth / 2, behavior: 'smooth' });
            }
        };
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
        }, { rootMargin: '-35% 0px -60% 0px' });
        Object.keys(byId).forEach(function (id) {
            var sec = document.getElementById(id);
            if (sec) spy.observe(sec);
        });
    }
})();
