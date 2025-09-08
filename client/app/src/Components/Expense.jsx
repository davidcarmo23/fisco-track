function Expense({ expense, onDelete, onEdit }) {
    const formattedDate = new Date(expense.date).toLocaleDateString("pt-PT");

    return (
        <div className="expense-container">
            <p className="expense-title">{expense.title}</p>
            <p className="expense-date">{formattedDate}</p>
            <p className="expense-category">{expense.category}</p>
            <p className="expense-value">{expense.value}</p>
            <div className="actions">
                <button className="edit-button" onClick={() => onEdit(expense.id)}>Edit</button>
                <button className="delete-button" onClick={() => onDelete(expense.id)}>Delete</button>
            </div>
        </div>
    );
}

export default Expense;