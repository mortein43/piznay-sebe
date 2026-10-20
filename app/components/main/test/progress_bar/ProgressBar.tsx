import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  // 1-based number of the question on screen.
  current: number;
  // Questions answered so far; the bar fills by this.
  answered: number;
  // Questions in the test; the caller renders the bar only when it is above zero.
  total: number;
}

export default function ProgressBar({
  current,
  answered,
  total,
}: ProgressBarProps) {
  const done = Math.min(Math.max(answered, 0), total);
  const percent = Math.round((done / total) * 100);

  return (
    <div className={styles.progressBar}>
      <div className={styles.progressBar__label}>
        <span>
          Питання {current} з {total}
        </span>
        <span>{percent}%</span>
      </div>
      <progress
        className={styles.progressBar__track}
        value={done}
        max={total}
        aria-label="Прогрес тесту"
        aria-valuetext={`Відповідей: ${done} з ${total}`}
      />
    </div>
  );
}
