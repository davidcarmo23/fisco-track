import React, { useState, useEffect } from "react";
import api from "../api";
import { Grid, Typography, Paper, Box } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const MonthlyDetails = () => {
    const [overview, setOverview] = useState({
        monthlyExpenses: 0,
        monthlyExpensesTrend: 0,
        totalInvoices: 0,
        monthlyEarnings: 0,
        monthlyEarningsTrend: 0,
        pendingPayments: { count: 0, expenses: 0, invoices: 0 },
    });

    useEffect(() => {
        api.get("api/analytics/overview/")
            .then((response) => {
                console.log(response.data)
                setOverview(response.data)
            })
            .catch((err) => console.error("Error fetching overview:", err));
    }, []);

    const formatCurrency = (value) =>
        new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(value);

    const renderTrend = (value) => (
        <Box component="span" ml={1} color={value >= 0 ? "green" : "red"}>
            {value >= 0 ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
            {Math.abs(value)}%
        </Box>
    );

    return (
        <Grid container spacing={2}>
            <Grid item size={{ xs: 12, md: 3 }}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle2">Total Invoices</Typography>
                    <Typography variant="h6">{overview.totalInvoices}</Typography>
                </Paper>
            </Grid>

            <Grid item size={{ xs: 12, md: 3 }}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle2">Monthly Expenses</Typography>
                    <Typography variant="h6">
                        {formatCurrency(overview.monthlyExpenses)}
                        {renderTrend(overview.monthlyExpensesTrend)}
                    </Typography>
                </Paper>
            </Grid>

            <Grid item size={{ xs: 12, md: 3 }}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle2">Monthly Earnings</Typography>
                    <Typography variant="h6">
                        {formatCurrency(overview.monthlyEarnings)}
                        {renderTrend(overview.monthlyEarningsTrend)}
                    </Typography>
                </Paper>
            </Grid>

            <Grid item size={{ xs: 12, md: 3 }}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle2">Pending Payments {overview.pendingPayments?.count || 0}</Typography>
                    <Typography variant="body2">
                        Expenses: {formatCurrency(overview.pendingPayments?.expenses || 0)} <br />
                        Invoices: {formatCurrency(overview.pendingPayments?.invoices || 0)}
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default MonthlyDetails;
