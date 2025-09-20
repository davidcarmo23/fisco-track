import GenericDetailView from "../Components/GenericDetailView";
import { invoiceDetailConfig } from "../Components/Hooks/DetailViewConfigurations"

function InvoiceView() {
  return <GenericDetailView config={invoiceDetailConfig} />;
}

export default InvoiceView;