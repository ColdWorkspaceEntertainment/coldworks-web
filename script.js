document.addEventListener('DOMContentLoaded', () => {
    
    // Smooth scroll için minik bir dokunuş
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Smooth scroll CSS tarafından hallediliyor, burası opsiyonel eklemeler için.
        });
    });

    // Navigasyon Arka Plan Değişimi
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.style.padding = '15px 10%';
            nav.style.background = 'rgba(12, 5, 29, 0.95)';
        } else {
            nav.style.padding = '20px 10%';
            nav.style.background = 'rgba(18, 5, 29, 0.85)';
        }
    });

    // Sayfa yüklendiğinde konsola şık bir mesaj
    console.log("%c Cold Works %c System Active ", "color: #12051d; background: #d6a4ff; font-weight: bold; padding: 5px; border-radius: 3px 0 0 3px;", "color: #fff; background: #333; padding: 5px; border-radius: 0 3px 3px 0;");
});
