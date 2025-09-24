import React, { useState, useEffect } from "react";
import api from "../api";
import { Grid, } from "@mui/material";

import MetricCard from "./MetricCards";

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

    return (
        <Grid container spacing={3}>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                <MetricCard
                    title="Total Monthly Invoices"
                    value={overview.totalInvoices}
                />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                <MetricCard
                    title="Monthly Expenses"
                    value={formatCurrency(overview.monthlyExpenses)}
                    trend={overview.monthlyExpensesTrend}
                />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                <MetricCard
                    title="Monthly Earnings"
                    value={formatCurrency(overview.monthlyEarnings)}
                    trend={overview.monthlyEarningsTrend}
                />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                <MetricCard
                    title={`Pending Payments (${overview.pendingPayments?.count || 0})`}
                    value=""
                    subtitle={
                        <>
                            Expenses: {formatCurrency(overview.pendingPayments?.expenses || 0)}<br />
                            Invoices: {formatCurrency(overview.pendingPayments?.invoices || 0)}
                        </>
                    }
                />
            </Grid>
        </Grid>
    );
};

export default MonthlyDetails;
