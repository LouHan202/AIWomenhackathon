const screens = [...document.querySelectorAll('.screen')];
const progress = [...document.querySelectorAll('.progress-step')];
const main = document.querySelector('main');
const brief = document.querySelector('#scent-brief');
const characterCount = document.querySelector('#character-count');
const briefState = document.querySelector('#brief-state');
const attachmentStatus = document.querySelector('#attachment-status');
const selectedTechnical = { space: '', format: '' };
let selectedDirection = 'Neroli Terrace';
let recorder;
let recordingStream;

document.head.insertAdjacentHTML('beforeend', `<style>
  .home-active>.progress,.home-active>.screen{display:none}.home-screen{display:none;max-width:1130px;margin:0 auto;padding:10vh 0 70px}.home-active>.home-screen{display:block}.home-hero{display:grid;grid-template-columns:1.05fr .95fr;gap:60px;align-items:center}.home-hero h1{font:clamp(56px,6.6vw,94px)/.86 'DM Sans',sans-serif;letter-spacing:-.075em;font-weight:500;margin:17px 0 24px}.home-hero h1 em,.home-method h2 em,.home-trust h3 em,.sillage-layer h2 em{font-family:'Instrument Serif',serif;font-weight:400}.home-actions{display:flex;gap:16px;align-items:center;margin-top:32px}.hero-system{max-width:400px;margin:23px 0 0;padding:13px 14px;border-left:2px solid #ee9d61;background:#fbfaf6}.hero-system span{display:block;font:8px 'DM Mono',monospace;letter-spacing:.08em;color:#a85d30}.hero-system b{display:block;margin-top:7px;font:14px/1.25 'DM Sans',sans-serif;font-weight:500;color:#353630}.home-image{height:540px;position:relative;overflow:hidden;background:#2b332b}.home-image>img{width:100%;height:100%;object-fit:cover;display:block}.home-image>div{position:absolute;left:22px;bottom:22px;background:#f8f7f2e8;padding:14px;color:#252621}.home-image span{font:8px 'DM Mono',monospace;color:#6f6b63}.home-image b{display:block;margin-top:8px;font:21px/1 'Instrument Serif',serif}.home-promise{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin-top:64px;background:var(--line)}.home-promise article{min-height:235px;padding:22px;background:#fbfaf6}.home-promise span{font:31px/.9 'Instrument Serif',serif;color:#a85d30}.home-promise b{display:block;margin:25px 0 8px;font-size:16px;font-weight:500;letter-spacing:-.03em}.home-promise p,.home-method p,.home-trust p,.sillage-layer p{margin:0;font-size:12px;line-height:1.55;color:#625f59}.sillage-layer{display:grid;grid-template-columns:1fr 1fr;gap:65px;margin-top:62px;padding:32px;background:#e9eee7}.sillage-layer h2{font:43px/.92 'DM Sans',sans-serif;letter-spacing:-.06em;font-weight:500;margin:14px 0}.sillage-layer p{max-width:430px}.sillage-layer small{display:block;margin-top:21px;font:8px/1.4 'DM Mono',monospace;color:#497064;letter-spacing:.06em}.layer-diagram{position:relative;min-height:260px;display:grid;place-items:center;background:#f8f7f2;border:1px solid #d3d8d0}.layer-app{position:relative;z-index:2;width:173px;padding:20px 18px;background:#20231f;color:#f8f7f2}.layer-app span{font:8px 'DM Mono',monospace;letter-spacing:.08em;color:#9fc6b7}.layer-app b{display:block;margin:13px 0 20px;font:27px/.92 'Instrument Serif',serif}.layer-app i{font:8px 'DM Mono',monospace;color:#c4c8bf;font-style:normal}.layer-line{position:absolute;z-index:1;width:72%;height:1px;background:#8cb7a8;top:50%;transform:translateY(-50%)}.layer-systems{position:absolute;bottom:22px;left:16px;right:16px;display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.layer-systems span{padding:9px 6px;border:1px solid #cbd1c9;background:#f8f7f2;color:#5a665e;text-align:center;font:8px 'DM Mono',monospace}.home-method,.home-trust{display:grid;grid-template-columns:1fr 1fr;gap:65px;margin-top:62px;padding-top:31px;border-top:1px solid var(--line)}.home-method h2,.home-trust h3{font:43px/.92 'DM Sans',sans-serif;letter-spacing:-.06em;font-weight:500;margin:14px 0}.method-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}.method-tags span{border:1px solid var(--line);border-radius:20px;padding:8px 10px;font:9px 'DM Mono',monospace;color:#6d6861}.home-trust{padding:28px;background:#e9eee7;border:0}.home-trust p+p{margin-top:15px}.home-footer-cta{display:flex;justify-content:space-between;align-items:center;margin-top:62px;padding-top:24px;border-top:1px solid var(--line)}.home-footer-cta p{margin:0;font:29px/1 'Instrument Serif',serif}@media(max-width:760px){.home-screen{padding:58px 0}.home-hero,.home-method,.home-trust,.sillage-layer{display:block}.home-image{height:380px;margin-top:35px}.home-promise{grid-template-columns:1fr;margin-top:42px}.home-method,.home-trust,.sillage-layer{margin-top:42px;gap:0}.home-method>div:last-child,.home-trust>div:last-child,.sillage-layer>div:last-child{margin-top:22px}.home-footer-cta{align-items:flex-start;gap:20px;flex-direction:column}.home-actions{align-items:flex-start;flex-direction:column}}
</style>`);

