import './config/loadEnv.js';
import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(cookieParser());


// Validate Api Key
if (process.env.NODE_ENV === 'production') {
  const validateApiKey = async (req, res, next) => {
    try {
      const headers = new Headers({
        Cookie: "access_token=" + req.cookies.access_token
      });
      const validateRequest = new Request(process.env.VALIDATE_URI, {
        headers: headers,
      });
      const validateResponse = await fetch(validateRequest);
      const validateData = await validateResponse.json();
      req.validateData = validateData.data;
      if (validateResponse.status === 200) {
        next();
      } else {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Can\'t validate token' });
    }
  };
  app.use(validateApiKey)
} else if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    req.validateData = { username: process.env.WEB_USERNAME || 'test' };
    next();
  });
}

app.get('/', (req, res) => {
  return res.render('dashboard', {data: req.validateData});
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
