// =========================================================
//  GALERİ — görseller hostingden gelir (medya.cwplaymusic.com/galeri)
//  Yeni eser eklemek için HTML'e dokunma:
//    1) Resmi  galeri/resimler/  klasörüne yükle
//    2) galeri/galeri.json'a bir satır ekle
// =========================================================
(function () {
    var GALLERY_BASE = 'https://medya.cwplaymusic.com/galeri/';

    function note(text) {
        var p = document.createElement('p');
        p.className = 'gallery-empty';
        p.textContent = text;
        return p;
    }

    function imageUrl(file) {
        if (/^https?:\/\//i.test(file)) return file; // tam adres verildiyse olduğu gibi kullan
        return GALLERY_BASE + 'resimler/' + encodeURIComponent(file);
    }

    function buildItem(item) {
        var url = imageUrl(item.dosya || '');

        var box = document.createElement('div');
        box.className = 'art-item';
        box.tabIndex = 0;
        box.setAttribute('role', 'button');
        box.setAttribute('data-isim', item.isim || '');
        box.setAttribute('data-sanatci', item.sanatci || '');
        box.setAttribute('data-resim', url);
        box.setAttribute('data-verified', item.verified ? 'true' : 'false');
        box.addEventListener('click', function () { ac(box); });

        var img = document.createElement('img');
        img.src = url;
        img.alt = item.sanatci || item.isim || 'Art';
        img.loading = 'lazy';

        var title = document.createElement('h4');
        title.textContent = item.isim || '';

        box.append(img, title);
        return box;
    }

    function render(data) {
        document.querySelectorAll('[data-gallery]').forEach(function (grid) {
            var list = data[grid.getAttribute('data-gallery')] || [];
            grid.replaceChildren();
            if (!list.length) {
                grid.append(note('No artworks here yet.'));
                return;
            }
            list.forEach(function (item) { grid.append(buildItem(item)); });
        });
    }

    fetch(GALLERY_BASE + 'galeri.json', { cache: 'no-store' })
        .then(function (res) {
            if (!res.ok) throw new Error('galeri.json ' + res.status);
            return res.json();
        })
        .then(render)
        .catch(function (err) {
            console.error('Gallery could not be loaded:', err);
            document.querySelectorAll('[data-gallery]').forEach(function (grid) {
                grid.replaceChildren(note('The gallery couldn\'t be loaded. Please refresh the page.'));
            });
        });
})();
