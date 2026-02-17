import React from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import './App.css';

function App() {
  return (
    <ExpenseProvider>
      <div className="container">
        <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ color: 'var(--primary-color)' }}>Serviced Apartments Expenses</h1>
          <p style={{ color: 'var(--secondary-color)' }}>Simple Expense Tracker</p>
        </header>

        <Summary />

        <div className="dashboard-grid">
          <AddExpenseForm />
          <ExpenseList />
        </div>
      </div>
    </ExpenseProvider>
  );
}

export default App;
