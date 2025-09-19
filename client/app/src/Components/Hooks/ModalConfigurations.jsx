export const expenseModalConfig = {
    entityName: "Expense",
    endpoint: "/api/expenses/",
    fields: [
        {
            key: "title",
            type: "text",
            label: "Title",
            required: true
        },
        {
            key: "date",
            type: "date",
            label: "Date",
            required: true
        },
        {
            key: "category",
            type: "select",
            label: "Category",
            required: true,
            optionsKey: "categories",
            displayField: "title"
        },
        {
            key: "value",
            type: "number",
            label: "Value (€)",
            required: true
        }
    ],
    dropdowns: [
        {
            key: "categories",
            endpoint: "/api/categories/"
        }
    ]
};

export const invoiceModalConfig = {
    entityName: "Invoice",
    endpoint: "/api/invoices/",
    fields: [
        {
            key: "date",
            type: "date",
            label: "Date",
            required: true
        },
        {
            key: "expense",
            type: "select",
            label: "Expense",
            required: true,
            optionsKey: "expenses",
            displayField: "title"
        },
        {
            key: "value",
            type: "number",
            label: "Value (€)",
            required: true
        }
    ],
    dropdowns: [
        {
            key: "expenses",
            endpoint: "/api/expenses/"
        }
    ]
};

export const receiptModalConfig = {
    entityName: "Receipt",
    endpoint: "/api/receipts/",
    fields: [
        {
            key: "date",
            type: "date",
            label: "Date",
            required: true
        },
        {
            key: "invoice",
            type: "select",
            label: "Invoice",
            required: true,
            optionsKey: "invoices",
            displayField: "id"
        },
        {
            key: "value",
            type: "number",
            label: "Value (€)",
            required: true
        }
    ],
    dropdowns: [
        {
            key: "invoices",
            endpoint: "/api/invoices/"
        }
    ]
};