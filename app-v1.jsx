// Shopify Front — App entry
const { useEffect, useState } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mintIntensity": "medium",
  "serif": "instrument",
  "darkMode": false,
  "cursor": true,
  "animationSpeed": 1
}/*EDITMODE-END*/;

const SERIF_STACKS = {
  instrument: "'Instrument Serif', 'Cormorant Garamond', serif",
  cormorant: "'Cormorant Garamond', 'Times New Roman', serif",
  bodoni: "'Bodoni Moda', 'Didot', serif",
  fraunces: "'Fraunces', serif"
};

const MINT_VALUES = {
  subtle: '#C9F4D9',
  medium: '#95ECB8',
  bold: '#6FD89A'
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.style.setProperty('--mint-active', MINT_VALUES[t.mintIntensity] || MINT_VALUES.medium);
    document.documentElement.style.setProperty('--serif', SERIF_STACKS[t.serif] || SERIF_STACKS.instrument);
    document.body.classList.toggle('theme-dark', !!t.darkMode);
    document.body.classList.toggle('no-cursor', !t.cursor);
    document.documentElement.style.setProperty('--anim-speed', t.animationSpeed);
  }, [t]);

  useReveal();

  return (
    <>
      <Cursor enabled={t.cursor} />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Work />
        <Statement />
        <Services />
        <About />
      </main>
      <Contact />

      <TweaksPanel title="Tweaks" defaultOpen={false}>
        <TweakSection title="Mint">
          <TweakRadio label="Intensity" value={t.mintIntensity} options={[
            { label: 'Subtle', value: 'subtle' },
            { label: 'Medium', value: 'medium' },
            { label: 'Bold', value: 'bold' }
          ]} onChange={(v) => setTweak('mintIntensity', v)} />
        </TweakSection>

        <TweakSection title="Type">
          <TweakSelect label="Serif accent" value={t.serif} options={[
            { label: 'Instrument Serif', value: 'instrument' },
            { label: 'Cormorant Garamond', value: 'cormorant' },
            { label: 'Bodoni Moda', value: 'bodoni' },
            { label: 'Fraunces', value: 'fraunces' }
          ]} onChange={(v) => setTweak('serif', v)} />
        </TweakSection>

        <TweakSection title="Mode">
          <TweakToggle label="Dark mode" value={t.darkMode} onChange={(v) => setTweak('darkMode', v)} />
          <TweakToggle label="Custom cursor" value={t.cursor} onChange={(v) => setTweak('cursor', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
