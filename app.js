const searchLyrics = document.querySelector('#search_lyrics');
const listTitle = document.querySelector('#list_title');
const lyricsEl = document.querySelector('#lyrics');
const buttonsNextAndPrev = document.querySelector('#buttons_next_and_prev');

const base_url = 'https://api.lyrics.ovh/';

const fetchData = async url => {
    const response = await fetch(url);
    const json = await response.json();
    return json
}

const getMoreSongs = async url => {

    const json = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`);

    insertSongIntoPage(json);
}

const insertNextAndPrevButtons = ({prev, next}) => {
    buttonsNextAndPrev.innerHTML = `
        ${prev ? `<button class="lyrics__button" onClick="getMoreSongs('${prev}')">Anteriores</button>`: ''}
        ${next ? `<button class="lyrics__button" onClick="getMoreSongs('${next}')">Próximos</button>`: ''}
    `;
}

const insertSongIntoPage = ({data, next, prev}) => {
    listTitle.innerHTML = data.reduce((acc, {artist:{ name }, title}) => `
          ${acc}
          <li class="lyrics__item">
              <p>
                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-file-earmark-music"
                      fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path
                          d="M4 0h5.5v1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h1V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" />
                      <path d="M9.5 3V0L14 4.5h-3A1.5 1.5 0 0 1 9.5 3z" />
                      <path fill-rule="evenodd"
                          d="M9.757 5.67A1 1 0 0 1 11 6.64v1.75l-2 .5v3.61c0 .495-.301.883-.662 1.123C7.974 13.866 7.499 14 7 14c-.5 0-.974-.134-1.338-.377-.36-.24-.662-.628-.662-1.123s.301-.883.662-1.123C6.026 11.134 6.501 11 7 11c.356 0 .7.068 1 .196V6.89a1 1 0 0 1 .757-.97l1-.25z" />
                  </svg>
                  <strong>${name}</strong> - ${title}
              </p>
              <div>
              <button class="lyrics__button" data-artist="${name}" data-song-title="${title}"> Ver letra</button>
                
            </div>
          </li>
          `, '');
    lyricsEl.classList.add('lyrics--show');

    
    if (prev || next) {
        insertNextAndPrevButtons({prev, next});
        return
    }

    buttonsNextAndPrev.innerHTML = '';
}

const fetchSongs = async term => {
    const json = await fetchData(`${base_url}suggest/${term}`);
    insertSongIntoPage(json);
}
const handleFormSubmit = event => {
    event.preventDefault()
    const artists = event.target.querySelector('input[name=artists]');
    const valueSearch = artists.value.trim();
    artists.value = '';
    artists.focus();
    if (!valueSearch)
        return;
    fetchSongs(valueSearch);

}

searchLyrics.addEventListener('submit', handleFormSubmit );

const insertLyricsIntoPage = ({ lyrics, songTitle, artist}) => {
    console.log(lyrics.length)
    listTitle.innerHTML = `
        <li class="lyrics__text">
            <h2><strong>${songTitle}</strong> - ${artist}</h2>
            <p>${lyrics.length > 0? lyrics: 'Desculpe não temos a letra da música!'}<p>
        </li>
    `;
}

const fetchLyrics = async (artist, songTitle) => {
    const json = await fetchData(`${base_url}/v1/${artist}/${songTitle}`);
    const lyrics = json.lyrics.replace(/(\r\n|\r|\n)/g, '<br />');
    insertLyricsIntoPage({ lyrics, songTitle, artist});
}

const handleSongsContainerClick = event => {
    const clickedElement = event.target
    if(clickedElement.tagName === "BUTTON") {
        const artist = clickedElement.getAttribute('data-artist');
        const songTitle = clickedElement.getAttribute('data-song-title');
        buttonsNextAndPrev.innerHTML = '';
        fetchLyrics(artist, songTitle)
    }
};

listTitle.addEventListener('click', handleSongsContainerClick);