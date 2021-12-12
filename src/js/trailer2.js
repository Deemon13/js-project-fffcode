import API from "./api-func";

const refs = {
    modal: document.querySelector('[data-modal]'),
    videoBox: document.querySelector('.iframeVideoPlayer'),
}
///////////////////////////////////////
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
//       var player;
//       function onYouTubeIframeAPIReady() {
//         player = new YT.Player('player', {
//           videoId: 'Ob3bp3jTc84',
//           autoplay: 1,
//           controls: 2,
         
//           events: {
//             'onReady': onPlayerReady,
//             'onStateChange': onPlayerStateChange
//           }
//         });
// }
 // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
        console.log('hi');
        
}
// 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}

function stopVideo(event) {
  event.stopVideo();
}
////////////////////////////////////////
async function onClickBtnTrailer(event) {
  console.log('будем запускать трейлер');
  try {
    const currentMovieForTrailer = event.currentTarget.id;
    console.log("movie id", currentMovieForTrailer);
    const keyTrailerForYouTube = await getIdForTrailer(currentMovieForTrailer);
    console.log("key", keyTrailerForYouTube);
    makeIframe(keyTrailerForYouTube);
//////////////////////////////////  
//This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
    ////////////то что работало //////////////
    // player = new YT.Player('player', {
    //   playerVars: {
    //     autoplay: 1,
    //     controls: 2,
    //     playsinline: 1,
    //     loop: 1,
    //     },
    //   height: '460',
    //     width: '740',
    //     videoId: keyTrailerForYouTube,

    //   events: {
    //     'onReady': onPlayerReady,
    //     'onStateChange': onPlayerStateChange,
    //       }
    //     });
    ///////////////////////////////////////
function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}
r(function(){
    if (!document.getElementsByClassName) {
        // Поддержка IE8
        var getElementsByClassName = function(node, classname) {
            var a = [];
            var re = new RegExp('(^| )'+classname+'( |$)');
            var els = node.getElementsByTagName("*");
            for(var i=0,j=els.length; i < j; i++)
                if(re.test(els[i].className))a.push(els[i]);
            return a;
        }
        var videos = getElementsByClassName(document.body,"youtube");
    } else {
        var videos = document.getElementsByClassName("youtube");
    }
    var nb_videos = videos.length;
    for (var i=0; i < nb_videos; i++) {
        // Находим постер для видео, зная ID нашего видео
        videos[i].style.backgroundImage = 'url(http://i.ytimg.com/vi/' + videos[i].id + '/sddefault.jpg)';
        // Размещаем над постером кнопку Play, чтобы создать эффект плеера
        var play = document.createElement("div");
        play.setAttribute("class","play");
        videos[i].appendChild(play);
        videos[i].onclick = function() {
            // Создаем iFrame и сразу начинаем проигрывать видео, т.е. атрибут autoplay у видео в значении 1
            var iframe = document.createElement("iframe");
            var iframe_url = "https://www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1";
            if (this.getAttribute("data-params")) iframe_url+='&'+this.getAttribute("data-params");
            iframe.setAttribute("src",iframe_url);
            iframe.setAttribute("frameborder",'0');
            // Высота и ширина iFrame будет как у элемента-родителя
            iframe.style.width  = this.style.width;
            iframe.style.height = this.style.height;
            // Заменяем начальное изображение (постер) на iFrame
            this.parentNode.replaceChild(iframe, this);
        }
    }
});
    /////////////////////////////////////
  }
  catch {
    console.log("не получилось");
  }
};

async function getIdForTrailer(id) {
  try {
    const response = await API.getTrailer(id);
    const keyForYouTube = response.videos.results[0].key;
    console.log("вот что нашла22", keyForYouTube);
    return keyForYouTube;
  }
  catch {
    console.log("не получилось");
  }
}
function makeIframe(key) {
   const makeIframeStr = `<button class="js-close-info">
        <svg class="modal__icon" width="20" height="20">
          <use href="./images/sprite.svg#icon-close"></use>
        </svg>
      КНОПКА</button>
      <div class="youtube" id="${key}" style="width: 500px; height: 281px;"></div>
`;
    refs.modal.insertAdjacentHTML("afterbegin", makeIframeStr);
 }

   
 ////////////////////////////

 ///////////////////////////////
export default { onClickBtnTrailer };