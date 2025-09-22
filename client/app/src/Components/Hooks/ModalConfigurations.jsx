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
            key: "amount",
            type: "number",
            label: "Amount (€)",
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
            key: "amount",
            type: "number",
            label: "Amount (€)",
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
            key: "amount",
            type: "number",
            label: "Amount (€)",
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

export const categoryModalConfig = {
    entityName: "Category",
    endpoint: "/api/categories/",
    fields: [
        {
            key: "title",
            type: "text",
            label: "Title",
            required: true
        },
        {
            key: "color",
            type: "text",
            label: "Color",
            required: true,
        },
        {
            key: "priority",
            type: "select",
            label: "Priority",
            required: true,
            optionsKey: "priorities",
            displayField: "id"
        }
    ],
    dropdowns: [
        {
            key: "priorities",
            endpoint: "/api/priorities/"
        }
    ]
};

export const priorityModalConfig = {
    entityName: "Priority",
    endpoint: "/api/priorities/",
    fields: [
        {
            key: "title",
            type: "text",
            label: "Title",
            required: true
        },
        {
            key: "priority_value",
            type: "number",
            label: "Value",
            required: true
        }
    ]
};

export const documentModalConfig = {
    entityName: "Document",
    endpoint: "/api/documents/",
    fields: [
        {
            key: "file_name",
            type: "text",
            label: "File Name",
            required: true
        },
        {
            key: "description",
            type: "text",
            label: "Description",
            required: false
        },
        {
            key: "file",
            type: "file",
            label: "File",
            required: true
        }
    ]
};