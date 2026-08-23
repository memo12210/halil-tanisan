export default function Info() {
  return (
    <section className="info">
      <div className="info-photo">
        <img className="media-img" src="/me.jpg" alt="Halil Tanisan" />
      </div>

      <div className="info-bio">
        <p>
          Halil Tanisan is a Turkish cinematographer based between Poland and
          Turkey. He holds both a bachelor’s and a master’s degree in
          Cinematography from the Łódź Film School.
        </p>
        <p>
          Working across analog and digital formats, his practice is shaped by
          an interest in time, space, movement, and the expressive possibilities
          of the human face.
        </p>

        <p className="info-eyebrow">Selected Festivals / Awards</p>
        <p>
          Ferret — EnergaCAMERIMAGE, Film and Art Schools Panorama, 2023
        </p>
        <p>
          The Hotel — EnergaCAMERIMAGE, Film and Art School Etudes
          Competition, 2025
        </p>
        <p>
          The Hotel — Manaki Brothers International Cinematographers’ Film
          Festival, Student Competition, 2026
        </p>
        <p>The Hotel — Istanbul Film Festival, Short Film Competition, 2026</p>
      </div>

      <aside className="info-contacts">
        <h3 className="info-subhead">Contact</h3>
        <div className="info-contact">
          <a className="info-link" href="mailto:haliltanisan@gmail.com">
            haliltanisan@gmail.com
          </a>
          <a
            className="info-link"
            href="https://www.instagram.com/haliltnsn"
            target="_blank"
            rel="noreferrer"
          >
            instagram.com/haliltnsn
          </a>
        </div>
      </aside>
    </section>
  );
}
