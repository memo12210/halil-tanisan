import Plate from "./Plate";

export default function Info() {
  return (
    <section className="info">
      <div className="info-photo">
        <Plate tone="neutral" label="Portrait placeholder" />
      </div>

      <div className="info-bio">
        <p>
          Halil Tanisan is a Turkish cinematographer and filmmaker based between
          Poland and Turkey. He holds both a bachelor’s and a master’s degree in
          Cinematography from the Łódź Film School.
        </p>
        <p>
          Working across both analog and digital formats, his practice is shaped
          by a strong interest in time, space, movement, and the expressive
          possibilities of the human face. He approaches cinematography not
          simply as image making, but as a way of revealing something less
          tangible beneath the visible.
        </p>

        <p className="info-eyebrow">Latest Credits / Awards</p>
        <p>
          His work has been presented at major international festivals including
          EnergaCAMERIMAGE and the Manaki Brothers International
          Cinematographers’ Film Festival. Ferret was part of the official
          selection at EnergaCAMERIMAGE, while The Hotel, which he directed and
          photographed, was selected for the festival’s Student Etudes
          Competition. His work has also been featured in the official selection
          at Manaki Brothers.
        </p>
      </div>

      <aside className="info-contacts">
        <h3 className="info-subhead">Contact</h3>
        <div className="info-contact">
          <a className="info-link" href="mailto:haliltanisan@gmail.com">
            haliltanisan@gmail.com
          </a>
        </div>
      </aside>
    </section>
  );
}
