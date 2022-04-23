var api_key = 'b239d10a14689b1e09956259e877b196'

var searchText = (document.getElementsByName("txt"))[0]


searchText.addEventListener('keyup',function(event){
    if(event.code === 'Enter'){
        var searchtext = searchText.value
        var url = '/search?text=' + searchtext
        window.location.href= url
    }
})

window.onload = function(){
    var path = window.location.pathname
    if (path == '/search'){
        var text = (window.location.search).replace('?text=','')
        var url = 'json/searchResults.json'
        fetch(url)
        .then(res =>{
            return res.json()
        })
        .then(data =>{
            update_search(data,text)
        })
    }
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
function update_search(data){
    if(document.getElementsByClassName('title').length >0){
        var titles = Array.from(document.getElementsByTagName('div'))
        titles.forEach(title =>{
            document.body.removeChild(title)
        })
    }
    var results = Array.from(data.results)
    results.forEach(result => {
        //Variables
        var id = result.id
        var mType = result.media_type
        var imgsrc = 'https://image.tmdb.org/t/p/w780/' + result.backdrop_path
        //Get Name
        if(result.name != undefined){
            var name = result.name
        }
        if(result.name == undefined){
            var name = result.title
        }

        //Creating title div
        var title = document.createElement('div')
        title.className = 'title'
        title.onclick = function(){
            //Video frame
            //var url = "https://api.themoviedb.org/3/" + mType + "/" + id + "?api_key=" + api_key
            var url= '/view?title=' + name + '&title_id=' + id
            window.location.href = url
        }
        //Title image
        var img = document.createElement('img')
        img.src = imgsrc
        img.className = 'title_img' 
        img.onerror = function(e) {
            img.src = 'img/imgERROR.png'
        }
        
        var titleText = document.createElement('h2')
        title.appendChild(img)
        title.appendChild(document.createElement('br'))
        titleText.innerHTML = name
        title.appendChild(titleText)
        title.appendChild(document.createElement('br'))
        document.body.appendChild(title)
    })
}



