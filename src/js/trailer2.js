import API from "./api-func";

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
 
async function trailer(id) {
    try {
        const key = await getKeyForTrailer(id);
        console.log("key", key);
        onYouTubeIframeAPIReady(key);
    }
    catch {
        console.log("ssori");
    }
}
function onYouTubeIframeAPIReady(key) {
   
    player = new YT.Player('player', {
        height: '260',
        width: '340',
        //videoId: keyTrailerForYouTube,
        videoId: key,

        events: {
             'onReady': onPlayerReady,
            // 'onStateChange': onPlayerStateChange,
        }
    });
}
async function getKeyForTrailer(id) {
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
     

      function onPlayerReady(event) {
        event.target.playVideo();
        console.log('hi');
        
}


export default { trailer};