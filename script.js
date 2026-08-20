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
    setupPageNavigation();

    // Hesap sistemi / misafir kilidi / cookie onayı
    setupAuthMenu();
    setupGuestLocks();
    setupCookieConsent();
    cwRefreshAuthUI();

    // Wii tarzı ana menü / dil seçici
    setupMainMenu();
    setupLanguageSwitcher();
});

// ============ WII TARZI SAYFA GEZİNMESİ ============
// Artık bölümler alt alta kaydırılmıyor: her "#hedef" bağlantısı, hedefin
// data-page değerine (yoksa kendi id'sine) göre TEK bir bölümü görünür
// yapıp diğer tüm [data-page] bölümlerini gizler. Birden fazla <section>
// aynı data-page değerine sahip olabilir (ör. "musics" grubu) — bu durumda
// hepsi birlikte gösterilir/gizlenir.
var CW_PAGE_FADE_DURATION = 280; // CSS'teki 0.28s ile aynı olmalı

function setupPageNavigation() {
    var links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {
        link.addEventListener('click', function (event) {
            var targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            var target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            cwSwitchToPage(target);
        });
    });
}

function cwSwitchToPage(target) {
    var pageKey = target.getAttribute('data-page') || target.id;
    if (!pageKey) return;

    document.body.classList.add('page-fading');

    setTimeout(function () {
        document.querySelectorAll('[data-page].page-visible').forEach(function (el) {
            el.classList.remove('page-visible');
        });
        document.querySelectorAll('[data-page="' + pageKey + '"]').forEach(function (el) {
            el.classList.add('page-visible');
        });

        window.scrollTo(0, 0);
        target.scrollIntoView({ behavior: 'auto', block: 'start' });

        document.body.classList.remove('page-fading');
    }, CW_PAGE_FADE_DURATION);
}

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

    var authModal = document.getElementById('authModal');
    if (authModal && event.target === authModal) {
        closeAuthModal();
    }

    var guestModal = document.getElementById('guestLockModal');
    if (guestModal && event.target === guestModal) {
        closeGuestLockModal();
    }
});

