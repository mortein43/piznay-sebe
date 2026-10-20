import TestEditor from "../../../components/admin/test_editor/TestEditor";
import { isAdminDbConfigured } from "../../../lib/adminEnv";

export default function NewTestPage() {
  return <TestEditor canSave={isAdminDbConfigured()} />;
}
