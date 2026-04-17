import http from 'http';

console.log('Starting diagnostic test...\n');

function testConnection() {
  return new Promise((resolve) => {
    console.log('Attempting to connect to http://localhost:5000/health');
    
    const options = {
      method: 'GET',
      hostname: 'localhost',
      port: 5000,
      path: '/health',
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      console.log(`✓ Connected! Status: ${res.statusCode}`);
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`Response body: ${data}`);
        resolve({ success: true, status: res.statusCode });
      });
    });

    req.on('error', (err) => {
      console.log(`✗ Connection failed: ${err.message}`);
      resolve({ success: false, error: err.message });
    });

    req.on('timeout', () => {
      console.log('✗ Request timed out');
      req.destroy();
      resolve({ success: false, error: 'timeout' });
    });

    req.end();
  });
}

async function run() {
  const result = await testConnection();
  process.exit(result.success ? 0 : 1);
}

run();
