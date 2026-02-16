import React, { useState, useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';

const ExpenseList = () => {
    const { expenses, deleteExpense } = useExpenses();
    const [filterUnit, setFilterUnit] = useState('all');
    const [filterMonth, setFilterMonth] = useState('');

    // Extract unique units for filter
    const uniqueUnits = useMemo(() => {
        const units = new Set(expenses.map(e => e.unitName).filter(Boolean));
        return ['all', ...Array.from(units)];
    }, [expenses]);

    const filteredExpenses = useMemo(() => {
        return expenses.filter(expense => {
            const matchUnit = filterUnit === 'all' || expense.unitName === filterUnit;
            const matchMonth = filterMonth === '' || expense.date.startsWith(filterMonth);
            return matchUnit && matchMonth;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [expenses, filterUnit, filterMonth]);

    const totalFilteredAmount = useMemo(() => {
        return filteredExpenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
    }, [filteredExpenses]);

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Expenses List</h2>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                        value={filterUnit}
                        onChange={(e) => setFilterUnit(e.target.value)}
                        style={{ marginBottom: 0, width: 'auto' }}
                    >
                        <option value="all">All Units</option>
                        {uniqueUnits.filter(u => u !== 'all').map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>

                    <input
                        type="month"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        style={{ marginBottom: 0, width: 'auto' }}
                    />
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Date</th>
                            <th style={{ padding: '10px' }}>Type</th>
                            <th style={{ padding: '10px' }}>Unit</th>
                            <th style={{ padding: '10px' }}>Category</th>
                            <th style={{ padding: '10px' }}>Description</th>
                            <th style={{ padding: '10px' }}>Amount</th>
                            <th style={{ padding: '10px' }}>Status</th>
                            <th style={{ padding: '10px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: 'var(--secondary-color)' }}>
                                    No expenses found.
                                </td>
                            </tr>
                        ) : (
                            filteredExpenses.map(expense => (
                                <tr key={expense.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '10px' }}>{expense.date}</td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem',
                                            backgroundColor: expense.expenseType === 'unit' ? '#e0f2fe' : '#fef3c7',
                                            color: expense.expenseType === 'unit' ? '#0369a1' : '#b45309'
                                        }}>
                                            {expense.expenseType}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px' }}>{expense.unitName}</td>
                                    <td style={{ padding: '10px' }}>{expense.category}</td>
                                    <td style={{ padding: '10px' }}>{expense.description}</td>
                                    <td style={{ padding: '10px', fontWeight: 'bold' }}><span style={{ fontSize: '0.8em', marginRight: '2px' }}>EGP</span> {expense.amount.toFixed(2)}</td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{ color: expense.paymentStatus === 'paid' ? 'var(--success-color)' : 'var(--danger-color)' }}>
                                            {expense.paymentStatus}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        <button
                                            onClick={() => deleteExpense(expense.id)}
                                            style={{
                                                backgroundColor: 'transparent',
                                                color: 'var(--danger-color)',
                                                padding: '4px 8px',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    <tfoot>
                        <tr style={{ borderTop: '2px solid var(--border-color)', backgroundColor: 'var(--background-color)', fontWeight: 'bold' }}>
                            <td colSpan="5" style={{ padding: '10px', textAlign: 'right' }}>Total:</td>
                            <td style={{ padding: '10px' }}>
                                <span style={{ fontSize: '0.8em', marginRight: '2px' }}>EGP</span> {totalFilteredAmount.toFixed(2)}
                            </td>
                            <td colSpan="2"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default ExpenseList;
