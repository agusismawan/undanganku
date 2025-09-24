import { data } from "../data.js";

export const time = () => {
    const akadContainer = document.getElementById("acara-akad-container");
    const resepsiContainer = document.getElementById("acara-resepsi-container");
    const mapsResepsi = document.getElementById("maps-resepsi");

    if (akadContainer && data) {
        akadContainer.innerHTML = `<div class="elementor-element elementor-element-616bff5f e-con-full e-flex e-con e-child"
            data-id="616bff5f" data-element_type="container">
            <div class="elementor-element elementor-element-592e0d99 e-con-full e-flex e-con e-child"
                data-id="592e0d99" data-element_type="container">
                <div class="elementor-element elementor-element-6bf7b45 revealkanan elementor-widget elementor-widget-heading"
                    data-id="6bf7b45" data-element_type="widget" data-widget_type="heading.default">
                    <div class="elementor-widget-container">
                        <h2 class="elementor-heading-title elementor-size-default">${data.time.mariage.month}</h2>
                    </div>
                </div>
            </div>
            <div class="elementor-element elementor-element-74838ef1 e-con-full e-flex e-con e-child"
                data-id="74838ef1" data-element_type="container">
                <div class="elementor-element elementor-element-3c51922 revealatas elementor-widget elementor-widget-text-editor"
                    data-id="3c51922" data-element_type="widget" data-widget_type="text-editor.default">
                    <div class="elementor-widget-container">
                        <p>${data.time.mariage.dayName}</p>
                    </div>
                </div>
                <div class="elementor-element elementor-element-7358c988 revealin elementor-widget elementor-widget-counter"
                    data-id="7358c988" data-element_type="widget" data-widget_type="counter.default">
                    <div class="elementor-widget-container">
                        <div class="elementor-counter">
                            <div class="elementor-counter-title">${data.time.mariage.time}</div>
                            <div class="elementor-counter-number-wrapper">
                                <span class="elementor-counter-number-prefix"></span>
                                <span class="elementor-counter-number" data-duration="2000"
                                    data-to-value="${data.time.mariage.day}" data-from-value="0" data-delimiter=",">0</span>
                                <span class="elementor-counter-number-suffix"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="elementor-element elementor-element-485c088 e-con-full e-flex e-con e-child"
                data-id="485c088" data-element_type="container">
                <div class="elementor-element elementor-element-53cbc6b2 revealkiri elementor-widget elementor-widget-heading"
                    data-id="53cbc6b2" data-element_type="widget" data-widget_type="heading.default">
                    <div class="elementor-widget-container">
                        <h2 class="elementor-heading-title elementor-size-default">${data.time.mariage.year}</h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="elementor-element elementor-element-201432bb reveal elementor-widget elementor-widget-text-editor"
            data-id="201432bb" data-element_type="widget" data-widget_type="text-editor.default">
            <div class="elementor-widget-container">
                <p>Alamat :</p>
                <p>${data.time.mariage.address}</p>
            </div>
        </div>`;
    }

    if (resepsiContainer && data) {
        resepsiContainer.innerHTML = `<div class="elementor-element elementor-element-4991356b e-con-full e-flex e-con e-child" data-id="4991356b" data-element_type="container">
            <div class="elementor-element elementor-element-4977eb26 e-con-full e-flex e-con e-child"
                data-id="4977eb26" data-element_type="container">
                <div class="elementor-element elementor-element-610c195 revealkanan elementor-widget elementor-widget-heading"
                    data-id="610c195" data-element_type="widget" data-widget_type="heading.default">
                    <div class="elementor-widget-container">
                        <h2 class="elementor-heading-title elementor-size-default">${data.time.reception.month}</h2>
                    </div>
                </div>
            </div>
            <div class="elementor-element elementor-element-3d273a3d e-con-full e-flex e-con e-child"
                data-id="3d273a3d" data-element_type="container">
                <div class="elementor-element elementor-element-729c80ea revealatas elementor-widget elementor-widget-text-editor"
                    data-id="729c80ea" data-element_type="widget"
                    data-widget_type="text-editor.default">
                    <div class="elementor-widget-container">
                        <p>${data.time.reception.dayName}</p>
                    </div>
                </div>
                <div class="elementor-element elementor-element-39f629a3 revealin elementor-widget elementor-widget-counter"
                    data-id="39f629a3" data-element_type="widget" data-widget_type="counter.default">
                    <div class="elementor-widget-container">
                        <div class="elementor-counter">
                            <div class="elementor-counter-title">${data.time.reception.time}</div>
                            <div class="elementor-counter-number-wrapper">
                                <span class="elementor-counter-number-prefix"></span>
                                <span class="elementor-counter-number" data-duration="2000"
                                    data-to-value="${data.time.reception.day}" data-from-value="0" data-delimiter=",">0</span>
                                <span class="elementor-counter-number-suffix"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="elementor-element elementor-element-608c37d1 e-con-full e-flex e-con e-child"
                data-id="608c37d1" data-element_type="container">
                <div class="elementor-element elementor-element-14032b35 revealkiri elementor-widget elementor-widget-heading"
                    data-id="14032b35" data-element_type="widget" data-widget_type="heading.default">
                    <div class="elementor-widget-container">
                        <h2 class="elementor-heading-title elementor-size-default">${data.time.reception.year}</h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="elementor-element elementor-element-74f8e9b2 reveal elementor-widget elementor-widget-text-editor"
            data-id="74f8e9b2" data-element_type="widget" data-widget_type="text-editor.default">
            <div class="elementor-widget-container">
                <p>Alamat :</p>
                <p>Kediaman Mempelai Putri<br>${data.time.reception.address}</p>
            </div>
        </div>`;
    }

    if (mapsResepsi && data) {
        const link = mapsResepsi.querySelector("a");
        if (link) {
            link.href = data.link.maps;
        }
    }
}