import React, { useState, useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';

const ExpenseList = () => {
    const { expenses, deleteExpense, editExpense } = useExpenses();
    const [filterUnit, setFilterUnit] = useState('all');
    const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

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
            <div className="list-header">
                <h2>Expenses List</h2>

                <div className="filters">
                    <select
                        value={filterUnit}
                        onChange={(e) => setFilterUnit(e.target.value)}
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
                    />
                </div>
            </div>

            <div className="desktop-only" style={{ overflowX: 'auto' }}>
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
                            <th style={{ padding: '10px' }}>Attachment</th>
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
                                <tr key={expense.id} style={{ borderBottom: '1px solid var(--border-color)', verticalAlign: 'middle' }}>
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
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            backgroundColor: expense.paymentStatus === 'paid' ? '#dcfce7' : '#fee2e2',
                                            color: expense.paymentStatus === 'paid' ? '#166534' : '#991b1b',
                                            textAlign: 'center',
                                            minWidth: '80px'
                                        }}>
                                            {expense.paymentStatus.charAt(0).toUpperCase() + expense.paymentStatus.slice(1)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        {expense.attachment ? (
                                            <a href={expense.attachment} download={expense.attachmentName || 'attachment'} style={{ color: 'var(--primary-color)', textDecoration: 'underline', cursor: 'pointer' }}>
                                                View
                                            </a>
                                        ) : (
                                            <span style={{ color: '#9ca3af' }}>-</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <button
                                                onClick={() => editExpense(expense)}
                                                style={{
                                                    backgroundColor: '#eff6ff',
                                                    color: '#1d4ed8',
                                                    border: '1px solid #bfdbfe',
                                                    padding: '6px 12px',
                                                    fontSize: '0.85rem',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#dbeafe'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#eff6ff'}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteExpense(expense.id)}
                                                style={{
                                                    backgroundColor: '#fef2f2',
                                                    color: '#b91c1c',
                                                    border: '1px solid #fecaca',
                                                    padding: '6px 12px',
                                                    fontSize: '0.85rem',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#fef2f2'}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    <tfoot style={{ backgroundColor: '#f8fafc' }}>
                        <tr style={{ borderTop: '2px solid var(--primary-color)' }}>
                            <td colSpan="5" style={{ padding: '16px 10px', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-color)' }}>Total Expenses:</td>
                            <td style={{ padding: '16px 10px', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary-color)' }}>
                                <span style={{ fontSize: '0.8em', marginRight: '4px', color: 'var(--secondary-color)' }}>EGP</span>
                                {totalFilteredAmount.toFixed(2)}
                            </td>
                            <td colSpan="3"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="mobile-only mobile-expense-list">
                {filteredExpenses.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--secondary-color)' }}>
                        No expenses found.
                    </div>
                ) : (
                    filteredExpenses.map(expense => (
                        <div key={expense.id} className="expense-card">
                            <div className="expense-card-header">
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{expense.category}</span>
                                <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                    EGP {expense.amount.toFixed(2)}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                                {expense.date} • {expense.unitName || 'General'}
                            </div>
                            {expense.description && (
                                <div style={{ fontSize: '0.9rem' }}>{expense.description}</div>
                            )}
                            {expense.attachment && (
                                <div style={{ marginTop: '5px' }}>
                                    <a href={expense.attachment} download={expense.attachmentName || 'attachment'} style={{ fontSize: '0.9rem', color: 'var(--primary-color)', textDecoration: 'underline' }}>
                                        View Attachment
                                    </a>
                                </div>
                            )}
                            <div className="expense-card-footer">
                                <span style={{
                                    fontSize: '0.8rem',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    backgroundColor: expense.paymentStatus === 'paid' ? '#dcfce7' : '#fee2e2',
                                    color: expense.paymentStatus === 'paid' ? '#166534' : '#991b1b',
                                    fontWeight: '600'
                                }}>
                                    {expense.paymentStatus.charAt(0).toUpperCase() + expense.paymentStatus.slice(1)}
                                </span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => editExpense(expense)}
                                        style={{
                                            backgroundColor: '#eff6ff',
                                            color: '#1d4ed8',
                                            border: '1px solid #bfdbfe',
                                            padding: '4px 10px',
                                            fontSize: '0.85rem',
                                            borderRadius: '6px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteExpense(expense.id)}
                                        style={{
                                            backgroundColor: '#fef2f2',
                                            color: '#b91c1c',
                                            border: '1px solid #fecaca',
                                            padding: '4px 10px',
                                            fontSize: '0.85rem',
                                            borderRadius: '6px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1.5rem',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-color)' }}>Total Expenses</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        <span style={{ fontSize: '0.8em', marginRight: '4px', color: 'var(--secondary-color)' }}>EGP</span>
                        {totalFilteredAmount.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ExpenseList;
