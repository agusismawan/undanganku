
// === DETEKSI EDITOR ELEMENTOR (ketat & aman untuk PREVIEW) ===
function isElementorEditing() {
    try {
        const qs = new URLSearchParams(location.search);

        // 1) Preview WordPress biasa → BUKAN editor
        if (qs.get('preview') === 'true') return false;

        // 2) Halaman "elementor-preview" (iframe konten saat builder)
        //    Anggap editor HANYA jika parent benar2 editor aktif
        if (qs.has('elementor-preview')) {
            if (window.parent && window.parent !== window) {
                const pd = window.parent.document;
                if (pd?.body?.classList?.contains('elementor-editor-active')) return true;
                if (window.parent.elementorFrontend?.isEditMode?.() === true) return true;
            }
            return false; // bukan di dalam builder → perlakukan seperti front-end
        }

        // 3) Sisa cek standar builder
        if (window.elementorFrontend?.isEditMode?.() === true) return true;
        if (document.body.classList.contains('elementor-editor-active')) return true;
        if (/\baction=elementor\b/i.test(location.search)) return true;

        // 4) (Opsional) jika halaman ditampilkan DI DALAM jendela builder
        if (window.parent && window.parent !== window) {
            const pd = window.parent.document;
            if (pd?.body?.classList?.contains('elementor-editor-active')) return true;
            if (/\baction=elementor\b/i.test(window.parent.location.search)) return true;
            if (window.parent.elementorFrontend?.isEditMode?.() === true) return true;
        }
    } catch (e) { /* cross-origin: anggap bukan editor */ }

    return false;
}

if (isElementorEditing()) {
    console.log('[cleanup] Mode Elementor editor terdeteksi → cleanup dimatikan.');
    return; // hentikan seluruh cleanup
}

// Utility batch remove
function batchRemove(elements) {
    if (elements.length) {
        requestAnimationFrame(() => elements.forEach(el => el.remove()));
    }
}

// ✅ Tambahkan helper ini DI SINI (global di dalam blok <script> / DOMContentLoaded)
function isDivOrSpace(el) {
    return !!(el && el.classList &&
        (el.classList.contains('elementor-widget-divider') ||
            el.classList.contains('elementor-widget-spacer')));
}

// 1. Hapus semua tombol lokasi-btn kosong / invalid (kebal "Not Found.")
function removeButtonsLokasiIfEmpty() {
    const toRemove = [];
    const seen = new Set();

    const isBadHref = (hrefRaw) => {
        const h = (hrefRaw || '').trim();

        if (!h) return true;

        const l = h.toLowerCase();

        // Placeholder umum + pola "Not Found"
        if (
            l === '#' || l === '-' || l === 'null' || l === 'javascript:void(0)' ||
            l.includes('not%20found') || l.includes('not found') ||
            l === 'http://not%20found.' || l === 'https://not%20found.' ||
            l === 'http://not found.' || l === 'https://not found./'
        ) return true;

        // URL tidak valid (throw saat diparse)
        try {
            const u = new URL(h.html);
            if (!u.hostname) return true;
            // optional: kalau mau ketat hanya izinkan domain peta
            // if (!/maps\.google\.|goo\.gl\/maps|waze\.com\/ul/i.test(l)) return true;
        } catch (e) {
            return true;
        }

        return false;
    };

    // Ambil semua kandidat tombol: yang diberi class khusus ATAU teks "Lihat Lokasi"
    const candidates = document.querySelectorAll(
        '.lokasi-btn, .elementor-widget-button a.elementor-button'
    );

    candidates.forEach(node => {
        const linkEl = node.tagName === 'A'
            ? node
            : node.querySelector('a, [role="link"], [role="button"]');

        if (!linkEl) return;

        const text = (linkEl.textContent || linkEl.getAttribute('aria-label') || '').trim();
        const isLokasiBtn = node.classList.contains('lokasi-btn') || /lihat lokasi/i.test(text);

        if (!isLokasiBtn) return; // jangan ganggu tombol lain

        const href = linkEl.getAttribute('href') || '';

        if (isBadHref(href)) {
            // Hapus wrapper widget button jika ada, fallback ke .elementor-widget, terakhir anchor itu sendiri
            const wrapper =
                linkEl.closest('.elementor-widget-button') ||
                linkEl.closest('.elementor-widget') ||
                linkEl;

            if (wrapper && !seen.has(wrapper)) {
                seen.add(wrapper);
                toRemove.push(wrapper);
            }
        }
    });

    // Eksekusi penghapusan dalam batch agar aman terhadap reflow
    requestAnimationFrame(() => {
        toRemove.forEach(el => el.remove());
    });
}

