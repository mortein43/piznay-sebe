import AdminNotice from "../components/admin/admin_notice/AdminNotice";
import AdminButton from "../components/admin/admin_button/AdminButton";
import { signOutAdmin } from "./actions";

// Rendered with status 403 when the signed-in GitHub account is not on the allowlist.
export default function AdminForbidden() {
  return (
    <AdminNotice
      title="Доступ заборонено"
      text="Цей обліковий запис GitHub не має доступу до адмін-панелі."
    >
      <form action={signOutAdmin}>
        <AdminButton type="submit">Вийти</AdminButton>
      </form>
    </AdminNotice>
  );
}
