// Shopify Front — site components
const { useEffect, useRef, useState } = React;

/* ---------- Wordmark + tag mark (inline SVG) ---------- */
const TagMark = ({ size = 36, color = '#95ECB8' }) => (
  <svg viewBox="0 0 85.24 96.72" width={size} height={size * (96.72 / 85.24)} aria-hidden="true">
    <path fill={color} d="M66.44,46.72l-7.95-15.84c-1.45-2.89-4.62-4.99-8.24-5.19-1.37-.07-2.7.18-3.91.66l-16.45,6.53c-1.36.54-2.4,1.56-2.88,2.84l-16.57,43.79c-.7,1.84.46,3.98,2.58,4.79l32.01,12.11c2.12.8,4.4-.04,5.1-1.88l16.57-43.8c.48-1.27.38-2.71-.27-4.01ZM49.25,38.94c-1.82,0-3.29-1.47-3.29-3.29s1.47-3.29,3.29-3.29,3.29,1.47,3.29,3.29-1.47,3.29-3.29,3.29Z"/>
    <path fill="#0a0a0a" d="M80.21,1.88c-3.47-2.45-8.34-2.5-14.46-.15-9.27,3.56-12.79,11.69-16.86,23.86.88-.11,1.78-.11,2.68.03,3.73-11.05,7.08-18.42,15.1-21.5,1.24-.48,4.1-1.58,7.08-1.58.86,0,1.73.09,2.57.32.85.22,1.67.59,2.42,1.11,3.81,2.69,4.62,8.92,3.44,13.41-1.92,7.3-9.5,10.4-23.05,14.7-1.65.53-3.4,1.07-5.23,1.64-.66.2-1.23.35-1.71.45-1.9.41-2.48.1-2.65-.09-.18-.2-.31-.66-.1-1.71-.06-.01-.12-.01-.18-.01-.99,0-1.87.44-2.48,1.13.03.82.27,1.65.88,2.31.78.85,1.89,1.13,3.03,1.13.56,0,1.13-.07,1.67-.16.92-.16,1.75-.43,2.31-.6,1.76-.55,3.46-1.08,5.08-1.59,14.11-4.48,22.67-7.96,24.92-16.55,1.43-5.46.37-12.75-4.44-16.15Z"/>
    <path fill="#0a0a0a" d="M62.71,54.38l-26.62,40.76c-1.12,1.72-3.56,2.1-5.46.86L1.96,77.28c-1.9-1.24-2.53-3.63-1.41-5.35L27.17,31.18c.78-1.19,2.03-2,3.5-2.27l17.73-3.24c.16-.03.33-.06.49-.08.88-.11,1.78-.11,2.68.03.27.05.55.1.82.18,3.29.88,5.8,3.35,6.72,6.29-1.65.53-3.4,1.07-5.23,1.64-.66.2-1.23.35-1.71.45-.52-1.02-1.55-1.74-2.76-1.8-.06-.01-.12-.01-.18-.01-.99,0-1.87.44-2.48,1.13-.5.58-.81,1.34-.81,2.16,0,1.82,1.47,3.29,3.29,3.29,1.43,0,2.64-.91,3.09-2.18.92-.16,1.75-.43,2.31-.6,1.76-.55,3.46-1.08,5.08-1.59l3.65,15.71c.34,1.45.09,2.92-.68,4.1Z"/>
    <path fill="#fff" d="M21.22,68.5c1.4.78,3.89,1.83,6.5,1.82,2.36,0,3.79-1.25,4.02-2.82.22-1.5-.53-2.53-2.83-3.96-2.86-1.79-4.82-4.33-4.33-7.62.86-5.86,6.47-9.96,13.74-9.92,3.16.02,5.5.67,6.71,1.44l-2.78,5.88c-1.04-.55-2.8-1.18-4.97-1.2-2.31-.01-3.99,1.05-4.24,2.74-.19,1.29.76,2.28,2.66,3.42,2.94,1.92,5.26,4.41,4.74,7.94-.97,6.62-6.84,10.21-14.29,10.16-3.4-.02-6.43-.98-7.79-2.1l2.87-5.8Z"/>
  </svg>
);

