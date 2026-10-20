import Link from "next/link";
import styles from "./AdminHeader.module.scss";
import AdminButton from "../admin_button/AdminButton";
import { signOutAdmin } from "../../../admin/actions";

interface AdminHeaderProps {
  login: string;
  // False when MONGODB_DB is not piznay_sebe_staging: the server refuses every save.
  canSave: boolean;
}

export default function AdminHeader({ login, canSave }: AdminHeaderProps) {
  return (
    <header className={styles.adminHeader}>
      <div className={styles.adminHeader__bar}>
        <nav className={styles.adminHeader__nav}>
          <Link className={styles.adminHeader__link} href="/admin">
            Тести
          </Link>
          <Link className={styles.adminHeader__link} href="/admin/new">
            Новий тест
          </Link>
          <Link className={styles.adminHeader__link} href="/">
            Сайт
          </Link>
        </nav>
        <div className={styles.adminHeader__user}>
          <span className={styles.adminHeader__login}>{login}</span>
          <form action={signOutAdmin}>
            <AdminButton type="submit" variant="small">
              Вийти
            </AdminButton>
          </form>
        </div>
      </div>
      {!canSave && (
        <p className={styles.adminHeader__warning}>
          Збереження вимкнено: сайт працює не з базою даних piznay_sebe_staging.
        </p>
      )}
    </header>
  );
}
