const API_URL = "https://inai-col1.fishrungames.com/ads";

const adForm = document.getElementById("adForm");
const adsList = document.getElementById("adsList");
const formMessage = document.getElementById("formMessage");
const refreshButton = document.getElementById("refreshButton");


// ==============================
// GET — получение объявлений
// ==============================

async function loadAds() {
    adsList.innerHTML = '<p class="loading">Загрузка объявлений...</p>';

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Не удалось получить объявления");
        }

        const data = await response.json();

        displayAds(data.items);

    } catch (error) {
        console.error(error);

        adsList.innerHTML = `
            <p class="loading">
                Не удалось загрузить объявления.
            </p>
        `;
    }
}


// ==============================
// Отображение объявлений
// ==============================

function displayAds(ads) {

    if (!ads || ads.length === 0) {
        adsList.innerHTML = `
            <p class="loading">
                Объявлений пока нет.
            </p>
        `;

        return;
    }

    adsList.innerHTML = "";

    ads.forEach(ad => {

        const card = document.createElement("div");
        card.className = "ad-card";

        let imageHTML;

        if (ad.image_url) {
            imageHTML = `
                <img
                    src="https://inai-col1.fishrungames.com${ad.image_url}"
                    alt="${ad.title}"
                >
            `;
        } else {
            imageHTML = `
                <div class="no-image">
                    Нет изображения
                </div>
            `;
        }

        card.innerHTML = `
            ${imageHTML}

            <div class="ad-content">

                <h3>${ad.title}</h3>

                <p class="ad-description">
                    ${ad.description}
                </p>

                <p class="ad-price">
                    ${ad.price} сом
                </p>

            </div>
        `;

        adsList.appendChild(card);
    });
}


// ==============================
// POST — добавление объявления
// ==============================

adForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").files[0];

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);

    if (image) {
        formData.append("image", image);
    }

    try {

        formMessage.textContent = "Публикуем объявление...";

        const response = await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Не удалось отправить объявление");
        }

        const newAd = await response.json();

        console.log("Новое объявление:", newAd);

        formMessage.textContent = "Объявление успешно опубликовано!";

        adForm.reset();

        // Обновляем список
        loadAds();

    } catch (error) {

        console.error(error);

        formMessage.textContent =
            "Ошибка при публикации объявления.";
    }
});


// ==============================
// Кнопка обновления
// ==============================

refreshButton.addEventListener("click", loadAds);


// Загружаем объявления при открытии страницы

loadAds();