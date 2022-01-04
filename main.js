const express = require('express')
const app = express()
const fs = require('fs')
const template = require('./lib/template.js')
const bodyParser = require('body-parser')
const compression = require('compression')
const topicRouter = require('./routes/topic')
const helmet = require('helmet')


app.use(helmet())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(compression())
//app.use(function(request, response, next){ .use 로 사용할 경우 모든 api 에 대하여 들어오지만 get 으로 주면 .get 에 해당하는 api 만 사용하게 된다.
app.get('*',function(request, response, next){
    fs.readdir('./data', (error, filelist) => {
        request.list = filelist
        next()
    })
})

app.use('/topic', topicRouter)

app.get('/', (request,response) => {
    //fs.readdir('./data', (error, filelist) => {
        let title = 'WELCOME'
        let description ='hello node.js'
        let list = template.List(request.list)
        let html = template.html(title, list, `
        <h2>${title}</h2>
        <p>${description}</p>
        <img src="/images/hello.jpg" style="width: 400px; display: block; margin-top : 10px;">`
        , `<a href="/topic/create">create</a>`)
        response.send(html);
    //});
})




app.use((req,res,next) => res.status(404).send('Sorry cant find that!!'))
app.use((err,req,res,next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(3000, () => console.log('Example app listening on port 3000!!'))

/*
var http = require('http')
var fs = require('fs')
var url = require('url')
var path = require('path')
const querystring = require('querystring')
var template = require('./lib/template.js')

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathName = url.parse(_url,true).pathname;

    if(pathName === '/'){
        if(queryData.id === undefined){
            fs.readdir('./data', (error, filelist) => {
                var title = 'WELCOME'
                var description ='hello node.js'
                var list = template.List(filelist)
                var html = template.html(title, list, `<h2>${title}</h2><p>${description}</p>`, `<a href="/create">create</a>`)
                response.writeHead(200);
                response.end(html);
            });
            
        }else {
            fs.readdir('./data', (error, filelist) => {
                var filteredId = path.parse(queryData.id).base
                fs.readFile(`data/${filteredId}`,'utf-8', (err , description) => {
                var title = queryData.id;
                var list = template.List(filelist)
                var html = template.html(title 
                                            ,list
                                            ,`<h2>${title}</h2><p>${description}</p>`
                                            , `<a href="/create">create</a> 
                                               <a href="/update?id=${title}">update</a>
                                               <form action="/delete_process" method="post">
                                                <input type="hidden" name="id" value="${title}">
                                                <input type="submit" value="delete">
                                               </form>`)
                response.writeHead(200);
                response.end(html);
                });
            }); 
        }
    }else if(pathName === '/create') {
        fs.readdir('./data', (error, filelist) => {
            var title = 'WEB - create '
            var list = template.List(filelist)
            var html = template.html(title, list, `<form action="/create_process" method="post">
                                                        <p><input type="text" name="title" placeholder="title"></p>
                                                        <p><textarea name="description" placeholder="description"></textarea></p>
                                                        <p><input type="submit"></input></p>
                                                        </form>`, ''
                                                        )
            response.writeHead(200);
            response.end(html);
        });
    }else if(pathName ==='/create_process') {
        var body = ''
        request.on('data', function(data){
            body = body + data
            // if(body.length >= 1e6) request.connection.destroy();
        })

        request.on('end', function(){
            var post = new URLSearchParams(body)
            var title = post.get('title')
            var description = post.get('description')
            fs.writeFile(`data/${title}`,description,'utf-8',(err) => {
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            })
        })
    }else if (pathName === '/update') {
        fs.readdir('./data', (error, filelist) => {
            var filteredId = path.parse(queryData.id).base
            fs.readFile(`data/${filteredId}`,'utf-8', (err , description) => {
            var title = queryData.id;
            var list = template.List(filelist)
            var html = template.html(title,
                                         list,
                                        `<form action="/update_process" method="post">
                                            <input type="hidden" name="id" value="${title}">
                                            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                                            <p><textarea name="description" placeholder="description">${description}</textarea></p>
                                            <p><input type="submit"></input></p>
                                        </form>`, 
                                        `<a href="/create">create</a> 
                                         <a href="/update?id=${title}">update</a>
                                         
                                         `)
            response.writeHead(200);
            response.end(html);
            });
        }); 
    }else if(pathName === '/update_process') {
        var body = ''
        request.on('data', function(data){
            body = body + data
            // if(body.length >= 1e6) request.connection.destroy();
        })

        request.on('end', function(){
            var post = new URLSearchParams(body)
            var title = post.get('title')
            var description = post.get('description')
            var id = post.get('id')
            fs.rename(`data/${id}`, `data/${title}`, (err) => {
                fs.writeFile(`data/${title}`,description,'utf-8',(err) => {
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                })
            })
        })
    }else if(pathName === '/delete_process'){
        var body = ''
        request.on('data', function(data){
            body = body + data
            // if(body.length >= 1e6) request.connection.destroy();
        })

        request.on('end', function(){
            var post = new URLSearchParams(body)
            var id = post.get('id')
            var filteredId = path.parse(id).base
            fs.unlink(`data/${filteredId}`, (err) => {
                response.writeHead(302, {Location: `/`});
                response.end();
            })
        })
    }else {
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);
*/