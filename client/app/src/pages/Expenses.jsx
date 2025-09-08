import { useState, useEffect, useRef } from "react";
import api from '../api';
import SimpleList from "../Components/Expense";
import ExpenseModalForm from "../Components/ExpenseModalForm";
import Expense from "../Components/Expense";

function Expenses() {
    const [expenses, setExpenses] = useState([]);

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("");
    const [value, setValue] = useState(0);

    const createExpenseRef = useRef(null);


    useEffect(() => {
        getExpenses();
    }, []);

    const getExpenses = () => {
        api.get("/api/expenses/"
        ).then(
            (res) => res.data
        ).then(
            (data) => {
                setExpenses(data);
                console.log(data)
            }
        ).catch((err) => alert(err));
    }

    const deleteExpense = (id) => {
        api.delete(`api/expenses/delete/${id}`).then((res) => {
            if (res.status === 204) {
                alert("Expense deleted");
            } else {
                alert("Failed to delete expense");
            }
        }).catch((err) => alert(err));
        getExpenses();
    }

    const editExpense = (id) => {

    }

    const toggleDialog = () => {
        if (!createExpenseRef.current) {
            return;
        }

        createExpenseRef.current.hasAttribute("open") ? createExpenseRef.current.close() : createExpenseRef.current.showModal();

    }

    return (
        <div>
            <div>
                <h1>Expenses</h1>
                <button onClick={() => {
                    toggleDialog();
                }}>Create Expense</button>
            </div>

            {expenses.map((expense) => 
                <Expense expense={expense} onDelete={deleteExpense} onEdit={editExpense} key={expense.id} />
            )}

            <dialog ref={createExpenseRef} onClick={(e) => {
                if (e.currentTarget === e.target) {
                    toggleDialog();
                }
            }}>
                <ExpenseModalForm route={"/api/expenses/"} toggleDialog={toggleDialog} getExpenses={getExpenses} />
            </dialog>
        </div>
    );
}

export default Expenses