document.head.insertAdjacentHTML('beforeend', `<style>
  .sillage-control{display:grid;grid-template-columns:1fr 1fr;gap:65px;margin-top:62px;padding:32px;background:#20231f;color:#f8f7f2}.sillage-control h2{font:43px/.92 'DM Sans',sans-serif;letter-spacing:-.06em;font-weight:500;margin:14px 0}.sillage-control h2 em{font-family:'Instrument Serif',serif;font-weight:400}.sillage-control p{max-width:390px;margin:0;color:#d9d8cf;font-size:12px;line-height:1.55}.sillage-control small{display:block;margin-top:22px;color:#a9aaa2;font:8px/1.4 'DM Mono',monospace;letter-spacing:.06em}.control-preview{padding:16px;background:#f0f0ea;color:#20231f;align-self:stretch}.control-preview-head{display:flex;justify-content:space-between;font:8px 'DM Mono',monospace;color:#676961}.control-preview-head b{color:#3b7164;font-weight:500}.scent-dial{height:164px;display:grid;place-items:center;position:relative;margin:12px 0}.scent-dial:before{content:'';width:134px;height:134px;border:1px solid #bfc4b8;border-radius:50%;position:absolute}.scent-dial:after{content:'';width:102px;height:102px;border:8px solid #9fc6b7;border-right-color:#e6e6df;border-bottom-color:#e6e6df;border-radius:50%;position:absolute;transform:rotate(25deg)}.scent-dial i{position:absolute;width:8px;height:8px;border-radius:50%;background:#e99d61;transform:translate(47px,-46px)}.scent-dial strong{font:42px/.8 'Instrument Serif',serif;z-index:1}.scent-dial strong small{display:inline;margin:0;font:13px 'DM Mono',monospace;color:#4d504a}.scent-dial span{position:absolute;bottom:9px;font:8px 'DM Mono',monospace;color:#6f716a}.control-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#d4d6cf}.control-grid div{padding:11px;background:#f0f0ea}.control-grid span{display:block;font:8px 'DM Mono',monospace;color:#777a72}.control-grid b{display:block;margin-top:6px;font-size:11px;font-weight:500}.compatibility-strip{display:grid;grid-template-columns:1.2fr 1fr auto;gap:12px;align-items:center;margin-top:1px;padding:12px 11px;background:#dfe8e0;color:#2d554a}.compatibility-strip span,.compatibility-strip b,.compatibility-strip i{font:8px 'DM Mono',monospace;letter-spacing:.03em}.compatibility-strip b{font-weight:500}.compatibility-strip i{font-style:normal;color:#d37e44;letter-spacing:2px}@media(max-width:760px){.sillage-control{display:block;margin-top:42px}.control-preview{margin-top:28px}.compatibility-strip{grid-template-columns:1fr;gap:5px}}
</style>`);

document.head.insertAdjacentHTML('beforeend', `<style>
  .ai-native{display:grid;grid-template-columns:.9fr 1.1fr;gap:65px;margin-top:62px;padding-top:31px;border-top:1px solid var(--line)}.ai-native h2,.use-cases h2{font:43px/.92 'DM Sans',sans-serif;letter-spacing:-.06em;font-weight:500;margin:14px 0}.ai-native h2 em,.use-cases h2 em{font-family:'Instrument Serif',serif;font-weight:400}.ai-native>div>p:not(.eyebrow),.use-cases p{margin:0;max-width:390px;font-size:12px;line-height:1.55;color:#625f59}.ai-native-flow{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line)}.ai-native-flow article{min-height:130px;padding:17px;background:#fbfaf6}.ai-native-flow span{font:9px 'DM Mono',monospace;color:#a85d30}.ai-native-flow b{display:block;margin:19px 0 5px;font-size:14px;font-weight:500}.ai-native-flow p{margin:0;color:#6a665e;font-size:10px}.use-cases{display:grid;grid-template-columns:.82fr 1.18fr;gap:65px;margin-top:62px;padding-top:31px;border-top:1px solid var(--line)}.use-case-tags{display:flex;align-content:flex-start;flex-wrap:wrap;gap:8px}.use-case-tags span{border:1px solid var(--line);border-radius:22px;padding:10px 12px;color:#514e48;font:10px 'DM Mono',monospace}.research-image{height:205px;margin:24px 0 0;position:relative;overflow:hidden}.research-image img{width:100%;height:100%;display:block;object-fit:cover;object-position:58% 56%;filter:saturate(.78) contrast(1.08)}.research-image:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,#1f211ecc)}.research-image figcaption{position:absolute;left:14px;bottom:13px;z-index:1;color:#fff;font:8px 'DM Mono',monospace;letter-spacing:.09em}@media(max-width:760px){.ai-native,.use-cases{display:block;margin-top:42px}.ai-native-flow,.use-case-tags{margin-top:27px}.research-image{height:180px}}
</style>`);

