const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const breeds = require('../data/breeds');
const cats = require('../data/cats.json');
const { request } = require('http');
const globalPath = __dirname.toString().replace('handlers', '');

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
            const catBreedPlaceholder = breeds.map(breed => `<option value="${breed}">${breed}</option>`); //for every breed in db creates an option
            const modifiedData = data.toString().replace('{{catBreeds}}', catBreedPlaceholder);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(modifiedData);
            res.end();
        })

    } else if (pathname === '/cats/add-breed' && req.method === 'GET') {

        const filePath = path.normalize(path.join(__dirname, '../views/addBreed.html'));

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


    } else if (pathname === '/cats/add-cat' && req.method === 'POST') {

        let form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            //fields is the incoming data from the form / files is the information about the uploaded file via form 
            if (err) {
                throw err;
            }
            let oldPath = files.upload.path;
            let newPath = path.normalize(path.join(globalPath, '/content/images/' + files.upload.name));

            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log(`Image uploaded to ${newPath}`);
            });

            fs.readFile('./data/cats.json', (err, data) => {
                if (err) {
                    throw err;
                }

                const allCats = JSON.parse(data);
                allCats.push({ id: (cats.length + 1).toString(), ...fields, image: files.upload.name });
                const json = JSON.stringify(allCats);

                fs.writeFile('./data/cats.json', json, (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log('Cat successfully added!');
                })
            });
            res.writeHead(301, { 'location': '/' });
            res.end();
        })
    } else if (pathname === '/cats/add-breed' && req.method === 'POST') {

        let formData = '';
        req.on('data', data => {
            formData += data;
        });

        console.log(formData);

        req.on('end', () => {
            const body = qs.parse(formData);

            fs.readFile('./data/breeds.json', (err, data) => {
                if (err) {
                    throw err;
                }
                let breeds = JSON.parse(data);
                breeds.push(body.breed);
                const json = JSON.stringify(breeds);


                fs.writeFile('./data/breeds.json', json, (err) => {
                    if (err) {
                        throw err;
                    }

                    console.log(`${body.breed} was successfully added to the breeds`);
                })
            })
        });
        res.writeHead(301, { 'location': '/' });
        res.end();
    }
}