const Wordmark = ({ height = 22 }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
    <TagMark size={height * 0.95} />
    <span style={{ fontWeight: 500, letterSpacing: '-0.02em', fontSize: height, lineHeight: 1 }}>
      shopify front
    </span>
  </span>
);

/* ---------- Custom cursor ---------- */
const Cursor = ({ enabled }) => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.remove('no-cursor');
    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;
    let raf;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }
    };
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onOver = (e) => {
      const t = e.target.closest('[data-cursor]');
      if (!t || !ringRef.current) return;
      ringRef.current.classList.add('is-hover');
      const label = t.getAttribute('data-cursor-label');
      if (label) {
        ringRef.current.classList.add('label');
        ringRef.current.setAttribute('data-label', label);
      }
    };
    const onOut = (e) => {
      const t = e.target.closest('[data-cursor]');
      if (!t || !ringRef.current) return;
      ringRef.current.classList.remove('is-hover', 'label');
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.body.classList.add('no-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

/* ---------- Magnetic hover ---------- */
const Magnetic = ({ children, strength = 0.35 }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const onLeave = () => { el.style.transform = ''; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);
  return <span ref={ref} className="magnetic" style={{ transition: 'transform .35s cubic-bezier(.2,.7,.2,1)' }}>{children}</span>;
};

/* ---------- Reveal on scroll ---------- */
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-line');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};

/* ---------- Time ticker ---------- */
const useNowTime = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
};

/* ---------- NAV ---------- */
const Nav = () => (
  <nav className="nav">
    <div className="nav-inner">
      <span className="nav-brand">
        <TagMark size={20} />
        shopify front<sup>™</sup>
      </span>
      <a href="#work" className="nav-link" data-cursor>Work</a>
      <a href="#services" className="nav-link" data-cursor>Services</a>
      <a href="#about" className="nav-link" data-cursor>About</a>
      <a href="#contact" className="nav-link cta" data-cursor>Let&rsquo;s talk</a>
    </div>
  </nav>
);

/* ---------- HERO ---------- */
const Hero = () => {
  const now = useNowTime();
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Africa/Johannesburg' });
  return (
    <section className="section hero" data-screen-label="01 Hero">
      <div className="hero-mark"><TagMark size={88} /></div>

      <div className="hero-meta reveal">
        <div>
          <span className="eyebrow">Studio · Est. 2024</span>
          <strong>Shopify-first commerce, redesigned</strong>
        </div>
        <div>
          <span className="eyebrow">Cape Town</span>
          <strong>{time} SAST</strong>
        </div>
        <div>
          <span className="eyebrow">Available · Q3 2026</span>
          <strong>2 client slots remaining</strong>
        </div>
      </div>

      <h1 className="hero-title">
        <span className="reveal-line"><span style={{ '--d': '0s' }}>Storefronts that</span></span>
        <span className="reveal-line"><span style={{ '--d': '.08s' }}><i className="serif">sell</i>, not</span></span>
        <span className="reveal-line"><span style={{ '--d': '.16s' }}>just <span className="mint-block">scroll</span>.</span></span>
      </h1>

      <div className="hero-foot">
        <p className="reveal">A design partner for ambitious Shopify brands. We build dynamic storefronts, conversion-led UX, and the supporting visual system around them — end to end.</p>
        <Magnetic strength={0.25}>
          <a href="#work" className="scroll-cue" data-cursor data-cursor-label="View">
            <span className="dot">↓</span>
            Featured projects · 04
          </a>
        </Magnetic>
      </div>
    </section>
  );
};

/* ---------- MARQUEE ---------- */
const Marquee = () => {
  const items = ['Brand Systems', 'Shopify Theme Dev', 'Headless Commerce', 'Art Direction', 'Motion & Interaction', 'Conversion Audits'];
  const dup = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {dup.map((it, i) => (
          <span key={i}>{it} <span className="dot" /></span>
        ))}
      </div>
    </div>
  );
};

