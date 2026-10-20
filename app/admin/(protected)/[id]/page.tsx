import { notFound } from "next/navigation";
import TestEditor from "../../../components/admin/test_editor/TestEditor";
import { getTest, parseObjectId } from "../../../lib/adminTests";
import { isAdminDbConfigured } from "../../../lib/adminEnv";

export default async function EditTestPage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseObjectId((await params).id);
  if (!id) notFound();
  const test = await getTest(id);
  if (!test) notFound();

  // A JSON round trip turns driver values (for example a nested ObjectId) into plain data for the client.
  const document: unknown = JSON.parse(JSON.stringify(test.doc));
  return <TestEditor key={test._id} testId={test._id} initialDocument={document} canSave={isAdminDbConfigured()} />;
}
