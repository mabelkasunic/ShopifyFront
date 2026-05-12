// Shopify Front — Section components
const { useEffect, useRef, useState } = React;

/* =========================================================
   01 · HERO — emotional, full-screen
========================================================= */
const Hero = () => {
  return (
    <section className="section hero" data-screen-label="01 Hero">
      <div className="hero-bg" aria-hidden="true">
        {/* Ambient grid of "storefront windows" */}
        <div className="window-grid">
          {Array.from({ length: 24 }).map((_, i) =>
          <div className="win" key={i} style={{ animationDelay: `${i * 0.18 % 4.2}s` }} />
          )}
        </div>
      </div>

      <div className="hero-meta">
        <div>
          <Eyebrow>Shopify Front · 2026</Eyebrow>
          <strong>Mabel Kasunic</strong>
        </div>
        <div>
          <Eyebrow>A thesis project</Eyebrow>
          <strong>The future of physical commerce</strong>
        </div>
      </div>

      <h1 className="hero-title">
        <span className="reveal-line"><span style={{ '--d': '0s' }}>The barrier to digital</span></span>
        <span className="reveal-line"><span style={{ '--d': '.06s' }}>retail <i className="serif">disappeared</i>.</span></span>
        <span className="reveal-line"><span style={{ '--d': '.18s' }}>Physical retail</span></span>
        <span className="reveal-line"><span style={{ '--d': '.24s' }}>never <span className="mint-block">caught up</span>.</span></span>
      </h1>

      <div className="hero-foot">
        <p className="reveal hero-sub" style={{ fontSize: "20px" }}>
          Shopify Front transforms retail into a live testing environment for small businesses
          — making <i className="serif" style={{ fontSize: "20px" }}>physical space</i> as accessible as launching a website.
        </p>
        <div className="hero-ctas reveal">
          <Magnetic strength={0.2}>
            <a className="btn btn-mint" href="#shift" data-cursor data-cursor-label="Enter">
              Explore the system <span className="arrow">→</span>
            </a>
          </Magnetic>
          <a className="btn btn-ghost" href="#how" data-cursor data-cursor-label="Watch">
            Watch the experience
          </a>
          <a className="btn btn-ghost" href="#contact" data-cursor data-cursor-label="Open">
            Enter the platform
          </a>
        </div>
      </div>
    </section>);

};

