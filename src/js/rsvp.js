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
      name: form.name.value?.trim(),
      status: form.status.value?.trim(),
      message: form.message.value?.trim(),
      date: new Date().toISOString(),
      color: "",
    };

    try {
      const bodyStr = JSON.stringify(payload);

      let sent = false;
      if (navigator.sendBeacon) {
        const blob = new Blob([bodyStr], { type: "text/plain" });
        sent = navigator.sendBeacon(SHEET_API_URL, blob);
      }
      if (!sent) {
        await fetch(SHEET_API_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: bodyStr,
        });
      }

      form.reset();
      alert("Terima kasih, ucapan Anda sudah terkirim!");
      allComments.unshift(payload);
      renderTimeline(1);
    } catch (err) {
      console.error("Post error:", err);
      alert("Gagal mengirim. Coba lagi.");
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
        allComments = result.comentar.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
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

    function timeAgo(dateString) {
      const now = new Date();
      const date = new Date(dateString);
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffSec < 60) return `${diffSec} detik yang lalu`;
      if (diffMin < 60) return `${diffMin} menit yang lalu`;
      if (diffHour < 24) return `${diffHour} jam yang lalu`;
      return `${diffDay} hari yang lalu`;
    }

    const avatarColors = [
      "#FF5722", // oranye
      "#4CAF50", // hijau
      "#3F51B5", // biru tua
      "#9C27B0", // ungu
      "#009688", // teal
      "#FFC107", // kuning
      "#795548", // coklat
      "#607D8B"  // abu kebiruan
    ];

    function getColorByName(name) {
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % avatarColors.length;
      return avatarColors[index];
    }

    timeline.innerHTML = pageComments
      .map((item) => {
        const initials = item.name
          ? item.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()
          : "?";

        const bgColor = getColorByName(item.name || "?");

        return `
          <div class="timeline-card" style="display:flex; flex-direction:column; gap:8px; padding:12px; border-bottom:1px solid #ddd;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div style="display:flex; align-items:flex-start; gap:10px;">
                <div style="
                  width:40px;
                  height:40px;
                  border-radius:50%;
                  background:${bgColor};
                  color:#fff;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  font-weight:bold;
                  font-size:14px;
                ">
                  ${initials}
                </div>
                <div>
                  <div style="font-size:16px; font-weight:600;">${item.name}</div>
                  <div style="font-size:12px; color:gray;">
                    ${item.date ? timeAgo(item.date) : ""}
                  </div>
                </div>
              </div>

              <div>
                <span style="font-size:18px;">
                  ${item.status === "y" ? "✅" : "❌"}
                </span>
              </div>
            </div>

            <div style="margin-left:50px; font-size:14px; color:#333;">
              ${item.message}
            </div>
          </div>
        `;
      })
      .join("");

    // Pagination with Prev/Next
    const totalPages = Math.ceil(allComments.length / COMMENTS_PER_PAGE);
    if (totalPages > 1) {
      let pagHtml = '<div class="timeline-pagination">';
      pagHtml += `<button type="button" ${
        page === 1 ? "disabled" : ""
      } onclick="window.gotoTimelinePage(${page - 1}, event)">Prev</button>`;
      for (let i = 1; i <= totalPages; i++) {
        pagHtml += `<button type="button" ${
          i === page ? 'class="active"' : ""
        } onclick="window.gotoTimelinePage(${i}, event)">${i}</button>`;
      }
      pagHtml += `<button type="button" ${
        page === totalPages ? "disabled" : ""
      } onclick="window.gotoTimelinePage(${page + 1}, event)">Next</button>`;
      pagHtml += "</div>";
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
