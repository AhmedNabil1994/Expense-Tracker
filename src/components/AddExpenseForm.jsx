import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';

const AddExpenseForm = () => {
    const { addExpense } = useExpenses();
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        expenseType: 'unit',
        unitName: '',
        category: 'electricity',
        description: '',
        amount: '',
        paymentStatus: 'paid',
        paymentMethod: 'cash'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newExpense = {
            ...formData,
            amount: parseFloat(formData.amount),
            // If type is salary, unit name is meaningless, so we can set it to 'General' or blank,
            // but requirement says "Unit name (only for unit expenses, otherwise "General")"
            unitName: formData.expenseType === 'salary' ? 'General' : formData.unitName
        };
        addExpense(newExpense);

        // Reset form
        setFormData({
            date: new Date().toISOString().split('T')[0],
            expenseType: 'unit',
            unitName: '',
            category: 'electricity',
            description: '',
            amount: '',
            paymentStatus: 'paid',
            paymentMethod: 'cash'
        });
    };

    return (
        <div className="card">
            <h2>Add New Expense</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
                <div className="form-row">
                    <div>
                        <label>Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Expense Type</label>
                        <select name="expenseType" value={formData.expenseType} onChange={handleChange}>
                            <option value="unit">Unit Expense</option>
                            <option value="salary">Salary</option>
                        </select>
                    </div>
                </div>

                {formData.expenseType === 'unit' && (
                    <div>
                        <label>Unit Name</label>
                        <input
                            type="text"
                            name="unitName"
                            placeholder="e.g. Apt 101"
                            value={formData.unitName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                <div className="form-row">
                    <div>
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="electricity">Electricity</option>
                            <option value="water">Water</option>
                            <option value="cleaning">Cleaning</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="salary">Salary</option>
                            <option value="internet">Internet</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label>Amount</label>
                        <input
                            type="number"
                            name="amount"
                            placeholder="EGP 0.00"
                            step="0.01"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label>Description</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Details..."
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <div>
                        <label>Payment Status</label>
                        <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                    <div>
                        <label>Payment Method</label>
                        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                            <option value="cash">Cash</option>
                            <option value="bank">Bank Transfer</option>
                            <option value="wallet">Wallet</option>
                        </select>
                    </div>
                </div>

                <button type="submit" style={{ backgroundColor: 'var(--primary-color)', color: 'white', marginTop: '10px' }}>
                    Add Expense
                </button>
            </form>
        </div>
    );
};

export default AddExpenseForm;
