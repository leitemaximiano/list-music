const searchLyrics = document.querySelector('#search_lyrics');
const listTitle = document.querySelector('#list_title');
const lyricsEl = document.querySelector('#lyrics');

const base_url = 'https://api.lyrics.ovh/'

const getLyricsbyArtistsOrBand = async (value) => {
    const response = await fetch(`${base_url}suggest/${value}`);
    const json = await response.json();
    return json
}

searchLyrics.addEventListener('submit', function(event){
    event.preventDefault()
    const artists = event.target.querySelector('input[name=artists]');
    const valueSearch = artists.value.trim();

    if (valueSearch) {
        fetch(`${base_url}suggest/${valueSearch}`)
            .then( res => res.json())
            .then( lyrics => {
                const html = lyrics.data.reduce((acc, item) => `
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
                        <strong>Titulo </strong> ${item.title}
                    </p>
                </li>
                `, '');
                listTitle.innerHTML = html;
                lyricsEl.classList.add('lyrics--show');
            })
    }
});



// https://api.lyrics.ovh/suggest/pink%20floid