const directions = [
  { name: 'Neroli Terrace', family: 'CITRUS · GREEN · MINERAL', copy: 'Golden citrus, water and pale woods in an open, reflective space.', top: 'Bitter orange · Petitgrain · Lemon leaf', heart: 'Neroli · Water accord · Green tea', base: 'Cedarwood · Mineral musk · Warm stone', mood: 'citrus', image: 'assets/neroli-terrace-visual.png', ingredientMood: [['TOP · BRIGHT ARRIVAL', 'Bitter orange · Petitgrain · Lemon leaf', '22% 34%'], ['HEART · OPEN AIR', 'Neroli · Water accord · Green tea', '64% 35%'], ['BASE · SUN-WARMED STONE', 'Cedarwood · Mineral musk · Warm stone', '47% 82%']] },
  { name: 'Coastal Slate', family: 'CITRUS · AQUATIC · MINERAL', copy: 'Salted air and cool mineral surfaces with a clean, windswept finish.', top: 'Bergamot · Sea salt · Black pepper', heart: 'Juniper · Water lily · Slate accord', base: 'Driftwood · Cedar · Soft musk', mood: 'coastal', image: 'assets/coastal-slate-visual.png', ingredientMood: [['TOP · SEA-WORN BRIGHTNESS', 'Bergamot · Sea salt · Black pepper', '24% 29%'], ['HEART · COOL CURRENT', 'Juniper · Water lily · Slate accord', '70% 45%'], ['BASE · TIDELINE', 'Driftwood · Cedar · Soft musk', '48% 80%']] },
  { name: 'Botanical Colonnade', family: 'GREEN · FLORAL · WOODY', copy: 'A planted threshold of crushed leaves, soft floral light and warm timber.', top: 'Fig leaf · Bergamot · Violet leaf', heart: 'Chamomile · Rose · Green tea', base: 'Cedarwood · Moss · Soft amber', mood: 'botanical', image: 'assets/botanical-colonnade-visual.png', ingredientMood: [['TOP · CRUSHED LEAF', 'Fig leaf · Bergamot · Violet leaf', '19% 25%'], ['HEART · GARDEN LIGHT', 'Chamomile · Rose · Green tea', '72% 39%'], ['BASE · PLANTED TIMBER', 'Cedarwood · Moss · Soft amber', '48% 84%']] }
];

const machineOptions = [
  { name: 'SILLAGE ONE', tier: 'FOCUSED ZONE', coverage: 'Small spaces · confirmed after site review', install: 'Freestanding placement · setup by SILLAGE', service: 'Cartridge service', copy: 'A compact SILLAGE system concept for a one-day activation, table or focused room.' },
  { name: 'SILLAGE ROOM', tier: 'ROOM SCALE', coverage: 'Room-scale coverage · confirmed after site review', install: 'Integrated placement · setup by SILLAGE', service: 'Scheduled refill service', copy: 'A discreet SILLAGE system concept for recurring interiors, hospitality and considered daily use.' },
  { name: 'SILLAGE FLOW', tier: 'MULTI-ZONE', coverage: 'Multi-zone planning · confirmed after site review', install: 'Airflow and site integration · expert review', service: 'Scheduled technical service', copy: 'A SILLAGE system concept for larger environments, long-term installations and operating plans.' }
];

document.head.insertAdjacentHTML('beforeend', `<style>
  .machine-visual{height:126px;margin:-20px -20px 18px;position:relative;overflow:hidden;background:linear-gradient(145deg,#e9e7df,#d8d4ca);display:grid;place-items:center}.machine-visual:after{content:'ILLUSTRATIVE DEVICE VIEW';position:absolute;left:12px;bottom:10px;color:#77736c;font:8px 'DM Mono',monospace;letter-spacing:.08em}.device{position:relative;z-index:1;box-shadow:10px 13px 20px #36342a33}.device-pilot{width:66px;height:88px;border-radius:28px 28px 19px 19px;background:linear-gradient(90deg,#343633,#171816 48%,#555751);border:7px solid #2a2b28}.device-pilot:before{content:'';position:absolute;width:19px;height:19px;left:16px;top:13px;border:2px solid #b7a77a;border-radius:50%;box-shadow:0 0 0 5px #252622}.device-wall{width:94px;height:70px;border-radius:5px;background:linear-gradient(135deg,#2a2b28,#0f100e);border:5px solid #383a36}.device-wall:before{content:'';position:absolute;left:17px;right:17px;top:14px;height:4px;background:#c7a875;box-shadow:0 13px #474943,0 26px #474943}.device-hvac{width:112px;height:52px;border-radius:6px;background:linear-gradient(100deg,#1d1e1b,#494b46,#1d1e1b);border:4px solid #2c2e2a}.device-hvac:before{content:'';position:absolute;left:15px;right:15px;top:18px;height:10px;border-top:2px solid #a5a39c;border-bottom:2px solid #a5a39c}.machine-card{overflow:hidden}
</style>`);

function showScreen(number) {
  main.classList.remove('home-active');
  screens.forEach(screen => screen.classList.toggle('active', Number(screen.dataset.screen) === number));
  progress.forEach(step => step.classList.toggle('active', Number(step.dataset.go) === number));
  if (number === 3 || number === 4) renderSolution();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => showScreen(Number(button.dataset.next))));
