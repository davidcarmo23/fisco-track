import { useState, useEffect } from "react";
import { Paper, Grid, Typography } from "@mui/material";
import api from '../api';
import ExpensesByCategory from "../Components/Charts/ExpensesByCategory";
import ExpensesOverTime from "../Components/Charts/ExpensesOverTime";
import IncomeVsExpenses from "../Components/Charts/IncomeVsExpenses";

function Dashboard() {
    return (
        <Paper sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Expenses Over Time</Typography>
                        <ExpensesOverTime />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <ExpensesByCategory />
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Income vs Expenses</Typography>
                        <IncomeVsExpenses />
                    </Paper>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default Dashboard;