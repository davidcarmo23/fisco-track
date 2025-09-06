//possible objects for list
function Invoice(props) {
    return (
        <li key={props.id}>
            <p> Title: {props.title}</p>
            <p>Invoice Date: {props.date}</p>
            <p>Category: {props.category}</p>
            <button onClick={() => props.editInvoiceDetails(props.id)}>Edit</button>
            <button onClick={() => props.removeInvoice(props.id)}>Delete</button>
        </li>
    );
};

function Receipt(props) {
    return (
        <li key={props.id}>
            <p>Receipt: Receipt#{props.id}</p>
            <p>Invoice: Invoice#{props.invoice}</p>
            <p>Receipt Date: {props.date}</p>
            <button onClick={() => updateReceiptDetails(props.id)}>Edit</button>
            <button onClick={() => removeReceipt(props.id)}>Delete</button>
        </li>
    );
};

function Category(props) {
    return (
        <li key={props.id}>
            <p>Title: {props.title}</p>
            <p>Color: {props.color}</p>
            <p>Priority: {props.priority}</p>
            <button onClick={() => updateCategoryDetails(props.id)}>Edit</button>
            <button onClick={() => removeCategory(props.id)}>Delete</button>
        </li>
    );
};

//list construction
function SimpleList({ list, items, updateInvoiceDetails, removeInvoice }) {
    if (list == "invoices") {
        return (
            <div className="d-flex ">
                <h2>Invoices</h2>
                <ul>
                    {items.map((item) => (
                        <Invoice
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            date={item.date}
                            category={item.category}
                            removeInvoice={removeInvoice}
                        />
                    ))}

                </ul>
            </div>
        );
    } else if (list == "receipts") {
        return (
            <div className="d-flex ">
                <h2>Receipts</h2>
                <ul>
                    {items.map((item) => {
                        <Receipt key={item.id} d={item.id} invoice={item.invoice}
                            date={item.date} />
                    })}
                </ul>
            </div>
        );
    } else {
        return (
            <div className="d-flex ">
                <h2>Categories</h2>
                <ul>
                    {items.map((item) => {
                        <Category key={item.id} id={item.id} title={item.title}
                            color={item.color} priority={item.priority} />
                    })}
                </ul>
            </div>
        );
    }

}

export default SimpleList;