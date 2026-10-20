"use client";
import { useState } from "react";
import styles from "./JsonImport.module.scss";
import AdminButton from "../admin_button/AdminButton";

const MAX_FILE_BYTES = 1024 * 1024;

interface JsonImportProps {
  // Gets one test document without _id; the editor checks it against the schema.
  onImport: (document: Record<string, unknown>, notice: string | null) => void;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// Extended JSON wraps values in objects such as {"$oid": ...} or {"$numberInt": ...}.
const hasDollarKey = (value: unknown): boolean =>
  Array.isArray(value)
    ? value.some(hasDollarKey)
    : isRecord(value) &&
      Object.entries(value).some(([key, item]) => key.startsWith("$") || hasDollarKey(item));

// Fills the editor from one test as plain JSON, pasted or from a file. Nothing is saved until "Зберегти".
export default function JsonImport({ onImport }: JsonImportProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const importText = (source: string) => {
    setError(null);
    let data: unknown;
    try {
      data = JSON.parse(source);
    } catch {
      setError("Це не схоже на JSON. Перевірте лапки, коми та дужки.");
      return;
    }
    if (Array.isArray(data)) {
      setError("Потрібен один тест (об’єкт { … }), а не список. Резервні копії з кількома тестами не імпортуються.");
      return;
    }
    if (!isRecord(data)) {
      setError("Потрібен один тест: об’єкт { … } з полями name, instruction, questions, interpretation.");
      return;
    }
    const { _id, ...document } = data;
    if (hasDollarKey(document)) {
      setError("Схоже на Extended JSON (поля на кшталт \"$oid\" чи \"$numberInt\"). Вставте звичайний JSON, де бали записані числами.");
      return;
    }
    onImport(document, _id === undefined ? null : "Поле _id проігноровано: імпорт створює новий тест.");
  };

  const importFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setError("Файл завеликий: не більше 1 МБ.");
      return;
    }
    importText(await file.text());
  };

  return (
    <details className={styles.jsonImport}>
      <summary className={styles.jsonImport__summary}>Імпорт з JSON</summary>
      <p className={styles.jsonImport__hint}>
        Вставте один тест у форматі JSON або виберіть файл .json. Імпорт замінить вміст форми; тест не
        збережеться, доки ви не натиснете «Зберегти».
      </p>
      <textarea
        className={styles.jsonImport__input}
        rows={6}
        value={text}
        placeholder='{ "name": "…", "instruction": "…", "questions": [ … ], "interpretation": "…" }'
        onChange={(event) => setText(event.target.value)}
      />
      <div className={styles.jsonImport__actions}>
        <AdminButton onClick={() => importText(text)} disabled={text.trim() === ""}>
          Імпортувати текст
        </AdminButton>
        <label className={styles.jsonImport__file}>
          <span>Або файл:</span>
          <input
            type="file"
            accept=".json,application/json"
            onChange={(event) => {
              void importFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
      </div>
      {error && <p className={styles.jsonImport__error}>{error}</p>}
    </details>
  );
}
