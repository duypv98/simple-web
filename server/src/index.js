import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { handleAPIError, handleNotFoundError } from './middlewares/errorHandlers';
import router from './routers';
import dotenv from './utils/dotenv';
import helmet from 'helmet';

dotenv.config();

const PORT = +(process.env.PORT || 3001);
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? '*' : process.env.ALLOWED_ORIGIN,
  // ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://local-ijd.test'],
  credentials: true,
  // process.env.NODE_ENV === 'development' ? false : true
}))

app.get('/', (req, res) => {
  res.json('Welcome!');
});

app.use(router);

app.use(handleAPIError);
app.use(handleNotFoundError);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
