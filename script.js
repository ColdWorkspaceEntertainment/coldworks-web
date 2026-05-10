// Sayfa yüklendiğinde animasyonları başlat
document.addEventListener('DOMContentLoaded', () => {
    
    // Smooth Scroll (Navigasyon linkleri için)
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Sadece site içi linkler için
            if(link.getAttribute('href').startsWith('#')) {
                // Varsayılan davranışı CSS smooth scroll hallediyor
            }
        });
    });

    // Kaydırma sırasında Navigasyonun şeffaflığını değiştir
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.style.padding = '15px 10%';
            nav.style.background = 'rgba(18, 5, 29, 0.98)';
        } else {
            nav.style.padding = '20px 10%';
            nav.style.background = 'rgba(18, 5, 29, 0.9)';
        }
    });

    console.log("Cold Works sitesi başarıyla yüklendi.");
});
