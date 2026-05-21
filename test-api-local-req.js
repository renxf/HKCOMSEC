import http from 'http';

const req = http.request('http://localhost:3000/api/rpa/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  res.on('data', d => process.stdout.write(d));
});

req.write(JSON.stringify({ englishName: 'MAPKING', chineseName: '' }));
req.end();
