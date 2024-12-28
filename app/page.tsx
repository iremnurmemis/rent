import styles from "@/styles/Home.module.css";

export default function Home() {
  return (
    <div>
      {/* Ana içerik */}
      <div className={styles.background}>
        <div className={styles.overlay}>
          <h1 className={styles.title}>Car Rental</h1>
        </div>
      </div>

      {/* Diğer içerikler */}
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Explore our amazing car rental options below.</p>
        <p>Scroll down to see more!</p>
      </div>
    </div>
  );
}
