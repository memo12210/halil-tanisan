import Header from './components/Header';
import Hero from './components/Hero';
import ProjectGrid from './components/ProjectGrid';
import Footer from './components/Footer';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Header />
        <Hero />
        <ProjectGrid />
        <Footer />
      </div>
    </div>
  );
}
