import { Typography, Paper, Box } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

function MetricCard({ title, value, trend, subtitle }) {

    const renderTrend = (value) => (
        <Box component="span" ml={1} color={value >= 0 ? "green" : "red"}>
            {value >= 0 ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
            {Math.abs(value)}%
        </Box>
    );

    return (
        <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="overline" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                <Typography variant="h4" component="div" fontWeight="bold">
                    {value}
                </Typography>
                {trend !== undefined && renderTrend(trend)}
            </Box>
            {subtitle && (
                <Typography variant="body2" color="textSecondary">
                    {subtitle}
                </Typography>
            )}
        </Paper>
    );

}

export default MetricCard;