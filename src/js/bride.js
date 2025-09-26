import { data } from "../data.js";

export const bride = () => {
    const brideCouple = document.querySelector(".bride_couple ul");
    const brideListItem = (data) =>
        `<li>
            <div class="elementor-element elementor-element-5d3c36f8 profil revealatas elementor-widget elementor-widget-image" data-id="5d3c36f8" data-element_type="widget" data-widget_type="image.default">
                <div class="elementor-widget-container">
                    <img decoding="async" width="768" height="1024"
                        src="src/wp/wp-content/uploads/2024/12/WANITA-1-2-1-1-768x1024.jpg"
                        class="attachment-large size-large wp-image-27209" alt=""
                        srcset="https://inv.nikustory.com/wp-content/uploads/2024/12/WANITA-1-2-1-1-768x1024.jpg 768w, https://inv.nikustory.com/wp-content/uploads/2024/12/WANITA-1-2-1-1-225x300.jpg 225w, https://inv.nikustory.com/wp-content/uploads/2024/12/WANITA-1-2-1-1-1152x1536.jpg 1152w, https://inv.nikustory.com/wp-content/uploads/2024/12/WANITA-1-2-1-1.jpg 1326w"
                        sizes="(max-width: 768px) 100vw, 768px" />
                </div>
            </div>
            <div class="elementor-element elementor-element-7775011d reveal elementor-widget elementor-widget-heading"
                data-id="7775011d" data-element_type="widget" data-widget_type="heading.default">
                <div class="elementor-widget-container">
                    <h2 class="elementor-heading-title elementor-size-default">${data.name}</h2>
                </div>
            </div>
            <div class="elementor-element elementor-element-15be15f8 reveal elementor-widget elementor-widget-text-editor"
                data-id="15be15f8" data-element_type="widget" data-widget_type="text-editor.default">
                <div class="elementor-widget-container">
                    <p>${data.child} dari Bapak ${data.father}</p>
                    <p>&amp; Ibu ${data.mother}</p>
                </div>
            </div>
            <div class="elementor-element elementor-element-68011971 e-grid-align-tablet-center e-grid-align-mobile-center reveal elementor-shape-rounded elementor-grid-0 e-grid-align-center elementor-invisible elementor-widget elementor-widget-social-icons"
                data-id="68011971" data-element_type="widget"
                data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;}"
                data-widget_type="social-icons.default">
                <div class="elementor-widget-container">
                    <div class="elementor-social-icons-wrapper elementor-grid">
                        <span class="elementor-grid-item">
                            <a class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-repeater-item-6cc0603"
                                target="_blank">
                                <span class="elementor-screen-only">Instagram</span>
                                <i class="fab fa-instagram"></i> </a>
                        </span>
                    </div>
                </div>
            </div>
            <span style="display: ${data.id === 2 ? "none" : "block"}">
                <div class="elementor-element elementor-element-7020acc6 reveal elementor-widget elementor-widget-heading"
                    data-id="7020acc6" data-element_type="widget" data-widget_type="heading.default">
                    <div class="elementor-widget-container">
                        <h2 class="elementor-heading-title elementor-size-default">&</h2>
                    </div>
                </div>
            </span>
        </li>`;

    const brideData = [data.bride.L, data.bride.P];

    function renderElement(data, element, listItem) {
        element.innerHTML = '';
        data.map((data) => element.innerHTML += listItem(data));
    }

    renderElement(brideData, brideCouple, brideListItem);
};