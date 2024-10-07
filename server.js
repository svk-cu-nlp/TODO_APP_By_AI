import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todos.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the TODO API' });
});

// Todo routes
app.use('/api/todos', todoRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});