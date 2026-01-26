(async () => {
  const origin = 'http://localhost:8081';
  const username = 'smoke_front_' + Date.now();
  const email = username + '@example.com';
  const password = 'Test1234';

  try {
    const regRes = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: origin },
      body: JSON.stringify({ username, email, password, fullName: 'Smoke Front' }),
    });
    const regJson = await regRes.json().catch(() => ({}));
    console.log('REGISTER', regRes.status, regJson);

    const loginRes = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: origin },
      body: JSON.stringify({ email, password }),
    });
    const loginJson = await loginRes.json().catch(() => ({}));
    console.log('LOGIN', loginRes.status, loginJson);
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
})();
