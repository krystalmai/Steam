const requestOptions = {
  method: "GET",
  redirect: "follow"
};
const GENRE_LIST_URL = "https://cs-steam-game-api.herokuapp.com/genres";
const TAG_LIST_URL = "https://cs-steam-game-api.herokuapp.com/steamspy-tags";
const FEATURED_GAMES_URL = "https://cs-steam-game-api.herokuapp.com/features";
let SEARCH_GAMES_BASE_URL = "https://cs-steam-game-api.herokuapp.com/games";
let SINGLE_GAME_BASE_URL =
  "https://cs-steam-game-api.herokuapp.com/single-game/";
const gameGrid = document.querySelector(".game-grid");
const errMsg = document.querySelector("#error-message");
const genresContainer = document.querySelector(".genres-container");
const tagsContainer = document.querySelector(".tags-container");
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");
let gameGridDisplayTitle = document.querySelector("#game-grid-display-title");
let detailTitle = document.querySelector("#detail-display-title");
const gameDetail = document.querySelector("#game-details");
const closeBtn = document.querySelector("#close-modal");
let checkboxList;
async function fetchGames(url) {
  try {
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      const data = await response.json();
      const games = data["data"];
      return games;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}
async function fetchSingleGame(appid) {
  let url = SINGLE_GAME_BASE_URL + appid;
  console.log(url);
  try {
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      const data = await response.json();
      const games = data["data"];
      return games;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}
async function fetchGenres() {
  try {
    const response = await fetch(`${GENRE_LIST_URL}`, requestOptions);
    if (response.ok) {
      const data = await response.json();
      const genres = data["data"];
      return genres;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function fetchTags() {
  try {
    const response = await fetch(`${TAG_LIST_URL}`, requestOptions);
    if (response.ok) {
      const data = await response.json();
      const tags = data["data"];
      console.log(tags);
      return tags;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

function createGameCard(img, name, price, appid) {
  const gameCard = document.createElement("div");
  const gameImg = document.createElement("img");
  const gameInfo = document.createElement("div");
  const gameName = document.createElement("span");
  const gamePrice = document.createElement("span");

  gameCard.classList.add("game-card");
  gameImg.setAttribute("id", `${appid}`);
  gameImg.classList.add("game-img");
  gameInfo.classList.add("game-info");
  gameName.classList.add("game-name");
  gamePrice.classList.add("game-price");

  gameImg.setAttribute("src", `${img}`);
  gameName.textContent = `${name}`;
  gamePrice.textContent = `$${price}`;

  gameInfo.appendChild(gameName);
  gameInfo.appendChild(gamePrice);
  gameCard.appendChild(gameImg);
  gameCard.appendChild(gameInfo);
  gameGrid.appendChild(gameCard);
}

function createGenre(name, count) {
  const genreWrapper = document.createElement("div");
  const checkbox = document.createElement("input");
  const label = document.createElement("label");
  const span = document.createElement("span");

  genreWrapper.classList.add("genre-wrapper");
  checkbox.classList.add("genre");
  label.classList.add("genre-label");
  span.classList.add("genre-count");

  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", `${name}`);
  checkbox.setAttribute("value", `${name}`);
  label.setAttribute("for", `${name}`);
  label.textContent = `${name}`;
  span.textContent = `${count}`;

  genreWrapper.appendChild(checkbox);
  genreWrapper.appendChild(label);
  genreWrapper.appendChild(span);
  genresContainer.appendChild(genreWrapper);
}

function createTag(name) {
  const tagWrapper = document.createElement("div");
  const tag = document.createElement("a");

  tagWrapper.classList.add("tag-wrapper");
  tag.classList.add("tag");

  tag.setAttribute("href", "#");
  tag.textContent = `${name}`;

  tagWrapper.appendChild(tag);
  tagsContainer.appendChild(tagWrapper);
}
async function displayGames(url) {
  errMsg.textContent = "Loading...";
  const games = await fetchGames(url);
  gameGrid.textContent = "";

  if (!games) {
    errMsg.textContent = "Could not find game.";
  } else {
    errMsg.textContent = "";
    games.forEach((game) => {
      createGameCard(
        game["header_image"],
        game["name"],
        game["price"],
        game["appid"]
      );
    });
  }
}

function displayGenres(genres) {
  genresContainer.textContent = "";

  genres.forEach((genre) => {
    createGenre(genre["name"], genre["count"]);
  });
}

function displayTags(tags) {
  tagsContainer.textContent = "";
  tags.forEach((tag) => {
    createTag(tag["name"]);
  });
}

async function initialize() {
  fetchGames(`${FEATURED_GAMES_URL}`);

  displayGames(`${FEATURED_GAMES_URL}`);

  const genres = await fetchGenres();

  displayGenres(genres);

  const tags = await fetchTags();

  displayTags(tags);

  checkboxList = document.querySelectorAll(".genre");
  let checkedGenres = [];
  checkboxList.forEach((genre) =>
    genre.addEventListener("change", () => {
      if (genre.checked) {
        checkedGenres.push(genre);
      }

      filterByGenre(checkedGenres);
    })
  );

  let tagList = document.querySelectorAll(".tag");
  tagList.forEach((tag) =>
    tag.addEventListener("click", () => filterByTag(tag))
  );
}

async function searchByName() {
  let SEARCH_GAMES_URL = SEARCH_GAMES_BASE_URL + `?q=${searchInput.value}`;
  fetchGames(`${SEARCH_GAMES_URL}`);
  displayGames(`${SEARCH_GAMES_URL}`);
}
async function filterByGenre(checkedGenres) {
  // make sure only 1 genre checked
  while (checkedGenres.length > 1) {
    checkedGenres[0].checked = false;
    checkedGenres.shift();
  }
  //filter if one genre is checked
  if (checkedGenres.length !== 0) {
    if (checkedGenres[0].checked) {
      let SEARCH_GAMES_URL =
        SEARCH_GAMES_BASE_URL + `?genres=${checkedGenres[0].value}`;
      fetchGames(SEARCH_GAMES_URL);
      displayGames(SEARCH_GAMES_URL);
      changeDisplayTitle(gameGridDisplayTitle, checkedGenres[0].value);
    }
  }
}
async function filterByTag(tag) {
  let SEARCH_GAMES_URL =
    SEARCH_GAMES_BASE_URL + `?steamspy_tags=${tag.textContent}`;
  console.log(SEARCH_GAMES_URL);
  fetchGames(SEARCH_GAMES_URL);
  displayGames(SEARCH_GAMES_URL);

  changeDisplayTitle(gameGridDisplayTitle, tag.textContent);
}
function changeDisplayTitle(oldTitle, newTitle) {
  oldTitle.textContent = "";
  oldTitle.textContent = newTitle.toUpperCase();
}
function createGameDetail(
  img,
  price,
  desc,
  reldate,
  dev,
  ratings,
  playtime,
  categories
) {
  const headerImg = document.querySelector(".detail-image");
  const detailInfo = document.querySelector(".detail-info");
  const gameCategories = document.querySelector("#game-categories");

  reldate = new Date(reldate);
  let year = reldate.getFullYear();
  let month = reldate.getMonth();
  let date = reldate.getDate();
  reldate = `${date} - ${month} - ${year}`;

  headerImg.setAttribute("src", `${img}`);
  detailInfo.innerHTML = `For $${price}, ${desc} <br>
                            RELEASE DATE: ${reldate} <br>
                            DEVELOPER: ${dev} <br>
                            POSITIVE RATINGS: ${ratings} <br>
                            AVERAGE PLAYTIME: ${playtime}`;
  if (categories) {
    categories.forEach((cate) => (gameCategories.textContent += `${cate}, `));
  }
}

async function displaySingleGame(appid) {
  errMsg.textContent = "Loading...";
  gameGrid.style.display = "none";
  gameGridDisplayTitle.style.display = "none";
  const game = await fetchSingleGame(appid);
  console.log(game);
  if (!game) {
    errMsg.textContent = "Could not find game details.";
  } else {
    errMsg.textContent = "";
    console.log(game["data"]);
    createGameDetail(
      game["header_image"],
      game["price"],
      game["description"],
      game["release_date"],
      game["developer"],
      game["positive_ratings"],
      game["average_playtime"],
      game["categories"]
    );
    changeDisplayTitle(detailTitle, game["name"]);
  }
  gameDetail.style.display = "flex";
}
function closeGameDetail() {
  gameDetail.style.display = "none";
  gameGrid.style.display = "flex";
  gameGridDisplayTitle.style.display = "block";
}
searchBtn.addEventListener("click", searchByName);
searchInput.addEventListener("keyup", function onEvent(e) {
  if (e.keyCode === 13) {
    searchByName();
  }
});

gameGrid.addEventListener("click", (e) => {
  let el = e.target;
  if (!el.matches(".game-img")) {
    return;
  }
  console.log(el.id);
  displaySingleGame(`${el.id}`);
});
closeBtn.onclick = closeGameDetail;
window.onload = initialize();
