import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  // 1-based number of the question on screen.
  current: number;
  answered: number;
  total: number;
}

export default function ProgressBar({ current, answered, total }: ProgressBarProps) {
  // Never shows more than the test has, even if a click lands during the answer delay.
  const done = Math.min(Math.max(answered, 0), total);
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className={styles.progressBar}>
      <div className={styles.progressBar__labels}>
        <span>
          Питання {Math.min(current, total)} з {total}
        </span>
        <span>{percent}%</span>
      </div>
      <progress
        className={styles.progressBar__track}
        value={done}
        max={total}
        aria-label={`Відповіли на ${done} з ${total} питань`}
      />
    </div>
  );
}