/* =========================================================
   01b · SHOWREEL — autoplay muted preview + slide-down lightbox
========================================================= */
const VideoShowreel = () => {
  const previewRef  = useRef(null);
  const overlayRef  = useRef(null);
  const trackRef    = useRef(null);
  const dragging    = useRef(false);

  const [open,           setOpen]          = useState(false);
  const [entered,        setEntered]       = useState(false); // drives slide-in
  const [overlayPlaying, setOverlayPlaying] = useState(true);
  const [progress,       setProgress]      = useState(0);
  const [duration,       setDuration]      = useState(0);
  const [closeHover,     setCloseHover]    = useState(false);

  // autoplay preview muted
  useEffect(() => {
    previewRef.current?.play().catch(() => {});
  }, []);

  // allow other sections (e.g. final footer "Video presentation") to open the same lightbox
  useEffect(() => {
    const handler = () => openOverlay();
    window.addEventListener('open-video-showreel', handler);
    return () => window.removeEventListener('open-video-showreel', handler);
  }, []);

  // slide-in: mount first, then flip `entered` so the transition fires
  const openOverlay = () => {
    setOpen(true);
    setProgress(0);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setEntered(true);
      const v = overlayRef.current;
      if (v) { v.muted = false; v.play().catch(() => {}); }
    }));
  };

  // slide-out: flip `entered`, wait for transition, then unmount
  const closeOverlay = () => {
    setEntered(false);
    const v = overlayRef.current;
    if (v) { v.pause(); v.currentTime = 0; }
    setOverlayPlaying(true);
    setTimeout(() => {
      setOpen(false);
      document.body.style.overflow = '';
    }, 420); // match transition duration
  };

  const toggleOverlay = () => {
    const v = overlayRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setOverlayPlaying(true); }
    else          { v.pause(); setOverlayPlaying(false); }
  };

  const onTimeUpdate = () => {
    const v = overlayRef.current;
    if (!v || !v.duration) return;
    setProgress(v.currentTime / v.duration);
  };

  const onLoadedMetadata = () => {
    const v = overlayRef.current;
    if (v) setDuration(v.duration);
  };

  // scrub helpers — support both click and drag
  const applySeek = (clientX) => {
    const v = overlayRef.current;
    const track = trackRef.current;
    if (!v || !track) return;
    const rect  = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    v.currentTime = ratio * v.duration;
    setProgress(ratio);
  };

  const onTrackMouseDown = (e) => {
    e.stopPropagation();
    dragging.current = true;
    applySeek(e.clientX);
    const onMove = (ev) => { if (dragging.current) applySeek(ev.clientX); };
    const onUp   = ()   => { dragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const onTrackTouchStart = (e) => {
    e.stopPropagation();
    dragging.current = true;
    const t = e.touches[0];
    if (t) applySeek(t.clientX);
    const onMove = (ev) => {
      if (!dragging.current) return;
      const t2 = ev.touches[0];
      if (t2) applySeek(t2.clientX);
    };
    const onEnd = () => {
      dragging.current = false;
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return '00:00';
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  return (
    <>
      {/* ── inline muted preview ── */}
      <section className="showreel-section" style={{ padding: '80px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          marginBottom: '24px', alignSelf: 'flex-start',
          paddingLeft: 'max(0px, calc(50% - 560px))',
        }}>
          <div style={{ width: '48px', height: '1px', background: 'currentColor', opacity: 0.3 }} />
          <span style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.5 }}>Showreel</span>
        </div>

        <div
          onClick={openOverlay}
          style={{ position: 'relative', width: '100%', maxWidth: '1120px', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', background: '#0a0a0a' }}
          data-cursor data-cursor-label="Showreel"
        >
          <video ref={previewRef} src="Shopify Front Final_Kasunic_Mabel.mp4"
            style={{ display: 'block', width: '100%', height: 'auto' }}
            muted loop playsInline />
        </div>
      </section>

      {/* ── slide-down lightbox ── */}
      {open && (
        <div
          className="modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) closeOverlay(); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '48px',
            background: entered ? '#000' : 'rgba(0,0,0,0)',
            transition: 'background 0.42s ease',
          }}
        >
          {/* modal — slides from top */}
          <div style={{
            position: 'relative', width: '100%', maxWidth: '1100px',
            background: '#0a0a0a', borderRadius: '6px', overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            transform: entered ? 'translateY(0)' : 'translateY(-110vh)',
            opacity: entered ? 1 : 0,
            transition: 'transform 0.42s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease',
          }}>

            {/* close */}
            <button
              className="modal-close"
              onClick={closeOverlay}
              onMouseEnter={() => setCloseHover(true)}
              onMouseLeave={() => setCloseHover(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px', zIndex: 3,
                background: closeHover ? '#fff' : 'rgba(255,255,255,0.14)',
                color: closeHover ? '#0a0a0a' : '#fff',
                border: 'none', borderRadius: '24px', padding: '8px 20px',
                fontSize: '13px', letterSpacing: '0.06em', cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background 0.18s ease, color 0.18s ease, transform 0.18s ease',
                transform: closeHover ? 'scale(1.06)' : 'scale(1)',
              }}
              data-cursor data-cursor-label="Close"
            >
              Close
            </button>

            {/* video */}
            <div
              onClick={toggleOverlay}
              style={{ lineHeight: 0, cursor: 'pointer', maxHeight: 'calc(88vh - 52px)', overflow: 'hidden' }}
              data-cursor data-cursor-label={overlayPlaying ? 'Pause' : 'Play'}
            >
              <video
                ref={overlayRef}
                src="Shopify Front Final_Kasunic_Mabel.mp4"
                style={{ display: 'block', width: '100%', height: 'auto', maxHeight: 'calc(88vh - 52px)' }}
                playsInline
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onEnded={() => setOverlayPlaying(false)}
              />
            </div>

            {/* scrub bar */}
            <div style={{
              flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '14px 20px', background: '#0a0a0a',
              color: '#fff', fontSize: '12px',
              letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums',
              userSelect: 'none',
            }}>
              <span style={{ opacity: 0.5, minWidth: '36px' }}>{fmt(progress * duration)}</span>

              {/* track — mousedown starts drag */}
              <div
                ref={trackRef}
                onMouseDown={onTrackMouseDown}
                onTouchStart={onTrackTouchStart}
                style={{
                  flex: 1, height: '4px',
                  background: 'rgba(255,255,255,0.18)',
                  borderRadius: '2px', cursor: 'pointer', position: 'relative',
                }}
              >
                {/* filled */}
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  width: `${progress * 100}%`,
                  background: '#fff', borderRadius: '2px', pointerEvents: 'none',
                }} />
                {/* thumb */}
                <div style={{
                  position: 'absolute', top: '50%', left: `${progress * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '12px', height: '12px', borderRadius: '50%',
                  background: '#fff', pointerEvents: 'none',
                  boxShadow: '0 0 0 3px rgba(255,255,255,0.2)',
                }} />
              </div>

              <span style={{ opacity: 0.5, minWidth: '36px', textAlign: 'right' }}>{fmt(duration)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* =========================================================
   CARD OVERLAY — fixed overlay, appears at the Shift heading
========================================================= */
const CardOverlay = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('shift');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Appear when the section top is ~20% from top — by then the full heading is in view
      // Disappear once scrolled ~400px past the section top
      setShow(rect.top < window.innerHeight * 0.2 && rect.top > -400);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 max(48px, calc(50% - 560px))',
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        padding: '24px 32px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(12,12,12,0.68)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.05) inset, 0 12px 48px rgba(0,0,0,0.4)',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
        transition: 'opacity 0.7s cubic-bezier(.2,.7,.2,1), transform 0.7s cubic-bezier(.2,.7,.2,1)',
      }}>
        <div style={{ fontSize: 'clamp(15px, 1.8vw, 28px)', fontWeight: 400, lineHeight: 1.45, color: 'rgba(255,255,255,0.62)' }}>
          That tension
        </div>
        <div style={{ fontSize: 'clamp(15px, 1.8vw, 28px)', fontWeight: 400, lineHeight: 1.45, color: 'rgba(255,255,255,0.72)', marginTop: '4px' }}>
          is the opportunity.
        </div>
        <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 'clamp(15px, 1.8vw, 28px)', fontWeight: 400, lineHeight: 1.45, color: 'rgba(255,255,255,0.95)' }}>
          <i className="serif" style={{ color: '#95ECB8' }}>Shopify Front</i>{' fills that gap.'}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   02 · THE SHIFT — horizontal scroll
========================================================= */
const SHIFT_PANELS = [
  {
    key: 'grid',
    label: 'Digital',
    caption: 'Frictionless process to entering digital space.',
    img: 'online grid.svg',
    imgAlt: 'Online grid',
  },
  {
    key: 'blob',
    label: 'Physical',
    caption: 'Constant change and uncertainty launching into physical spaces.',
    img: 'user%20blob.svg',
    imgAlt: 'User blob',
  },
  {
    key: 'statement',
    content: (ratio) => {
      // Statement is panel 2 of 4; visible ~r=0.375–0.79, swap mid-way
      const showConstraint = ratio > 0.60;
      return (
        <div style={{ maxWidth: '640px', width: '100%' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '32px' }}>
            The result
          </p>
          <div className="statement-swap" style={{ position: 'relative', overflow: 'hidden', minHeight: '240px', width: '100%', paddingBottom: '12px' }}>
            <h2 className={`statement-swap-line ${showConstraint ? 'out' : 'in'}`} style={{ fontWeight: 400, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.08, margin: 0 }}>
              Barriers that keep<br />
              <i className="serif">small businesses</i> out.
            </h2>
            <h2 className={`statement-swap-line ${showConstraint ? 'in' : 'out-below'}`} style={{ fontWeight: 400, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.08, margin: 0 }}>
              Not by choice but, <span className="serif mint-text">by constraint.</span>
            </h2>
          </div>
        </div>
      );
    },
  },
  {
    key: 'reasons',
    content: (ratio) => {
      const words = ['costly', 'long term', 'risky'];
      const wordColors = ['#79F1AA', '#6DDBEB', '#2A71F5'];
      // Word cycling starts at ~0.85 — when the reasons panel is near the centre of the screen
      const panelStart = 0.85, panelEnd = 1.0;
      const localR = Math.max(0, Math.min(1, (ratio - panelStart) / (panelEnd - panelStart)));
      // costly gets 0–0.50, long term 0.50–0.75, risky 0.75–1.0
      const thresholds = [0.50, 0.75];
      const _wi = thresholds.findIndex(t => localR < t);
      const wordIdx = _wi === -1 ? words.length - 1 : _wi;

      return (
        <div style={{ maxWidth: '640px', width: '100%' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '32px' }}>
            Why they stay online
          </p>
          <h2 style={{ fontWeight: 400, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.08, margin: 0 }}>
            They live online<br />
            because physical<br />
            retail is...
          </h2>
          <div className="statement-swap" style={{ position: 'relative', overflow: 'hidden', minHeight: '90px', width: '100%', paddingBottom: '12px' }}>
            {words.map((word, i) => (
              <h2
                key={word}
                className={`statement-swap-line ${i === wordIdx ? 'in' : i < wordIdx ? 'out' : 'out-below'}`}
                style={{ fontWeight: 400, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.08, margin: 0, color: wordColors[i], fontStyle: 'italic', fontFamily: 'var(--serif)' }}
              >
                {word}
              </h2>
            ))}
          </div>
        </div>
      );
    },
  },
];

const useViewportProgress = () => {
  const ref = useRef(null);
  const [ratio, setRatio] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const range = window.innerHeight + rect.height;
      const pos = window.innerHeight - rect.top;
      setRatio(Math.max(0, Math.min(1, pos / range)));
    };
    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, []);
  return [ref, ratio];
};

const MobileStatementPanel = () => {
  const [ref, ratio] = useViewportProgress();
  const showConstraint = ratio > 0.5;
  return (
    <div ref={ref} style={{ padding: '60px 18px' }}>
      <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '20px' }}>The result</p>
      <div className="statement-swap" style={{ position: 'relative', overflow: 'hidden', minHeight: '190px', width: '100%' }}>
        <h2 className={`statement-swap-line ${showConstraint ? 'out' : 'in'}`} style={{ fontWeight: 400, fontSize: 'clamp(28px, 8vw, 42px)', lineHeight: 1.1, margin: 0 }}>
          Barriers that keep<br /><i className="serif">small businesses</i> out.
        </h2>
        <h2 className={`statement-swap-line ${showConstraint ? 'in' : 'out-below'}`} style={{ fontWeight: 400, fontSize: 'clamp(28px, 8vw, 42px)', lineHeight: 1.1, margin: 0 }}>
          Not by choice but, <span className="serif mint-text">by constraint.</span>
        </h2>
      </div>
    </div>
  );
};

const MobileReasonsPanel = () => {
  const [ref, ratio] = useViewportProgress();
  const words = ['costly', 'long term', 'risky'];
  const colors = ['#79F1AA', '#6DDBEB', '#2A71F5'];
  const thresholds = [0.40, 0.55];
  const _wi = thresholds.findIndex(t => ratio < t);
  const wordIdx = _wi === -1 ? words.length - 1 : _wi;
  return (
    <div ref={ref} style={{ padding: '40px 18px 60px' }}>
      <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '20px' }}>Why they stay online</p>
      <h2 style={{ fontWeight: 400, fontSize: 'clamp(28px, 8vw, 42px)', lineHeight: 1.15, margin: 0 }}>
        They live online<br />because physical<br />retail is...
      </h2>
      <div className="statement-swap" style={{ position: 'relative', overflow: 'hidden', minHeight: '72px', width: '100%', marginTop: '14px' }}>
        {words.map((word, i) => (
          <h2 key={word} className={`statement-swap-line ${i === wordIdx ? 'in' : i < wordIdx ? 'out' : 'out-below'}`} style={{ fontWeight: 400, fontSize: 'clamp(28px, 8vw, 42px)', lineHeight: 1.1, margin: 0, color: colors[i], fontStyle: 'italic', fontFamily: 'var(--serif)' }}>
            {word}
          </h2>
        ))}
      </div>
    </div>
  );
};

const Shift = () => {
  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const [ratio, setRatio] = useState(0);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)');
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    const onScroll = () => {
      const rect = outer.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const passed = Math.max(0, Math.min(scrollable, -rect.top));
      const r = scrollable > 0 ? passed / scrollable : 0;
      setRatio(r);
      const maxX = track.scrollWidth - window.innerWidth;
      track.style.transform = `translateX(${-r * maxX}px)`;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  if (isMobile) {
    return (
      <section id="shift" data-screen-label="02 The Shift" style={{ position: 'relative' }}>
        <div style={{ padding: '80px 18px 40px' }}>
          <Eyebrow num="02">The shift</Eyebrow>
          <h2 style={{ fontWeight: 400, marginTop: '20px', lineHeight: 0.98, fontSize: 'clamp(34px, 9vw, 54px)' }}>
            Anyone can launch <i className="serif">online</i>.<br />
            Almost nobody can launch <span className="mint-underline" style={{ fontWeight: 400 }}>physically</span>.
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '56px', padding: '0 18px 80px' }}>
          {/* Digital */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.4, margin: 0 }}>Digital</p>
            <div style={{ width: '100%', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '28px', background: 'rgba(0,0,0,0.01)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="online grid.svg" alt="Online grid" style={{ width: '100%', maxWidth: '240px', height: 'auto', display: 'block' }} />
            </div>
            <p style={{ fontSize: '15px', lineHeight: 1.55, opacity: 0.6, margin: 0 }}>Frictionless process to entering digital space.</p>
          </div>

          {/* Physical */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.4, margin: 0 }}>Physical</p>
            <div style={{ width: '100%', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px', padding: '28px', background: 'rgba(0,0,0,0.01)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="user blob.svg" alt="User blob" style={{ width: '100%', maxWidth: '240px', height: 'auto', display: 'block' }} />
            </div>
            <p style={{ fontSize: '15px', lineHeight: 1.55, opacity: 0.6, margin: 0 }}>Constant change and uncertainty launching into physical spaces.</p>
          </div>

        </div>

        {/* Statement — scroll-driven morph (vertical) */}
        <MobileStatementPanel />

        {/* Reasons — scroll-driven word cycle (vertical) */}
        <MobileReasonsPanel />
      </section>
    );
  }

  return (
    <section id="shift" data-screen-label="02 The Shift" style={{ position: 'relative' }}>

      {/* ── static heading above the scroll ── */}
      <div style={{ padding: '120px 80px 80px' }}>
        <Eyebrow num="02">The shift</Eyebrow>
        <h2 style={{ fontWeight: 400, marginTop: '32px', lineHeight: 0.95, fontSize: 'clamp(40px, 7vw, 100px)' }}>
          Anyone can launch <i className="serif">online</i>.<br />
          Almost nobody can launch <span className="mint-underline" style={{ fontWeight: 400 }}>physically</span>.
        </h2>
      </div>

      {/* scroll driver — height gives us the scroll distance */}
      <div ref={outerRef} style={{ height: `${SHIFT_PANELS.length * 250}vh` }}>

        {/* sticky viewport */}
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

          {/* horizontal track */}
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              height: '100%',
              willChange: 'transform',
              paddingLeft: 'calc((100vw - 38vw) / 2)',
            }}
          >
            {SHIFT_PANELS.map((panel) => (
              <div
                key={panel.key}
                style={{
                  width: (panel.key === 'statement' || panel.key === 'reasons') ? '60vw' : '38vw',
                  flexShrink: 0,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 40px',
                  boxSizing: 'border-box',
                }}
              >
                {panel.content ? (
                  panel.content(ratio)
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%', textAlign: 'center' }}>
                    <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.4, margin: 0 }}>
                      {panel.label}
                    </p>
                    <div style={{
                      width: '100%',
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      padding: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0,0,0,0.01)',
                    }}>
                      <img
                        src={panel.img}
                        alt={panel.imgAlt}
                        style={{ width: '100%', maxWidth: '280px', height: 'auto', display: 'block' }}
                      />
                    </div>
                    <p style={{ fontSize: '17px', lineHeight: 1.6, opacity: 0.55, margin: 0 }}>
                      {panel.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* progress bar */}
          <div style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}>
            {SHIFT_PANELS.map((panel, i) => {
              const panelRatio = i / (SHIFT_PANELS.length - 1);
              const active = Math.round(ratio * (SHIFT_PANELS.length - 1)) === i;
              return (
                <div key={panel.key} style={{
                  height: '2px',
                  width: active ? '32px' : '16px',
                  background: active ? 'var(--mint-active, #95ECB8)' : 'rgba(0,0,0,0.18)',
                  borderRadius: '2px',
                  transition: 'width 0.3s ease, background 0.3s ease',
                }} />
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

/* =========================================================
   02b · SHIFT STATEMENT — staggered text boxes slide in
========================================================= */
const ShiftStatement = () => (
  <section className="shift-statement-section" style={{ padding: '80px 80px 100px', background: 'var(--bg)' }}>
    <div style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[
        { text: 'That tension', delay: '0s' },
        { text: 'is the opportunity.', delay: '0.13s' },
        { label: 'shopify-front', delay: '0.28s', mint: true },
      ].map(({ text, label, delay, mint }) => (
        <div
          key={delay}
          className="reveal shift-statement-box"
          style={{
            transitionDelay: delay,
            padding: '26px 34px',
            borderRadius: '16px',
            border: `1px solid ${mint ? 'rgba(149,236,184,0.5)' : 'rgba(0,0,0,0.08)'}`,
            background: mint ? 'rgba(149,236,184,0.07)' : 'rgba(0,0,0,0.025)',
            fontSize: 'clamp(22px, 3vw, 42px)',
            fontWeight: 400,
            lineHeight: 1.25,
          }}
        >
          {mint
            ? <><i className="serif" style={{ color: 'var(--mint-active)' }}>Shopify Front</i>{' fills that gap.'}</>
            : text}
        </div>
      ))}
    </div>
  </section>
);

/* =========================================================
   02b · CAPABILITIES — SVG + auto-stacking feature frames
========================================================= */
const CAPABILITY_FRAMES = [
  { label: 'Inventory',      sub: 'Real-time sync' },
  { label: 'Merchandising',  sub: 'Space planning' },
  { label: 'Analytics',      sub: 'Behavioural data' },
  { label: 'Scheduling',     sub: 'Operator dispatch' },
  { label: 'Point of Sale',  sub: 'Unified checkout' },
];

const Capabilities = () => {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="capabilities-section"
      style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        alignItems: 'center', gap: '60px',
        padding: '100px max(48px, calc(50% - 560px))',
        background: 'var(--bg)',
      }}
    >
      <div>
        <img
          src="blah blah.svg"
          alt=""
          style={{ width: '100%', maxWidth: '500px', height: 'auto', display: 'block' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {CAPABILITY_FRAMES.map(({ label, sub }, i) => (
          <div
            key={label}
            style={{
              padding: '18px 26px',
              borderRadius: '14px',
              border: '1px solid var(--line)',
              background: 'var(--bg)',
              boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              opacity: active ? 1 : 0,
              transform: active ? 'translateY(0) scale(1)' : 'translateY(22px) scale(0.97)',
              transition: `opacity 0.55s cubic-bezier(.2,.7,.2,1) ${i * 0.12}s, transform 0.55s cubic-bezier(.2,.7,.2,1) ${i * 0.12}s`,
            }}
          >
            <span style={{ fontWeight: 500, fontSize: '15px' }}>{label}</span>
            <span style={{ fontSize: '11.5px', color: 'var(--mute)', letterSpacing: '0.04em' }}>{sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

/* =========================================================
   03 · INTRODUCING — the reveal
========================================================= */
const Intro = () =>
<section id="intro" className="intro" data-screen-label="03 Intro">
    <div className="intro-inner">
      <Eyebrow num="03" dark>Introducing</Eyebrow>
      <div className="intro-mark reveal" style={{ fontWeight: "400" }}>
        <span style={{ color: '#fff' }}><TagMark size={88} /></span>
      </div>
      <h2 className="reveal intro-title" style={{ fontWeight: "400" }}>
        Shopify <i className="serif" style={{ fontFamily: "\"Neue Haas Grotesk Display Pro\"" }}>Front</i>.
      </h2>
      <p className="intro-sub reveal" style={{ fontFamily: "\"Instrument Serif\"" }}>
        A modular retail infrastructure for testing products in the real world.
      </p>

      <div className="intro-bullets">
        {[
      ['Access', 'temporary retail spaces, on demand'],
      ['Launch', 'short-term storefronts in days, not years'],
      ['Observe', 'real customer behaviour, in context'],
      ['Gather', 'physical insights you cannot collect online'],
      ['Validate', 'products before you scale them']].
      map(([k, v], i) =>
      <div className="intro-bullet reveal" key={k} style={{ transitionDelay: `${i * 0.06}s`, padding: "32px 0px 32px 10px" }}>
            <span className="num">0{i + 1}</span>
            <span className="lbl"><b style={{ fontFamily: "\"Neue Haas Grotesk Display Pro\"", fontWeight: "400", padding: "0px" }}>{k}.</b> {v}</span>
          </div>
      )}
      </div>

      <div className="pull-quote reveal">
        <span className="qm">“</span>
        <p style={{ fontWeight: "400" }}>
          Retail becomes a tool for <span className="serif mint-text">learning</span> —<br />
          not just <span className="serif">selling</span>.
        </p>
      </div>
    </div>
  </section>;


/* =========================================================
   04 · HOW IT WORKS — 5 steps with UI mocks
========================================================= */
const STEPS = [
{
  n: '01', name: 'Onboard',
  blurb: 'Brand enters product details, audience, and the questions they want answered.',
  cursor: 'Open'
},
{
  n: '02', name: 'Goal Selection',
  blurb: 'Define what success looks like — product validation, brand awareness, or direct customer feedback.',
  cursor: 'Choose'
},
{
  n: '03', name: 'Select a space',
  blurb: 'Choose a neighbourhood, footprint, and duration from live inventory.',
  cursor: 'Browse'
},
{
  n: '04', name: 'Launch',
  blurb: 'A modular installation is deployed. Fixtures, signage, point of sale — ready in 72 hours.',
  cursor: 'Deploy'
},
{
  n: '05', name: 'Observe',
  blurb: 'Foot traffic, dwell time, interaction zones — translated into honest behavioural insight.',
  cursor: 'Analyse'
},
{
  n: '06', name: 'Iterate',
  blurb: 'Refine product, layout, pricing or strategy. Then go again, or scale to permanent retail with confidence.',
  cursor: 'Loop'
}];


const StepUI = ({ step }) => {
  const [format, setFormat] = useState('Kiosk');

  if (step === 0) return (
    <div className="ui-card">
      <div className="ui-head"><span>onboarding · brand profile</span><span>3 / 5</span></div>
      <div className="ui-field"><label>Brand name</label><div className="input">Maple Hill Goods</div></div>
      <div className="ui-field">
        <label>Industry</label>
        <div style={{ position: 'relative' }}>
          <select defaultValue="fashion" style={{
            width: '100%', appearance: 'none', WebkitAppearance: 'none',
            background: '#fafafa', border: '1px solid var(--line)',
            padding: '10px 32px 10px 14px', borderRadius: '8px',
            fontSize: '14px', fontFamily: 'inherit', color: 'inherit',
            cursor: 'pointer', outline: 'none',
          }}>
            <option value="" disabled>Select your industry</option>
            <option value="fashion">Fashion &amp; Apparel</option>
            <option value="beauty">Beauty &amp; Cosmetics</option>
            <option value="home">Home &amp; Decor</option>
            <option value="electronics">Electronics</option>
            <option value="other">Other</option>
          </select>
          <span style={{
            position: 'absolute', right: '12px', top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none',
            fontSize: '9px', color: 'var(--mute)',
          }}>▼</span>
        </div>
      </div>
      <div className="ui-field"><label>Hypothesis</label>
        <div className="input area">"Younger buyers prefer the natural-dye line over the classic line in person."</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0 12px' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
        <span style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--mute)', opacity: 0.7 }}>Or</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        background: '#f8f8f8', borderRadius: '12px',
        padding: '14px 16px', border: '1px solid var(--line)',
        cursor: 'pointer', marginBottom: '4px',
      }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
          background: '#F4F1E9', border: '1px solid rgba(0,0,0,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img src="assets/shopify logo.svg" alt="Shopify" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '3px' }}>Connect your Shopify store</div>
          <div style={{ fontSize: '12px', color: 'var(--mute)', lineHeight: 1.4 }}>Sync your inventory and settings instantly</div>
        </div>
        <span style={{ color: 'var(--mute)', fontSize: '16px' }}>→</span>
      </div>

      <div className="ui-foot"><span className="ui-status"><span className="dot mint" /> Auto-saved</span><button className="btn-mini">Continue →</button></div>
    </div>);

  if (step === 1) return (
    <div className="ui-card">
      <div className="ui-head"><span>goal selection · retail test</span><span>step 2 of 7</span></div>
      <p style={{ fontSize: '12px', color: 'var(--mute)', marginBottom: '16px', lineHeight: 1.55 }}>
        We'll help you focus your space and data collection based on your goal.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
        {[
          { label: 'Validate a product', desc: 'Measure demand and market fit for a new product or line.' },
          { label: 'Gather customer feedback', desc: 'Understand how shoppers engage with your brand in person.', active: true },
          { label: 'Drive brand awareness', desc: 'Introduce your brand to a new neighbourhood or demographic.' },
          { label: 'Test pricing', desc: 'Optimize your margins with real-world price sensitivity data.' },
        ].map(({ label, desc, active }) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'flex-start', gap: '12px',
            padding: '11px 13px', borderRadius: '10px',
            border: `1px solid ${active ? 'var(--mint-active)' : 'var(--line)'}`,
            background: active ? 'rgba(149,236,184,0.09)' : '#fafafa',
            cursor: 'pointer', position: 'relative',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
              background: active ? 'rgba(149,236,184,0.22)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${active ? 'var(--mint-active)' : 'var(--line)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px',
            }}>
              {active ? '◉' : '○'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '3px' }}>{label}</div>
              <div style={{ fontSize: '11.5px', color: 'var(--mute)', lineHeight: 1.4 }}>{desc}</div>
            </div>
            {active && <span style={{ color: 'var(--mint-active)', fontSize: '13px', flexShrink: 0, marginTop: '2px' }}>✓</span>}
          </div>
        ))}
      </div>
      <div className="ui-foot"><span className="ui-status"><span className="dot mint" /> Goal selected</span><button className="btn-mini">Continue →</button></div>
    </div>);

  if (step === 2) return (
    <div className="ui-card map-card">
      <div className="ui-head"><span>select a space · Toronto, Queen W.</span><span>14 active</span></div>
      <div className="map">
        <svg viewBox="0 0 360 220" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="360" height="220" fill="url(#grid)" />
          {[[60, 90], [120, 60], [180, 140], [240, 80], [300, 160], [90, 170], [210, 40]].map(([x, y], i) =>
          <g key={i} className={`pin ${i === 2 ? 'active' : ''}`} style={{ animationDelay: `${i * 0.4}s` }}>
              <circle cx={x} cy={y} r={i === 2 ? 14 : 6} fill={i === 2 ? '#95ECB8' : 'rgba(255,255,255,.5)'} />
              {i === 2 && <circle cx={x} cy={y} r="14" fill="none" stroke="#95ECB8" strokeOpacity=".3"><animate attributeName="r" values="14;28;14" dur="2.6s" repeatCount="indefinite" /><animate attributeName="stroke-opacity" values=".4;0;.4" dur="2.6s" repeatCount="indefinite" /></circle>}
            </g>
          )}
        </svg>
      </div>
      <div className="space-row">
        <div><b>Space 047</b><span>· Queen West, 320 sqft</span></div>
        <div className="space-meta">14 days · $ 1,840 total</div>
      </div>
      <div style={{ marginTop: '12px', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--mute)', fontWeight: 500, marginBottom: '10px' }}>
          Choose Retail Format
        </div>
        <div style={{ display: 'flex', gap: '7px' }}>
          {[
            { label: 'Kiosk', desc: 'Compact, high-visibility booth for single-product launches.', tag: 'Low Cost',
              icon: <><rect x="3" y="5" width="18" height="13" rx="1.5" strokeWidth="1.5"/><path d="M3 9h18" strokeWidth="1.5"/><path d="M9 13h6" strokeWidth="1.5"/></> },
            { label: 'Shared Space', desc: 'A collaborative multi-brand environment with shared overhead.', tag: 'Collaborative',
              icon: <><circle cx="9" cy="7" r="2.5" strokeWidth="1.5"/><circle cx="15" cy="7" r="2.5" strokeWidth="1.5"/><path d="M3 19c0-3.3 2.5-5 6-5s6 1.7 6 5" strokeWidth="1.5"/><path d="M15 14c2.5.3 4.5 1.8 4.5 4.5" strokeWidth="1.5"/></> },
            { label: 'Full Pop-up', desc: 'A stand-alone storefront for a fully immersive brand experience.', tag: 'Stand-alone',
              icon: <><rect x="2" y="8" width="20" height="13" rx="1" strokeWidth="1.5"/><path d="M2 11 12 4l10 7" strokeWidth="1.5"/><path d="M9 21v-6h6v6" strokeWidth="1.5"/></> },
          ].map(({ label, desc, tag, icon }) => {
            const active = format === label;
            return (
            <div key={label} onClick={() => setFormat(label)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '10px 6px 8px', borderRadius: '10px', textAlign: 'center',
              border: `1.5px solid ${active ? 'var(--mint-active)' : 'var(--line)'}`,
              background: active ? 'rgba(149,236,184,0.06)' : '#fafafa',
              cursor: 'pointer', gap: '6px',
              transition: 'border-color .2s, background .2s',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                background: active ? 'rgba(149,236,184,0.18)' : '#ebebeb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke={active ? '#2d6a4f' : '#666'} strokeLinecap="round" strokeLinejoin="round">
                  {icon}
                </svg>
              </div>
              <div style={{ fontWeight: 600, fontSize: '11.5px', lineHeight: 1.2 }}>{label}</div>
              <div style={{ fontSize: '10px', color: 'var(--mute)', lineHeight: 1.4, flex: 1 }}>{desc}</div>
              <div style={{
                fontSize: '10px', padding: '3px 9px', borderRadius: '999px', marginTop: '2px',
                background: active ? 'rgba(149,236,184,0.28)' : '#ebebeb',
                color: active ? '#2d6a4f' : 'var(--mute)', fontWeight: 500,
              }}>{tag}</div>
            </div>
          ); })}
        </div>
      </div>
    </div>);

  if (step === 3) return (
    <div className="ui-card launch-card">
      <div className="ui-head"><span>launch · your success suite</span><span>step 4 of 7</span></div>
      <p style={{ fontSize: '12px', color: 'var(--mute)', marginBottom: '14px', lineHeight: 1.55 }}>
        We've architected a supportive environment where high-end commerce meets real-world testing. No friction, just focus.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {[
          {
            title: 'Foot traffic exposure',
            desc: 'Position your brand in high-velocity urban corridors with guaranteed minimum daily impressions.',
            icon: <><circle cx="9" cy="7" r="2.5" strokeWidth="1.5"/><circle cx="15" cy="7" r="2.5" strokeWidth="1.5"/><path d="M3 19c0-3.3 2.7-5 6-5h6c3.3 0 6 1.7 6 5" strokeWidth="1.5"/></>,
          },
          {
            title: 'Customer feedback tools',
            desc: 'Integrated digital touchpoints to capture real-time sentiment from every physical visitor.',
            icon: <><rect x="3" y="12" width="4" height="9" rx="1" strokeWidth="1.5"/><rect x="10" y="7" width="4" height="14" rx="1" strokeWidth="1.5"/><rect x="17" y="3" width="4" height="18" rx="1" strokeWidth="1.5"/></>,
          },
          {
            title: 'On-site support team',
            desc: 'Dedicated floor staff trained to your brand to assist customers and gather live qualitative data.',
            icon: <><circle cx="12" cy="8" r="3" strokeWidth="1.5"/><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" strokeWidth="1.5"/><path d="M5 10a7 7 0 0 1 2-4.9" strokeWidth="1.5"/><path d="M19 10a7 7 0 0 0-2-4.9" strokeWidth="1.5"/></>,
          },
          {
            title: 'Integrated point of sale',
            desc: 'Shopify POS pre-configured and synced with your online store from day one.',
            icon: <><rect x="4" y="5" width="16" height="14" rx="2" strokeWidth="1.5"/><path d="M8 5V3" strokeWidth="1.5"/><path d="M16 5V3" strokeWidth="1.5"/><path d="M4 10h16" strokeWidth="1.5"/><path d="M9 15h6" strokeWidth="1.5"/></>,
          },
        ].map(({ title, desc, icon }) => (
          <div key={title} style={{
            background: '#f7f7f7', borderRadius: '10px',
            padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px',
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'rgba(45,106,79,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="#2d6a4f" strokeLinecap="round" strokeLinejoin="round">
                {icon}
              </svg>
            </div>
            <div style={{ fontWeight: 600, fontSize: '12px', lineHeight: 1.3 }}>{title}</div>
            <div style={{ fontSize: '11px', color: 'var(--mute)', lineHeight: 1.45 }}>{desc}</div>
          </div>
        ))}
      </div>
      <div className="ui-foot"><span className="ui-status"><span className="dot mint pulse" /> Ready to launch</span><button className="btn-mini mint">Continue →</button></div>
    </div>);

  if (step === 4) return (
    <div className="ui-card heat-card">
      <div className="ui-head"><span>observe · live behaviour</span><span>day 06 / 14</span></div>
      <div className="heat">
        {Array.from({ length: 80 }).map((_, i) => {
          const h = Math.abs(Math.sin(i * 0.7) + Math.cos(i * 0.31));
          const v = Math.min(1, h * 0.7);
          return <span key={i} style={{ background: `rgba(149,236,184,${v.toFixed(2)})` }} />;
        })}
      </div>
      <div className="heat-stats">
        <div><b>248</b><span>avg. visits / day</span></div>
        <div><b>2:14</b><span>median dwell</span></div>
        <div><b>62%</b><span>touch-tested SKU 04</span></div>
      </div>
    </div>);

  if (step === 5) return (
    <div className="ui-card iter-card">
      <div className="ui-head"><span>iterate · shape testing</span></div>
      <svg
        viewBox="0 0 700 450"
        width="100%"
        style={{ display: 'block', margin: '12px 0', borderRadius: '8px', background: '#f9f9f9', border: '1px solid var(--line)' }}
      >
        {/* ── Row 1 ── */}
        <g transform="translate(0,10)">
          <path d="M110,40 L161,40 L180,87 L180,133 L161,180 L110,180 L59,180 L40,133 L40,87 L59,40 Z" fill="#79F1AA">
            <animate
              attributeName="d"
              values={[
                'M110,40 L161,40 L180,87 L180,133 L161,180 L110,180 L59,180 L40,133 L40,87 L59,40 Z',
                'M110,40 L161,40 L180,87 L180,133 L161,180 L110,180 L59,180 L40,133 L40,87 L59,40 Z',
                'M110,30 L129,84 L186,85 L140,120 L157,175 L110,142 L63,175 L80,120 L34,85 L91,84 Z',
                'M110,30 L129,84 L186,85 L140,120 L157,175 L110,142 L63,175 L80,120 L34,85 L91,84 Z',
                'M110,40 L161,40 L180,87 L180,133 L161,180 L110,180 L59,180 L40,133 L40,87 L59,40 Z',
              ].join(';')}
              keyTimes="0;0.001;0.5;0.501;1"
              calcMode="spline"
              keySplines="0 0 1 1;0.5 0 0.5 1;0 0 1 1;0.5 0 0.5 1"
              dur="8s" repeatCount="indefinite" begin="0s"
            />
            <animate
              attributeName="fill"
              values="#79F1AA;#79F1AA;#6DDBEB;#6DDBEB;#79F1AA"
              keyTimes="0;0.001;0.5;0.501;1"
              calcMode="spline"
              keySplines="0 0 1 1;0.5 0 0.5 1;0 0 1 1;0.5 0 0.5 1"
              dur="8s" repeatCount="indefinite" begin="0s"
            />
          </path>
        </g>
        <g transform="translate(240,10)">
          <path d="M110,25 L152.5,67.5 L195,110 L152.5,152.5 L110,195 L67.5,152.5 L25,110 L67.5,67.5 Z" fill="#2A71F5">
            <animate
              attributeName="d"
              values={[
                'M110,25 L152.5,67.5 L195,110 L152.5,152.5 L110,195 L67.5,152.5 L25,110 L67.5,67.5 Z',
                'M110,25 L152.5,67.5 L195,110 L152.5,152.5 L110,195 L67.5,152.5 L25,110 L67.5,67.5 Z',
                'M110,25 L170.1,49.9 L195,110 L170.1,170.1 L110,195 L49.9,170.1 L25,110 L49.9,49.9 Z',
                'M110,25 L170.1,49.9 L195,110 L170.1,170.1 L110,195 L49.9,170.1 L25,110 L49.9,49.9 Z',
                'M110,25 L152.5,67.5 L195,110 L152.5,152.5 L110,195 L67.5,152.5 L25,110 L67.5,67.5 Z',
              ].join(';')}
              keyTimes="0;0.001;0.5;0.501;1"
              calcMode="spline"
              keySplines="0 0 1 1;0.5 0 0.5 1;0 0 1 1;0.5 0 0.5 1"
              dur="8s" repeatCount="indefinite" begin="0s"
            />
            <animate
              attributeName="fill"
              values="#2A71F5;#2A71F5;#79F1AA;#79F1AA;#2A71F5"
              keyTimes="0;0.001;0.5;0.501;1"
              calcMode="spline"
              keySplines="0 0 1 1;0.5 0 0.5 1;0 0 1 1;0.5 0 0.5 1"
              dur="8s" repeatCount="indefinite" begin="0s"
            />
          </path>
        </g>
        <g transform="translate(480,10)">
          <path d="M110,25 L146.8,88.75 L183.6,152.5 L110,152.5 L36.4,152.5 L73.2,88.75 Z" fill="#6DDBEB">
            <animate
              attributeName="d"
              values={[
                'M110,25 L146.8,88.75 L183.6,152.5 L110,152.5 L36.4,152.5 L73.2,88.75 Z',
                'M110,25 L146.8,88.75 L183.6,152.5 L110,152.5 L36.4,152.5 L73.2,88.75 Z',
                'M110,25 L183.6,67.5 L183.6,152.5 L110,195 L36.4,152.5 L36.4,67.5 Z',
                'M110,25 L183.6,67.5 L183.6,152.5 L110,195 L36.4,152.5 L36.4,67.5 Z',
                'M110,25 L146.8,88.75 L183.6,152.5 L110,152.5 L36.4,152.5 L73.2,88.75 Z',
              ].join(';')}
              keyTimes="0;0.001;0.5;0.501;1"
              calcMode="spline"
              keySplines="0 0 1 1;0.5 0 0.5 1;0 0 1 1;0.5 0 0.5 1"
              dur="8s" repeatCount="indefinite" begin="0s"
            />
            <animate
              attributeName="fill"
              values="#6DDBEB;#6DDBEB;#2A71F5;#2A71F5;#6DDBEB"
              keyTimes="0;0.001;0.5;0.501;1"
              calcMode="spline"
              keySplines="0 0 1 1;0.5 0 0.5 1;0 0 1 1;0.5 0 0.5 1"
              dur="8s" repeatCount="indefinite" begin="0s"
            />
          </path>
        </g>

        {/* ── Row 2 ── */}
        <g transform="translate(0,235)">
          <path d="M110,40 L161,40 L180,87 L180,133 L161,180 L110,180 L59,180 L40,133 L40,87 L59,40 Z" fill="#2A71F5">
            <animate
              attributeName="d"
              values={[
                'M110,40 L161,40 L180,87 L180,133 L161,180 L110,180 L59,180 L40,133 L40,87 L59,40 Z',
                'M110,40 L161,40 L180,87 L180,133 L161,180 L110,180 L59,180 L40,133 L40,87 L59,40 Z',
                'M110,30 L129,84 L186,85 L140,120 L157,175 L110,142 L63,175 L80,120 L34,85 L91,84 Z',
                'M110,30 L129,84 L186,85 L140,120 L157,175 L110,142 L63,175 L80,120 L34,85 L91,84 Z',
                'M110,40 L161,40 L180,87 L180,133 L161,180 L110,180 L59,180 L40,133 L40,87 L59,40 Z',
              ].join(';')}
              keyTimes="0;0.001;0.5;0.501;1"
              calcMode="spline"
              keySplines="0 0 1 1;0.5 0 0.5 1;0 0 1 1;0.5 0 0.5 1"
              dur="8s" repeatCount="indefinite" begin="0s"
            />
            <animate
              attributeName="fill"
              values="#2A71F5;#2A71F5;#6DDBEB;#6DDBEB;#2A71F5"
              keyTimes="0;0.001;0.5;0.501;1"
              calcMode="spline"
              keySplines="0 0 1 1;0.5 0 0.5 1;0 0 1 1;0.5 0 0.5 1"
              dur="8s" repeatCount="indefinite" begin="0s"
            />
          </path>
        </g>
        <g transform="translate(240,235)">
          <path d="M110,25 L152.5,67.5 L195,110 L152.5,152.5 L110,195 L67.5,152.5 L25,110 L67.5,67.5 Z" fill="#79F1AA">
            <animate
              attributeName="d"
              values={[
                'M110,25 L152.5,67.5 L195,110 L152.5,152.5 L110,195 L67.5,152.5 L25,110 L67.5,67.5 Z',
                'M110,25 L152.5,67.5 L195,110 L152.5,152.5 L110,195 L67.5,152.5 L25,110 L67.5,67.5 Z',
                'M110,25 L170.1,49.9 L195,110 L170.1,170.1 L110,195 L49.9,170.1 L25,110 L49.9,49.9 Z',
                'M110,25 L170.1,49.9 L195,110 L170.1,170.1 L110,195 L49.9,170.1 L25,110 L49.9,49.9 Z',
                'M110,25 L152.5,67.5 L195,110 L152.5,152.5 L110,195 L67.5,152.5 L25,110 L67.5,67.5 Z',
              ].join(';')}
              keyTimes="0;0.001;0.5;0.501;1"
              calcMode="spline"
              keySplines="0 0 1 1;0.5 0 0.5 1;0 0 1 1;0.5 0 0.5 1"
              dur="8s" repeatCount="indefinite" begin="0s"
            />
            <animate
              attributeName="fill"
              values="#79F1AA;#79F1AA;#2A71F5;#2A71F5;#79F1AA"
              keyTimes="0;0.001;0.5;0.501;1"
              calcMode="spline"
              keySplines="0 0 1 1;0.5 0 0.5 1;0 0 1 1;0.5 0 0.5 1"
              dur="8s" repeatCount="indefinite" begin="0s"
            />
          </path>
        </g>
        <g transform="translate(480,235)">
          <path d="M110,25 L146.8,88.75 L183.6,152.5 L110,152.5 L36.4,152.5 L73.2,88.75 Z" fill="#6DDBEB">
            <animate
              attributeName="d"
              values={[
                'M110,25 L146.8,88.75 L183.6,152.5 L110,152.5 L36.4,152.5 L73.2,88.75 Z',
                'M110,25 L146.8,88.75 L183.6,152.5 L110,152.5 L36.4,152.5 L73.2,88.75 Z',
                'M110,25 L183.6,67.5 L183.6,152.5 L110,195 L36.4,152.5 L36.4,67.5 Z',
                'M110,25 L183.6,67.5 L183.6,152.5 L110,195 L36.4,152.5 L36.4,67.5 Z',
                'M110,25 L146.8,88.75 L183.6,152.5 L110,152.5 L36.4,152.5 L73.2,88.75 Z',
              ].join(';')}
              keyTimes="0;0.001;0.5;0.501;1"
              calcMode="spline"
              keySplines="0 0 1 1;0.5 0 0.5 1;0 0 1 1;0.5 0 0.5 1"
              dur="8s" repeatCount="indefinite" begin="0s"
            />
            <animate
              attributeName="fill"
              values="#6DDBEB;#6DDBEB;#79F1AA;#79F1AA;#6DDBEB"
              keyTimes="0;0.001;0.5;0.501;1"
              calcMode="spline"
              keySplines="0 0 1 1;0.5 0 0.5 1;0 0 1 1;0.5 0 0.5 1"
              dur="8s" repeatCount="indefinite" begin="0s"
            />
          </path>
        </g>
      </svg>
    </div>);

  return null;
};

const How = () => {
  const [active, setActive] = useState(0);
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;if (!stage) return;
    const onScroll = () => {
      const r = stage.getBoundingClientRect();
      const total = r.height - innerHeight;
      const passed = Math.max(0, Math.min(total, -r.top));
      const idx = Math.min(STEPS.length - 1, Math.floor(passed / total * STEPS.length));
      setActive(idx);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="how" className="section how" data-screen-label="04 How it works">
      <div className="how-head">
        <Eyebrow num="04">How it works</Eyebrow>
        <h2 className="reveal" style={{ fontWeight: "400" }}>
          From hypothesis to <i className="serif">storefront</i><br />
          in six movements.
        </h2>
      </div>

      <div className="how-stage" ref={stageRef} style={{ height: `${STEPS.length * 100}vh` }}>
        <div className="how-sticky">
          <div className="how-rail">
            {STEPS.map((s, i) =>
            <button
              key={s.n}
              className={`rail-item ${i === active ? 'active' : ''} ${i < active ? 'done' : ''}`}
              onClick={() => window.scrollTo({ top: stageRef.current.offsetTop + i / STEPS.length * (stageRef.current.offsetHeight - innerHeight), behavior: 'smooth' })}
              data-cursor>
              
                <span className="rail-num">{s.n}</span>
                <span className="rail-name">{s.name}</span>
                <span className="rail-bar"><span style={{ width: i < active ? '100%' : i === active ? '50%' : '0%' }} /></span>
              </button>
            )}
          </div>
          <div className="how-canvas">
            <div className="how-step-meta">
              <span className="step-tag">Step {STEPS[active].n}</span>
              <h3 className="step-title" style={{ fontWeight: "400" }}>{STEPS[active].name.split(' ')[0]} <i className="serif">{STEPS[active].name.split(' ').slice(1).join(' ')}</i></h3>
              <p className="step-blurb">{STEPS[active].blurb}</p>
            </div>
            <div className="how-step-ui" key={active}>
              <StepUI step={active} />
            </div>
          </div>
        </div>
      </div>
    </section>);

};

/* =========================================================
   05 · WHY PHYSICAL MATTERS — cinematic
========================================================= */
const Why = () => {
  const fragments = ['hesitation', 'touch', 'movement', 'instinct', 'reaction'];
  return (
    <section className="why" data-screen-label="05 Why physical matters">
      <div className="why-inner">
        <Eyebrow num="05" dark>Why physical matters</Eyebrow>
        <h2 className="reveal" style={{ fontWeight: "400" }}>
          Products are not<br />
          understood through <i className="serif">clicks</i>.
        </h2>

        <div className="not-list reveal">
          <span><s>Not impressions.</s></span>
          <span><s>Not analytics dashboards.</s></span>
          <span><s>Not online reviews.</s></span>
        </div>

        <p className="why-lead reveal">
          Real understanding happens —
        </p>
        <ul className="why-fragments">
          {fragments.map((f, i) =>
          <li key={f} className="reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
              <span className="num">/0{i + 1}</span>
              <span className="word" style={{ fontWeight: "400" }}>in <i className="serif">{f}</i>.</span>
            </li>
          )}
        </ul>
      </div>
    </section>);

};

/* =========================================================
   06 · COMMUNITY + LOCAL IMPACT
========================================================= */
const Community = () =>
<section id="community" className="section community" data-screen-label="06 Community">
    <div className="community-head">
      <Eyebrow num="06">Community + Local impact</Eyebrow>
      <h2 className="reveal">
        A system designed for<br />
        <i className="serif">local economies</i>.
      </h2>
      <p className="reveal community-lead" style={{ fontSize: "24px" }}>
        Shopify Front isn&rsquo;t only a platform — it&rsquo;s a piece of <i className="serif">urban infrastructure</i>. It activates vacant storefronts, supports landlords with revenue between leases, and gives local entrepreneurs a route into the streets they already live on.
      </p>
    </div>

    <div className="community-grid">
      <div className="map-frame reveal">
        <div className="map-frame-head">
          <span><span className="dot mint" /> Toronto · live network</span>
          <span>14 active · 28 queued</span>
        </div>
        <svg viewBox="0 0 600 380" className="city-map">
          <defs>
            <pattern id="g2" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0,0,0,.06)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="600" height="380" fill="url(#g2)" />
          {/* abstract streets */}
          <path d="M 0 120 L 600 100" stroke="#0a0a0a" strokeOpacity=".15" strokeWidth="2" />
          <path d="M 0 200 L 600 220" stroke="#0a0a0a" strokeOpacity=".15" strokeWidth="2" />
          <path d="M 0 290 L 600 280" stroke="#0a0a0a" strokeOpacity=".15" strokeWidth="2" />
          <path d="M 140 0 L 130 380" stroke="#0a0a0a" strokeOpacity=".15" strokeWidth="2" />
          <path d="M 320 0 L 310 380" stroke="#0a0a0a" strokeOpacity=".15" strokeWidth="2" />
          <path d="M 480 0 L 490 380" stroke="#0a0a0a" strokeOpacity=".15" strokeWidth="2" />
          {/* Lake Ontario suggestion */}
          <path d="M 0 380 Q 200 320 400 350 T 600 360 L 600 380 Z" fill="#0a0a0a" opacity=".05" />
          {[
        [80, 110, 'Junction', '047'],
        [180, 90, 'Ossington', '022'],
        [260, 200, 'Queen W.', '014'],
        [340, 130, 'Kensington', '061'],
        [430, 230, 'Leslieville', '038'],
        [520, 110, 'Riverside', '009'],
        [120, 280, 'Roncesvalles', '055'],
        [380, 290, 'Distillery', '012']].
        map(([x, y, n, id], i) =>
        <g key={i}>
              <circle cx={x} cy={y} r="22" fill="#95ECB8" opacity=".18">
                <animate attributeName="r" values="20;30;20" dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values=".25;0;.25" dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={x} cy={y} r="6" fill="#0a0a0a" />
              <circle cx={x} cy={y} r="3" fill="#95ECB8" />
              <text x={x + 12} y={y - 8} fontFamily="var(--sans)" fontSize="10" fill="#0a0a0a" fontWeight="500">{n}</text>
              <text x={x + 12} y={y + 4} fontFamily="var(--sans)" fontSize="9" fill="#6f6f6f">SF-{id}</text>
            </g>
        )}
        </svg>
      </div>

      <div className="community-list">
        {[
      ['Vacant storefront activation', 'Empty retail becomes revenue between leases — without locking landlords in.'],
      ['Local entrepreneurs first', 'Booking priority and reduced rates for businesses based in the same postcode.'],
      ['Experimentation, returned', 'A street feels alive when its windows change. Cities should reward that.'],
      ['Lower barrier to participation', 'No build-out, no broker, no minimum term. The cost is the duration.']].
      map(([h, b], i) =>
      <div className="comm-item reveal" key={h} style={{ transitionDelay: `${i * 0.08}s` }}>
            <span className="comm-num">0{i + 1}</span>
            <div>
              <h4>{h}</h4>
              <p>{b}</p>
            </div>
          </div>
      )}
      </div>
    </div>
  </section>;


/* =========================================================
   07 · USE CASES
========================================================= */
const CASES = [
{ tag: 'Hardware', name: 'Kickstarter Founder', desc: 'Tests a prototype with real hands before manufacturing at scale.', metric: '14 days · 1 unit · 2,400 conversations', slider: { leftImg: 'store front images/blank store front.png', rightImg: 'store front images/numa.png' } },
{ tag: 'Apparel', name: 'Small Fashion Brand', desc: 'Validates sizing, fabric and silhouette behaviour in person.', metric: '21 days · 1 unit · 38% try-on rate', slider: { leftImg: 'store front images/blank store front.png', rightImg: 'store front images/baseline tennis apparel.png' } },
{ tag: 'F&B', name: 'Food Startup', desc: 'Experiments with neighbourhoods before signing a single lease.', metric: '3 spaces · 2 weeks each · 1 chosen', slider: { leftImg: 'store front images/blank store front.png', rightImg: 'store front images/nom.png' } },
{ tag: 'Creator', name: 'Digital Creator', desc: 'Turns an online audience into a physical, local community.', metric: '7-day skincare pop-up · personalized consultations · 1,140 visits', slider: { leftImg: 'store front images/blank store front.png', rightImg: 'store front images/sage mercer.png' } }];


const Cases = () => {
  const [openCase, setOpenCase] = useState(null);
  const [entered, setEntered] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [closeHover, setCloseHover] = useState(false);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const openCard = (c) => {
    if (!c.slider) return;
    setOpenCase(c);
    setSliderPos(50);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  };

  const closeCard = () => {
    setEntered(false);
    setTimeout(() => {
      setOpenCase(null);
      document.body.style.overflow = '';
    }, 420);
  };

  const applyDrag = (clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(ratio);
  };

  const onSliderMouseDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    applyDrag(e.clientX);
    const onMove = (ev) => { if (dragging.current) applyDrag(ev.clientX); };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const onSliderTouchStart = (e) => {
    dragging.current = true;
    const t = e.touches[0];
    if (t) applyDrag(t.clientX);
    const onMove = (ev) => {
      if (!dragging.current) return;
      const t2 = ev.touches[0];
      if (t2) applyDrag(t2.clientX);
    };
    const onEnd = () => {
      dragging.current = false;
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
  };

  return (
    <>
      <section id="cases" className="section cases" data-screen-label="07 Use cases">
        <div className="cases-head">
          <Eyebrow num="07">Use cases</Eyebrow>
          <h2 className="reveal">
            Flexible enough for<br />
            <i className="serif">whoever</i> needs the street.
          </h2>
        </div>
        <div className="cases-grid">
          {CASES.map((c, i) =>
          <article
            className="case-card reveal"
            key={c.name}
            style={{ transitionDelay: `${i * 0.06}s`, cursor: c.slider ? 'pointer' : undefined }}
            data-cursor
            data-cursor-label="Read"
            onClick={() => openCard(c)}>
              <div className="case-card-top">
                <span className="case-tag">{c.tag}</span>
                <span className="case-arrow">→</span>
              </div>
              <h3>{c.name.split(' ')[0]} <i className="serif">{c.name.split(' ').slice(1).join(' ')}</i></h3>
              <p>{c.desc}</p>
              <div className="case-metric">{c.metric}</div>
            </article>
          )}
        </div>
      </section>

      {openCase &&
      <div
        className="modal-overlay"
        onClick={(e) => { if (e.target === e.currentTarget) closeCard(); }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '48px',
          background: entered ? '#000' : 'rgba(0,0,0,0)',
          transition: 'background 0.42s ease'
        }}>
          <div style={{
          position: 'relative', width: '100%', maxWidth: '1100px',
          background: '#0a0a0a', borderRadius: '6px', overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          transform: entered ? 'translateY(0)' : 'translateY(-110vh)',
          opacity: entered ? 1 : 0,
          transition: 'transform 0.42s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease'
        }}>
            <button
            className="modal-close"
            onClick={closeCard}
            onMouseEnter={() => setCloseHover(true)}
            onMouseLeave={() => setCloseHover(false)}
            style={{
              position: 'absolute', top: '16px', right: '16px', zIndex: 3,
              background: closeHover ? '#fff' : 'rgba(255,255,255,0.14)',
              color: closeHover ? '#0a0a0a' : '#fff',
              border: 'none', borderRadius: '24px', padding: '8px 20px',
              fontSize: '13px', letterSpacing: '0.06em', cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.18s ease, color 0.18s ease, transform 0.18s ease',
              transform: closeHover ? 'scale(1.06)' : 'scale(1)'
            }}
            data-cursor data-cursor-label="Close">
              Close
            </button>

            <div
            ref={containerRef}
            onMouseDown={onSliderMouseDown}
            onTouchStart={onSliderTouchStart}
            style={{
              position: 'relative', width: '100%',
              aspectRatio: '3 / 2',
              maxHeight: 'calc(88vh)',
              userSelect: 'none', cursor: 'ew-resize',
              lineHeight: 0, background: '#0a0a0a',
              overflow: 'hidden',
              touchAction: 'none'
            }}>
              <img
              src={openCase.slider.rightImg}
              alt=""
              draggable={false}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center center'
              }} />
              <img
              src={openCase.slider.leftImg}
              alt=""
              draggable={false}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center center',
                clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                WebkitClipPath: `inset(0 ${100 - sliderPos}% 0 0)`
              }} />
              <div style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${sliderPos}%`, width: '2px',
              background: '#fff', transform: 'translateX(-1px)',
              pointerEvents: 'none',
              boxShadow: '0 0 12px rgba(0,0,0,0.4)'
            }} />
              <div style={{
              position: 'absolute', top: '50%',
              left: `${sliderPos}%`,
              transform: 'translate(-50%, -50%)',
              width: '48px', height: '48px', borderRadius: '50%',
              background: '#fff', color: '#0a0a0a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: 500,
              boxShadow: '0 6px 24px rgba(0,0,0,0.5)',
              pointerEvents: 'none',
              letterSpacing: '-2px'
            }}>
                ‹ ›
              </div>
              <div style={{
              position: 'absolute', top: 'calc(50% + 38px)',
              left: `${sliderPos}%`,
              transform: 'translate(-50%, 0)',
              color: '#fff',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.85,
              pointerEvents: 'none',
              textShadow: '0 1px 3px rgba(0,0,0,0.6)',
              whiteSpace: 'nowrap'
            }}>
                drag me
              </div>
            </div>
          </div>
        </div>
      }
    </>);

};


