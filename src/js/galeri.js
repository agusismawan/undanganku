import { data } from "../data.js";

export const galeri = () => {
    const galeriContainer = document.querySelector('.elementor-gallery__container');
    if (!galeriContainer || !data.galeri) return;

    galeriContainer.innerHTML = data.galeri.map(item => `
        <a class="e-gallery-item elementor-gallery-item elementor-animated-content"
            href="src/wp/wp-content/uploads/2024/12/Mini-23TD475-10-2-2-1.jpg"
            data-elementor-open-lightbox="yes" data-elementor-lightbox-slideshow="581a934d"
            data-e-action-hash="#elementor-action%3Aaction%3Dlightbox%26settings%3DeyJpZCI6MjcyMTMsInVybCI6Imh0dHBzOlwvXC9pbnYubmlrdXN0b3J5LmNvbVwvd3AtY29udGVudFwvdXBsb2Fkc1wvMjAyNFwvMTJcL01pbmktMjNURDQ3NS0xMC0yLTItMS5qcGciLCJzbGlkZXNob3ciOiI1ODFhOTM0ZCJ9">
            <div class="e-gallery-image elementor-gallery-item__image"
                data-thumbnail="https://inv.nikustory.com/wp-content/uploads/2024/12/Mini-23TD475-10-2-2-1.jpg"
                data-width="1600" data-height="2396" aria-label="" role="img"></div>
            <div class="elementor-gallery-item__overlay"></div>
        </a>
    `).join('');
}