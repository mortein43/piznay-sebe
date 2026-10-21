import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  // Questions answered so far, 0..total.
  answered: number;
  total: number;
  // 1-based number of the question on screen.
  current: number;
}

export default function ProgressBar({
  answered,
  total,
  current,
}: ProgressBarProps) {
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <div className={styles.progress}>
      <div className={styles.progress__label} aria-hidden="true">
        <span>
          Питання {current} з {total}
        </span>
        <span>{percent}%</span>
      </div>
      <progress
        className={styles.progress__bar}
        value={answered}
        max={total}
        aria-label="Прогрес проходження тесту"
        aria-valuetext={`Питання ${current} з ${total}, відповіли на ${answered}`}
      />
    </div>
  );
}
