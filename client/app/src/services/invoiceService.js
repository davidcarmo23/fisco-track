const API_URL = "http://127.0.0.1:8000/api/invoices/";

export async function fetchInvoices() {
    const response = await fetch(API_URL);

    if (!response.ok) throw new Error("Failed to fetch invoices");
    return response.json();
}

export async function createInvoice(invoiceData) {
    const response = await fetch(API_URL + "create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
    });

    if (!response.ok) throw new Error("Failed to create invoice");
    return response.json();
}

export function editInvoiceDetails(pk, invoiceData){
    //this should open a modal
}

export async function updateInvoice(pk, invoiceData) {
    const response = await fetch(API_URL + pk, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
    });

    if (!response.ok) throw new Error("Failed to update invoice");
    return response.json();
}

export async function deleteInvoice(pk) {
    const response = await fetch(API_URL + pk, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete invoice");
}
