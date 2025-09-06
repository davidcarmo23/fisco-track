import { use, useEffect, useState } from 'react'
import SimpleList from './Components/SimpleList';
import { fetchInvoices, createInvoice, updateInvoice, deleteInvoice } from "./services/invoiceService";
import './App.css'

function App() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices().then(setInvoices).catch(console.error);
  }, []);

  const addInvoice = async (invoiceData) => {
    const newInvoice = await createInvoice(invoiceData);
    setInvoices((prev) => [...prev, newInvoice]);
  };

  const updateInvoiceDetails = async (id, date, category, newTitle) => {
    const updated = await updateInvoice(id, { title: newTitle, date, category });
    setInvoices((prev) => prev.map((i) => (i.id === id ? updated : i)));
  };

  const removeInvoice = async (id) => {
    await deleteInvoice(id);
    setInvoices((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <>
      <h1>Fiscotrack</h1>

      {/* <div>
        <input type='text' placeholder='Invoice Title...' onChange={(e) => setTitle(e.target.value)} />
        <input type='date' placeholder='Invoice date...' onChange={(e) => setDate(e.target.value)} />
        <input type='number' placeholder='Category...' onChange={(e) => setCategory(e.target.value)} />

        <button onClick={addInvoice}>Add Invoice</button>
      </div> */}
      {/* {invoices.map((invoice) => (
        <div key={invoice.id}>
          <p> Title: {invoice.title}</p>
          <p>Invoice Date: {invoice.date}</p>
          <p>Category: {invoice.category}</p>
          <input type='text' placeholder='New Title...' onChange={(e) => setNewTitle(e.target.value)} />
          <button onClick={() => updateTitle(invoice.id, invoice.date, invoice.category)}>Change Title</button>
          <button onClick={() => deleteInvoice(invoice.id)}>Delete</button>
        </div>
      ))} */}
      <SimpleList
        list="invoices"
        items={invoices}
        updateInvoiceDetails={updateInvoiceDetails}
        removeInvoice={removeInvoice}
      />
    </>
  )
}

export default App
