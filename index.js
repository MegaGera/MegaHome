import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import { PORT, SECRET_JWT_KEY } from './config.js';

const app = express();

app.set('view engine', 'ejs');

app.use(cookieParser());

app.get('/', (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).send('Unauthorized');
  try {
    const data = jwt.verify(token, SECRET_JWT_KEY);
    return res.render('dashboard', data);
  } catch (error) {
    return res.status(401).send('Unauthorized');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
