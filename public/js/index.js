var api_key = 'b239d10a14689b1e09956259e877b196'

//https://image.tmdb.org/t/p/w780/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg

function getID(url){
    console.log(url)
    var url1 = "https://api.codetabs.com/v1/proxy?quest=" + url
    fetch(url1)
    .then(res =>{
        return res.text()
    })
    .then(html =>{
        var parser = new DOMParser();
        // Parse the text
        var doc = parser.parseFromString(html, "text/html");
        console.log(doc)
        var embedDiv = Array.from(doc.querySelector('.play-video').children)
        embedDiv.forEach(el=>{
            if(el.nodeName == "IFRAME"){
                vidSRC = el.src
                console.log(vidSRC)
                var i_start = vidSRC.indexOf('id=') + 3
                var i_end = vidSRC.indexOf('&')
                vidID = vidSRC.slice(i_start,i_end)
                console.log(vidID)
                loadVidById(vidID)
                
            }
        })
    })
}
function loadVidById(id){
    url = 'https://membed.net/streaming.php?id=' + id
    window.open(url, '').focus();
}
function search(text){
    if((text.replace(' ','')).length >0){
        text = text.replace(' ','+')
        var url = 'https://api.themoviedb.org/3/search/multi?api_key=' + api_key + '&query=' + text
        fetch(url)
        .then(res =>{
            return res.json()
        })
        .then(data =>{
            console.log("search results:",data)
            updatePageSearch(data)
        })
    }
}

function updatePageSearch(data){
    if(document.getElementsByTagName('h2').length >0){
        var titles = Array.from(document.getElementsByTagName('h2'))
        titles.forEach(title =>{
            document.body.removeChild(title)
        })

    }
    var results = Array.from(data.results)
    results.forEach(result =>{
        //console.log(result.name)
        if(result.name != undefined){
            var name = result.name
        }
        if(result.name == undefined){
            //console.log(result.title)
            var name = result.title
        }
        console.log(name)
        var title = document.createElement('h2')
        var id = result.id
        //title.href = window.location.host +'/show.html'+ '?bruh=123'
        title.onclick = function(){
            var url = "https://api.themoviedb.org/3/" + result.media_type + "/" + result.id + "?api_key=" + api_key
            fetch(url)
            .then(res =>{
                return res.json()
            })
            .then(data =>{
                if(result.media_type == "tv"){
                    updateSeasons(data,result.id,name)
                }
                else{
                    updateMovie(data,result.id)
                }
            })
        }
        title.innerHTML = name
        title.append(document.createElement('br'))
        document.body.appendChild(title)
    })
}
function updateSeasons(data,TV_id,TV_name){
    //console.log(data)
    var seasons = Array.from(data.seasons)
    seasons.forEach(season =>{
        var seasonID = season.id
        var seasonNum = season.season_number
        var seasonName = season.name
        var seasonTitle = document.createElement('h3')
        seasonTitle.style.color = 'blue'
        seasonTitle.onclick = function(){
            var url = "https://api.themoviedb.org/3/tv/" + TV_id + "/season/" + season.season_number + "?api_key=" + api_key + "&language=en-US"
            fetch(url)
            .then(res =>{
                return res.json()
            })
            .then(data =>{
                console.log(seasonName,data)
                updateEpisodes(data,seasonNum,seasonName,TV_name,)
            })
        }
        seasonTitle.innerHTML = seasonName
        document.body.appendChild(seasonTitle)
    })
}
function updateEpisodes(data,seasonNum,seasonName,TV_name){
    var episodes = Array.from(data.episodes)
    episodes.forEach(episode =>{
        var epNum = episode.episode_number
        var epName = episode.name
        var epID = episode.id
        var episodeTitle = document.createElement('h4')
        episodeTitle.style.color = 'red'
        if(epNum <10){
            epNum = '0' + String(epNum)
        }
        episodeTitle.innerHTML = TV_name + ' - ' + seasonName + ' Episode ' + epNum + ': ' + epName
        epName = epName.replaceAll(' ','-')
        epName = epName.replaceAll("'",'-')
        epName = epName.replaceAll(",",'')
        if(epName.includes('...')){
            epName = epName.replaceAll("...",'')
        }
        if(epName.includes('-(1)')){
            epName = epName.replace("-(1)",'')
        }
        if(epName.includes('-(2)')){
            epName = epName.replace("-(2)",'')
        }
        if(TV_name.includes(' ')){
            TV_name = TV_name.replace(' ','-')
        }
        var epTitle = TV_name + '-' + 'season-' + seasonNum + '-Episode-' + epNum + '-' + epName
        var epTitle = epTitle.toLowerCase() 
        console.log("TITLE:",epTitle)
        episodeTitle.onclick = function(){
            //https://membed.net/videos/castle-season-3-episode-24-knockout
            console.log(epTitle)
            var url = 'https://membed.net/videos/' + epTitle
            getID(url)
        }
        //Castle - Season 3 Episode 24: Knockout
        
        document.body.appendChild(episodeTitle)
    })
}