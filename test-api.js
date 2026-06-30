fetch('http://localhost:3000/api/visitors', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

fetch('http://localhost:3000/api/visitors', { method: 'GET' })
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
