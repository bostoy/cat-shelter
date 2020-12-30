const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const breeds = require('../data/breeds');
const cats = require('../data/cats.json');

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;
    //you should check every single pathname and request method and load an HTML page or parse the incoming data.

    if (pathname === '/cats/add-cat' && req.method === 'GET') {

        const filePath = path.normalize(
            path.join(__dirname, '../views/addCat.html')
        );

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('404 File Not Found');
                res.end();
                return;
            }
            const placeholder = breeds.map(breed => `<option value="${breed}">${breed}</option>`); //for every breed in db creates an option
            console.log('Data to string ' + data.toString()); //check data
            const modifiedData = data.toString().replace('{{catBreeds}}', placeholder);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(modifiedData);
            res.end();
        })

    } else if (pathname === '/cats/add-breed' && req.method === 'GET') {

        const filePath = path.normalize(path.join(__dirname, './views/addBreed.html'));

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('404 File Not Found');
                res.end();
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });


    }
}