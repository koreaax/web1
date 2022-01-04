module.exports = {
    html : function (title, list, body, control) {
        return `
                <!doctype html>
                <html>
                    <head>
                    <title>WEB1 - ${title} </title>
                    <meta charset="utf-8">
                    </head>
                    <body>
                    <h1><a href="/">WEB</a></h1>
                    ${list}
                    ${control}
                    ${body}
                    </body>
                </html>
                `
    },
    List : function (filelist) {
        var list = '<ul>'
        for(var i = 0 ; i < filelist.length ; i++){
            var name = filelist[i]
            list += `<li><a href="/topic/${name}">${name}</a></li>`
        }
        list = list + '</ul>'
        return list
    }
}

