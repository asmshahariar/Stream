const https = require('https');

https.get('https://mtlivestream.com/hls/asian/ytlive/index.m3u8', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
}).on('error', (e) => {
  console.error(e);
});
