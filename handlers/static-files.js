const url = require('url');
const fs = require('fs');
const path = require('path');

function getContentType(url) {
    if (url.endsWith('css')) {
        return 'text/css';
    } else if (url.endsWith('html')) {
        return 'text/html';
    } else if (url.endsWith('png')) {
        return 'image/png';
    } else if (url.endsWith('txt')) {
        return 'text/plain';
    } else if (url.endsWith('ico')) {
        return 'image/x-icon';
    }
}

module.exports((req, res) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname.startsWith('/content') && req.method === 'GET') {
        if (pathname.endsWith('html') || pathname.endsWith('png') || pathname.endsWith('txt') || pathname.endsWith('ico')) {

            fs.readFile(`./${pathname}`, (err, data) => {
                if (err) {
                    console.log(err);
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.write('404 File Not Found');
                    res.end();
                    return;
                };
                res.writeHead(200, { 'Content-Type': `${getContentType(pathname)}` });
                res.write(data);
                res.end();

            })
        }

    }


});
