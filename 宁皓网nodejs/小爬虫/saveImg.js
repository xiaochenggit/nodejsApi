const https = require('https');
const request = require('request');
const fs = require('fs');
const url = 'https://threejs.org/files/projects/christmasexperiments2016.png';
request(url).pipe(fs.createWriteStream('2016.png'));