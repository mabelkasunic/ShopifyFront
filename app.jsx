// Shopify Front — App entry
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mintIntensity": "medium",
  "serif": "instrument",
  "darkMode": false,
  "cursor": true
}/*EDITMODE-END*/;

const SERIF_STACKS = {
  instrument: "'Instrument Serif', 'Cormorant Garamond', serif",
  cormorant: "'Cormorant Garamond', 'Times New Roman', serif",
  bodoni: "'Bodoni Moda', 'Didot', serif",
  fraunces: "'Fraunces', serif"
};
const MINT_VALUES = { subtle: '#C9F4D9', medium: '#95ECB8', bold: '#6FD89A' };

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.style.setProperty('--mint-active', MINT_VALUES[t.mintIntensity] || MINT_VALUES.medium);
    document.documentElement.style.setProperty('--serif', SERIF_STACKS[t.serif] || SERIF_STACKS.instrument);
    document.body.classList.toggle('theme-dark', !!t.darkMode);
    document.body.classList.toggle('no-cursor', !t.cursor);
  }, [t]);

  useReveal();

  return (
    <>
      <Cursor enabled={t.cursor} />
      <CardOverlay />
      <Nav />
      <main>
        <Hero />
        <VideoShowreel />
        <Shift />
        <Capabilities />
        <Intro />
        <How />
        <Why />
        <Community />
        <Cases />
        <Insight />
        <Vision />
      </main>
      <Final />
      <InfoCard />

      <TweaksPanel>
        <TweakSection label="Mint" />
        <TweakRadio label="Intensity" value={t.mintIntensity}
          options={['subtle', 'medium', 'bold']}
          onChange={(v) => setTweak('mintIntensity', v)} />
        <TweakSection label="Type" />
        <TweakSelect label="Serif accent" value={t.serif}
          options={['instrument', 'cormorant', 'bodoni', 'fraunces']}
          onChange={(v) => setTweak('serif', v)} />
        <TweakSection label="Mode" />
        <TweakToggle label="Dark mode" value={t.darkMode} onChange={(v) => setTweak('darkMode', v)} />
        <TweakToggle label="Custom cursor" value={t.cursor} onChange={(v) => setTweak('cursor', v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