document.querySelectorAll('[data-back]').forEach(button => button.addEventListener('click', () => showScreen(Number(button.dataset.back))));
progress.forEach(step => step.addEventListener('click', () => showScreen(Number(step.dataset.go))));
function showHome() { main.classList.add('home-active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
document.querySelectorAll('[data-enter]').forEach(button => button.addEventListener('click', () => showScreen(1)));
document.querySelectorAll('[data-home-scroll]').forEach(button => button.addEventListener('click', () => document.querySelector('#home-approach').scrollIntoView({ behavior: 'smooth' })));
document.querySelector('#restart').addEventListener('click', showHome);

const copy = {
  en: { header: 'ARCHITECTURAL & SPATIAL SCENTING · CUSTOMER STUDIO', about: 'About SILLAGE', hero: 'Architecture has<br>an <em>atmosphere.</em><br>We give it scent.', heroLead: 'For brands, events and spaces: choose a ready-made architectural scent or create a signature fragrance, then match it with the right diffusion system.', aiTitle: 'From feeling to <em>fitting system.</em>', aiLead: 'AI structures a multimodal brief, compares scent cues with room conditions and returns a transparent creative and technical starting point. Perfumers and specialists review the final formula, operating profile and hardware fit.', controlTitle: 'Give the room<br>its own <em>atmosphere.</em>', controlLead: 'Light and temperature already have a control layer. SILLAGE gives scent the same consideration: a clear interface for intensity, timing, zones and moments of pause.', useTitle: 'Built for <em>shared experiences.</em>', supportTitle: 'Digital guidance.<br><em>Human support.</em>', aboutTitle: 'Built at the<br><em>AI.WOMEN Hackathon.</em>' },
  de: { header: 'ARCHITEKTUR- & RAUMBEDUFTUNG · CUSTOMER STUDIO', about: 'Über SILLAGE', hero: 'Architektur hat<br>eine <em>Atmosphäre.</em><br>Wir geben ihr Duft.', heroLead: 'Für Marken, Events und Räume: Wählen Sie einen fertigen Architectural Scent oder entwickeln Sie einen Signature-Duft und kombinieren Sie ihn mit dem passenden Diffusionssystem.', aiTitle: 'Vom Gefühl zum<br><em>passenden System.</em>', aiLead: 'KI strukturiert ein multimediales Briefing, gleicht Duft-Cues mit Raumdaten ab und erstellt einen transparenten kreativen und technischen Ausgangspunkt. Parfümeure und Spezialist:innen prüfen Formel, Betriebsprofil und Hardware-Fit.', controlTitle: 'Geben Sie dem Raum<br>seine eigene <em>Atmosphäre.</em>', controlLead: 'Licht und Temperatur haben bereits eine Steuerungsebene. SILLAGE gibt Duft dieselbe Aufmerksamkeit: eine klare Oberfläche für Intensität, Zeitfenster, Zonen und Pausen.', useTitle: 'Für <em>gemeinsame Erlebnisse.</em>', supportTitle: 'Digitale Begleitung.<br><em>Menschlicher Support.</em>', aboutTitle: 'Entstanden beim<br><em>AI.WOMEN Hackathon.</em>' }
};
let language = 'en';
function setLanguage(nextLanguage) {
  language = nextLanguage;
  const text = copy[language];
  document.documentElement.lang = language;
  document.querySelector('[data-i18n="headerMeta"]').textContent = text.header;
  document.querySelector('[data-i18n="aboutButton"]').textContent = text.about;
  document.querySelector('.home-hero h1').innerHTML = text.hero;
  document.querySelector('.home-hero .lede').textContent = text.heroLead;
  document.querySelector('.ai-native h2').innerHTML = text.aiTitle;
  document.querySelector('.ai-native > div > p:not(.eyebrow)').textContent = text.aiLead;
  document.querySelector('.sillage-control h2').innerHTML = text.controlTitle;
  document.querySelector('.use-cases h2').innerHTML = text.useTitle;
  document.querySelector('.support-section h2').innerHTML = text.supportTitle;
  document.querySelector('.about-section h2').innerHTML = text.aboutTitle;
  const localize = (selector, german) => document.querySelectorAll(selector).forEach((element, index) => { if (!element.dataset.en) element.dataset.en = element.innerHTML; element.innerHTML = language === 'de' ? (german[index] || element.dataset.en) : element.dataset.en; });
  localize('.home-hero .eyebrow', ['SILLAGE · KI-NATIVE ARCHITEKTUR- & RAUMBEDUFTUNG']);
  localize('.hero-system span', ['EINE APP · MEHRERE DUFTSYSTEME']);
  localize('.hero-system b', ['Eine SILLAGE-Steuerungsebene für jedes geprüfte kompatible System.']);
  localize('.home-actions button', ['Duftprojekt starten <b>→</b>', 'So funktioniert SILLAGE ↓']);
  localize('.ai-native .eyebrow', ['SILLAGE INTELLIGENCE']);
  localize('.ai-native-flow b', ['Briefing verstehen', 'Atmosphäre erfassen', 'System abstimmen', 'Expert:innen-Review']);
  localize('.ai-native-flow p', ['Text · Bild · Sound · Voice', 'Farbe · Mood · Material · Noten', 'Raum · Luftstrom · Dauer · Maschine', 'Parfümeur · Sicherheit · Installation']);
  localize('.home-promise b', ['100+ Architectural Scents', 'System-agnostische Steuerung', 'Projektgerechte MOQ']);
  localize('.home-promise p', ['Ein von professionellen Parfümeuren entwickeltes Portfolio für einen schnellen Projektstart — oder ein individueller Signature-Duft.', 'Eine SILLAGE-Steuerungsebene kann um geprüfte kompatible Duftsysteme geplant werden, während SILLAGE die Customer Experience bleibt.', 'Vom fokussierten Event bis zum wiederkehrenden Raumprogramm: Menge und Lieferformat richten sich nach dem tatsächlichen Briefing.']);
  localize('.sillage-layer .eyebrow', ['DER SILLAGE VORTEIL']);
  localize('.sillage-layer h2', ['Eine App.<br><em>Mehrere Duftsysteme.</em>']);
  localize('.sillage-layer p:not(.eyebrow)', ['Behalten Sie Ihre Duftwelt an einem Ort. SILLAGE kann geprüfte kompatible Systeme an eine kundenorientierte Steuerungsebene anbinden. Ihr Team steuert Intensität, Zeitpläne, Zonen und Kartuschenservice, ohne für jeden Raum eine neue Oberfläche lernen zu müssen.']);
  localize('.sillage-layer small', ['KEINE ANBIETERNAMEN. EIN SILLAGE ERLEBNIS. KOMPATIBILITÄT WIRD PRO PROJEKT BESTÄTIGT.']);
  localize('.layer-app span', ['SILLAGE APP']);
  localize('.layer-app b', ['Ihre Atmosphäre<br>steuern']);
  localize('.layer-app i', ['Intensität · Zeitpläne · Zonen']);
  localize('.layer-systems span', ['FOKUSSIERTE ZONE', 'RAUMSKALA', 'MEHRZONEN']);
  localize('.sillage-control .eyebrow', ['SILLAGE CONTROL · SYSTEM-AGNOSTISCH']);
  localize('.sillage-control p:not(.eyebrow)', ['Licht und Temperatur haben bereits eine Steuerungsebene. SILLAGE gibt Duft dieselbe Aufmerksamkeit: eine klare Oberfläche für Intensität, Zeitfenster, Zonen und Pausen — konzipiert für geprüfte kompatible Duftsysteme.']);
  localize('.sillage-control small', ['CONTROL-READY KONZEPT · KOMPATIBILITÄT, SITE-SETUP UND LIVE-INTEGRATION WERDEN PRO PROJEKT BESTÄTIGT.']);
  localize('.compatibility-strip span', ['SILLAGE CONTROL LAYER']);
  localize('.compatibility-strip b', ['Geprüfte kompatible Systeme']);
  localize('.use-cases .eyebrow', ['WO SILLAGE ZUHAUSE IST']);
  localize('.use-cases p:not(.eyebrow)', ['Vom einmaligen Markenmoment bis zum wiederkehrenden Architectural-Scent-Programm.']);
  localize('.use-case-tags span', ['Markenevents', 'Messen', 'Museen & Ausstellungen', 'Retail', 'Hotels & Resorts', 'Spas, Bäder & Saunas', 'Immersive Installationen', 'Kinos & Escape Rooms', 'Healthcare · nicht-klinische Bereiche']);
  localize('.support-section .eyebrow', ['SILLAGE SERVICE']);
  localize('.support-section > div > p:not(.eyebrow)', ['Ein Duftkartuschen-Abo versorgt Ihr System im Rhythmus Ihres Projekts. Im Kundeninterface beantwortet der SILLAGE Assistant alltägliche Duft- und Gerätefragen; ein technisches Team übernimmt Installation, Setup und Support vor Ort.']);
  localize('.service-grid span', ['KARTUSCHEN-SERVICE', 'KUNDENINTERFACE', 'VOR-ORT-TEAM']);
  localize('.service-grid b', ['Geliefert, wenn<br>Ihr Raum es braucht.', 'SILLAGE Assistant<br>für schnelle Antworten.', 'Menschen für den<br>physischen Raum.']);
  localize('.service-grid p', ['Regelmäßige Nachfüllungen, flexibler Rhythmus und klare Austauschhinweise.', 'Für eingeloggte Kund:innen bei Fragen zu Produkt, Duft und Technik.', 'Installation, Kalibrierung und Expert:innen-Support, wenn ein Raum ein menschliches Auge braucht.']);
  localize('#assistant-button', ['Kundenzugang →']);
  localize('.about-section .eyebrow', ['ÜBER SILLAGE']);
  localize('.about-section > div > p:not(.about-placeholder)', ['Dies ist ein About-Platzhalter. SILLAGE entstand als KI-natives Konzept, um Architectural Scent Planning klarer, visueller und steuerbarer zu machen. Vor dem Launch durch Gründungsgeschichte, Team und Unternehmensdetails ersetzen.']);
  localize('.about-placeholder', ['PLATZHALTER · AI.WOMEN HAMBURG HACKATHON · [DATUM / TEAM / UNTERNEHMENSDETAILS]']);
  localize('.home-footer-cta p', ['Ein System für einen ausdrucksstärkeren Raum.']);
  localize('.home-footer-cta button', ['Duftbriefing erstellen <b>→</b>']);
  localize('.site-footer > span', ['© [JAHR] SILLAGE · PLATZHALTER']);
  localize('.site-footer nav button', ['Impressum', 'Datenschutz', 'Cookie-Einstellungen', 'AGB', 'Widerruf', 'Lieferung & Abo', 'Barrierefreiheit', 'Produktinformationen']);
  document.querySelector('#language-toggle').textContent = language === 'en' ? 'DE' : 'EN';
}
document.querySelector('#language-toggle').addEventListener('click', () => setLanguage(language === 'en' ? 'de' : 'en'));

brief.addEventListener('input', () => {
  characterCount.textContent = `${brief.value.length} / 900`;
  briefState.textContent = brief.value.trim() ? 'SCENT STORY ADDED' : 'READY FOR YOUR STORY';
});
document.querySelectorAll('[data-prompt]').forEach(button => button.addEventListener('click', () => {
  const prompt = button.dataset.prompt;
  brief.value = `${brief.value}${brief.value ? ' ' : ''}${prompt}: `;
  brief.focus();
  brief.dispatchEvent(new Event('input'));
}));

document.querySelectorAll('[data-upload]').forEach(button => button.addEventListener('click', () => document.querySelector(`#${button.dataset.upload}`).click()));
['image-upload', 'audio-upload'].forEach(id => document.querySelector(`#${id}`).addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;
  attachmentStatus.textContent = `${id === 'image-upload' ? 'Moodboard' : 'Sound'} attached locally: ${file.name}`;
  event.target.closest('.input-ways').querySelector(`[data-upload="${id}"]`).classList.add('active');
}));

