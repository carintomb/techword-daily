import { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

const TOPICS = [
  { emoji: "🌿", label: "Environment", value: "Environmental Science & Engineering" },
  { emoji: "⚙️", label: "General Technical", value: "General Technical English" },
  { emoji: "💼", label: "Business", value: "Business & Corporate English" },
  { emoji: "🤖", label: "Data & AI", value: "Data Science & AI" },
  { emoji: "⚖️", label: "Legal", value: "Legal & Regulatory English" },
  { emoji: "🏭", label: "Engineering", value: "Industrial Engineering" },
];

const LEVELS = [
  { value: "B2 (Upper-Intermediate)", label: "B2 – Upper Intermediate" },
  { value: "C1 (Advanced)", label: "C1 – Advanced" },
  { value: "C2 (Proficiency)", label: "C2 – Proficiency" },
];

const POS_COLORS = {
  noun: "#7c6fff", verb: "#ff9f43", adjective: "#4af2a1", adverb: "#54a0ff",
};

function getPosColor(pos = "") {
  const key = Object.keys(POS_COLORS).find(k => pos.toLowerCase().includes(k));
  return POS_COLORS[key] || "#9fa8c8";
}

function BoldWord({ text }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <strong key={i} style={{ color: "#4af2a1", fontWeight: 600 }}>{part}</strong>
          : part
      )}
    </span>
  );
}

export default function Home() {
  const [topic, setTopic] = useState(TOPICS[0].value);
  const [level, setLevel] = useState(LEVELS[1].value);
  const [loading, setLoading] = useState(false);
  const [words, setWords] = useState([]);
  const [error, setError] = useState("");
  const [generatedLabel, setGeneratedLabel] = useState("");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  async function handleGenerate() {
    setLoading(true);
    setWords([]);
    setError("");
    setGeneratedLabel(TOPICS.find(t => t.value === topic)?.label || topic);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, level }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setWords(data.words || []);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>TechWord Daily</title>
        <meta name="description" content="Learn 5 technical English words every day — powered by Gemini AI (free)" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <main className={styles.main}>
        <div className={styles.glowA} />
        <div className={styles.glowB} />

        <div className={styles.container}>

          <header className={styles.header}>
            <div className={styles.badge}>✦ Powered by Gemini AI — Free</div>
            <h1 className={styles.title}>TechWord Daily</h1>
            <p className={styles.subtitle}>
              5 advanced technical English words every day — with meaning, phonetics & real sentences.
            </p>
          </header>

          <div className={styles.panel}>
            <div className={styles.panelLabel}>Choose your field</div>
            <div className={styles.topicGrid}>
              {TOPICS.map(t => (
                <button
                  key={t.value}
                  className={`${styles.topicBtn} ${topic === t.value ? styles.active : ""}`}
                  onClick={() => setTopic(t.value)}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
            <div className={styles.levelRow}>
              <span className={styles.levelLabel}>Level:</span>
              <select className={styles.select} value={level} onChange={e => setLevel(e.target.value)}>
                {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </div>

          <button className={styles.genBtn} onClick={handleGenerate} disabled={loading}>
            {loading ? "⏳  Generating your words…" : "✦  Generate Today's 5 Words"}
          </button>

          {error && <div className={styles.errorBox}>⚠️ {error}</div>}

          {words.length > 0 && (
            <div>
              <div className={styles.resultsHeader}>
                <span className={styles.resultsTitle}>{generatedLabel} · 5 Words</span>
                <span className={styles.resultsDate}>{today}</span>
              </div>

              {words.map((w, i) => (
                <div key={i} className={styles.card}>
                  <div className={styles.cardNum}>WORD {String(i + 1).padStart(2, "0")} / 05</div>
                  <div className={styles.wordRow}>
                    <span className={styles.wordTerm}>{w.word}</span>
                    <span className={styles.pos} style={{
                      color: getPosColor(w.pos),
                      background: getPosColor(w.pos) + "22",
                      borderColor: getPosColor(w.pos) + "55",
                    }}>{w.pos}</span>
                  </div>
                  <div className={styles.phonetic}>{w.phonetic}</div>
                  <div className={styles.definition}>{w.definition}</div>
                  <div className={styles.examplesLabel}>Example Sentences</div>
                  {(w.examples || []).map((ex, j) => (
                    <div key={j} className={styles.exampleItem}>
                      <span className={styles.arrow}>→</span>
                      <span><BoldWord text={ex} /></span>
                    </div>
                  ))}
                  {w.tip && (
                    <div className={styles.tip}>
                      <strong style={{ color: "#4af2a1" }}>💡 Tip: </strong>{w.tip}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
