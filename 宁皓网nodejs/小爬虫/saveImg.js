const https = require('https');
const request = require('request');
const fs = require('fs');
const url = 'https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p2449831923.jpg';
request(url).pipe(fs.createWriteStream('2016.png'));