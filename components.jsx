// Shopify Front — primitives, cursor, nav
const { useEffect, useRef, useState, useMemo } = React;

/* ---------- Marks ---------- */
const TagMark = ({ size = 36, accentMint = true }) =>
<svg viewBox="0 0 85.24 96.72" width={size} height={size * (96.72 / 85.24)} aria-hidden="true">
    <path fill={accentMint ? '#95ECB8' : '#fff'} d="M66.44,46.72l-7.95-15.84c-1.45-2.89-4.62-4.99-8.24-5.19-1.37-.07-2.7.18-3.91.66l-16.45,6.53c-1.36.54-2.4,1.56-2.88,2.84l-16.57,43.79c-.7,1.84.46,3.98,2.58,4.79l32.01,12.11c2.12.8,4.4-.04,5.1-1.88l16.57-43.8c.48-1.27.38-2.71-.27-4.01ZM49.25,38.94c-1.82,0-3.29-1.47-3.29-3.29s1.47-3.29,3.29-3.29,3.29,1.47,3.29,3.29-1.47,3.29-3.29,3.29Z" />
    <path fill="currentColor" d="M80.21,1.88c-3.47-2.45-8.34-2.5-14.46-.15-9.27,3.56-12.79,11.69-16.86,23.86.88-.11,1.78-.11,2.68.03,3.73-11.05,7.08-18.42,15.1-21.5,1.24-.48,4.1-1.58,7.08-1.58.86,0,1.73.09,2.57.32.85.22,1.67.59,2.42,1.11,3.81,2.69,4.62,8.92,3.44,13.41-1.92,7.3-9.5,10.4-23.05,14.7-1.65.53-3.4,1.07-5.23,1.64-.66.2-1.23.35-1.71.45-1.9.41-2.48.1-2.65-.09-.18-.2-.31-.66-.1-1.71-.06-.01-.12-.01-.18-.01-.99,0-1.87.44-2.48,1.13.03.82.27,1.65.88,2.31.78.85,1.89,1.13,3.03,1.13.56,0,1.13-.07,1.67-.16.92-.16,1.75-.43,2.31-.6,1.76-.55,3.46-1.08,5.08-1.59,14.11-4.48,22.67-7.96,24.92-16.55,1.43-5.46.37-12.75-4.44-16.15Z" style={{ fill: "rgb(149, 236, 184)" }} />
    <path fill="currentColor" d="M62.71,54.38l-26.62,40.76c-1.12,1.72-3.56,2.1-5.46.86L1.96,77.28c-1.9-1.24-2.53-3.63-1.41-5.35L27.17,31.18c.78-1.19,2.03-2,3.5-2.27l17.73-3.24c.16-.03.33-.06.49-.08.88-.11,1.78-.11,2.68.03.27.05.55.1.82.18,3.29.88,5.8,3.35,6.72,6.29-1.65.53-3.4,1.07-5.23,1.64-.66.2-1.23.35-1.71.45-.52-1.02-1.55-1.74-2.76-1.8-.06-.01-.12-.01-.18-.01-.99,0-1.87.44-2.48,1.13-.5.58-.81,1.34-.81,2.16,0,1.82,1.47,3.29,3.29,3.29,1.43,0,2.64-.91,3.09-2.18.92-.16,1.75-.43,2.31-.6,1.76-.55,3.46-1.08,5.08-1.59l3.65,15.71c.34,1.45.09,2.92-.68,4.1Z" style={{ fill: "rgb(159, 237, 190)" }} />
    <path fill={accentMint ? '#fff' : '#95ECB8'} d="M21.22,68.5c1.4.78,3.89,1.83,6.5,1.82,2.36,0,3.79-1.25,4.02-2.82.22-1.5-.53-2.53-2.83-3.96-2.86-1.79-4.82-4.33-4.33-7.62.86-5.86,6.47-9.96,13.74-9.92,3.16.02,5.5.67,6.71,1.44l-2.78,5.88c-1.04-.55-2.8-1.18-4.97-1.2-2.31-.01-3.99,1.05-4.24,2.74-.19,1.29.76,2.28,2.66,3.42,2.94,1.92,5.26,4.41,4.74,7.94-.97,6.62-6.84,10.21-14.29,10.16-3.4-.02-6.43-.98-7.79-2.1l2.87-5.8Z" style={{ fill: "rgb(255, 255, 255)" }} />
  </svg>;


/* ---------- Custom cursor ---------- */
const Cursor = ({ enabled }) => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.remove('no-cursor');
    let mx = innerWidth / 2,my = innerHeight / 2;
    let rx = mx,ry = my;
    let raf;
    const onMove = (e) => {
      mx = e.clientX;my = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    const onOver = (e) => {
      const t = e.target.closest('[data-cursor]');
      if (!t || !ringRef.current) return;
      ringRef.current.classList.add('is-hover');
      const label = t.getAttribute('data-cursor-label');
      if (label) {ringRef.current.classList.add('label');ringRef.current.setAttribute('data-label', label);}
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
  return <><div ref={dotRef} className="cursor-dot" /><div ref={ringRef} className="cursor-ring" /></>;
};

/* ---------- Magnetic hover ---------- */
const Magnetic = ({ children, strength = 0.35 }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const onLeave = () => {el.style.transform = '';};
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {el.removeEventListener('mousemove', onMove);el.removeEventListener('mouseleave', onLeave);};
  }, [strength]);
  return <span ref={ref} className="magnetic" style={{ transition: 'transform .35s cubic-bezier(.2,.7,.2,1)' }}>{children}</span>;
};

/* ---------- Reveal on scroll ---------- */
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-line');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {e.target.classList.add('in');io.unobserve(e.target);}
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};

/* ---------- Smooth section progress ---------- */
const useScrollProgress = () => {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return p;
};

/* ---------- NAV ---------- */
const Nav = () => {
  const p = useScrollProgress();
  return (
    <nav className="nav">
      <div className="nav-inner">
        <span className="nav-brand">
          <img src="assets/shopify logo.svg" alt="Shopify" style={{ height: '22px', width: 'auto', display: 'block' }} />
        </span>
        <a href="#shift" className="nav-link" data-cursor>The Shift</a>
        <a href="#how" className="nav-link" data-cursor>How it works</a>
        <a href="#cases" className="nav-link" data-cursor>Use cases</a>
        <a href="#vision" className="nav-link" data-cursor>Vision</a>
        <a href="#contact" className="nav-link cta" data-cursor>Enter the platform</a>
      </div>
      <div className="nav-progress"><span style={{ width: `${p * 100}%` }} /></div>
    </nav>);

};

/* ---------- Section eyebrow ---------- */
const Eyebrow = ({ num, children, dark }) =>
<span className={`eyebrow ${dark ? 'on-dark' : ''}`}>
    {num && <em className="eyebrow-num">{num}</em>}
    {children}
  </span>;


Object.assign(window, { TagMark, Cursor, Magnetic, useReveal, useScrollProgress, Nav, Eyebrow });