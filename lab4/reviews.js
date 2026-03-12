let reviews = [];

loadReviews();

if (reviews.length === 0) {
    reviews = [
        {
            name: "Катя",
            text: "Огурцы просто супер! Хрустят как надо!",
            img: null
        },
        {
            name: "Игорь",
            text: "Беру уже третий раз, рассол вообще топ.",
            img: null
        }
    ];
}

const list = document.getElementById("reviews-list");
const form = document.getElementById("review-form");
const nameInput = document.getElementById("review-name");
const textInput = document.getElementById("review-text");
const imgInput = document.getElementById("review-image");
const error = document.getElementById("review-error");

function renderReviews() {
    list.innerHTML = "";

    reviews.forEach(r => {
        const block = document.createElement("div");
        block.className = "otziv-window";

        let html = `<p><strong>${r.name}</strong></p>
                    <p>${r.text}</p>`;

        if (r.img) {
            html += `<img src="${r.img}" style="max-width:100%; margin-top:10px;">`;
        }

        block.innerHTML = html;
        list.appendChild(block);
    });
}

renderReviews();

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (nameInput.value.trim() === "" || textInput.value.trim() === "") {
        error.style.display = "block";
        return;
    }

    error.style.display = "none";

    if (imgInput.files[0]) {
        const reader = new FileReader();
        reader.onload = () => {
            reviews.push({
                name: nameInput.value,
                text: textInput.value,
                img: reader.result
            });

            saveReviews();
            renderReviews();
        };
        reader.readAsDataURL(imgInput.files[0]);
    } else {
        reviews.push({
            name: nameInput.value,
            text: textInput.value,
            img: null
        });

        saveReviews();
        renderReviews();
    }

    form.reset();
});
