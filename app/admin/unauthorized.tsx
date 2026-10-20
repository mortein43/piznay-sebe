import AdminNotice from "../components/admin/admin_notice/AdminNotice";

// Rendered with status 401 when an admin page is opened without a session.
export default function AdminUnauthorized() {
  return (
    <AdminNotice
      title="Потрібно увійти"
      text="Щоб відкрити адмін-панель, увійдіть через GitHub."
      link={{ href: "/admin/sign-in", label: "Перейти до входу" }}
    />
  );
}