// 2. Hapus social widget kosong
// ====== Social widget cleaner ======
function isInvalidSocialHref(hrefRaw) {
    var s = (hrefRaw || '').trim();

    // decode dan normalisasi
    try { s = decodeURIComponent(s); } catch (e) { }
    s = s.replace(/\s+/g, ' ').trim().toLowerCase();
    // buang skema & www
    s = s.replace(/^(https?:)?\/\/(www\.)?/, '');

    // aturan invalid
    if (!s) return true;                       // kosong
    if (s === '#' || s === '-' || s === '0') return true;
    if (s === 'null' || s === 'undefined') return true;
    if (/^javascript:/.test(s)) return true;
    if (/^mailto:\s*$/i.test(hrefRaw || '')) return true; // mailto kosong
    if (/^tel:\s*$/i.test(hrefRaw || '')) return true;    // tel kosong
    if (/^[\.\-]+$/.test(s)) return true;

    // placeholder umum (id/en)
    if (s.indexOf('not found') !== -1) return true;
    if (s.indexOf('tidak tersedia') !== -1) return true;
    if (s.indexOf('coming soon') !== -1) return true;
    if (s.indexOf('kosong') !== -1) return true;

    return false;
}

function cleanSocialWidgets() {
    document.querySelectorAll('.elementor-widget-social-icons').forEach(function (widget) {
        var items = Array.from(widget.querySelectorAll('.elementor-social-icons-wrapper .elementor-grid-item'));
        var anyValid = false;

        items.forEach(function (item) {
            var a = item.querySelector('a');
            var href = a ? a.getAttribute('href') : '';
            if (!a || isInvalidSocialHref(href)) {
                item.remove(); // buang icon yang invalid
            } else {
                anyValid = true;
            }
        });

        // jika semua icon terhapus → hapus widget-nya
        if (!anyValid) {
            widget.remove();
        }
    });
}


// 3. Hapus HTML widget kosong
function removeEmptyHTMLWidgets() {
    const toRemove = [];
    document.querySelectorAll('.elementor-widget-html').forEach(widget => {
        const container = widget.querySelector('.elementor-widget-container');
        if (!container) return;
        const html = container.innerHTML.replace(/<!--.*?-->/g, '').trim();
        if (!html) toRemove.push(widget);
    });
    batchRemove(toRemove);
}

// 4) Hapus SELURUH .acara-con di FRONTEND jika nama_acara kosong/null/tidak ada
function removeAcaraContainerIfEmpty() {
    const errorWords = /(not\s*found|null|undefined|tidak\s*tersedia|^\s*-\s*$)/i;
    const toRemove = [];

    document.querySelectorAll('.acara-con').forEach(container => {
        // cari marker yg dibungkus dari shortcode
        const marker = container.querySelector('.nama-acara-marker');

        // jika marker tidak ada → kontainer ini tidak punya nama_acara → hapus
        if (!marker) {
            toRemove.push(container);
            return;
        }

        // jika marker ada tapi teks kosong / error → hapus
        const nameText = (marker.textContent || '').replace(/\s+/g, ' ').trim();
        if (nameText === '' || errorWords.test(nameText)) {
            toRemove.push(container);
            return;
        }

        // kalau ada teks valid → biarkan
    });

    batchRemove(toRemove);
}

