import API from "./api-func";


var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

async function trailer(id) {
  try {
    const key = await getKeyForTrailer(id);
    if (!key) {
      console.log("Нет ключа для трейлера");
      return;
    }
    console.log("key", key);
    markupForTrailer(key);
  }
  catch (error) {
    console.log(error.messege);
  }
}

async function getKeyForTrailer(id) {
  try {
    const response = await API.getTrailer(id);
    const keyForYouTube = response.videos.results[0].key;
    return keyForYouTube;
  }
  catch (error) {
    console.log(error.messege);
  }
}

function markupForTrailer(key) {
  const markupStringForTrailer =
    `<div class="trailer">
      <div id="player"></div>
      <div class="to-play" data-id="player" data-video="${key}" style="background-image: url(https://img.youtube.com/vi/${key}/hqdefault.jpg)">
        <button class="btn-trailer" data-datakey="${key}">
          <svg class="btn-trailer__icon" width="20" height="20">
            <use href="../images/icon8-youtube-play.svg#PgB_UHa29h0TpFV_moJI9a"></use>
          </svg>
        </button>
      </div>
    </div>`;
  const jsCardRef = document.querySelector('.js-card');
  jsCardRef.insertAdjacentHTML("beforeend", markupStringForTrailer);

  const toPlayRef = document.querySelector('.to-play');

  const btnTrailerRef = document.querySelector('.btn-trailer');
  btnTrailerRef.addEventListener('click', (event) => {
    toPlayRef.classList.add('removed');
    onYouTubeIframeAPIReady(event);
  });
}

var player;
function onYouTubeIframeAPIReady(event) {
  const keyForOnPlayer = event.currentTarget.getAttribute('data-datakey');;
  player = new YT.Player('player', {
    height: '180',
    width: '340',
    videoId: keyForOnPlayer,
    playerVars: {
      'autoplay': 1,
      'controls': 1,
      'playsinline': 1
    },
      events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 3000);
          done = true;
        }
      }
      function stopVideo() {
        player.stopVideo();
      }
}

function onPlayerReady(event) {
  event.target.playVideo();
}
      
export default { trailer };