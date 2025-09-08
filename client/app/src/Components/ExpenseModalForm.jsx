import { use, useEffect, useState } from "react";
import api from '../api';
import "../App.css";
import "../styles/AuthForm.css";
import Loader from "./Loader";

function ExpenseModalForm({ route, toggleDialog, getExpenses }) {

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState(0);
    const [value, setValue] = useState(0);

    const [loading, setLoading] = useState(false);


    const createExpense = (e) => {
        setLoading(true);
        e.preventDefault();
        api.post(route, {
            title,
            date,
            category,
            value
        }).then((res) => {
            if (res.status === 201) {
                setLoading(false);
                alert("Expense created");
            } else {
                alert("Failed to create expense");
            }
        }).catch((err) => alert(err));
        getExpenses();
    }

    return (
        <div className="card">
            <div className="card-title">
                <h2>Create Expense</h2>
            </div>
            <form onSubmit={createExpense}>
                <div className="fieldsHolder">
                    <div className="fieldGroup">
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="fieldGroup">
                        <label>Date:</label>
                        <input
                            type="date"
                            name="date"
                            placeholder="Date"
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="fieldGroup">
                        <label>Category:</label>
                        <input
                            type="number"
                            name="category"
                            placeholder="Category"
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </div>

                    <div className="fieldGroup">
                        <label>Value:</label>
                        <input
                            type="number"
                            name="value"
                            placeholder="Value"
                            onChange={(e) => setValue(e.target.value)}
                            required
                        />
                    </div>
                    {loading && <Loader/>}
                    <div className="modalButtons">
                        <button onClick={() => {
                            toggleDialog();
                        }}>Close</button>
                        <button className="button-primary" type="submit">Create</button>
                    </div>

                </div>
            </form>
        </div>
    );
}

export default ExpenseModalForm