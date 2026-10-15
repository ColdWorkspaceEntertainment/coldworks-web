// =========================================================================
//  INTERACTION STATION — train.js
//  Adds the opening intro, the train on the rail, the "Next stop" page
//  transition, Fizzy's greetings and arrow-key riding.
//  script.js is NOT changed: this file only replaces cwSwitchToPage()
//  with a version that plays the train animation around the same page swap.
// =========================================================================
(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------- Opening intro ---------------- */
    var intro = document.getElementById('station-intro');
    if (intro) {
        var seen = false;
        try { seen = sessionStorage.getItem('cw_intro_seen') === '1'; } catch (e) {}

        if (seen || reduceMotion) {
            intro.classList.add('is-skipped');
        } else {
            var finishIntro = function () {
                if (intro.classList.contains('is-done')) return;
                intro.classList.add('is-done');
                try { sessionStorage.setItem('cw_intro_seen', '1'); } catch (e) {}
                setTimeout(function () { intro.classList.add('is-skipped'); }, 700);
            };
            setTimeout(finishIntro, 2600);
            intro.addEventListener('click', finishIntro); // click to skip
        }
    }

    /* ---------------- Rail, stops and train ---------------- */
    var railScroll = document.getElementById('railScroll');
    var train = document.getElementById('train');
    var stops = Array.prototype.slice.call(document.querySelectorAll('.rail-track .stop'));
    var stationName = document.getElementById('stationName');
    var wipe = document.getElementById('stationWipe');
    var wipeName = document.getElementById('wipeName');

    // Legal pages and the sitemap all share the last stop
    var STOP_ALIAS = {
        'privacy-policy': 'info',
        'cookie-policy': 'info',
        'terms-of-use': 'info',
        'sitemap': 'info'
    };

    var currentPage = 'welcome';
    var lastX = 0;
    var busy = false;

    function stopFor(pageKey) {
        var key = STOP_ALIAS[pageKey] || pageKey;
        for (var i = 0; i < stops.length; i++) {
            if (stops[i].getAttribute('data-stop') === key) return stops[i];
        }
        return null;
    }

    function moveTrain(pageKey, animate) {
        var stop = stopFor(pageKey);
        if (!stop || !train) return;

        var dot = stop.querySelector('.stop-dot');
        var center = stop.offsetLeft + (dot ? dot.offsetLeft + dot.offsetWidth / 2 : stop.offsetWidth / 2);
        var x = Math.round(center - train.offsetWidth / 2);

        train.classList.toggle('facing-left', x < lastX);
        if (!animate) {
            train.style.transition = 'none';
            train.style.transform = 'translateX(' + x + 'px)';
            void train.offsetWidth; // apply instantly
            train.style.transition = '';
        } else {
            train.classList.add('is-moving');
            train.style.transform = 'translateX(' + x + 'px)';
            setTimeout(function () { train.classList.remove('is-moving'); }, 1000);
        }
        lastX = x;

        stops.forEach(function (s) {
            var on = s === stop;
            s.classList.toggle('is-current', on);
            if (on) s.setAttribute('aria-current', 'page'); else s.removeAttribute('aria-current');
        });
        if (stationName) stationName.textContent = stop.getAttribute('data-label');

        // keep the current stop visible on narrow screens
        if (railScroll) {
            var target = center - railScroll.clientWidth / 2;
            railScroll.scrollTo({ left: target, behavior: animate && !reduceMotion ? 'smooth' : 'auto' });
        }
    }

    // Same page swap as the original cwSwitchToPage in script.js
    function showPage(pageKey, target) {
        document.querySelectorAll('[data-page].page-visible').forEach(function (el) {
            el.classList.remove('page-visible');
        });
        var group = document.querySelectorAll('[data-page="' + pageKey + '"]');
        group.forEach(function (el) { el.classList.add('page-visible'); });

        window.scrollTo(0, 0);
        if (target && group.length && target !== group[0]) {
            target.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    }

    // Replaces script.js's cwSwitchToPage (setupPageNavigation calls it by name)
    window.cwSwitchToPage = function (target) {
        var pageKey = target.getAttribute('data-page') || target.id;
        if (!pageKey) return;

        if (pageKey === currentPage) {
            showPage(pageKey, target);
            return;
        }
        if (busy) return;

        var stop = stopFor(pageKey);
        if (wipeName && stop) wipeName.textContent = stop.getAttribute('data-label');
        currentPage = pageKey;

        if (reduceMotion || !wipe) {
            showPage(pageKey, target);
            moveTrain(pageKey, false);
            return;
        }

        busy = true;
        moveTrain(pageKey, true);
        wipe.classList.remove('out');
        wipe.classList.add('in');

        setTimeout(function () {
            showPage(pageKey, target);
            wipe.classList.remove('in');
            wipe.classList.add('out');
            setTimeout(function () {
                wipe.classList.remove('out');
                busy = false;
            }, 440);
        }, 470);
    };

    /* ---------------- Arrow keys: ride to the previous / next stop ---------------- */
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        if (e.altKey || e.ctrlKey || e.metaKey) return;

        var el = document.activeElement;
        var tag = el && el.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el && el.isContentEditable)) return;
        if (document.querySelector('.wii-menu-overlay.open')) return;
        var openModal = Array.prototype.some.call(document.querySelectorAll('.modal-overlay'), function (m) {
            return m.style.display === 'flex';
        });
        if (openModal) return;

        var current = stopFor(currentPage);
        var index = stops.indexOf(current);
        var next = stops[index + (e.key === 'ArrowRight' ? 1 : -1)];
        if (!next) return;

        var targetEl = document.querySelector(next.getAttribute('href'));
        if (targetEl) {
            e.preventDefault();
            window.cwSwitchToPage(targetEl);
        }
    });

    /* ---------------- Fizzy, the station host ---------------- */
    var fizzyBtn = document.getElementById('fizzyBtn');
    var fizzyImg = document.getElementById('fizzyImg');
    var fizzyLine = document.getElementById('fizzyLine');

    function lang() {
        var sel = document.getElementById('langSelect');
        return sel && sel.value === 'en' ? 'en' : 'tr';
    }

    function greeting() {
        var h = new Date().getHours();
        if (lang() === 'en') {
            return h < 12 ? 'Good morning, welcome aboard!' : h < 18 ? 'Good afternoon, welcome aboard!' : 'Good evening, welcome aboard!';
        }
        return h < 12 ? 'Günaydın, hoş geldin!' : h < 18 ? 'İyi günler, hoş geldin!' : 'İyi akşamlar, hoş geldin!';
    }

    var LINES = {
        tr: [
            'Ben Fizzy, bu istasyonun yöneticisiyim.',
            'Aşağıdaki kalkış panosundan bir yer seç, tren seni götürsün.',
            'Klavyedeki ← ve → oklarıyla duraklar arasında gezebilirsin.',
            'Sağ üstteki Ana Menü tüm hattın haritası.',
            'Galeriye uğramadan gitme, harika eserler var!'
        ],
        en: [
            "I'm Fizzy, I run this station.",
            'Pick a destination on the board below and the train will take you there.',
            'Use the ← and → keys to ride between stations.',
            'The Main Menu at the top right is the map of the whole line.',
            "Don't leave without visiting the gallery!"
        ]
    };
    var lineIndex = -1;
    var typing = null;

    function say(text) {
        if (!fizzyLine) return;
        clearInterval(typing);
        if (reduceMotion) { fizzyLine.textContent = text; return; }
        var i = 0;
        fizzyLine.textContent = '';
        typing = setInterval(function () {
            i++;
            fizzyLine.textContent = text.slice(0, i);
            if (i >= text.length) clearInterval(typing);
        }, 22);
    }

    if (fizzyImg && fizzyBtn) {
        // No images/fizzy.png yet? Show the lettered badge instead.
        fizzyImg.addEventListener('error', function () { fizzyBtn.classList.add('no-image'); });
        if (fizzyImg.complete && fizzyImg.naturalWidth === 0) fizzyBtn.classList.add('no-image');
    }

    if (fizzyBtn) {
        fizzyBtn.addEventListener('click', function () {
            var lines = LINES[lang()];
            lineIndex = (lineIndex + 1) % lines.length;
            say(lines[lineIndex]);
            fizzyBtn.classList.remove('is-talking');
            void fizzyBtn.offsetWidth;
            fizzyBtn.classList.add('is-talking');
        });
    }

    var langSel = document.getElementById('langSelect');
    if (langSel) langSel.addEventListener('change', function () { lineIndex = -1; say(greeting()); });

    /* ---------------- Departure board clock ---------------- */
    var clock = document.getElementById('boardClock');
    function tick() {
        if (!clock) return;
        var d = new Date();
        var hh = String(d.getHours()).padStart(2, '0');
        var mm = String(d.getMinutes()).padStart(2, '0');
        clock.innerHTML = hh + '<span class="colon">:</span>' + mm;
        clock.setAttribute('datetime', hh + ':' + mm);
    }
    tick();
    setInterval(tick, 10000);

    /* ---------------- Start ---------------- */
    function start() {
        moveTrain(currentPage, false);
        // Wait for the intro (if it plays) before Fizzy speaks
        var delay = intro && !intro.classList.contains('is-skipped') ? 2900 : 300;
        setTimeout(function () { say(greeting()); }, delay);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
    window.addEventListener('load', function () { moveTrain(currentPage, false); });
    window.addEventListener('resize', function () { moveTrain(currentPage, false); });
})();