document.querySelector('#voice-button').addEventListener('click', async event => {
  const button = event.currentTarget;
  if (recorder?.state === 'recording') {
    recorder.stop();
    recordingStream.getTracks().forEach(track => track.stop());
    return;
  }
  try {
    recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(recordingStream);
    recorder.onstop = () => { button.classList.remove('active'); button.querySelector('b').textContent = 'Voice note attached'; attachmentStatus.textContent = 'Voice note attached locally. It is not sent anywhere in this prototype.'; };
    recorder.start();
    button.classList.add('active');
    button.querySelector('b').textContent = 'Recording — tap to stop';
    attachmentStatus.textContent = 'Recording locally…';
  } catch {
    attachmentStatus.textContent = 'Microphone access was not granted. You can still use text, an image or a song.';
  }
});

document.querySelectorAll('.choice-grid button').forEach(button => button.addEventListener('click', () => {
  const field = button.closest('.choice-grid').dataset.field;
  button.closest('.choice-grid').querySelectorAll('button').forEach(item => item.classList.toggle('selected', item === button));
  selectedTechnical[field] = button.dataset.value;
}));

function suggestedDirection() {
  const words = `${brief.value} ${selectedTechnical.format}`.toLowerCase();
  if (/sea|coast|marine|water|museum|blue/.test(words)) return directions[1];
  if (/garden|green|flower|botanical|retail/.test(words)) return directions[2];
  return directions[0];
}

