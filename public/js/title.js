var api_key = 'b239d10a14689b1e09956259e877b196'
var searchText = (document.getElementsByName("txt"))[0]
var errText = document.getElementById('err_text')

searchText.addEventListener('keyup',function(event){
    var searchtext = searchText.value
    if(searchtext.length <1){
        errText.innerHTML = 'Please enter a movie name before searching'
    }
    else{
        errText.innerHTML = ''
        if(event.code === 'Enter'){
            var url = '/search?text=' + searchtext
            window.location.href= url
        }
    }
    
})


document.addEventListener('DOMContentLoaded', function(){
    var data = x
    titlePage(data)
    .then(function(){
        //console.log(document.getElementById('64807'))
    })
})


async function titlePage(data){
    var iframe = document.getElementById('iframe')
    iframe.style.marginLeft = '12.5%'
    iframe.style.width = '65%'
    //iframe.style.height = '60vh'
    iframe.setAttribute('allowfullscreen','')
    iframe.id = 'iframe'
    document.body.appendChild(iframe)
    //Variables
    var title = data
    var titleID = title.id
    var name = title.name
    var dropdwn = document.createElement('div')
    var seasons = Array.from(data.seasons)
    //Dropdown
    var dropdown_btn = document.createElement('button')
    dropdown_btn.id = 'dd_btn'
    dropdown_btn.innerHTML = "Season 1"
    var dropdown = document.createElement('div')
    dropdown.id='dd'
    dropdown.style = 'background: lightgrey'
    dropdown.style.border = 'solid 2px black'
    dropdown.style.display = 'none'
    dropdown.style.width = '100px'
    dropdown_btn.onclick = function(){
        var display = document.getElementById('dd').style.display
        if(display == 'none'){
            document.getElementById('dd').style.display ='block'
        }
        else{
            document.getElementById('dd').style.display = 'none'
        }
    }
    document.body.appendChild(dropdown_btn)
    document.body.appendChild(dropdown)
    //Add to dropdown

    seasons.forEach(season =>{
        var seasonNum = season.season_number
        var season_div = document.createElement('div')
        season_div.id = "Season "+seasonNum
        season_div.className = "seasonDiv"
        
        if(seasonNum != 1){
            season_div.style.display = 'none'
        }
        document.body.appendChild(season_div)
    })
    seasons.forEach(season =>{
        var seasonNum = season.season_number
        var br = document.createElement('br')
        var ss = document.createElement('p')
        
        ss.href='#'
        ss.innerHTML = "Season " + seasonNum
        ss.style.color = 'blue'
        ss.style.border = '1px solid black'
        ss.style.marginBottom = '1px'
        ss.onclick = function(){
            console.log("Loading:",ss.innerHTML)
            document.getElementById('dd_btn').innerHTML = ss.innerHTML
            document.getElementById('dd_btn').click()
            var ssDivs = Array.from(document.getElementsByClassName('seasonDiv'))
            ssDivs.forEach(div =>{
                //console.log(div.style.display)
                if(div.style.display != "none"){
                    div.style.display = 'none'
                }
            })
            var sID = "Season " + seasonNum
            document.getElementById(sID).style.display = "block"
        }
        dropdown.appendChild(ss)
        var url = "https://api.themoviedb.org/3/tv/" + titleID + "/season/" + seasonNum + "?api_key=" + api_key + "&language=en-US"
        fetch(url)
        .then(res =>{
            return res.json()
        })
        .then(data =>{  
            console.log("Season " + seasonNum,data)
            getEpisodes(name,seasonNum,data)
        })
    })
}
var test = localStorage.getItem('Already_Viewed')
if(test == null){
    console.log("No viewed episodes")
    localStorage.setItem('Already_Viewed',JSON.stringify({"Episodes":[]}))
}
else if(test != null){  
    console.log("Viewed episodes",test)
    var viewed_episode_localStorage = JSON.parse(localStorage.getItem('Already_Viewed'))
    var viewed_episode_list = Array.from(viewed_episode_localStorage.Episodes)
    console.log(viewed_episode_list)
    var viewed_episodesID = []
    viewed_episode_list.forEach(viewed_episode =>{
        viewed_episode = JSON.parse(viewed_episode)
        viewed_episodesID.push(parseInt(viewed_episode.ID)) 
    })
}

