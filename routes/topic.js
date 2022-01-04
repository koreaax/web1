const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const template = require('../lib/template.js')

router.get('/create', (request,response) => {
    //fs.readdir('./data', (error, filelist) => {
        let title = 'WEB - create '
        let list = template.List(request.list)
        let html = template.html(title, list, `<form action="/topic/create_process" method="post">
                                                    <p><input type="text" name="title" placeholder="title"></p>
                                                    <p><textarea name="description" placeholder="description"></textarea></p>
                                                    <p><input type="submit"></input></p>
                                                    </form>`, ''
                                                    )
        response.send(html);
    //});
})

router.post('/create_process', (request,response) => {
    let post = request.body
    let title = post.title
    let description = post.description
    fs.writeFile(`data/${title}`,description,'utf-8',(err) => {
        response.writeHead(302, {Location: `/topic/${title}`});
        response.send();
    })
    /*
    let body = ''
    request.on('data', function(data){
        body = body + data
        // if(body.length >= 1e6) request.connection.destroy();
    })

    request.on('end', function(){
        let post = new URLSearchParams(body)
        let title = post.get('title')
        let description = post.get('description')
        fs.writeFile(`data/${title}`,description,'utf-8',(err) => {
            response.writeHead(302, {Location: `page/${title}`});
            response.send();
        })
    })
    */
})

router.get('/update/:pageId', (request,response) => {
    // fs.readdir('./data', (error, filelist) => {
        let filteredId = path.parse(request.params.pageId).base
        fs.readFile(`data/${filteredId}`,'utf-8', (err , description) => {
        let title = request.params.pageId;
        let list = template.List(request.list)
        let html = template.html(title,
                                     list,
                                    `<form action="/topic/update_process" method="post">
                                        <input type="hidden" name="id" value="${title}">
                                        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                                        <p><textarea name="description" placeholder="description">${description}</textarea></p>
                                        <p><input type="submit"></input></p>
                                    </form>`, 
                                    `<a href="/topic/create">create</a> 
                                     <a href="/topic/update?id=${title}">update</a>
                                     
                                     `)
        response.send(html);
        });
    // }); 
})

router.post('/update_process', (request,response) => {
    let post = request.body
    let title = post.title
    let description = post.description
    let id = post.id
    fs.rename(`data/${id}`, `data/${title}`, (err) => {
        fs.writeFile(`data/${title}`,description,'utf-8',(err) => {
            response.redirect(`/topic/${title}`)
        })
    })
    /*
    let body = ''
    request.on('data', function(data){
        body = body + data
        // if(body.length >= 1e6) request.connection.destroy();
    })

    request.on('end', function(){
        let post = new URLSearchParams(body)
        let title = post.get('title')
        let description = post.get('description')
        let id = post.get('id')
        fs.rename(`data/${id}`, `data/${title}`, (err) => {
            fs.writeFile(`data/${title}`,description,'utf-8',(err) => {
                response.redirect(`/page/${title}`)
            })
        })
    })
    */
})

router.post('/delete_process', (request,response) => {
    let post = request.body
    let id = post.id
    let filteredId = path.parse(id).base
    fs.unlink(`data/${filteredId}`, (err) => {
        response.redirect('/')
    })
    /*
    let body = ''
    request.on('data', function(data){
        body = body + data
        // if(body.length >= 1e6) request.connection.destroy();
    })

    request.on('end', function(){
        let post = new URLSearchParams(body)
        let id = post.get('id')
        let filteredId = path.parse(id).base
        fs.unlink(`data/${filteredId}`, (err) => {
            response.redirect('/')
        })
    })
    */
})


router.get('/:pageId', (request,response,next) => {
    //fs.readdir('./data', (error, filelist) => {
    let filteredId = path.parse(request.params.pageId).base
    fs.readFile(`data/${filteredId}`,'utf-8', (err , description) => {
        if(err){
            next(err)
        }else {
            let title = request.params.pageId
            let list = template.List(request.list)
            let html = template.html(title 
                                    ,list
                                    ,`<h2>${title}</h2><p>${description}</p>`
                                    , `<a href="/topic/create">create</a> 
                                        <a href="/topic/update/${title}">update</a>
                                        <form action="/topic/delete_process" method="post">
                                        <input type="hidden" name="id" value="${title}">
                                        <input type="submit" value="delete">
                                        </form>`)
            response.send(html);
        }
    });
    //}); 
})

module.exports = router