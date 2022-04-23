const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
var http = require("http")
var fs = require('fs')
var express = require('express');
var app = express();
var fs = require('fs');
const { nextTick } = require('process');
var api_key = 'b239d10a14689b1e09956259e877b196'

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/json', express.static(__dirname + 'public/json'))

app.set('view engine','ejs')
app.get("", (req, res) => {
    console.log("HERE")
    res.render('index')
})
app.get("/search", (req, res) => {
    var text = req.query.text
    console.log("Searching for",text)
    search(text)
    .then(data =>{
        var results = JSON.stringify(data)
        console.log("Search successfull - creating file")
        //create file
        fs.writeFile(__dirname + '/public/json/searchResults.json',results,'utf8', (err)=>{
            if (err) throw err;
            console.log('SearchResults created')
        })
        res.render('index')
    })
})


app.get("/view", (req, res) => {
    var title = req.query.title
    console.log(req.url)
    var title_id = req.query.title_id
    console.log(title_id)
    search(title)
    .then(data =>{
        var results = Array.from(data.results)
        //console.log(JSON.stringify(results))
        results.forEach(result =>{
            if(result.id == title_id){
                titleClicked(result)
                .then(data =>{    
                    console.log('Viewing -',result.name,result.title)
                    res.render('title', {titleData:data})
                });
            }
        })
    })
})

function titlePage_reload(result){
    
}

app.listen(8080, '192.168.0.69')

async function getTitle(title){
    
}
    /*
    var data = fs.readFileSync(__dirname + '/public/json/searchResults.json')
    var data = JSON.parse(data)
    var results = Array.from(data.results)
    results.forEach(result =>{
        var name = ''
        if(result.name == title){
            name = title
        }
        if(result.title == title){
            name = title
        }
        if(name != ''){
            titleClicked(result)
            .then(data =>{
                var data2 = JSON.stringify(data)
                fs.writeFile(__dirname + '/public/json/title.json',data2,'utf8', function (err) {
                    if (err){
                        console.log(err)
                    }
                    else{
                        console.log('Updated - title.json')
                    }
                    
                }) 
                 
            })
            
        }
        
    })
    
})

*/

async function search(text){
    if((text.replace(' ','')).length >0){
        text = text.replace(' ','+')
        var url = 'https://api.themoviedb.org/3/search/multi?api_key=' + api_key + '&query=' + text
        var res = await fetch(url)
        return res.json()  
    }
}
async function titleClicked(result){
    var mType = result.media_type
    var id = result.id
    var url = "https://api.themoviedb.org/3/" + mType + "/" + id + "?api_key=" + api_key
    var res = await fetch(url)
    return res.json()  
}