function renderDirections() {
  const recommended = suggestedDirection().name;
  selectedDirection = recommended;
  document.querySelector('#direction-cards').innerHTML = directions.filter(direction => direction.name === recommended).map(direction => `<article class="direction-card active"><span>RECOMMENDED FOR YOUR BRIEF</span><b>${direction.name}</b><p>${direction.copy}</p><small>Refined with you in the personal consultation.</small></article>`).join('');
}

function renderArchitecture(direction) {
  document.querySelector('#solution-title').textContent = direction.name;
  document.querySelector('#solution-copy').textContent = direction.copy;
  document.querySelector('#top-notes').textContent = direction.top;
  document.querySelector('#heart-notes').textContent = direction.heart;
  document.querySelector('#base-notes').textContent = direction.base;
  document.querySelector('#ingredient-caption').textContent = `${direction.name}: an ingredient-led visual sequence from top to heart to base.`;
  document.querySelector('#ingredient-moodboard').innerHTML = direction.ingredientMood.map(([label, ingredients, position], index) => `<article class="ingredient-panel ${['top', 'heart', 'base'][index]}" style="--mood-image:url('${direction.image}');--mood-position:${position}"><span>${label}</span><b>${['Lift', 'Character', 'Residence'][index]}</b><p>${ingredients}</p></article>`).join('');
  const mainImage = document.querySelector('.image-main img');
  const detailImage = document.querySelector('.image-detail img');
  const materialCard = document.querySelector('.material-card');
  const visualSettings = {
    citrus: { position: '20% 50%', filter: 'saturate(1.12) brightness(1.06) contrast(1.02)', card: 'Warm stone<br>Green citrus<br>Cool water' },
    coastal: { position: '76% 48%', filter: 'saturate(.72) brightness(.92) hue-rotate(12deg)', card: 'Salted air<br>Cool slate<br>Soft driftwood' },
    botanical: { position: '10% 35%', filter: 'saturate(1.18) brightness(.93) hue-rotate(-8deg)', card: 'Leaf shade<br>Soft floral<br>Warm timber' }
  };
  const architecturalScenes = {
    Home: { label: 'FUTURE HOME', image: 'assets/future-home-reference.png' },
    Gallery: { label: 'FUTURE GALLERY', image: 'assets/botanical-colonnade-visual.png' },
    Museum: { label: 'FUTURE MUSEUM', image: 'assets/coastal-slate-visual.png' },
    'Hotel / hospitality': { label: 'ARCHITECTURAL HOSPITALITY', image: 'assets/future-home-reference.png' },
    'Fair / exhibition': { label: 'EXHIBITION ENVIRONMENT', image: 'assets/botanical-colonnade-visual.png' },
    'Immersive installation': { label: 'IMMERSIVE ENVIRONMENT', image: 'assets/coastal-slate-visual.png' }
  };
  const setting = visualSettings[direction.mood];
  const scene = architecturalScenes[selectedTechnical.format] || { label: 'ARCHITECTURAL ROOM', image: 'assets/future-home-reference.png' };
  mainImage.src = direction.image;
  detailImage.src = scene.image;
  mainImage.style.objectPosition = setting.position;
  mainImage.style.filter = setting.filter;
  detailImage.style.objectPosition = setting.position;
  detailImage.style.filter = setting.filter;
  materialCard.querySelector('b').innerHTML = setting.card;
  document.querySelector('.visual-label span').textContent = `${direction.name.toUpperCase()} · ARCHITECTURAL MOOD`;
  mainImage.alt = `${direction.name.toLowerCase()} visual mood for the selected scent`;
  detailImage.alt = `${scene.label.toLowerCase()} spatial setting reference`;
}