/* =========================================================
   08 · DATA / INSIGHT LAYER
========================================================= */
const Insight = () =>
<section className="insight" data-screen-label="08 Insight layer">
    <div className="insight-inner">
      <Eyebrow num="08" dark>The insight layer</Eyebrow>
      <h2 className="reveal">
        Behavioural <span className="serif mint-text">understanding</span>.<br />
        Not consumer <s>tracking</s>.
      </h2>
      <p className="reveal insight-lead">
        Every Shopify Front installation produces an honest record of how people meet a product — measured in the language of <i className="serif">behaviour</i>, not surveillance.
      </p>

      <div className="insight-grid">
        <div className="insight-tile heat-tile reveal">
          <div className="tile-head"><span>foot-traffic heatmap</span><span className="dot mint" /></div>
          <div className="floor">
            <div className="floor-grid">
              {Array.from({ length: 60 }).map((_, i) => {
              const v = Math.max(0, Math.sin(i * 0.5) * Math.cos(i * 0.31) + 0.4);
              return <span key={i} style={{ background: `rgba(149,236,184,${(v * 0.9).toFixed(2)})` }} />;
            })}
            </div>
            <span className="floor-label entry">entry</span>
            <span className="floor-label hotspot">hotspot</span>
          </div>
        </div>
        <div className="insight-tile dwell-tile reveal" style={{ transitionDelay: '.08s' }}>
          <div className="tile-head"><span>dwell time · top SKUs</span><span>06d 14h</span></div>
          <div className="bars">
            {[
          ['SKU 04 — natural dye', 92],
          ['SKU 07 — limited tee', 74],
          ['SKU 12 — ceramic mug', 61],
          ['SKU 02 — classic cut', 43],
          ['SKU 09 — tote', 28]].
          map(([n, v], i) =>
          <div className="bar-row" key={i}>
                <span className="bar-label">{n}</span>
                <span className="bar-track"><span className="bar-fill" style={{ width: `${v}%` }} /></span>
                <span className="bar-val">{(v * 0.025).toFixed(2)} min</span>
              </div>
          )}
          </div>
        </div>
        <div className="insight-tile flow-tile reveal" style={{ transitionDelay: '.16s' }}>
          <div className="tile-head"><span>customer flow</span><span>248 / day</span></div>
          <svg viewBox="0 0 320 160" className="flow">
            <path d="M 10 130 C 60 130, 80 30, 130 80 S 220 140, 260 60 L 310 60" stroke="#95ECB8" strokeWidth="2" fill="none" strokeDasharray="4 4">
              <animate attributeName="stroke-dashoffset" values="0;-32" dur="2.4s" repeatCount="indefinite" />
            </path>
            <circle cx="10" cy="130" r="6" fill="#0a0a0a" stroke="#95ECB8" strokeWidth="2" />
            <circle cx="310" cy="60" r="6" fill="#95ECB8" />
            <text x="10" y="148" fontSize="9" fill="rgba(255,255,255,.5)">enter</text>
            <text x="280" y="48" fontSize="9" fill="rgba(255,255,255,.5)">checkout</text>
          </svg>
          <div className="flow-stats">
            <div><b>4.2</b><span>zones / visit</span></div>
            <div><b>62%</b><span>reach plinth A</span></div>
            <div><b>11%</b><span>complete loop</span></div>
          </div>
        </div>
      </div>

      <p className="insight-foot reveal">
        <i className="serif">Behavioural insight</i>, not tracking. Aggregate, anonymised, and shaped to answer the question the brand actually asked at onboarding.
      </p>
    </div>
  </section>;


