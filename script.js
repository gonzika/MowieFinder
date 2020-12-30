const URL = 'https://www.omdbapi.com/?apikey='
const KEY = 'cc66794b'
btn = document.getElementById('subm')
result = document.getElementById('results')
let d

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

function writeResults(data, page) {
    if (data.Search.length > 0) {
        d = data
        let inner = ''
        data.Search.forEach((e, i) => {
            inner += `<div><a href="${e.Poster}"><img src="${e.Poster}"></a><span>${e.Title}</span><button onclick="writeDetails(${i})">Details</button></div>`
        });
        inner += '<br>'
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

function writeDetails(s) {
    b = ''
    b += `<h3>Title: ${d.Search[s].Title}</h3>`
    b += `<i>Type: ${d.Search[s].Type}</i>`
    b += `<b>Year: ${d.Search[s].Year}</b>`
    b += `<div>imdbID: ${d.Search[s].imdbID}</div>`
    details.innerHTML = b
}

function eventer(event, t) {
    if (event.keyCode === 13) {
        getFilm(t.value)
    }
}