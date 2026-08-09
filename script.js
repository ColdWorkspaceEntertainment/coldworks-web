function ac(el) {
    var modal = document.getElementById('profil');
    var isimText = document.getElementById('isim-text');
    var sanatciText = document.getElementById('kutu-sanatci');
    var kutuResim = document.getElementById('kutu-resim');
    var rozet = document.getElementById('rozet');

    document.addEventListener('DOMContentLoaded', () => {
    const intro = document.getElementById('site-intro');
    if (intro) {
        // Animasyon süresi bitince (yaklaşık 3 saniye sonra) elementi tamamen kaldırır
        setTimeout(() => {
            intro.remove();
        }, 3000);
    }
});

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

window.onclick = function(event) {
    var modal = document.getElementById('profil');
    if (event.target === modal) {
        kapatModal();
    }
};
