var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html');

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        var body = '';

        req.on('data', function (chunk) {
            body += chunk;
        });

        req.on('end', function () {
            if (req.url === '/') {
                log('Received message: ' + body);
            } else if (req.url === '/scheduled') {
                log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            } else if (req.url === '/ping') {
                log('Received message: ' + body);
            }
            res.writeHead(200);
            res.write(body);
            res.end();
        });
    } else if (req.method === 'GET' && req.url === '/ping') {
        const { headers } = req;
        const header = headers['x-okta-verification-challenge'];
        const response = {
            'verification': header,
        };
        res.writeHead(200);
        res.write(JSON.stringify(response));
        res.end();
    } else {
        res.writeHead(200);
        res.write(html);
        res.end();
    }
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');
