import AdminNotice from "../../components/admin/admin_notice/AdminNotice";
import AdminButton from "../../components/admin/admin_button/AdminButton";
import { signInWithGitHub } from "../actions";

// The only admin page served without a session; it shows no data.
// Auth.js sends failed sign-ins here with ?error=<type>.
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const { error } = await searchParams;
  const errorText = !error
    ? undefined
    : error === "AccessDenied"
      ? "Цей обліковий запис GitHub не має доступу до адмін-панелі."
      : "Не вдалося увійти. Спробуйте ще раз.";

  return (
    <AdminNotice
      title="Адмін-панель"
      text="Увійдіть через GitHub, щоб керувати тестами на staging."
      error={errorText}
    >
      <form action={signInWithGitHub}>
        <AdminButton type="submit" variant="primary">
          Увійти через GitHub
        </AdminButton>
      </form>
    </AdminNotice>
  );
}
