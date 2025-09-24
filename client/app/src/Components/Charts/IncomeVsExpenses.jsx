import { useEffect, useState } from "react";
import { Paper, Typography, TextField, MenuItem } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import api from "../../api";

const comparisonPeriodItems = [
    { value: "last-6-months", label: "Last 6 Months" },
    { value: "last-12-months", label: "Last 12 Months" },
    { value: "current-year", label: "Current Year" },
];

function IncomeVsExpenses() {
    const [comparisonPeriod, setComparisonPeriod] = useState("last-12-months");
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/api/analytics/income-vs-expenses/", {
                    params: { comparison_period: comparisonPeriod },
                });

                const { income, expenses } = res.data;

                // Merge income & expenses by month
                const merged = {};
                income.forEach((i) => {
                    merged[i.month] = { month: i.month, income: i.total, expenses: 0 };
                });
                expenses.forEach((e) => {
                    if (!merged[e.month]) {
                        merged[e.month] = { month: e.month, income: 0, expenses: e.total };
                    } else {
                        merged[e.month].expenses = e.total;
                    }
                });

                // Convert object → array sorted by month
                const mergedArray = Object.values(merged).sort(
                    (a, b) => new Date(a.month) - new Date(b.month)
                );

                setData(mergedArray);
            } catch (err) {
                console.error("Error fetching income vs expenses:", err);
            }
        };

        fetchData();
    }, [comparisonPeriod]);

    return (
        <Paper sx={{ p: 2 }}>
            {/* Period Selector */}
            <TextField
                select
                label="Comparison Period"
                fullWidth
                margin="normal"
                value={comparisonPeriod}
                onChange={(e) => setComparisonPeriod(e.target.value)}
            >
                {comparisonPeriodItems.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>

            {/* Bar Chart */}
            <BarChart
                dataset={data}
                xAxis={[
                    {
                        dataKey: "month",
                        scaleType: "band",
                        label: "Month",
                        tickLabelStyle: { fontSize: 12 },
                        valueFormatter: (value) =>
                            new Date(value).toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric",
                            }),
                    },
                ]}
                series={[
                    { dataKey: "income", label: "Income", color: "#4caf50" },
                    { dataKey: "expenses", label: "Expenses", color: "#f44336" },
                ]}
                width={600}
                height={400}
            />
        </Paper>
    );
}

export default IncomeVsExpenses;
