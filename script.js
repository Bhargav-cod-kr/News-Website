const API_KEY = "e74108a4e48c46e2be12963a2c7e2d14";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener('load', () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    //fetch is asynchronous function jisse promise mil jaega jis par hum await karenge
    const res = await fetch(`${url}${query}&apikey=${API_KEY}`);
    //upar wali line se jo data milega use hum JSON format me convert kar denge
    //aur niche wali line bhi hume promise return karti hai to iske liye bhi hum await kar lenge
    const data = await res.json();
    console.log(data);
    //data ke andar jitne bhi articles hai unko bind karna hai
    bindData(data.articles);
}

//Jitne bhi articles aa rhe h utne he hume is template ko banana hai utni he baar
//aur us template ko bana bana kar apne "card_container" me append karte jana hai

function bindData(articles) { 
    const cardContainer = document.getElementById('card_container');
    const newsCardTemplate = document.getElementById('template_news_card');

    cardContainer.innerHTML = '';
    articles.forEach(article => {
        //agar image nhi aa rha h to direct return kar denge
        if(!article.urlToImage) return;

        //Jinme Images hai unko he load karenge
        //Create a Template clone
        const cardClone = newsCardTemplate.content.cloneNode(true);
        //Upar wali line ka matlab hai ki class = "card" wale div me jitne bhi element ya cheeze hai un sbka bhi clone banaenge matlab deep copy

        //data dalenege
        fillDataInCard(cardClone, article);
        //ab clone to ban gya hai
        //ab in clones ko card_container me append karenge
        cardContainer.appendChild(cardClone);
        //ab humare jitne bhi articles honge utne clone bante jaenge aur humare card_container me dalte jaege
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

    //convert time Zone Formate into Human readable(iske liye JavaScript me library bani hui hai)
    const date = new Date(article.publishedAt).toLocaleString("en-US" , {
        timeZone: "Asia/Jakarta"
    });

    newsSource.innerHTML = `${article.source.name} : ${date}`;

    //source website pr render karne ke liye
    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank");
    })
}

//ipl, finanace, politics ko selet krne ke liye means color change krne k liye
let currentSelectNav = null;
function onNavItemClick(id) {
    fetchNews(id);

    const navItems = document.getElementById(id);
    //Jb aapne kisi naye nav items par click kiya, to purane wale nav items me se active class ko remove kar do
    //currentSelectNav NULL nahi hai tbhi classList me se active class ko remove krnea hai
    currentSelectNav?.classList.remove('active');
    currentSelectNav = navItems;
    currentSelectNav.classList.add('active');
}

const searchButton = document.getElementById('search_button');
const searchText = document.getElementById('search_text');

searchButton.addEventListener('click', () => {
    const query = searchText.value;
    if(!query) return;
    fetchNews(query);
    currentSelectNav?.classList.remove('active');
    currentSelectNav = null;
})

searchText.addEventListener('keypress', (e) => {
    if(e.key == 'Enter') {
    const query = searchText.value;
    if(!query) return;
    fetchNews(query);
    currentSelectNav?.classList.remove('active');
    currentSelectNav = null;
    }
})