function sortedMachines() {
  const area = document.querySelector('#room-area').value;
  if (area === 'Up to 35 m²') return [machineOptions[0], machineOptions[1], machineOptions[2]];
  if (area === '35–100 m²') return [machineOptions[1], machineOptions[0], machineOptions[2]];
  if (area === '100–550 m²' || area === '550 m²+') return [machineOptions[2], machineOptions[1], machineOptions[0]];
  return machineOptions;
}

function renderMachines() {
  const area = document.querySelector('#room-area').value;
  const space = selectedTechnical.space || 'room setting not yet specified';
  const duration = document.querySelector('#event-duration').value;
  document.querySelector('#machine-summary').textContent = `This SILLAGE system concept considers ${area.toLowerCase()} · ${space}. Final coverage, hardware and installation are confirmed after expert site review.`;
  const deliveryTitle = document.querySelector('#delivery-title');
  const deliverySummary = document.querySelector('#delivery-summary');
  if (duration === 'One day' || duration === '2–7 days') { deliveryTitle.textContent = 'A flexible event installation, ready when the room opens.'; deliverySummary.textContent = `For a ${duration.toLowerCase()} activation, we will prepare a rental-led setup and a one-time scent delivery, with on-demand technical support if required.`; }
  else if (duration === 'Longer than a week' || duration === 'Permanent / recurring') { deliveryTitle.textContent = 'A lasting scent program, kept in rhythm.'; deliverySummary.textContent = 'For longer use, we will propose purchase or installed hardware with a cartridge subscription, digital support and optional in-person consulting.'; }
  else { deliveryTitle.textContent = 'A considered installation, supported by people.'; deliverySummary.textContent = 'Choose the duration when you are ready. We will recommend the right rental, purchase or subscription format for the project.'; }
  document.querySelector('#machine-cards').innerHTML = sortedMachines().slice(0, 1).map(machine => `<article class="machine-card"><div class="machine-visual"><div class="device ${machine.name.includes('ONE') ? 'device-pilot' : machine.name.includes('ROOM') ? 'device-wall' : 'device-hvac'}"></div></div><span>SILLAGE SYSTEM CONCEPT · ${selectedDirection.toUpperCase()}</span><b>${machine.name}</b><p>${machine.copy}</p><dl><div><dt>Coverage</dt><dd>${machine.coverage}</dd></div><div><dt>Installation</dt><dd>${machine.install}</dd></div><div><dt>Maintenance</dt><dd>${machine.service}</dd></div></dl><button data-consult="${machine.name}">Review this setup with a consultant</button></article>`).join('');
  document.querySelectorAll('[data-consult]').forEach(button => button.addEventListener('click', () => { const machine = button.dataset.consult; openConsultation(`Human review · ${machine}`, `A SILLAGE consultant will confirm availability, the appropriate hardware, site compatibility and the next step with you.`); }));
}

function renderSolution() {
  renderDirections();
  const direction = directions.find(item => item.name === selectedDirection);
  renderArchitecture(direction);
  renderMachines();
}

