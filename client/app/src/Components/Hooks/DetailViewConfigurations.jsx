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
        totalValue: (item) => parseFloat(item.amount || 0),
        receivedValue: (item) => parseFloat(item.total_received || 0),
        remainingValue: (item) => parseFloat(item.amount || 0) - parseFloat(item.total_received || 0),
        isPaid: (item) => item.is_paid || false
    },

    financials: {
        totalLabel: "TOTAL AMOUNT",
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
            { key: "amount", type: "number", label: "Amount (€)", required: true }
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
    ],

    calculations: {
        totalValue: (item) => item.amount || 0,
        receivedValue: (item) => item.total_received || 0,
        remainingValue: (item) => (item.amount || 0) - (item.total_received || 0),
        isPaid: (item) => item.is_paid || false
    },

    financials: {
        totalLabel: "INVOICE AMOUNT",
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
            { key: "amount", type: "number", label: "Amount (€)", required: true }
        ],
        dropdowns: [{ key: "expenses", endpoint: "/api/expenses/" }]
    }
};