const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');

const IMAGES_FILE = 'images.json';

// Initialize images array from file or as empty
let images = [];
try {
    const data = fs.readFileSync(IMAGES_FILE, 'utf8');
    images = JSON.parse(data);
} catch (err) {
    console.log('No existing images.json file found. Starting with an empty image gallery.');
    images = [];
}

const saveImages = () => {
    fs.writeFileSync(IMAGES_FILE, JSON.stringify(images, null, 2), 'utf8');
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (path === '/images') {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const { name, preview_url, description } = JSON.parse(body);
                const newId = images.length > 0 ? Math.max(...images.map(img => img.id)) + 1 : 1;
                const newImage = { id: newId, name, preview_url: preview_url || `http://example.com/preview/${newId}.jpg`, description: description || `Description for image ${newId}` };
                images.push(newImage);
                saveImages();
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newImage));
            });
        } else if (req.method === 'GET') {
            if (query.id) {
                const image = images.find(img => img.id === parseInt(query.id));
                if (image) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(image));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Image not found' }));
                }
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(images));
            }
        } else if (req.method === 'DELETE') {
            if (query.id) {
                const initialLength = images.length;
                images = images.filter(img => img.id !== parseInt(query.id));
                if (images.length < initialLength) {
                    saveImages();
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Image deleted successfully' }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Image not found' }));
                }
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Missing image ID for deletion' }));
            }
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Method Not Allowed' }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 