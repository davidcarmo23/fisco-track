import GenericDetailView from "../Components/GenericDetailView";
import { expenseDetailConfig } from "../Components/Hooks/DetailViewConfigurations"

function ExpenseView() {
  return <GenericDetailView config={expenseDetailConfig} />;
}

export default ExpenseView;