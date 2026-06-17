import Header from './components/Header';
import Hero from './components/Hero';
import ProjectGrid from './components/ProjectGrid';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="page">
      <div className="container">
        <Header />
        <Hero />
        <ProjectGrid />
        <Footer />
      </div>
    </div>
  );
}