/* ---------- WORK ---------- */
const cases = [
  {
    n: '01',
    title: 'Mabel & Co.',
    titleSerif: 'Mabel & Co.',
    desc: 'A modular Shopify theme for a slow-fashion label, built around editorial photography and a quiet, confident type system.',
    tags: ['Shopify 2.0', 'Brand', 'UX'],
    art: 'art-1',
    pill: 'Fashion · 2025',
    visual: 'phone-mabel'
  },
  {
    n: '02',
    title: 'Verde Living',
    titleSerif: 'Verde Living',
    desc: 'Plant care subscription replatformed onto a headless storefront. Cart conversion +38% and average order time halved.',
    tags: ['Headless', 'Subscriptions', 'Hydrogen'],
    art: 'art-2',
    pill: 'Lifestyle · 2024',
    visual: 'cart'
  },
  {
    n: '03',
    title: 'Atlas Pantry',
    titleSerif: 'Atlas Pantry',
    desc: 'Wholesale-meets-DTC pantry brand. We rebuilt the storefront around recipe-led discovery and bulk reorder flows.',
    tags: ['Shopify Plus', 'B2B', 'Editorial'],
    art: 'art-3',
    pill: 'Food · 2025',
    visual: 'grid'
  },
  {
    n: '04',
    title: 'Field Notes',
    titleSerif: 'Field Notes',
    desc: 'A stationery house with a 12-year archive. Migrated 800+ SKUs and gave it a storefront worthy of the catalogue.',
    tags: ['Migration', 'IA', 'Shopify Markets'],
    art: 'art-4',
    pill: 'Stationery · 2024',
    visual: 'mint-stack'
  }
];

