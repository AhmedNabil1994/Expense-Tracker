import React, { useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';

const Summary = () => {
    const { expenses } = useExpenses();

    const totals = useMemo(() => {
        return expenses.reduce((acc, curr) => {
            const amount = parseFloat(curr.amount) || 0;
            acc.total += amount;
            if (curr.expenseType === 'unit') {
                acc.unitTotal += amount;
            } else if (curr.expenseType === 'salary') {
                acc.salaryTotal += amount;
            }
            return acc;
        }, { total: 0, unitTotal: 0, salaryTotal: 0 });
    }, [expenses]);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid var(--primary-color)' }}>
                <h3 style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>Total Expenses</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-color)' }}>
                    <span style={{ fontSize: '0.6em' }}>EGP</span> {totals.total.toFixed(2)}
                </p>
            </div>

            <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid #0369a1' }}>
                <h3 style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>Unit Expenses</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0369a1' }}>
                    <span style={{ fontSize: '0.6em' }}>EGP</span> {totals.unitTotal.toFixed(2)}
                </p>
            </div>

            <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid #b45309' }}>
                <h3 style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>Salaries</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#b45309' }}>
                    <span style={{ fontSize: '0.6em' }}>EGP</span> {totals.salaryTotal.toFixed(2)}
                </p>
            </div>
        </div>
    );
};

export default Summary;
