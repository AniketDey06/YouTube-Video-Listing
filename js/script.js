const videoBox = document.querySelector('.videobox')
const search = document.querySelector('.input')

let videoDataArr = [] 

function displayToScreen(obj){
    const videoData = obj.data.data
    videoDataArr = []
    videoData.forEach(video => {
        const videoCard = document.createElement("div")
        videoCard.classList.add('card')
        videoCard.innerHTML = 
                `<a href="https://www.youtube.com/watch?v=${video.items.id}" id="videolink" target="_blank" rel="noopener noreferrer">
                    <div class="card-image-container">
                        <img src="${video.items.snippet.thumbnails.maxres.url}" id="thamnail" alt="">
                    </div>
                    <p class="card-title" id="videotitle">${video.items.snippet.title}</p>
                    <div class="channelname">
                        <p class="card-des" id="channelname">
                            ${video.items.snippet.channelTitle}
                        </p>
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                </a>`
        videoBox.appendChild(videoCard)
        videoDataArr.push({
            videoTitle: video.items.snippet.title.toLowerCase(),
            element: videoCard
        });
    });

   


}

async function fetchVideoData() {
    fetch("https://api.freeapi.app/api/v1/public/youtube/videos?page=1&limit=10&query=javascript&sortBy=keep%2520one%253A%2520mostLiked%2520%257C%2520mostViewed%2520%257C%2520latest%2520%257C%2520oldest")
        .then( res => res.json())
        .then(displayToScreen)
        .finally(() => {
            console.log("end");
        })
}

search.addEventListener('input', e => {
    const value = e.target.value.toLowerCase()
    
    videoDataArr.forEach( video => {

        let isPresent = video.videoTitle.includes(value)
        video.element.classList.toggle("hide", !isPresent)
        
    })
    

})
 
window.addEventListener("load", () => {
    fetchVideoData()
})
