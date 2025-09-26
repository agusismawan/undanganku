import { data } from "../data.js";

export const welcome = () => {
    const generateBrideNames = () => {
        const brideNames = document.getElementById("bride-names");
        const brideNames2 = document.getElementById("bride-names-2");
        const brideNames3 = document.getElementById("bride-names-3");

        if (brideNames && brideNames2 && brideNames3 && data.bride) {
            const {
                L: { name: brideLName },
                P: { name: bridePName }
            } = data.bride;
            brideNames.textContent = `${brideLName.split(" ")[0]} & ${bridePName.split(" ")[0]}`;
            brideNames2.textContent = `${brideLName.split(" ")[0]} & ${bridePName.split(" ")[0]}`;
            brideNames3.textContent = `${brideLName.split(" ")[0]} & ${bridePName.split(" ")[0]}`;
        }
    }

    const generateTimeContent = ({ time }) => {
        const { year, monthName, day, dayName } = time.reception;
        return `${dayName}, ${day} ${monthName} ${year}`;
    };

    const setupSaveTheDate = () => {
        const saveDateBtn = document.querySelector('a.elementor-button[href="#date"]');
        if (saveDateBtn && data.link && data.link.calendar) {
            saveDateBtn.setAttribute('href', data.link.calendar);
            saveDateBtn.setAttribute('target', '_blank');
            saveDateBtn.setAttribute('rel', 'noopener');
        }
    }

    const initializeHome = () => {
        const { bride, time } = data;
        if (bride && time) {
            generateBrideNames();
            const tanggal = document.getElementById("wedding-date");
            if (tanggal) {
                tanggal.textContent = generateTimeContent({ time });
            }
        }
        setupSaveTheDate()
    }

    initializeHome();
}