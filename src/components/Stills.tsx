import { gridStills, highlightedStill } from '../data/stills';

export default function Stills() {
  return (
    <section className="stills">
      <div className="stills-hero">
        <img className="media-img" src={highlightedStill.image} alt="" />
      </div>
      <div className="stills-grid">
        {gridStills.map((still, index) => (
          <div className="stills-tile" key={index}>
            <img className="media-img" src={still.image} alt="" />
          </div>
        ))}
      </div>
    </section>
  );
}
