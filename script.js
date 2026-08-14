// ============ INTRO SPLASH KALDIRMA ============
// Önceki sürümde bu kod yanlışlıkla ac() fonksiyonunun İÇİNE yazılmıştı.
// DOMContentLoaded olayı sayfa yüklendiğinde bir kez tetiklenir; ac() fonksiyonu
// ilk kez bir sanat eserine tıklandığında çalıştığı için o zamana kadar
// DOMContentLoaded çoktan geçmiş oluyor ve listener hiç tetiklenmiyordu.
// Artık en üst seviyede, sayfa yüklenir yüklenmez çalışıyor.
document.addEventListener('DOMContentLoaded', () => {
    const intro = document.getElementById('site-intro');
    if (intro) {
        // CSS animasyonu bittiğinde (introFadeOut) elementi DOM'dan kaldır
        intro.addEventListener('animationend', () => intro.remove());
        // Animasyon herhangi bir nedenle tetiklenmezse yedek zamanlayıcı
        setTimeout(() => intro.remove(), 3200);
    }

    setupUpdateMenu();
    setupMobileNav();
    setupModalKeyboardClose();
});

// ============ SANAT ESERİ MODAL ============
function ac(el) {
    var modal = document.getElementById('profil');
    var isimText = document.getElementById('isim-text');
    var sanatciText = document.getElementById('kutu-sanatci');
    var kutuResim = document.getElementById('kutu-resim');
    var rozet = document.getElementById('rozet');

    if (modal && isimText && sanatciText && kutuResim) {
        isimText.innerText = el.getAttribute('data-isim') || '';
        sanatciText.innerText = el.getAttribute('data-sanatci') || '';
        kutuResim.src = el.getAttribute('data-resim') || '';
        if (el.getAttribute('data-verified') === 'true') {
            rozet.style.display = 'inline-block';
            rozet.style.width = '16px';
        } else {
            rozet.style.display = 'none';
        }
        modal.style.display = 'flex';
    }
}

function kapatModal() {
    var modal = document.getElementById('profil');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Galeri öğeleri artık klavye ile de (Enter/Space) açılabiliyor (tabindex + role="button" HTML'de eklendi)
document.addEventListener('keydown', function (event) {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.classList && event.target.classList.contains('art-item')) {
        event.preventDefault();
        ac(event.target);
    }
});

// Modal dışına tıklayınca kapansın
window.addEventListener('click', function (event) {
    var modal = document.getElementById('profil');
    if (modal && event.target === modal) {
        kapatModal();
    }
});

// Modal açıkken Escape tuşuyla kapansın
function setupModalKeyboardClose() {
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            kapatModal();
        }
    });
}

// ============ UPDATE LOG MENÜSÜ ============
function setupUpdateMenu() {
    var toggleBtn = document.getElementById('updateToggleBtn');
    var dropdown = document.getElementById('updateDropdown');
    if (!toggleBtn || !dropdown) return;

    toggleBtn.addEventListener('click', function (event) {
        event.stopPropagation();
        var isOpen = dropdown.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Dışarı tıklanınca kapat
    document.addEventListener('click', function (event) {
        if (!dropdown.contains(event.target) && event.target !== toggleBtn) {
            dropdown.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

// ============ MOBİL NAVİGASYON MENÜSÜ ============
// Önceki sürümde 768px altında .nav-links tamamen gizleniyordu ve
// yerine geçecek bir menü olmadığı için mobilde site içi gezinme imkansızdı.
function setupMobileNav() {
    var navToggle = document.getElementById('navToggleBtn');
    var navLinks = document.getElementById('navLinks');
    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', function () {
        var isOpen = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Bir bağlantıya tıklanınca menüyü kapat
    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}
