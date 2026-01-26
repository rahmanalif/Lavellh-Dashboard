import EarningOverview from "@/components/dashboardcomponents/EarningOverview";
import { TransactionsTable } from "../../../components/dashboardcomponents/TransactionsTable";

const Earnings = () => {
  return (
    <div>
      <EarningOverview />
      <TransactionsTable />
    </div>
  );
};

export default Earnings;
