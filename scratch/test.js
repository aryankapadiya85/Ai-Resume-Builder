import handler from '../api/generate.js';

const req = {
  method: 'POST',
  body: {
    fullName: "John Doe",
    email: "test@example.com",
    jobTitle: "Frontend Dev",
    jobDescription: "What ever you give me i will do it very precisely"
  }
};

const res = {
  status: (code) => ({
    send: (msg) => console.log('STATUS:', code, 'SEND:', msg),
    json: (data) => console.log('STATUS:', code, 'JSON:', data)
  })
};

async function test() {
  await handler(req, res);
}

test();
