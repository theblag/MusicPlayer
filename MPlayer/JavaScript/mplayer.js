let currentSong = new Audio();
let songs;
let currFolder;
document.querySelector(".range").getElementsByTagName("input")[0].value=100
const play = document.getElementById("play");
function secToMin(sec) {
    if (isNaN(sec) || sec < 0) {
        return "00:00";
    }
    const min = Math.floor(sec / 60)
    const remsec = Math.floor(sec % 60);

    const newmin = String(min).padStart(2, '0')
    const newsec = String(remsec).padStart(2, '0')
    return `${newmin}:${newsec}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`Songs/${folder}`)
    let response = await a.text()

    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    songs = [];
    let as = div.getElementsByTagName("a")
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href.split(`/Songs/${folder}`)[1]).slice(1))
            console.log(decodeURIComponent(element.href.split(`/Songs/${folder}`)[1]).slice(1))
        }
    }
    let ul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    ul.innerHTML = ""
    for (const song of songs) {
        ul.innerHTML = ul.innerHTML + `<li>
            <img src="svg/music.svg" alt="music" class="invert">
                            <div class="info">
                                <div class="song-name">${song.replace("%20", " ").replace("/", "")}</div>
                                <div>The Bl@g</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="svg/play.svg" alt="play" class="invert">
                            </div></li>`;

    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            document.getElementById("play").src = "svg/pause.svg";
        })
        // console.log(e.querySelector(".info").firstElementChild.innerHTML.trim())
    });

}

const playMusic = (track, folder = currFolder, pause = false) => {
    currentSong.src = `Songs/${currFolder}/${track}`
    if (!pause) {
        currentSong.play()
        play.src = "svg/play.svg"
    }
    else {
        play.src = "svg/pause.svg"
    }

    // play.src="svg/pause.svg"
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"



}

async function main() {



    await getSongs("Calm")
    // console.log(songs)

    playMusic(songs[0], true)


    //event listener to previous, next and play
    play.addEventListener("click", () => { //play is the id
        if (currentSong.paused) {
            currentSong.play()
            play.src = "svg/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "svg/play.svg"
        }
    })


    //timeupdate

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secToMin(currentSong.currentTime)} / ${secToMin(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    //seek
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width * 100)

        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    });
    // document.querySelector(".circle").style.transition = "left 0.1s ease";

    //add event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";

    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //event listener for next and previous

    document.getElementById("previous").addEventListener("click", () => {
        currentSong.pause()
        console.log(decodeURIComponent(currentSong.src.split("/").slice(-1)[0]))
        let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").slice(-1)[0]))
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
            play.src="svg/pause.svg"
        }
        else{
            currentSong.play()
        }
        console.log(songs[index -1])
       
    })

    // Add an event listener to next
    document.getElementById("next").addEventListener("click", () => {
        currentSong.pause()
        console.log(decodeURIComponent(currentSong.src.split("/").slice(-1)[0]))

        let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").slice(-1)[0]))
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
            play.src="svg/pause.svg"
        }
        else{
            currentSong.play()
        }
    })


    //functioning of the volume button
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log("e.target.value is:",e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100
    })
    //loading playlist on card click
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            const folder = item.currentTarget.dataset.folder;
            currFolder = folder; // Update the current folder
            await getSongs(folder);
            playMusic(songs[0],currFolder)
            play.src="svg/pause.svg";

        })
    })
    let x=currentSong.volume;
    //muting on clicking the volume button
    document.querySelector(".volume>img").addEventListener("click",e=>{
        console.log(e.target)
        
        console.log(x)
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg");
            x=currentSong.volume;
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg");
            currentSong.volume=x;
            console.log(currentSong.volume,x);
            document.querySelector(".range").getElementsByTagName("input")[0].value=x*100
        }
    })
 
    
}

main()