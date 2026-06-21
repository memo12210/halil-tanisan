import Plate from "./Plate";

export default function Info() {
  return (
    <section className="info">
      <div className="info-photo">
        <Plate tone="neutral" label="Portrait placeholder" />
      </div>

      <div className="info-bio">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua, based in
          ut enim ad minim veniam.
        </p>
        <p>
          Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur, excepteur sint
          occaecat cupidatat non proident.
        </p>

        <p className="info-eyebrow">Latest Credits / Awards</p>
        <p>
          Recent projects: ‘Lorem’ for Studio A, ‘Ipsum’ for Pictures Co.,
          ‘Dolor Sit’ for Network B, ‘Amet’ (Festival Grand Prize) for Studios
          C, and ‘Consectetur’ for Channel D.
        </p>

        <h3 className="info-subhead">Word Is Cheap</h3>
        <blockquote className="info-quote">
          “Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.”
        </blockquote>
      </div>

      <aside className="info-contacts">
        <h3 className="info-subhead">Contact</h3>
        <div className="info-contact">
          <a className="info-link" href="mailto:hello@example.com">
            hello@example.com
          </a>
          <a className="info-link" href="tel:+10000000000">
            +1 (000) 000&#8209;0000
          </a>
        </div>
      </aside>
    </section>
  );
}
