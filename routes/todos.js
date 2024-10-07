import express from 'express';
import { getAllTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todos.js';

const router = express.Router();

router.get('/', getAllTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;