import { NavLink } from "react-router-dom";
import { Typography } from "@mui/material";

export const expenseDetailConfig = {
    entityName: "Expense",
    endpoint: "/api/expenses/",
    redirectOnError: "/expenses",
    showProgress: true,

    header: {
        title: (item) => `Expense #${item.id}`,
        subtitle: (item) => item.title,
        chips: [
            {
                getData: (item) => ({
                    label: item.category_details?.title || 'No Category',
                    color: item.category_details?.color
                })
            }
        ]
    },

    calculations: {
        totalValue: (item) => parseFloat(item.value || 0),
        receivedValue: (item) => parseFloat(item.total_received || 0),
        remainingValue: (item) => parseFloat(item.value || 0) - parseFloat(item.total_received || 0),
        isPaid: (item) => item.is_paid || false
    },

    financials: {
        totalLabel: "TOTAL VALUE",
        receivedLabel: "RECEIVED",
        remainingLabel: "REMAINING"
    },

    tabs: {
        currEl: "Expenses"
    },

    modalConfig: {
        // Import from your existing expenseModalConfig
        entityName: "Expense",
        endpoint: "/api/expenses/",
        fields: [
            { key: "title", type: "text", label: "Title", required: true },
            { key: "date", type: "date", label: "Date", required: true },
            { key: "category", type: "select", label: "Category", required: true, optionsKey: "categories", displayField: "title" },
            { key: "value", type: "number", label: "Value (€)", required: true }
        ],
        dropdowns: [{ key: "categories", endpoint: "/api/categories/" }]
    }
};

export const invoiceDetailConfig = {
    entityName: "Invoice",
    endpoint: "/api/invoices/",
    redirectOnError: "/invoices",
    showProgress: true,

    header: {
        title: (item) => `Invoice #${item.id}`,
        subtitle: (item) => '',
        chips: [
            {
                getData: (item) => item.category_details ? ({
                    label: item.category_details.title,
                    color: item.category_details.color
                }) : null
            }
        ]
    },

    associations: [
        {
            label: "Associated Expense",
            getData: (item) => item.expense_details ?
                <Typography
                    component={NavLink}
                    to={`/expenses/view/${item.expense_details.id}`}
                    sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    #{item.expense_details.id} - {item.expense_details.title}
                </Typography>
                :
                `Expense #${item.expense}`
        }
    ],

    calculations: {
        totalValue: (item) => item.value || 0,
        receivedValue: (item) => item.total_received || 0,
        remainingValue: (item) => (item.value || 0) - (item.total_received || 0),
        isPaid: (item) => item.is_paid || false
    },

    financials: {
        totalLabel: "INVOICE VALUE",
        receivedLabel: "RECEIVED",
        remainingLabel: "REMAINING"
    },

    tabs: {
        currEl: "Invoices"
    },

    modalConfig: {
        entityName: "Invoice",
        endpoint: "/api/invoices/",
        fields: [
            { key: "date", type: "date", label: "Date", required: true },
            { key: "expense", type: "select", label: "Expense", required: true, optionsKey: "expenses", displayField: "title" },
            { key: "value", type: "number", label: "Value (€)", required: true }
        ],
        dropdowns: [{ key: "expenses", endpoint: "/api/expenses/" }]
    }
};