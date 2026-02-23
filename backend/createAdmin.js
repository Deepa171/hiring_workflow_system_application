const bcrypt = require('bcryptjs');

async function createHash() {
  const password = 'admin123';   // ← tum apna password rakh sakti ho
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
}

createHash();
