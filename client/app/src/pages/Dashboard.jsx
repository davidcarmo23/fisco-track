import { Paper, Grid, Typography } from "@mui/material";
import ExpensesByCategory from "../Components/Charts/ExpensesByCategory";
import ExpensesOverTime from "../Components/Charts/ExpensesOverTime";
import IncomeVsExpenses from "../Components/Charts/IncomeVsExpenses";
import MonthlyDetails from "../Components/MonthlyDetails";
import RecentActivityDatatable from '../Components/Datatables/RecentActivityDatatable'

function Dashboard() {
    return (
        <>

            <Grid container spacing={3}>
                <Grid item size={{ xs: 12, md: 12 }}>
                    <MonthlyDetails />
                </Grid>

                <Grid item size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Expenses Over Time</Typography>
                        <ExpensesOverTime />
                    </Paper>
                </Grid>

                <Grid item size={{ xs: 12, md: 6 }} >
                    <ExpensesByCategory />
                </Grid>

                <Grid item size={{ xs: 12, md: 12 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Income vs Expenses</Typography>
                        <IncomeVsExpenses />
                    </Paper>
                </Grid>

                <Grid item size={{ xs: 12, md: 12 }}>
                    <RecentActivityDatatable />
                </Grid>
            </Grid>
        </>
    );
}

export default Dashboard;