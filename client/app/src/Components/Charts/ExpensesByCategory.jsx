import { useEffect, useState } from "react";
import { Paper, Typography, TextField, MenuItem } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import api from "../../api";

const dateRangeItems = [
    { value: "all", label: "All Time" },
    { value: "last-month", label: "Last Month" },
    { value: "last-3-months", label: "Last 3 Months" },
    { value: "last-year", label: "Last Year" },
];

function ExpensesByCategory() {
    const [dateRange, setDateRange] = useState("all");
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/api/analytics/expenses-by-category/", {
                    params: { date_range: dateRange },
                });
                setData(res.data);
            } catch (err) {
                console.error("Error fetching expenses by category:", err);
            }
        };
        fetchData();
    }, [dateRange]);

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Expenses by Category
            </Typography>

            {/* Date Range Selector */}
            <TextField
                select
                label="Date Range"
                fullWidth
                margin="normal"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
            >
                {dateRangeItems.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>

            {/* Pie / Donut Chart */}
            <PieChart
                series={[
                    {
                        data: data.map((item, idx) => ({
                            id: idx,
                            value: item.value,
                            label: `${item.label} (${item.amount.toFixed(2)})`,
                            color: item.color,
                        })),
                        arcLabel: (item) => `${item.value}%`,
                        arcLabelMinAngle: 30,
                        arcLabelRadius: "60%",
                        highlightScope: { fade: "global", highlight: "item" },
                        faded: { innerRadius: 30, additionalRadius: -20, color: "gray" },
                    },
                ]}
                width={400}
                height={400}
            />
        </Paper>
    );
}

export default ExpensesByCategory;
