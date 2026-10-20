import { listTests } from "../../lib/adminTests";
import TestsTable from "../../components/admin/tests_table/TestsTable";

// The tests in piznay_sebe_staging.
export default async function AdminTestsPage() {
  const tests = await listTests();
  return <TestsTable tests={tests} />;
}
