import React, { createContext, useState, useEffect, useContext } from 'react';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense) => {
    setExpenses((prevExpenses) => [...prevExpenses, { ...expense, id: Date.now() }]);
  };

  const deleteExpense = (id) => {
    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
  };

  const editExpense = (expense) => {
    setEditingExpense(expense);
  };

  const updateExpense = (updatedExpense) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) => (expense.id == updatedExpense.id ? updatedExpense : expense))
    );
    setEditingExpense(null);
  };

  const clearEditing = () => {
    setEditingExpense(null);
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense, editingExpense, editExpense, updateExpense, clearEditing }}>
      {children}
    </ExpenseContext.Provider>
  );
};