// 5. Hapus widget heading waktu_acara jika kosong atau masih shortcode
function removeWaktuAcaraIfEmpty() {
    const toRemove = [];

    document.querySelectorAll('.elementor-widget-heading, .elementor-widget-text-editor').forEach(widget => {
        const container = widget.querySelector('.elementor-widget-container');
        if (!container) return;

        const rawHTML = container.innerHTML.toLowerCase();
        const cleanText = container.textContent.replace(/\s+/g, ' ')
            .replace(/&nbsp;/gi, ' ')
            .trim()
            .toLowerCase();

        // Cek apakah widget memang untuk waktu_acara (shortcode)
        const isWidgetForWaktuAcara = /\[wedding_info\s+field=["']waktu_acara["']/i.test(rawHTML);

        // Apakah labelnya pakai "pukul" atau "at"
        const isPukulOrAt = cleanText.startsWith('pukul') || cleanText.startsWith('at');

        // Apakah isi teks mencurigakan (error-like)
        const errorKeywords = ['not found', 'null', 'undefined'];
        const isErrorOutput = errorKeywords.some(k => cleanText.includes(k));

        const isTooShort = cleanText.length < 8; // lebih ketat dari 15 → "at :", "pukul :" bisa kehapus

        // Hapus jika:
        // - widget waktu_acara dan error/pendek
        // - atau label "pukul"/"at" tapi kosong/pendek/error
        const shouldRemove =
            (isWidgetForWaktuAcara && (isErrorOutput || isTooShort)) ||
            (isPukulOrAt && (isErrorOutput || isTooShort));

        if (shouldRemove) {
            toRemove.push(widget);
        }
    });

    batchRemove(toRemove);
}

// 6. Hapus widget tempat_acara jika kosong atau masih shortcode
function removeTempatAcaraIfEmpty() {
    const toRemove = [];

    document.querySelectorAll('.elementor-widget-heading, .elementor-widget-text-editor').forEach(widget => {
        const container = widget.querySelector('.elementor-widget-container');
        if (!container) return;

        const rawHTML = container.innerHTML.toLowerCase();
        const cleanText = container.textContent.replace(/\s+/g, ' ')
            .replace(/&nbsp;/gi, ' ')
            .trim()
            .toLowerCase();

        // Apakah ini widget untuk [wedding_info field="tempat_acara"]
        const isTempatAcaraShortcode = /\[wedding_info\s+field=["']tempat_acara["']/i.test(rawHTML);

        // Deteksi label lokasi yang umum
        const labelKeywords = ['tempat', 'alamat', 'address', 'location'];
        const startsWithLabel = labelKeywords.some(label => cleanText.startsWith(label));

        // Deteksi kalau output error
        const errorKeywords = ['not found', 'null', 'undefined'];
        const isErrorOutput = errorKeywords.some(k => cleanText.includes(k));

        // Terlalu pendek → misalnya cuma "tempat :", atau "alamat :"
        const isTooShort = cleanText.length < 10;

        const shouldRemove =
            (isTempatAcaraShortcode && (isErrorOutput || isTooShort)) ||
            (startsWithLabel && (isErrorOutput || isTooShort));

        if (shouldRemove) {
            toRemove.push(widget);
        }
    });

    batchRemove(toRemove);
}

// 7. Kosongkan SEMUA isi .ls-con jika deskripsi_ls kosong/null
function removeLoveStoryContainersIfEmpty() {
    // Fallback deteksi shortcode bila marker PHP belum aktif di beberapa halaman
    const shortcodeRegex = /\[wedding_info\s+field=["']deskripsi_ls["']\s+ls_index=["']\d+["']\]/i;

    // Kata-kata error / kosong yang valid untuk dianggap "tidak ada konten"
    const errorWords = /(not\s*found|null|undefined|tidak tersedia|^\s*-\s*$)/i;

    // Helper: widget dianggap "trivial" bila benar-benar tidak ada nilai konten
    function isTrivialWidget(widget) {
        if (!widget) return true;

        // widget structural
        if (
            widget.classList.contains('elementor-widget-divider') ||
            widget.classList.contains('elementor-widget-spacer')
        ) return true;

        const box = widget.querySelector('.elementor-widget-container') || widget;
        const raw = box.innerHTML || '';
        const txt = (box.textContent || '').replace(/\s+/g, ' ').trim();

        // Ada media berarti bukan trivial
        if (/<(img|iframe|video|audio|picture|svg)\b/i.test(raw)) return false;

        // Kosong beneran
        if (txt === '' || errorWords.test(txt)) return true;

        // Dilunakkan: jangan anggap heading pendek otomatis trivial
        if (widget.classList.contains('elementor-widget-heading')) {
            // Hanya heading super pendek (<= 10) yang bisa dianggap trivial
            if (txt.length <= 10) return true;
            return false;
        }

        // Dilunakkan: text-editor
        if (widget.classList.contains('elementor-widget-text-editor')) {
            const words = txt.split(' ').filter(Boolean).length;
            // Dulu: words <= 3 && txt.length <= 24 → TERLALU AGRESIF
            // Sekarang: benar-benar sangat pendek saja yang dianggap trivial
            if (words === 0 || txt.length <= 2) return true;
            return false;
        }

        // Default: bukan trivial
        return false;
    }

    document.querySelectorAll('.ls-con').forEach(container => {
        let foundDeskripsi = false;
        let deskripsiEmpty = false;

        // 1) PRIORITAS: marker hasil patch PHP
        const marker = container.querySelector('.deskripsi-ls-marker');
        if (marker) {
            foundDeskripsi = true;
            const markerText = (marker.textContent || '').replace(/\s+/g, ' ').trim();
            if (markerText === '' || errorWords.test(markerText)) {
                deskripsiEmpty = true;
            }
        }

        // 2) FALLBACK: deteksi berbasis shortcode (kalau marker tidak ada)
        if (!foundDeskripsi) {
            const textish = container.querySelectorAll(
                '.elementor-widget-text-editor, .elementor-widget-heading, .elementor-widget-heading :is(h1,h2,h3,h4,h5,h6)'
            );

            textish.forEach(el => {
                const widget = el.closest('.elementor-widget') || el;
                const box = widget.querySelector('.elementor-widget-container') || widget;
                const html = box.innerHTML || '';
                const text = (box.textContent || '').replace(/\s+/g, ' ').trim();

                // Jika widget ini memuat deskripsi_ls (sebagai shortcode atau hasil render)
                if (shortcodeRegex.test(html) || shortcodeRegex.test(text)) {
                    foundDeskripsi = true;
                    // PENTING: untuk deskripsi_ls, JANGAN pakai isTrivialWidget
                    if (text === '' || errorWords.test(text)) {
                        deskripsiEmpty = true;
                    }
                }
            });
        }

        // 3) Tidak ditemukan marker/shortcode → nilai agregat: semua widget trivial?
        if (!foundDeskripsi) {
            const widgets = Array.from(container.querySelectorAll('.elementor-widget'));
            const allTrivial = widgets.length > 0 && widgets.every(isTrivialWidget);
            if (allTrivial) deskripsiEmpty = true;
        }

        // 4) Eksekusi penghapusan bila benar-benar kosong
        if (deskripsiEmpty) {
            // 🔒 Bersihkan spacer/divider yang HANYA DI DALAM .ls-con
            container
                .querySelectorAll('.elementor-widget-divider, .elementor-widget-spacer')
                .forEach(el => el.remove());

            // Lalu hapus .ls-con itu sendiri
            container.remove();
            // ❌ Tidak menyentuh elemen di luar .ls-con
        }
    });
}

// 8) Hapus SELURUH .stream-con di FRONTEND jika link_streaming kosong/invalid
function removeStreamContainersIfEmpty() {
    // Di editor: jangan hapus; cukup matikan klik supaya tidak kabur dari canvas
    if (typeof isElementorEditing === 'function' && isElementorEditing()) {
        document.querySelectorAll('.stream-con a').forEach(a => {
            a.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); });
            a.style.pointerEvents = 'none';
        });
        return;
    }

    const errorWords = /(not\s*found|null|undefined|tidak\s*tersedia|^\s*-\s*$)/i;

    const isBadHref = (hrefRaw) => {
        const h = (hrefRaw || '').trim();
        if (!h) return true;
        const l = h.toLowerCase();
        // placeholder & pola "Not Found."
        if (
            l === '#' || l === '-' || l === 'null' || l === 'undefined' ||
            l === 'http://not%20found.' || l === 'https://not%20found.' ||
            l.includes('not%20found') || l.includes('not found') ||
            l.includes('tidak%20tersedia')
        ) return true;
        try {
            const u = new URL(h.html);
            if (!u.hostname) return true;
        } catch (e) {
            return true;
        }
        return false;
    };

    const toRemove = [];

    document.querySelectorAll('.stream-con').forEach(container => {
        // 1) Prioritas: marker dari shortcode (jika dipakai di Text Editor)
        const marker = container.querySelector('.link-streaming-marker');

        if (marker) {
            const a = marker.querySelector('a'); // kalau format=link
            const raw = a ? (a.getAttribute('href') || '').trim()
                : (marker.textContent || '').replace(/\s+/g, ' ').replace(/&nbsp;/gi, ' ').trim();

            const invalid = (raw.length < 5) || errorWords.test(raw) || isBadHref(raw);
            if (invalid) {
                toRemove.push(container);
            }
            return; // sudah divalidasi via marker
        }

        // 2) Fallback (tanpa marker): cek semua <a> di dalam .stream-con (termasuk tombol Elementor)
        const links = Array.from(container.querySelectorAll('a'));
        if (links.length === 0) { // tidak ada link sama sekali
            toRemove.push(container);
            return;
        }

        // anggap valid jika ADA minimal satu link dengan href yang baik
        const hasValid = links.some(a => !isBadHref(a.getAttribute('href') || ''));
        if (!hasValid) {
            toRemove.push(container);
        }
    });

    // ✅ Hapus batch (tanpa naik DOM—pola yg sama dgn .kh-con)
    batchRemove(toRemove);
}

// 9) Hapus SELURUH .gift-con di FRONTEND jika no_rekening kosong/invalid/marker tidak ada
function removeGiftConIfNoRekeningEmpty() {
    if (typeof isElementorEditing === 'function' && isElementorEditing()) return;

    const errorWords = /(not\s*found|null|undefined|tidak\s*tersedia|^\s*-\s*$)/i;
    const toRemove = [];

    // 🔁 Sama seperti sistem #4 (acara): iterasi per-container
    document.querySelectorAll('.gift-con').forEach(container => {
        // cari marker yg dibungkus dari shortcode PHP
        const marker = container.querySelector('.no-rekening-marker');

        // ❶ Jika marker tidak ada → kartu ini invalid (PHP sengaja tidak render marker)
        if (!marker) {
            toRemove.push(container);
            return;
        }

        // ❷ Jika marker ada → validasi teks & digit
        const raw = (marker.textContent || '').replace(/\s+/g, ' ').trim();
        const digits = raw.replace(/\D+/g, '');

        // Minimal 6 digit agar “kelihatan” sbg rekening + tidak mengandung kata error
        const invalid = (digits.length < 6) || errorWords.test(raw);
        if (invalid) {
            toRemove.push(container);
            return;
        }

        // kalau ada marker & lolos validasi → biarkan
    });

    // ✅ Hapus batch (tanpa "naik DOM" dan tanpa sentuh spacer/divider, persis sistem #4)
    batchRemove(toRemove);
}

// Intercept tombol copy agar menyalin angka dari .no-rekening-marker (bukan HTML)
function fixCopyButtonsForNoRekening() {
    // cari semua tombol/anchor yang kemungkinan tombol copy di dalam gift-con
    const candidates = document.querySelectorAll(
        '.gift-con a, .gift-con button, .gift-con [role="button"]'
    );

    candidates.forEach(btn => {
        // cegah binding ganda
        if (btn.__nrCopyBound) return;

        const txt = (btn.textContent || '').toLowerCase();
        const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
        const title = (btn.getAttribute('title') || '').toLowerCase();
        const cls = (btn.className || '');

        // heuristik: tombol berteks/label "copy/salin" atau ada class copy
        const looksLikeCopy =
            /copy|salin/.test(txt + ' ' + aria + ' ' + title) ||
            /\b(copy|btn-copy|wpcp-copy|weddingpress-copy)\b/i.test(cls);

        if (!looksLikeCopy) return;

        // cari marker rekening di kartu yang sama
        const container = btn.closest('.gift-con');
        if (!container) return;
        const marker = container.querySelector('.no-rekening-marker');
        if (!marker) return;

        const value = (marker.getAttribute('data-plain') || marker.textContent || '')
            .replace(/\s+/g, ' ')
            .trim();

        if (!value) return;

        // Set juga data-clipboard-text (kalau plugin pakai clipboard.js, ini langsung kepakai)
        btn.setAttribute('data-clipboard-text', value);

        // Intercept klik → paksa copy angka murni
        btn.addEventListener('click', function (e) {
            try {
                // kalau plugin lain juga handle, kita ambil alih
                e.preventDefault();
                e.stopPropagation();
            } catch (_) { }

            // Clipboard API
            const copyText = value;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(copyText).then(() => {
                    showCopiedHint(btn);
                }).catch(() => {
                    legacyCopy(copyText, btn);
                });
            } else {
                legacyCopy(copyText, btn);
            }
        }, true);

        btn.__nrCopyBound = true;
    });

    function legacyCopy(text, btn) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (_) { }
        document.body.removeChild(ta);
        showCopiedHint(btn);
    }

    function showCopiedHint(btn) {
        // feedback kecil (opsional)
        const old = btn.getAttribute('data-old-text') || btn.textContent;
        btn.setAttribute('data-old-text', old);
        btn.textContent = 'Tersalin!';
        setTimeout(() => { btn.textContent = btn.getAttribute('data-old-text') || old; }, 1200);
    }
}

// 10) Hapus SELURUH .kh-con di FRONTEND jika [wedding_info field="nama_kh"] kosong/invalid
function removeKhConIfEmpty() {
    if (typeof isElementorEditing === 'function' && isElementorEditing()) return;

    const errorWords = /(not\s*found|null|undefined|tidak\s*tersedia|^\s*-\s*$)/i;
    const toRemove = [];

    // 🔁 Sama pola dgn #4/#9: iterasi per-CONTAINER
    document.querySelectorAll('.kh-con').forEach(container => {
        // cari marker yg dibungkus dari PHP
        const marker = container.querySelector('.nama-kh-marker');

        // ❶ Jika marker TIDAK ada → anggap invalid (PHP sengaja tak render marker di FE)
        if (!marker) {
            toRemove.push(container);
            return;
        }

        // ❷ Jika marker ADA → validasi konten
        const text = (marker.textContent || '')
            .replace(/\s+/g, ' ')
            .replace(/&nbsp;/gi, ' ')
            .trim();

        const isTooShort = text.length < 2; // “-”, spasi, dsb.
        const isError = errorWords.test(text);

        if (isTooShort || isError) {
            toRemove.push(container);
            return;
        }

        // ada marker & lolos validasi → biarkan
    });

    // ✅ Hapus batch (tanpa naik DOM—persis pola #4)
    batchRemove(toRemove);
}

// 11. Hapus .amplop-section jika TIDAK ada .gift-con maupun .kh-con (dinamis)
function removeAmplopSectionIfEmpty() {
    if (typeof isElementorEditing === 'function' && isElementorEditing()) return;

    const toRemove = [];

    document.querySelectorAll('.amplop-section').forEach(section => {
        // cek sisa blok hadiah/kado setelah pembersihan lain jalan
        const hasGift = !!section.querySelector('.gift-con');
        const hasKh = !!section.querySelector('.kh-con');

        if (!hasGift && !hasKh) {
            toRemove.push(section);
        }
    });

    if (toRemove.length) {
        requestAnimationFrame(() => {
            toRemove.forEach(sec => {
                // rapikan divider/spacer tetangga agar tidak menyisakan jarak kosong
                const prev = sec.previousElementSibling;
                const next = sec.nextElementSibling;
                const isDivOrSpace = el => el && (
                    el.classList?.contains('elementor-widget-divider') ||
                    el.classList?.contains('elementor-widget-spacer')
                );
                if (isDivOrSpace(prev)) prev.remove();
                if (isDivOrSpace(next)) next.remove();
                sec.remove();
            });
        });
    }
}

// 12. Hapus .ls-section jika di dalamnya TIDAK ada .ls-con (dinamis)
function removeLsSectionIfEmpty() {
    if (typeof isElementorEditing === 'function' && isElementorEditing()) return;

    const toRemove = [];

    document.querySelectorAll('.ls-section').forEach(container => {
        const hasLsCon = !!container.querySelector('.ls-con'); // cek keberadaan .ls-con
        if (!hasLsCon) {
            toRemove.push(container);
        }
    });

    if (toRemove.length) {
        requestAnimationFrame(() => {
            toRemove.forEach(c => {
                // rapikan divider/spacer tetangga agar tidak menyisakan jarak kosong
                const prev = c.previousElementSibling;
                const next = c.nextElementSibling;
                const isDivOrSpace = el => el && (
                    el.classList?.contains('elementor-widget-divider') ||
                    el.classList?.contains('elementor-widget-spacer')
                );
                if (isDivOrSpace(prev)) prev.remove();
                if (isDivOrSpace(next)) next.remove();
                c.remove();
            });
        });
    }
}

// Jalankan semua
function runCleanup() {
    removeButtonsLokasiIfEmpty();
    cleanSocialWidgets();
    removeEmptyHTMLWidgets();
    removeAcaraContainerIfEmpty();
    removeWaktuAcaraIfEmpty();
    removeTempatAcaraIfEmpty();
    removeLoveStoryContainersIfEmpty();
    removeStreamContainersIfEmpty();
    removeGiftConIfNoRekeningEmpty();
    removeKhConIfEmpty();
    removeAmplopSectionIfEmpty();
    removeLsSectionIfEmpty();
    fixCopyButtonsForNoRekening();
}
window.runCleanup = runCleanup;

// Pertama kali
//   if (isElementorEditing()) { console.log('[cleanup] Editor → skip'); return; }

runCleanup();
setTimeout(runCleanup, 250);
setTimeout(runCleanup, 800);

// Observer dengan debounce
let cleanupTimeout;
const observer = new MutationObserver(mutations => {
    if (mutations.some(m => m.addedNodes.length || m.removedNodes.length)) {
        clearTimeout(cleanupTimeout);
        cleanupTimeout = setTimeout(runCleanup, 100);
    }
});
observer.observe(document.body, { childList: true, subtree: true });

// Hook Elementor
if (window.elementorFrontend && window.elementorFrontend.hooks) {
    ['button.default', 'social-icons.default', 'html.default', 'container'].forEach(type => {
        elementorFrontend.hooks.addAction(`frontend/element_ready/${type}`, runCleanup);
    });
}

const lazyloadRunObserver = () => {
    const lazyloadBackgrounds = document.querySelectorAll(`.e-con.e-parent:not(.e-lazyloaded)`);
    const lazyloadBackgroundObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                let lazyloadBackground = entry.target;
                if (lazyloadBackground) {
                    lazyloadBackground.classList.add('e-lazyloaded');
                }
                lazyloadBackgroundObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '200px 0px 200px 0px' });
    lazyloadBackgrounds.forEach((lazyloadBackground) => {
        lazyloadBackgroundObserver.observe(lazyloadBackground);
    });
};
const events = [
    'DOMContentLoaded',
    'elementor/lazyload/observe',
];
events.forEach((event) => {
    document.addEventListener(event, lazyloadRunObserver);
});