const CaseVisual = ({ kind }) => {
  if (kind === 'phone-mabel') {
    return (
      <div className="art-phone">
        <div className="notch" />
        <div className="screen" style={{ background: '#f4f1ea' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 4px 0', fontSize: 10, color: '#0a0a0a' }}>
            <span style={{ fontWeight: 600 }}>9:41</span>
            <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14, letterSpacing: '-0.02em' }}>mabel</span>
            <span>•••</span>
          </div>
          <div style={{ marginTop: 22, padding: 8, background: '#0a0a0a', color: '#fff', borderRadius: 12, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 26, lineHeight: 1, padding: '24px 14px', textAlign: 'center' }}>
            quiet<br/>essentials.
          </div>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <div style={{ aspectRatio: '3/4', background: '#d6cebd', borderRadius: 8 }} />
            <div style={{ aspectRatio: '3/4', background: '#a8907a', borderRadius: 8 }} />
            <div style={{ aspectRatio: '3/4', background: '#5a4f44', borderRadius: 8 }} />
            <div style={{ aspectRatio: '3/4', background: '#e8e2d4', borderRadius: 8 }} />
          </div>
          <div style={{ marginTop: 14, padding: '10px 12px', background: '#95ECB8', borderRadius: 999, color: '#0a0a0a', fontSize: 11, fontWeight: 600, textAlign: 'center' }}>
            Shop the edit
          </div>
        </div>
      </div>
    );
  }
  if (kind === 'cart') {
    return (
      <div style={{ width: '78%', background: '#fff', borderRadius: 14, padding: 22, color: '#0a0a0a', boxShadow: '0 30px 60px rgba(0,0,0,.3)' }}>
        <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: '#6f6f6f', fontWeight: 500 }}>Your bag · 3 items</div>
        <div style={{ marginTop: 18, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 32, lineHeight: 1, letterSpacing: '-0.02em' }}>R 1,284 <span style={{ color: '#6FD89A' }}>.00</span></div>
        {[
          { n: 'Pothos · medium', p: 'R 420', sw: '#6FD89A' },
          { n: 'Olive · ceramic', p: 'R 520', sw: '#9eaf8c' },
          { n: 'Care kit', p: 'R 344', sw: '#cdd9c1' },
        ].map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid #eee' }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: it.sw }} />
            <div style={{ flex: 1, fontSize: 13 }}>{it.n}</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{it.p}</div>
          </div>
        ))}
        <div style={{ marginTop: 14, padding: '12px 18px', background: '#95ECB8', borderRadius: 999, fontSize: 13, fontWeight: 600, textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Checkout</span><span>→</span>
        </div>
      </div>
    );
  }
  if (kind === 'grid') {
    return (
      <div style={{ width: '80%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{
            aspectRatio: '1/1.2',
            borderRadius: 6,
            background: ['#e8e1d2','#c8b59a','#928068','#5a4d3c','#d6cebd','#a8907a','#7d6a55','#bda386','#3d342a'][i],
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', bottom: 4, left: 4, right: 4, fontSize: 8, fontWeight: 600, color: '#fff', mixBlendMode: 'difference', display: 'flex', justifyContent: 'space-between' }}>
              <span>0{i+1}</span><span>R{120 + i*40}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (kind === 'mint-stack') {
    return (
      <div style={{ position: 'relative', width: '60%' }}>
        {[0,1,2,3].map((i) => (
          <div key={i} style={{
            position: 'absolute',
            top: i * 22,
            left: i * 14,
            width: '100%',
            aspectRatio: '4/5',
            borderRadius: 10,
            background: i === 0 ? '#95ECB8' : i === 1 ? '#fff' : i === 2 ? '#1a1a1a' : '#0C1510',
            color: i === 2 ? '#95ECB8' : i === 3 ? '#fff' : '#0a0a0a',
            border: '1px solid rgba(255,255,255,.06)',
            padding: 18,
            boxShadow: '0 20px 40px rgba(0,0,0,.4)',
            transform: `rotate(${(i - 1.5) * 4}deg)`,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 600 }}>Field notes · 0{i+1}</span>
            <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 32, letterSpacing: '-0.02em', lineHeight: .95 }}>
              {['archive','catalogue','process','press'][i]}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Work = () => (
  <section id="work" className="section work" data-screen-label="02 Work">
    <div className="work-head">
      <div>
        <span className="eyebrow">Selected work · 2024–26</span>
        <h2 className="reveal">Built for the brands<br/>customers <span className="serif">return to</span>.</h2>
      </div>
      <p className="reveal">Four recent storefronts. Each shipped with a brand system, a Shopify build (Liquid or Hydrogen), and a measurement plan that survives the launch week.</p>
    </div>

    <div className="sticky-stage">
      {cases.map((c, i) => (
        <article className="case" key={c.n} style={{ top: `${100 + i * 16}px`, zIndex: i + 1 }}>
          <div className="case-info">
            <span className="case-num">{c.n} / 04 — {c.pill}</span>
            <div>
              <h3 className="case-title">{c.title.split(' ')[0]} <span className="serif">{c.title.split(' ').slice(1).join(' ')}</span></h3>
              <p className="case-desc">{c.desc}</p>
              <div className="case-tags">
                {c.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
              </div>
            </div>
            <Magnetic strength={0.2}>
              <a href="#" className="case-cta" data-cursor data-cursor-label="Open">
                Read the case study <span className="arrow">→</span>
              </a>
            </Magnetic>
          </div>
          <div className={`case-art ${c.art}`} data-cursor data-cursor-label="View">
            <div className="art-overlay">
              <span className="pill">{c.pill}</span>
              <span className="pill" style={{ alignSelf: 'flex-end' }}>{c.tags[0]}</span>
            </div>
            <CaseVisual kind={c.visual} />
          </div>
        </article>
      ))}
    </div>
  </section>
);

/* ---------- STATEMENT ---------- */
const Statement = () => (
  <section className="statement" data-screen-label="03 Statement">
    <div className="statement-inner">
      <span className="eyebrow" style={{ color: '#0a0a0a' }}>Inside Shopify Front</span>
      <h2 className="reveal">
        Designing storefronts<br/>
        that <span className="serif">behave</span> like products,<br/>
        not <span className="serif">brochures</span>.
      </h2>
      <div className="statement-foot">
        <p className="reveal">Every project starts with the question most agencies skip: what is the storefront <i>for</i>? We build the answer into the architecture, the type, the motion, and the metrics.</p>
        <Magnetic strength={0.25}>
          <a href="#about" className="case-cta" data-cursor data-cursor-label="More" style={{ color: '#0a0a0a' }}>
            How we work <span className="arrow" style={{ background: '#0a0a0a', color: '#95ECB8' }}>→</span>
          </a>
        </Magnetic>
      </div>
    </div>
  </section>
);

/* ---------- SERVICES ---------- */
const services = [
  { n: '01', name: ['Brand', 'Systems'], desc: 'Identity, type, voice and the design system that holds it together across every surface.' },
  { n: '02', name: ['Shopify', 'Build'], desc: 'Custom Shopify 2.0 themes, sections, and metaobject architectures merchandisers actually want to use.' },
  { n: '03', name: ['Headless', 'Commerce'], desc: 'Hydrogen, Next.js or Astro storefronts when the catalogue, scale or content model demands it.' },
  { n: '04', name: ['Conversion', 'UX'], desc: 'Audits, redesigns and experimentation programmes for stores doing >$1M ARR.' },
  { n: '05', name: ['Motion &', 'Interaction'], desc: 'Micro-interactions, transitions and the dynamic UI that makes a storefront feel alive.' },
];

const Services = () => (
  <section id="services" className="section services" data-screen-label="04 Services">
    <div className="services-head">
      <span className="eyebrow">What we do</span>
      <h2 className="reveal">Five services,<br/>one <span className="serif">throughline</span>.</h2>
    </div>
    <div className="svc-list">
      {services.map((s) => (
        <a href="#contact" className="svc-row" key={s.n} data-cursor data-cursor-label="Inquire">
          <span className="svc-num">{s.n}</span>
          <span className="svc-name">{s.name[0]} <span className="serif">{s.name[1]}</span></span>
          <span className="svc-desc">{s.desc}</span>
          <span className="svc-arrow">→</span>
        </a>
      ))}
    </div>
  </section>
);

/* ---------- ABOUT ---------- */
const About = () => (
  <section id="about" className="section about" data-screen-label="05 About">
    <div className="about-photo reveal">
      <img src="assets/mabel.jpg" alt="Mabel — Founder, Shopify Front" />
      <div className="badge"><span className="pulse" /> Mabel · Founder & Lead Designer</div>
    </div>
    <div className="about-copy">
      <span className="eyebrow">About</span>
      <h2 className="reveal">A small studio<br/>with <span className="serif">deep practice</span><br/>in commerce design.</h2>
      <p className="reveal">Shopify Front is a two-person studio working out of Cape Town with merchants in five countries. We&rsquo;re hands-on through the entire build — strategy, design, theme code, and the launch retro that almost no one runs.</p>
      <p className="reveal" style={{ marginTop: 16 }}>We say no to most things. The work we say yes to gets the rest of our calendar.</p>
      <div className="stats">
        <div className="stat reveal"><span className="num">38</span><span className="lbl">Storefronts shipped</span></div>
        <div className="stat reveal"><span className="num">+41<i style={{ fontStyle: 'italic' }}>%</i></span><span className="lbl">Avg. CVR lift</span></div>
        <div className="stat reveal"><span className="num">5</span><span className="lbl">Countries served</span></div>
      </div>
    </div>
  </section>
);

/* ---------- CONTACT ---------- */
const Contact = () => (
  <footer id="contact" className="contact" data-screen-label="06 Contact">
    <div className="contact-inner">
      <span className="eyebrow" style={{ color: 'rgba(255,255,255,.6)' }}>Next intake · Q3 2026</span>
      <h2 className="reveal">Got a storefront<br/>that <span className="serif mint">deserves more</span>?<br/>Let&rsquo;s build it.</h2>
      <Magnetic strength={0.3}>
        <a href="mailto:hello@shopifyfront.studio" className="contact-cta" data-cursor data-cursor-label="Email">
          hello@shopifyfront.studio <span className="icon">→</span>
        </a>
      </Magnetic>
      <div className="contact-grid">
        <div>
          <h4>Studio</h4>
          <a href="#">Cape Town, ZA</a>
          <a href="#">By appointment</a>
          <a href="#">+27 21 000 0000</a>
        </div>
        <div>
          <h4>Index</h4>
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
        </div>
        <div>
          <h4>Elsewhere</h4>
          <a href="#">Instagram</a>
          <a href="#">Are.na</a>
          <a href="#">Read.cv</a>
        </div>
        <div>
          <h4>Newsletter</h4>
          <a href="#">Quarterly notes from the studio. No spam, no growth hacks.</a>
        </div>
      </div>
      <div className="copyline">
        <span>© 2026 Shopify Front Studio. All rights reserved.</span>
        <span>Built with care in Cape Town · v1.0</span>
      </div>
    </div>
  </footer>
);

Object.assign(window, { Cursor, Nav, Hero, Marquee, Work, Statement, Services, About, Contact, useReveal, TagMark });