// Modal açıkken Escape tuşuyla kapansın
function setupModalKeyboardClose() {
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            kapatModal();
            closeAuthModal();
            closeGuestLockModal();
            if (window.cwCloseMainMenu) window.cwCloseMainMenu();
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
// Not: navToggleBtn / navLinks artık HTML'de bulunmuyor (yerlerini Wii tarzı
// ana menü aldı); bu fonksiyon dokunulmadan bırakıldı, elemanlar bulunamadığı
// için aşağıdaki erken "return" ile sorunsuzca hiçbir şey yapmıyor.
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

// ============================================================
// ============ HESAP SİSTEMİ (LOCAL / TARAYICI TABANLI) ======
// ============================================================
// NOT: Bu sistem tamamen tarayıcının localStorage'ında çalışır.
// Gerçek bir sunucu/veritabanı YOKTUR. Bu yüzden:
//  - Bir hesap sadece kayıt olunan tarayıcı/cihazda geçerlidir,
//    başka bir cihazdan aynı bilgilerle giriş yapılamaz.
//  - Tarayıcı geçmişi/verileri temizlenirse hesaplar da silinir.
//  - Şifreler basit bir "hash" ile tutulur, gerçek güvenlik sağlamaz.
// Kullanıcı isteği doğrultusunda oturum, sayfa yenilense veya
// tarayıcı kapatılıp açılsa bile SÜRESİZ açık kalır — sadece
// "Logout" ile sonlandırılır.

var CW_USERS_KEY = 'cw_users';
var CW_SESSION_KEY = 'cw_current_user';

function cwGetUsers() {
    try {
        return JSON.parse(localStorage.getItem(CW_USERS_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function cwSaveUsers(users) {
    localStorage.setItem(CW_USERS_KEY, JSON.stringify(users));
}

// Basit bir "hash" — şifreyi düz metin olarak saklamamak için.
// Gerçek güvenlik gerekiyorsa sunucu taraflı bcrypt/argon2 kullanılmalıdır.
function cwSimpleHash(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash.toString(36);
}

function cwGetCurrentUser() {
    return localStorage.getItem(CW_SESSION_KEY);
}

function cwSetCurrentUser(username) {
    localStorage.setItem(CW_SESSION_KEY, username);
}

function cwClearCurrentUser() {
    localStorage.removeItem(CW_SESSION_KEY);
}

function handleRegister(event) {
    event.preventDefault();
    var username = document.getElementById('registerUsername').value.trim();
    var password = document.getElementById('registerPassword').value;
    var confirmPassword = document.getElementById('registerPasswordConfirm').value;
    var errorEl = document.getElementById('registerError');
    errorEl.textContent = '';

    if (username.length < 3) {
        errorEl.textContent = 'Username must be at least 3 characters.';
        return false;
    }

    if (password !== confirmPassword) {
        errorEl.textContent = 'Passwords do not match.';
        return false;
    }

    var users = cwGetUsers();
    var exists = users.some(function (u) { return u.username.toLowerCase() === username.toLowerCase(); });
    if (exists) {
        errorEl.textContent = 'This username is already taken.';
        return false;
    }

    users.push({ username: username, passwordHash: cwSimpleHash(password) });
    cwSaveUsers(users);
    cwSetCurrentUser(username);
    closeAuthModal();
    cwRefreshAuthUI();
    return false;
}

function handleLogin(event) {
    event.preventDefault();
    var username = document.getElementById('loginUsername').value.trim();
    var password = document.getElementById('loginPassword').value;
    var errorEl = document.getElementById('loginError');
    errorEl.textContent = '';

    var users = cwGetUsers();
    var user = users.find(function (u) { return u.username.toLowerCase() === username.toLowerCase(); });

    if (!user || user.passwordHash !== cwSimpleHash(password)) {
        errorEl.textContent = 'Incorrect username or password.';
        return false;
    }

    cwSetCurrentUser(user.username);
    closeAuthModal();
    cwRefreshAuthUI();
    return false;
}

function logoutUser() {
    cwClearCurrentUser();
    cwRefreshAuthUI();

    var dropdown = document.getElementById('authDropdown');
    var toggleBtn = document.getElementById('authToggleBtn');
    if (dropdown) dropdown.classList.remove('open');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
}

// Nav'daki hesap alanını ve misafir kilitli formu güncel duruma göre yeniler
function cwRefreshAuthUI() {
    var current = cwGetCurrentUser();
    var label = document.getElementById('authToggleLabel');
    var guestView = document.getElementById('authGuestView');
    var userView = document.getElementById('authUserView');
    var usernameLabel = document.getElementById('authUsernameLabel');
    var artOverlay = document.getElementById('artGuestOverlay');

    if (current) {
        if (label) label.textContent = current;
        if (guestView) guestView.style.display = 'none';
        if (userView) userView.style.display = 'block';
        if (usernameLabel) usernameLabel.textContent = current;
        if (artOverlay) artOverlay.classList.remove('visible');
    } else {
        if (label) label.textContent = 'Login';
        if (guestView) guestView.style.display = 'block';
        if (userView) userView.style.display = 'none';
        if (artOverlay) artOverlay.classList.add('visible');
    }
}

// ============ AUTH MENÜSÜ AÇ/KAPA (Sol üst) ============
function setupAuthMenu() {
    var toggleBtn = document.getElementById('authToggleBtn');
    var dropdown = document.getElementById('authDropdown');
    if (!toggleBtn || !dropdown) return;

    toggleBtn.addEventListener('click', function (event) {
        event.stopPropagation();
        var isOpen = dropdown.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Dışarı tıklanınca kapat
    document.addEventListener('click', function (event) {
        if (!dropdown.contains(event.target) && event.target !== toggleBtn && !toggleBtn.contains(event.target)) {
            dropdown.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

// ============ AUTH (LOGIN/REGISTER) MODAL AÇ/KAPA ============
function openAuthModal(tab) {
    var modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'flex';
    switchAuthTab(tab || 'login');

    // Menü açık kaldıysa kapat
    var dropdown = document.getElementById('authDropdown');
    var toggleBtn = document.getElementById('authToggleBtn');
    if (dropdown) dropdown.classList.remove('open');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
}

function closeAuthModal() {
    var modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'none';

    var loginError = document.getElementById('loginError');
    var registerError = document.getElementById('registerError');
    if (loginError) loginError.textContent = '';
    if (registerError) registerError.textContent = '';
}

function switchAuthTab(tab) {
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');
    var tabLogin = document.getElementById('authTabLogin');
    var tabRegister = document.getElementById('authTabRegister');
    var title = document.getElementById('authModalTitle');
    if (!loginForm || !registerForm || !tabLogin || !tabRegister || !title) return;

    if (tab === 'register') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
        title.textContent = 'Register';
    } else {
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
        tabRegister.classList.remove('active');
        tabLogin.classList.add('active');
        title.textContent = 'Login';
    }
}

// ============ MİSAFİR KİLİDİ (Alt domain yönlendirmeleri) ============
// Headquarters, Publishing/Distro, Music Engine ve Manga linkleri gibi
// alt domain yönlendirmeleri, giriş yapılmadan kullanılamaz.
//
// Bu linklerin HTML'deki href'i kasıtlı olarak "javascript:void(0)" —
// gerçek adres data-href özniteliğinde tutuluyor ve yönlendirme SADECE
// buradaki JS üzerinden yapılıyor. Böylece orta tık (yeni sekmede aç) veya
// sağ tık > "Bağlantıyı yeni sekmede aç" gibi tarayıcı native davranışları
// da JS kontrolünü atlayıp gerçek adrese gidemiyor; çünkü href'te gerçek
// adres hiç bulunmuyor.
function setupGuestLocks() {
    var lockedLinks = document.querySelectorAll('[data-guest-lock="true"]');
    lockedLinks.forEach(function (link) {
        // Sol tık (ve Enter/Space ile klavye aktivasyonu) click event'i tetikler
        link.addEventListener('click', function (event) {
            event.preventDefault();
            handleGuestLockedNavigation(link);
        });

        // Orta tık (mouse wheel click) çoğu tarayıcıda 'click' değil 'auxclick'
        // tetikler; href gerçek adres olmadığı için zaten hiçbir yere gitmez,
        // ama yine de burada modalı açalım ki davranış tutarlı olsun.
        link.addEventListener('auxclick', function (event) {
            if (event.button === 1) {
                event.preventDefault();
                handleGuestLockedNavigation(link);
            }
        });

        // Sağ tık menüsünden "yeni sekmede/pencerede aç" seçeneklerini de
        // anlamsız hale getirmek için context menu'yü engelliyoruz.
        link.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
    });
}

function handleGuestLockedNavigation(link) {
    if (!cwGetCurrentUser()) {
        openGuestLockModal();
        return;
    }
    var url = link.getAttribute('data-href');
    if (url) {
        window.open(url, '_blank', 'noopener');
    }
}

function openGuestLockModal() {
    var modal = document.getElementById('guestLockModal');
    if (modal) modal.style.display = 'flex';
}

function closeGuestLockModal() {
    var modal = document.getElementById('guestLockModal');
    if (modal) modal.style.display = 'none';
}

// ============ COOKIE ONAYI ============
function setCookieConsent(accepted) {
    localStorage.setItem('cw_cookie_consent', accepted ? 'accepted' : 'rejected');
    var banner = document.getElementById('cookieConsent');
    if (banner) banner.classList.remove('visible');
}

function setupCookieConsent() {
    var consent = localStorage.getItem('cw_cookie_consent');
    var banner = document.getElementById('cookieConsent');
    if (!consent && banner) {
        banner.classList.add('visible');
    }
}

// ============================================================
// ============ WII TARZI ANA MENÜ (YENİ) ======================
// ============================================================
// Eski kaydırmalı/bar üzerinden açılan nav-links yerine geçen,
// tam ekran açılan tek bir "ana menü" sistemi. Menü içindeki
// bağlantılar normal "#section" anchor'ları olduğu için mevcut
// setupPageNavigation() fonksiyonu onları otomatik olarak yakalar ve
// aynı fade geçiş efektiyle ilgili bölümü görünür yapar; burada sadece
// menünün açılıp/kapanmasını yönetiyoruz.
function setupMainMenu() {
    var menuBtn = document.getElementById('mainMenuBtn');
    var overlay = document.getElementById('mainMenuOverlay');
    var closeBtn = document.getElementById('wiiMenuCloseBtn');
    if (!menuBtn || !overlay) return;

    function openMenu() {
        overlay.classList.add('open');
        menuBtn.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
        overlay.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
    }

    menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    // Arka plana (kutunun dışına) tıklanınca kapat
    overlay.addEventListener('click', function (event) {
        if (event.target === overlay) closeMenu();
    });

    // Bir menü kutucuğuna (tile) tıklanınca menüyü kapat.
    // Sayfa geçişi zaten setupPageNavigation() tarafından yönetiliyor.
    overlay.querySelectorAll('.wii-tile').forEach(function (tile) {
        tile.addEventListener('click', closeMenu);
    });

    // Escape ile kapatabilmek için setupModalKeyboardClose()'un erişebileceği
    // global bir referans bırakıyoruz.
    window.cwCloseMainMenu = closeMenu;
}

// ============================================================
// ============ DİL (LANGUAGE) AYARI (YENİ) =====================
// ============================================================
// Sadece yeni eklenen arayüz metinlerini (ana menü, footer) kapsar;
// mevcut sayfa içeriği kullanıcı isteği doğrultusunda değiştirilmedi.
var CW_LANG_KEY = 'cw_lang';

var cwTranslations = {
    tr: {
        mainMenuBtnLabel: 'Ana Menü',
        menuTitle: 'Ana Menü',
        menuHome: 'Anasayfa',
        menuViolet: 'Violet',
        menuRiley: 'Riley',
        menuLucia: 'Lucia',
        menuPublishing: 'Yayıncılık',
        menuMusics: 'Müzikler',
        menuSpecial: 'Özel',
        menuPartner: 'Ortak',
        menuCommunity: 'Topluluk',
        menuArts: 'Sanat',
        menuManga: 'Manga',
        menuHQ: 'Merkez',
        footerHelp: 'Yardım',
        footerSupportCenter: 'Destek Merkezi',
        footerCommunity: 'Topluluk',
        footerCompany: 'Marka',
        footerAbout: 'Hakkımızda',
        footerPartner: 'Ortaklık',
        footerFeatured: 'Öne Çıkanlar',
        footerProduct: 'Ürün',
        footerDistribution: 'Dağıtım',
        footerMusics: 'Müzikler',
        footerManga: 'Manga',
        footerMusicEngine: 'Müzik Motoru',
        footerPrivacy: 'Gizlilik Politikası',
        footerCookies: 'Çerez Politikası',
        footerTerms: 'Kullanım Şartları',
        footerSitemap: 'Site Haritası',
        privacyTitle: 'Gizlilik Politikası',
        cookieTitle: 'Çerez Politikası',
        termsTitle: 'Kullanım Şartları',
        sitemapTitle: 'Site Haritası',
        backHome: 'Ana Sayfaya Dön'
    },
    en: {
        mainMenuBtnLabel: 'Main Menu',
        menuTitle: 'Main Menu',
        menuHome: 'Home',
        menuViolet: 'Violet',
        menuRiley: 'Riley',
        menuLucia: 'Lucia',
        menuPublishing: 'Publishing',
        menuMusics: 'Musics',
        menuSpecial: 'Special',
        menuPartner: 'Partner',
        menuCommunity: 'Community',
        menuArts: 'Arts',
        menuManga: 'Manga',
        menuHQ: 'HQ',
        footerHelp: 'Help',
        footerSupportCenter: 'Support Center',
        footerCommunity: 'Community',
        footerCompany: 'Brand',
        footerAbout: 'About Us',
        footerPartner: 'Partnership',
        footerFeatured: 'Featured',
        footerProduct: 'Product',
        footerDistribution: 'Distribution',
        footerMusics: 'Musics',
        footerManga: 'Manga',
        footerMusicEngine: 'Music Engine',
        footerPrivacy: 'Privacy Policy',
        footerCookies: 'Cookie Policy',
        footerTerms: 'Terms of Use',
        footerSitemap: 'Sitemap',
        privacyTitle: 'Privacy Policy',
        cookieTitle: 'Cookie Policy',
        termsTitle: 'Terms of Use',
        sitemapTitle: 'Sitemap',
        backHome: 'Back to Home'
    }
};

function cwApplyLanguage(lang) {
    var dict = cwTranslations[lang] || cwTranslations.tr;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
    });

    var menuLabel = document.getElementById('mainMenuBtnLabel');
    if (menuLabel && dict.mainMenuBtnLabel) menuLabel.textContent = dict.mainMenuBtnLabel;

    var select = document.getElementById('langSelect');
    if (select) select.value = lang;

    localStorage.setItem(CW_LANG_KEY, lang);
}

function setupLanguageSwitcher() {
    var select = document.getElementById('langSelect');
    var savedLang = localStorage.getItem(CW_LANG_KEY) || 'tr';
    cwApplyLanguage(savedLang);

    if (select) {
        select.addEventListener('change', function () {
            cwApplyLanguage(this.value);
        });
    }
}
