import express from 'express';
import router from './routes/userRoutes.js';

const app = express();

app.use(express.json());

app.use('/api/users', router);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
