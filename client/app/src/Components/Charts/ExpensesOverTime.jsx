import { useEffect, useState } from "react";
import { Paper, Typography, TextField, MenuItem } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import api from "../../api";

const granularityItems = [
    { value: "year", label: "Year" },
    { value: "month", label: "Month" },
    { value: "week", label: "Week" },
];

function ExpensesOverTime() {
    const [granularity, setGranularity] = useState("month");
    const [period, setPeriod] = useState(""); // e.g. "2025", "2025-09", "2025-W38"
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/api/analytics/expenses-over-time/", {
                    params: { granularity, period },
                });
                setData(res.data);
            } catch (err) {
                console.error("Error fetching expenses over time:", err);
            }
        };
        fetchData();
    }, [granularity, period]);

    return (
        <Paper sx={{ p: 2 }}>
            {/* Granularity Selector */}
            <TextField
                select
                label="Granularity"
                fullWidth
                margin="normal"
                value={granularity}
                onChange={(e) => {
                    setGranularity(e.target.value);
                    setPeriod(""); // reset on change
                }}
            >
                {granularityItems.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>

            {/* Optional Period Input */}
            <TextField
                label="Period"
                fullWidth
                margin="normal"
                placeholder={
                    granularity === "year"
                        ? "e.g. 2025"
                        : granularity === "month"
                            ? "e.g. 2025-09"
                            : "e.g. 2025-W1"
                }
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
            />

            {/* Line Chart */}
            <LineChart
                dataset={data}
                xAxis={[
                    {
                        dataKey: "period",
                        scaleType: "band",
                        label: "Period",
                        valueFormatter: (value) =>
                            new Date(value).toLocaleDateString("en-US", {
                                month: granularity === "month" ? "short" : undefined,
                                year: "numeric",
                                ...(granularity === "week" && { day: "numeric" }),
                            }),
                    },
                ]}
                series={[{ dataKey: "total", label: "Expenses", color: "#f44336" }]}
                width={600}
                height={400}
            />
        </Paper>
    );
}

export default ExpensesOverTime;