const consultationDialog = document.querySelector('#consultation-dialog');
const legalDialog = document.querySelector('#legal-dialog');
const legalContent = document.querySelector('#legal-content');
const legalCopy = {
  imprint: `<section class="legal-block"><p class="eyebrow">LEGAL PLACEHOLDER · GERMANY</p><h3>Imprint / Impressum</h3><p class="placeholder">Replace every bracketed field before publication. This template is not legal advice.</p><h4>Information according to § 5 DDG</h4><p>[Company legal name / legal form]<br>[Street and number]<br>[Postal code, city, Germany]</p><h4>Represented by</h4><p>[Managing director / authorised representative]</p><h4>Contact</h4><p>Email: [email address]<br>Phone: [telephone number]</p><h4>Register and VAT</h4><p>[Register court / register number, if applicable]<br>[VAT ID or business ID, if applicable]</p><h4>Responsible for editorial content</h4><p>[Name and address, if required under § 18(2) MStV]</p><h4>Consumer dispute resolution</h4><p>[State whether you are willing or obliged to participate in dispute resolution proceedings.]</p></section>`,
  privacy: `<section class="legal-block"><p class="eyebrow">LEGAL PLACEHOLDER · PRIVACY</p><h3>Privacy / Datenschutz</h3><p class="placeholder">Replace this with an organisation-specific privacy notice reviewed by qualified counsel or a privacy professional before launch.</p><h4>Controller</h4><p>[Company legal name, contact details and, if applicable, data protection officer]</p><h4>Data processed in this prototype</h4><p>Briefing text, optional uploaded files and contact-form data are currently kept in the browser prototype and are not sent by this static demo. A live deployment must document each processing purpose, legal basis, retention period, recipients/processors and data-subject rights.</p><h4>AI and customer assistant</h4><p>Describe the actual AI provider, processor agreement, hosting region, input filtering, retention settings and whether customer data is used for model training. Do not activate the assistant until this review is complete.</p><h4>Your rights</h4><p>Include access, rectification, erasure, restriction, objection, portability and the right to complain to a supervisory authority.</p></section>`,
  cookies: `<section class="legal-block"><p class="eyebrow">COOKIE SETTINGS</p><h3>Your privacy choices</h3><p>This prototype uses no analytics, advertising or optional third-party cookies. Language selection is only active during the current page session.</p><h4>Essential operation</h4><p>Required for the website to function. Always active.</p><h4>Optional services</h4><p>Analytics, marketing tags, external fonts, embeds and an AI assistant must remain off until configured, documented and — where required — consented to. Implement a real consent tool before adding any of them.</p></section>`,
  terms: `<section class="legal-block"><p class="eyebrow">LEGAL PLACEHOLDER · COMMERCIAL TERMS</p><h3>Terms / AGB</h3><p class="placeholder">Have this reviewed and replaced before publication. It must reflect the actual SILLAGE contracting party and service model.</p><h4>Define the commercial model</h4><p>[B2B only or B2C / mixed customer model] · [scope of the offer] · [quotation and contract conclusion] · [rental, purchase and cartridge-subscription terms] · [cancellation] · [liability] · [applicable law and venue where valid].</p></section>`,
  withdrawal: `<section class="legal-block"><p class="eyebrow">LEGAL PLACEHOLDER · CONSUMER RIGHTS</p><h3>Withdrawal / Widerruf</h3><p class="placeholder">Whether and how withdrawal rights apply depends on the real customer type and contract path. Obtain legal advice before enabling an online order.</p><h4>If consumer distance sales are offered</h4><p>Provide the required withdrawal information, model form, deadline, return conditions and any lawful exceptions before the customer places a binding order. Do not state that withdrawal is excluded without a product-specific legal review.</p></section>`,
  commerce: `<section class="legal-block"><p class="eyebrow">LEGAL PLACEHOLDER · ORDER & SUBSCRIPTION</p><h3>Delivery, payment & subscription</h3><p class="placeholder">Add this before any live checkout, rental agreement or recurring cartridge subscription.</p><h4>Information to complete</h4><p>[Final price including taxes] · [recurring total and billing rhythm] · [minimum term and cancellation] · [deposit, delivery and installation lead times] · [payment methods] · [customer-service and complaint route] · [statutory warranty information]. This prototype creates a consultation request only; it does not complete an order.</p></section>`,
  accessibility: `<section class="legal-block"><p class="eyebrow">LEGAL PLACEHOLDER · ACCESSIBILITY</p><h3>Accessibility / Barrierefreiheit</h3><p class="placeholder">Assess the actual service against the German Accessibility Strengthening Act (BFSG) before launch, especially if consumer e-commerce is enabled.</p><h4>Publication placeholder</h4><p>[Accessibility statement] · [known limitations] · [feedback contact] · [date and method of assessment] · [enforcement/contact information, if applicable]. Build and test keyboard, focus, contrast, forms and assistive-technology support in the production site.</p></section>`,
  product: `<section class="legal-block"><p class="eyebrow">LEGAL PLACEHOLDER · PRODUCT DOCUMENTATION</p><h3>Product & fragrance information</h3><p class="placeholder">Attach real, product-specific documentation before delivery. This page does not substitute for it.</p><h4>Documentation to prepare</h4><p>[IFRA conformity / intended-use information] · [safety data and CLP / REACH information where applicable] · [machine instructions] · [maintenance and disposal] · [emergency and support contact]. Final hardware, scent format and coverage are confirmed only after site review.</p></section>`
};
document.querySelectorAll('[data-legal]').forEach(button => button.addEventListener('click', () => { legalContent.innerHTML = legalCopy[button.dataset.legal]; legalDialog.showModal(); }));
document.querySelector('#assistant-button').addEventListener('click', () => document.querySelector('#assistant-dialog').showModal());
document.querySelector('#assistant-close').addEventListener('click', () => document.querySelector('#assistant-dialog').close());
function openConsultation(title, copy) { document.querySelector('#consultation-title').textContent = title; document.querySelector('#consultation-copy').textContent = copy; document.querySelector('#dialog-status').textContent = 'Prototype only — this form does not send data.'; consultationDialog.showModal(); }
document.querySelector('#sample-button').addEventListener('click', () => openConsultation(`Order a ${selectedDirection} sample`, 'Request a sample of the selected scent direction. A SILLAGE expert will confirm format, availability and delivery.'));
document.querySelector('#consult-machine-button').addEventListener('click', () => openConsultation(`Personal proposal · ${selectedDirection}`, 'Your selected scent and machine preferences will be prepared for a SILLAGE consultant. We will confirm the final proposal together.'));
document.querySelectorAll('.dialog-close').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelector('#consultation-form').addEventListener('submit', event => { event.preventDefault(); consultationDialog.close(); showScreen(5); });
