const url = require('url');
const fs = require('fs');
const path = require('path');
const cats = require('../data/cats.json');
const breeds = require('../data/breeds.json');


module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;
    const filePath = path.normalize(path.join(__dirname, '../views/home/index.html'));

    if (pathname === '/' && req.method === 'GET') {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 File Not Found');
                return
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    } else {

        return true;
    }

}