import { data } from "./data.js";
import { time } from "./js/time.js";
import { setupRSVP } from "./js/rsvp.js";

// load content
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    const guestDiv = document.getElementById('guest-name');
    if (guestDiv) {
        guestDiv.innerHTML = to ? to : 'Teman-teman semua';
    }

    time();
    setupRSVP();

    const alamatGift = document.getElementById("alamat-gift");
    if (alamatGift && data) {
        alamatGift.textContent = data.time.reception.address;
    }
});