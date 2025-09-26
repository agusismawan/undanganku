import { data } from "./data.js";
import { welcome } from "./js/welcome.js";
import { bride } from "./js/bride.js";
import { time } from "./js/time.js";
import { setupRSVP } from "./js/rsvp.js";

function getUrlParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}

// load content
document.addEventListener('DOMContentLoaded', () => {
    const to = getUrlParam('to');
    const guestDiv = document.getElementById('guest-name');
    const nameInput = document.getElementById("name");
    if (guestDiv) {
        guestDiv.innerHTML = to ? to : 'Teman-teman semua';
    }

    if (nameInput && to) {
        nameInput.value = to.replace(/\+/g, " ");
        nameInput.disabled = true;
    }

    welcome();
    // bride();
    time();
    setupRSVP();

    const alamatGift = document.getElementById("alamat-gift");
    if (alamatGift && data) {
        alamatGift.textContent = data.time.reception.address;
    }
});