/* =========================================================
   09 · VISION
========================================================= */
const Vision = () =>
<section id="vision" className="section vision" data-screen-label="09 Vision">
    <div className="vision-inner">
      <Eyebrow num="09">The vision</Eyebrow>
      <h2 className="reveal">
        What if launching a <i className="serif">storefront</i><br />
        felt like launching a <span className="mint-block">website</span>?
      </h2>
      <div className="vision-foot">
        <p className="reveal" style={{ fontSize: "20px" }}>
          Shopify transformed digital entrepreneurship.
          Shopify Front extends that accessibility into physical space — creating a future where retail becomes
          <i className="serif"> flexible</i>, <i className="serif">testable</i>, and <i className="serif">community-driven</i>.
        </p>
        <p className="reveal vision-strong">
          This is not permanent retail.<br />
          It is <span className="mint-underline">adaptive retail infrastructure</span>.
        </p>
      </div>
    </div>
  </section>;


/* =========================================================
   09b · INFO CARD — slide-up contact card
========================================================= */
const InfoCard = () => {
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [closeHover, setCloseHover] = useState(false);

  const openCard = () => {
    setOpen(true);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  };

  const closeCard = () => {
    setEntered(false);
    setTimeout(() => {
      setOpen(false);
      document.body.style.overflow = '';
    }, 480);
  };

  useEffect(() => {
    const handler = () => openCard();
    window.addEventListener('open-info-card', handler);
    return () => window.removeEventListener('open-info-card', handler);
  }, []);

  if (!open) return null;

  return (
    <div
      className="modal-overlay infocard-modal"
      onClick={(e) => {if (e.target === e.currentTarget) closeCard();}}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px',
        background: entered ? 'rgba(0,0,0,0.42)' : 'rgba(0,0,0,0)',
        backdropFilter: entered ? 'blur(14px) saturate(120%)' : 'blur(0px)',
        WebkitBackdropFilter: entered ? 'blur(14px) saturate(120%)' : 'blur(0px)',
        transition: 'background 0.42s ease, backdrop-filter 0.42s ease, -webkit-backdrop-filter 0.42s ease'
      }}>

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '592px',
        transform: entered ? 'translateY(0)' : 'translateY(110vh)',
        opacity: entered ? 1 : 0,
        transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.32s ease'
      }}>

        <button
          className="modal-close"
          onClick={closeCard}
          onMouseEnter={() => setCloseHover(true)}
          onMouseLeave={() => setCloseHover(false)}
          style={{
            position: 'absolute', top: '16px', right: '16px', zIndex: 3,
            background: closeHover ? '#fff' : 'rgba(255,255,255,0.14)',
            color: closeHover ? '#0a0a0a' : '#fff',
            border: 'none', borderRadius: '24px', padding: '8px 20px',
            fontSize: '13px', letterSpacing: '0.06em', cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.18s ease, color 0.18s ease, transform 0.18s ease',
            transform: closeHover ? 'scale(1.06)' : 'scale(1)'
          }}
          data-cursor
          data-cursor-label="Close">

          Close
        </button>

        <img
          src="info card.svg"
          alt="Contact info"
          style={{ display: 'block', width: '100%', height: 'auto', borderRadius: '38px' }} />

      </div>
    </div>);

};