function getEpisodes(TV_name1,seasonNum,data){
    var episodes = Array.from(data.episodes)
    episodes.forEach(episode =>{
        var epNum = episode.episode_number
        var epName = episode.name
        var epID = episode.id
        var ep = document.createElement('div')
        ep.className = 'Episode'
        ep.id = epID
        ep.style.border = 'solid 1px grey'
        ep.style.color = 'black'
        ep.style.display = 'inline-block'
        ep.style.margin = '10px 15px'
        ep.href ='#'
        console.log("Viewed Episode IDs",viewed_episodesID)
        console.log('Episode ID:',epID)
        console.log(typeof epID)
        if(viewed_episodesID.includes(epID)){
            console.log("Match")
            ep.style.backgroundColor = 'lightblue'
        }
        if(!viewed_episodesID.includes(epID)){
            ep.onmouseover = function(){
                ep.style.backgroundColor = 'lightblue'
            }
            ep.onmouseout = function(){
                ep.style.backgroundColor = 'white'
            }
        }
        
        if(epNum <10){
            epNum = '0' + String(epNum)
        }
        ep.innerHTML = ' Episode ' + epNum + ': ' + epName

        var names = formatEpisodeName(epName,TV_name1)
        var epName = names[0]
        var TV_name = names[1]
        var epTitle = TV_name + '-' + 'season-' + seasonNum + '-Episode-' + epNum + '-' + epName
        var epTitle = epTitle.toLowerCase()
        ep.onclick = function(){
            //https://membed.net/videos/castle-season-3-episode-24-knockout
            console.log(epTitle,epID)
            ep.style.backgroundColor = 'lightblue'
            addToViewed(ep)
            var url = 'https://membed.net/videos/' + epTitle
            getID(url,TV_name,seasonNum,epNum)
        }
        seasonID = "Season " + seasonNum
        document.getElementById(seasonID).appendChild(ep)
    })
}

function formatEpisodeName(epName,TV_name){
    epName = epName.replaceAll(' ','-')
    epName = epName.replaceAll("'",'-')
    epName = epName.replaceAll(",",'')
    if(epName.includes('...')){
        epName = epName.replaceAll("...",'')
    }
    if(epName.includes('-(1)')){
        epName = epName.replaceAll("-(1)",'')
    }
    if(epName.includes('-(2)')){
        epName = epName.replaceAll("-(2)",'')
    }
    if(epName.includes('.')){
        epName = epName.replaceAll(".",'-')
    }
    if(TV_name.includes(' ')){
        TV_name = TV_name.replaceAll(' ','-')
    }
    return [epName,TV_name]
}


function addToViewed(episode){
    var EP_json = {
        "ID": episode.id
    }
    var ep_list1 = JSON.parse(localStorage.getItem('Already_Viewed'))
    var ep_list = Array.from(ep_list1.Episodes)
    var viewed = 0
    ep_list.forEach(ep =>{
        var ep = JSON.parse(ep)
        var id = ep.ID
        if(id == episode.id){
            viewed = 1
        }
    })
    if(viewed !=1){
        ep_list.push(JSON.stringify(EP_json))
        var toAdd = {
            "Episodes":ep_list
        }
        localStorage.setItem('Already_Viewed',JSON.stringify(toAdd))
    }
    
}


var retry = 0
function getID(url,TV_name,seasonNum,epNum){
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
        if(doc.querySelector('.play-video')){
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
        }
        else {
            if(retry <2){
                retry++
                var epTitle = TV_name + '-' + 'season-' + seasonNum + '-Episode-' + epNum
                var url = 'https://membed.net/videos/' + epTitle
                getID(url,TV_name,seasonNum,epNum)
            }
            
        }
        
    })
}

function loadVidById(id){
    if(id != 999){
        url = 'https://membed.net/streaming.php?id=' + id
        console.log("link:",url)
        var iframe = document.getElementById('iframe')
        iframe.src = url

    }
}
