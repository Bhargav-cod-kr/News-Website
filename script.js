

window.addEventListener('load', () => fetchNews("India"));

async function fetchNews(query) {
    try {
        const response = await fetch(`${url}${query}&apikey=${API_KEY}`);

        console.log('Request URL:', `${url}${query}&apikey=${API_KEY}`);
        console.log('Response Status:', response.status);
        console.log('Response Headers:', response.headers);

        if (response.status === 426) {
            throw new Error("HTTP 426: Upgrade required. Please ensure your request is using HTTPS.");
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        if (!data.articles) {
            throw new Error("Data format error: 'articles' property is missing");
        }

        bindData(data.articles);

    } catch (error) {
        console.error("Failed to fetch news:", error);
    }
}

function bindData(articles) {
    if (!articles || articles.length === 0) {
        console.error("No articles available to display");
        return;
    }

    const cardContainer = document.getElementById('card_container');
    const newsCardTemplate = document.getElementById('template_news_card');

    cardContainer.innerHTML = '';
    articles.forEach(article => {
        if (!article.urlToImage) return;

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news_img');
    const newsTitle = cardClone.querySelector('#news_title');
    const newsSource = cardClone.querySelector('#news_source');
    const newsDesc = cardClone.querySelector('#news_description');

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    });

    newsSource.innerHTML = `${article.source.name} : ${date}`;
    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank");
    });
}

let currentSelectNav = null;
function onNavItemClick(id) {
    fetchNews(id);

    const navItems = document.getElementById(id);
    currentSelectNav?.classList.remove('active');
    currentSelectNav = navItems;
    currentSelectNav.classList.add('active');
}

const searchButton = document.getElementById('search_button');
const searchText = document.getElementById('search_text');

searchButton.addEventListener('click', () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    currentSelectNav?.classList.remove('active');
    currentSelectNav = null;
});

searchText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchText.value;
        if (!query) return;
        fetchNews(query);
        currentSelectNav?.classList.remove('active');
        currentSelectNav = null;
    }
});
