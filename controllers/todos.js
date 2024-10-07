let todos = [];

export const getAllTodos = (req, res) => {
  res.json(todos);
};

export const createTodo = (req, res) => {
  const newTodo = {
    id: Date.now(),
    ...req.body,
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
};

export const updateTodo = (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(todo => todo.id === id);
  if (index !== -1) {
    todos[index] = { ...todos[index], ...req.body };
    res.json(todos[index]);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
};

export const deleteTodo = (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  res.status(204).end();
};