/* =========================================================
   10 · FINAL — minimal black
========================================================= */
const Final = () =>
<footer id="contact" className="final" data-screen-label="10 Final">
    <div className="final-inner">
      <p className="final-line reveal">
        Before businesses scale physically,<br />
        they should be able to <i className="serif">learn</i> physically.
      </p>

      <div className="final-links">
        {[
      ['Full thesis report', 'PDF · 48 pp', 'assets/gradex-process-book.pdf'],
      ['Prototype walkthrough', 'Interactive', 'https://mabelkasunic.github.io/Front/'],
      ['Video presentation', '4 min · MP4', null],
      ['Contact the creator', 'mabelkasunicdesign@gmail.com', null]].
      map(([k, v, url], i) =>
      <Magnetic key={k} strength={0.18}>
            <a
              href={url || '#'}
              target={url ? '_blank' : undefined}
              rel={url ? 'noopener noreferrer' : undefined}
              className="final-link reveal"
              data-cursor
              data-cursor-label="Open"
              style={{ transitionDelay: `${i * 0.06}s` }}
              onClick={(e) => {
                console.log('[final-link click]', { k, url });
                e.preventDefault();
                e.stopPropagation();
                if (k === 'Video presentation') {
                  window.dispatchEvent(new CustomEvent('open-video-showreel'));
                  return;
                }
                if (k === 'Contact the creator') {
                  window.dispatchEvent(new CustomEvent('open-info-card'));
                  return;
                }
                if (!url) return;
                const tmp = document.createElement('a');
                tmp.href = url;
                tmp.target = '_blank';
                tmp.rel = 'noopener noreferrer';
                document.body.appendChild(tmp);
                tmp.click();
                document.body.removeChild(tmp);
              }}>
              <span className="num">/0{i + 1}</span>
              <span className="lbl" style={{ fontWeight: "400" }}>{k}</span>
              <span className="meta">{v}</span>
              <span className="arr">→</span>
            </a>
          </Magnetic>
      )}
      </div>

      <div className="final-foot">
        <span className="final-mark"><span style={{ color: '#fff' }}><TagMark size={26} /></span> shopify front<sup>™</sup></span>
        <span>© 2026 · Mabel Kasunic</span>
      </div>

      <div className="final-watermark" aria-hidden="true">Shopify Front</div>
    </div>
  </footer>;


Object.assign(window, { Hero, VideoShowreel, CardOverlay, Shift, ShiftStatement, Capabilities, Intro, How, Why, Community, Cases, Insight, Vision, InfoCard, Final });
