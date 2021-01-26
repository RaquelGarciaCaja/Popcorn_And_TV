"use strict";
const input = document.querySelector(".js-input");
const btn = document.querySelector(".js-button");
const listMovies = document.querySelector(".js-main__list");
const url = "//api.tvmaze.com/search/shows?q=";
const imgPlaceholder = "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
const resetAllFavorites = document.querySelector(".js-reset");
const logBtn = document.querySelector(".js-log");
//
const mainSectionPopcorn = document.querySelector(".js-popcorn");

let movies = [];
let arrFavoriteList = [];

//API
function getData() {
  fetch(url + input.value)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      movies = data;

      paintMovies();
      listenFavMovies();
      paintFavorite();
      listenTrashItem();
      mainSection();
    });
}

const mainSection = () => {
  mainSectionPopcorn.classList.add("main__hidden");
};

//PAINT API
function paintMovies() {
  let html = "";
  for (let i = 0; i < movies.length; i++) {
    let colorFavorite;
    let startFavorite;
    let HiddenPhoto;
    const classIndex = arrFavoriteList.findIndex((favMovie) => {
      if (favMovie.show.id === movies[i].show.id) {
        return true;
      } else {
        return false;
      }
    });

    if (classIndex !== -1) {
      colorFavorite = "color-favorite";
      startFavorite = "";
      HiddenPhoto = "hidden";
    } else {
      colorFavorite = "";
      startFavorite = "hidden";
      HiddenPhoto = "";
    }

    const showimage = movies[i].show.image;
    html += `<li class = "main__container ${colorFavorite}" id="${movies[i].show.id}">`;

    if (showimage !== null) {
      html += `<img class = "main__img ${HiddenPhoto}  " src="${movies[i].show.image.medium}" alt="${movies[i].show.name}" />`;
    } else {
      html += `<img class = "main__img ${HiddenPhoto}" src="${imgPlaceholder}" alt="${movies[i].show.name}" />`;
    }

    html += `<div class="main__text ${HiddenPhoto} "> <h3 class = "main__name">${movies[i].show.name}</h3></div>`;

    html += `<div class="${startFavorite}">`;
    if (showimage !== null) {
      html += `<div class="main__imgStart"><img class = "main__img main__details " src="${movies[i].show.image.medium}" alt="${movies[i].show.name}" /><i class="far fa-star main__star ${startFavorite}"></i></div>`;
    } else {
      html += `<div class="main__imgStart"><img class = "main__img main__details" src="${imgPlaceholder}" alt="${movies[i].show.name}" /><i class="far fa-star main__star ${startFavorite}"></i></div>`;
    }

    html += `<h3> ${movies[i].show.name}</h3>`;
    html += `<p><h4>Género:</h4>${movies[i].show.genres} </p>`;
    html += `<p><h4>Estreno:</h4>${movies[i].show.premiered} </p>`;

    html += `<p><h4>Idioma:</h4>${movies[i].show.language} </p>`;
    html += "</div>";
    html += "</li>";
  }

  listMovies.innerHTML = html;
  listenFavMovies();
}

// HANDLER PAINT
function handleFilter() {
  getData();
}

//PUSH AND SPLICES FAVORITES INTO ARRFAVORITELIST
function favMovies(ev) {
  const movieCLick = ev.currentTarget;
  const clickId = parseInt(movieCLick.id);
  const indexFav = arrFavoriteList.findIndex((click) => {
    if (parseInt(click.show.id) === clickId) return click;
  });
  if (indexFav === -1) {
    const foundIsFavorite = movies.find((click) => {
      if (parseInt(click.show.id) === clickId) {
        return click;
      }
    });
    arrFavoriteList.push(foundIsFavorite);
    movieCLick.classList.add("color-favorite");
  } else {
    arrFavoriteList.splice(indexFav, 1);
  }

  paintMovies();
  listenFavMovies();
  paintFavorite();
  listenTrashItem();
  setLocalStorage();
}

// PAINT FAVORITES
function paintFavorite() {
  const listMoviesFav = document.querySelector(".js-main__aside--fav");
  let htmlFav = "";
  for (let i = 0; i < arrFavoriteList.length; i++) {
    htmlFav += `<li class = "main__container--fav" id="${arrFavoriteList[i].show.id}">`;

    if (arrFavoriteList[i].show.image !== null) {
      htmlFav += `<img class = "main__img--fav" src="${arrFavoriteList[i].show.image.medium}" alt="${arrFavoriteList[i].show.name}" />`;
    } else {
      htmlFav += `<img class = "main__img--fav" src="${imgPlaceholder}" alt="${arrFavoriteList[i].show.name}" />`;
    }

    htmlFav += `<h3 class = "main__name--fav">${arrFavoriteList[i].show.name}</h3>`;
    htmlFav += `<i class="fas fa-trash js-reset-items" id="${i}"></i>`;

    htmlFav += "</li>";
  }
  listMoviesFav.innerHTML = htmlFav;
  listenFavMovies();
}
//////////////////////////////////////////////////////////////
//GUARDAR EN EL LOCAL STORAGE
function setLocalStorage() {
  localStorage.setItem("LocalStorageList", JSON.stringify(arrFavoriteList));
}
//OBTENER EL LOCAL STORAGE
function getLocalStorage() {
  arrFavoriteList = JSON.parse(localStorage.getItem("LocalStorageList"));
  if (arrFavoriteList === null) {
    arrFavoriteList = [];
  }
  paintMovies();
  listenFavMovies();
  paintFavorite();
  listenTrashItem();
}
getLocalStorage();
//////////////////////////////////////////////////////////////////
//RESET ALL
function resetFavorites() {
  arrFavoriteList.splice(1, arrFavoriteList.length);
  arrFavoriteList = [];
  localStorage.clear();
  paintFavorite();
}

// RESET EACH FAVORITE
function resetItemFavorites(ev) {
  const removeIdFav = ev.currentTarget.id;
  arrFavoriteList.splice(removeIdFav, 1);

  paintFavorite();
  listenFavMovies();
  listenTrashItem();
  setLocalStorage();
}

//SignIn; ///////////////////////////////////////////////////////////////////////////

function clickBtn() {
  // const btn = ev.currentTarget;
  alert("Esta acción esta en construcción, perdón por las molestias");
}

//////////////////////////////////////////////////////////////
//LISTENERS
btn.addEventListener("click", handleFilter);

function listenFavMovies() {
  const clickFavMovies = document.querySelectorAll(".main__container");
  for (const clickFavMovie of clickFavMovies) {
    clickFavMovie.addEventListener("click", favMovies);
  }
}

resetAllFavorites.addEventListener("click", resetFavorites);

function listenTrashItem() {
  const resetItems = document.querySelectorAll(".js-reset-items");
  for (const resetItem of resetItems) {
    resetItem.addEventListener("click", resetItemFavorites);
  }
}

//
function buttonsSignIn() {
  const popBtns = document.querySelectorAll(".js-popBtn");
  for (const popBtn of popBtns) {
    popBtn.addEventListener("click", clickBtn);
  }
}
buttonsSignIn();
