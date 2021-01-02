const URL = 'https://www.omdbapi.com/?apikey='
const KEY = 'cc66794b'
btn = document.getElementById('subm')
result = document.getElementById('results')
favorLists = document.getElementById('favorList')
let d
let storage = []
let start = 1

document.addEventListener('submit', function (e) {
    e.preventDefault();
    getFilm()
})

function getFilm(page = 1) {
    search = filmName.value
    type = typeMowie.value
    let req = `${URL}${KEY}&s=${search}&type=${type}&page=${page}`
    console.log(req);
    fetch(req)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if (data.Error) {
                console.log(111);
                result.innerHTML = ''
                details.innerHTML = 'Movie not found!'
            } else {
                writeResults(data, page);
            }
        })
        .catch((error) => (console.error(error)));
}

function getInnet(storage, e, i, inner, details) {
    let classes = "btn-favor"
    let tit = "Add to your favorite movies"
    if (localStorage[e.imdbID]) {
        classes += ' isFavorite'
        tit = "Delete from your favorite movies"
    }
    inner += `<div class="result">
    <a href="${e.Poster}"><img src="${e.Poster}"></a>
    <span>${e.Title}</span>
    <button class="${classes}" id="${e.imdbID}" onclick="addStorage('${e.Title}', '${e.imdbID}', this)" title="${tit}">⭐</button>
    <button class="btn-details" onclick="writeDetails(${i}, ${storage}, ${details})">Details</button>
    </div>`
    return inner
}

function writeResults(data, page) {
    if (data.Search.length > 0) {
        d = data
        let inner = ''
        data.Search.forEach((e, i) => {
            inner = getInnet('d.Search', e, i, inner, 'details')
        });
        len = Math.floor(Number(data.totalResults) / 10)
        if (len * 10 > 10) {
            let pagin = ''
            for (let i = 1; i < len && i < 10; i++) {
                if (i == page) {
                    pagin += `<button class="btn--active" onclick="getFilm(${i})">${i}</button>`
                } else {
                    pagin += `<button onclick="getFilm(${i})">${i}</button>`
                }
            }
            if (len > 9) {
                pagin += `<input onkeydown="eventer(event, this)" type="number" placeholder="${page}" max="${len}" id="pageN">`;
                if (len == page) {
                    pagin += `<button  class="btn--active" onclick="getFilm(${len})">${len}</button>`;
                } else {
                    pagin += `<button onclick="getFilm(${len})">${len}</button>`;
                }
            }
            inner += pagin
        }
        result.innerHTML = inner
    } else {
        result.innerHTML = ''
        details.innerHTML = 'Movie not found!'
    }
}

function writeDetails(s, d, details) {
    b = ''
    let imdb = d[s].imdbID
    b += `<h3>Title: ${d[s].Title} </h3>`
    b += `<div><i>Type: ${d[s].Type}</i></div>`
    b += `<div><b>Year: ${d[s].Year}</b></div>`
    b += `<div>imdbID: ${imdb}</div>`
    details.innerHTML = b
}

function eventer(event, t) {
    if (event.keyCode === 13) {
        getFilm(t.value)
    }
}

function addStorage(t, i, th) {
    if (localStorage[i]) {
        localStorage.removeItem(i)
        th.classList.remove('isFavorite')
    } else {
        localStorage.setItem(i, t)
        th.classList.add('isFavorite')
    }
}

function watchFavorite(s, h) {
    if (s == 'favorite') doFavoriteList()
    let hid = document.querySelector('.' + h)
    let show = document.querySelector('.' + s)
    hid.classList.add("hidden");
    show.classList.remove("hidden");
    detailsF.innerHTML = ''
    details.innerHTML = ''
}

function doFavoriteList() {
    let innerF = ''
    let i = 0
    favorLists.innerHTML = ''
    for (key in localStorage) {
        if (key[0] == 't' && key[1] == 't') {
            let req = `${URL}${KEY}&i=${key}`
            fetch(req)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data.Error) {
                        console.error(data.Error);
                    } else {
                        console.log(data);
                        storage.push(data)
                        favorLists.innerHTML += getInnet('storage', data, i, innerF, 'detailsF')
                        i++
                    }
                })
                .catch((error) => (console.error(error)));
        }
    }
}
