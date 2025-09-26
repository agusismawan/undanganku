import { data } from "../data.js";

const SHEET_API_URL = data.api;

export function setupRSVP() {
    const form = document.getElementById("rsvp-form");
    const timeline = document.getElementById("timeline");
    const COMMENTS_PER_PAGE = 5;
    let allComments = [];
    let currentPage = 1;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Loading...";

        const payload = {
            id: Date.now(),
            name: form.name.value,
            status: form.status.value,
            message: form.message.value,
            date: new Date().toISOString(),
            color: ""
        };
        try {
            const res = await fetch(SHEET_API_URL, {
                method: "POST",
                mode: 'no-cors',
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" }
            });
            const result = await res.json();
            // if (result.status === 200) {
            //     form.reset();
            //     alert("Terima kasih, ucapan Anda sudah terkirim!");
            //     // Tambahkan komentar baru ke awal array dan render ulang tanpa reload
            //     allComments.unshift(payload);
            //     renderTimeline(1);
            // } else {
            //     alert("Gagal mengirim. Coba lagi.");
            // }
            form.reset();
            alert("Terima kasih, ucapan Anda sudah terkirim!");
            // Tambahkan komentar baru ke awal array dan render ulang tanpa reload
            allComments.unshift(payload);
            renderTimeline(1);

            return result;
        } catch (err) {
            alert("Gagal mengirim. Coba lagi.");
            console.error('Post error:', err);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });

    async function loadTimeline(page = 1) {
        timeline.innerHTML = "<div>Loading...</div>";
        try {
            const res = await fetch(SHEET_API_URL);
            const result = await res.json();
            if (result.status === 200 && Array.isArray(result.comentar)) {
                // Descending order (terbaru di atas)
                allComments = result.comentar.sort((a, b) => new Date(b.date) - new Date(a.date));
                renderTimeline(page);
            } else {
                timeline.innerHTML = "<div>Tidak ada komentar.</div>";
            }
        } catch {
            timeline.innerHTML = "<div>Gagal memuat komentar.</div>";
        }
    }

    function renderTimeline(page) {
        currentPage = page;
        const start = (page - 1) * COMMENTS_PER_PAGE;
        const end = start + COMMENTS_PER_PAGE;
        const pageComments = allComments.slice(start, end);

        timeline.innerHTML = pageComments.map(item => `
            <div class="timeline-card">
                <div class="cui-comment-meta">
                    <span class="cui-post-author">${item.name}</span>
                    <span class="cui-post-date">${item.date ? new Date(item.date).toLocaleString("id-ID") : ""}</span>
                    <span class="cui-post-status">${item.status === "y" ? "✅" : "❌"}</span>
                </div>
                <div class="cui-comment-text">${item.message}</div>
            </div>
        `).join("");

        // Pagination with Prev/Next
        const totalPages = Math.ceil(allComments.length / COMMENTS_PER_PAGE);
        if (totalPages > 1) {
            let pagHtml = '<div class="timeline-pagination">';
            pagHtml += `<button type="button" ${page === 1 ? 'disabled' : ''} onclick="window.gotoTimelinePage(${page - 1}, event)">Prev</button>`;
            for (let i = 1; i <= totalPages; i++) {
                pagHtml += `<button type="button" ${i === page ? 'class="active"' : ''} onclick="window.gotoTimelinePage(${i}, event)">${i}</button>`;
            }
            pagHtml += `<button type="button" ${page === totalPages ? 'disabled' : ''} onclick="window.gotoTimelinePage(${page + 1}, event)">Next</button>`;
            pagHtml += '</div>';
            timeline.innerHTML += pagHtml;
        }
    }

    // Expose pagination function globally
    window.gotoTimelinePage = function (page, event) {
        if (event) event.preventDefault();
        // Prevent out of range
        const totalPages = Math.ceil(allComments.length / COMMENTS_PER_PAGE);
        if (page < 1 || page > totalPages) return;
        renderTimeline(page);
    };

    loadTimeline();
}