import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Head from "next/head";
import axios from "axios";
import Preview from "../components/Preview";

// i18n dictionary (EN / MK)
type Lang = "en" | "mk";
const DICT: Record<Lang, Record<string, string>> = {
  en: {
    analyzing_layout: "Analyzing layout",
    generating_structure: "Generating structure",
    optimizing_spacing: "Optimizing spacing",
    styling_components: "Styling components",
    preloading_fonts: "Preloading fonts",
    final_touches: "Final touches",

    app_title: "✏️ program.ly",
    text: "Text",
    url: "URL",
    placeholder_text: "Describe your website…",
    placeholder_url: "Paste a URL…",
    generate: "Generate",
    generating: "Generating…",
    copy: "Coming soon",
    download: "Coming soon",
    contact_us: "Contact Us",

    variant: "Variant",
    standard: "Standard",
    creative: "Creative",
    status_default: "Generate a preview to see what your website could look like",
    status_success: "If you like what you see, please contact us for a full product at a cheap price",
    status_blocked: "You are previewing a demo. If you are interested in a full website, please contact us",

    device: "Device",
    desktop: "Desktop",
    mobile: "Mobile",

    desktop_mvp: "Desktop MVP",
    preview_here: "Your generated website preview will appear here.",
    scroll_inside: "Scroll inside preview",

    modal_title: "Contact us",
    email: "Email",
    phone: "Phone",
    note: "We’ll build your full site fast and affordably.",
    send_email: "Send us an email",

    lang_toggle: "MK",

    // Intro overlay
    intro_title: "Welcome to program.ly",
    intro_what_title: "What is this tool?",
    intro_what_body:
      "An AI-powered sandbox that instantly generates concept homepages from a URL or a short brief — so you can preview styles and structures before committing.",
    intro_whytool_title: "Why should I use it?",
    intro_whytool_body:
      "By visualising different versions of your existing or brand-new website, you can expand your horizons, discover what you like, and we can demonstrate what we can deliver.",
    intro_whywebsite_title: "Why do I need a website?",
    intro_whywebsite_1: "Credibility — A website builds trust with clients.",
    intro_whywebsite_2: "Utility — A central hub for your products and services.",
    intro_whywebsite_3: "Marketing — Your website works 24/7.",
    intro_whywebsite_4: "Opportunities — A constant channel for new partnerships.",
    intro_how_title: "How do I use this tool?",
    intro_how_1: "Paste a URL or write a short brief (11+ words).",
    intro_how_2: "Click Generate to create a concept homepage.",
    intro_how_3: "Toggle Standard/Creative and scroll the preview.",
    intro_how_4: "It’s fully free to try — contact us for a full build.",
    intro_contact_title: "Contact",
    intro_contact_prompt:
      "Ready to turn a concept into a real site? Reach out — we’ll build it fast and affordably.",
    intro_button: "Generate",
  },
  mk: {
    analyzing_layout: "Анализа на распоред",
    generating_structure: "Генерирање структура",
    optimizing_spacing: "Оптимизација на размак",
    styling_components: "Стилизирање компоненти",
    preloading_fonts: "Вчитување фонтови",
    final_touches: "Завршни допири",

    app_title: "✏️ program.ly",
    text: "Текст",
    url: "URL",
    placeholder_text: "Опишете ја вашата веб-страница…",
    placeholder_url: "Внесете URL…",
    generate: "Генерирај",
    generating: "Се генерира…",
    copy: "Наскоро",
    download: "Наскоро",
    contact_us: "Контактирајте нè",

    variant: "Варијанта",
    standard: "Стандард",
    creative: "Креативна",
    status_default: "Генерирајте преглед за да видите како може да изгледа вашата страница",
    status_success: "Ако ви се допаѓа, контактирајте нè за целосен производ по поволна цена",
    status_blocked: "Ова е демо преглед. За целосна веб-страница, ве молиме контактирајте нè",

    device: "Уред",
    desktop: "Десктоп",
    mobile: "Мобилен",

    desktop_mvp: "Десктоп MVP",
    preview_here: "Тука ќе се појави прегледот на генерираната страница.",
    scroll_inside: "Лизгајте во рамката",

    modal_title: "Контактирајте нè",
    email: "Е-пошта",
    phone: "Телефон",
    note: "Ќе ја изработиме вашата страница брзо и поволно.",
    send_email: "Испратете е-пошта",

    lang_toggle: "EN",

    // Intro overlay
    intro_title: "Добредојдовте во program.ly",
    intro_what_title: "Што е оваа алатка?",
    intro_what_body:
      "AI-алатка што моментално генерира концепт-почетни страници од URL или краток опис — за да видите како може да изгледа вашата веб-страница.",
    intro_whytool_title: "Зошто да ја користам?",
    intro_whytool_body:
      "Со визуелизација на различни верзии на постојна или нова страница, ги проширувате хоризонтите, откривате што ви се допаѓа, а ние покажуваме што можеме да направиме.",
    intro_whywebsite_title: "Зошто ми треба веб-страница?",
    intro_whywebsite_1: "Кредибилитет – Веб сајтот ја гради довербата кај клиентите.",
    intro_whywebsite_2: "Корисност – Централно место за ваши продукти и услуги.",
    intro_whywebsite_3: "Реклама – Веб сајтот работи за вас 24/7.",
    intro_whywebsite_4: "Бизнис можности – Постојан канал за нови партнерства.",
    intro_how_title: "Како се користи оваа алатка?",
    intro_how_1: "Залепете URL или напишете краток опис (11+ зборови).",
    intro_how_2: "Притиснете „Генерирај“ за концепт-почетна страница.",
    intro_how_3: "Менувајте Стандард/Креативна и лизгајте го прегледот.",
    intro_how_4: "Целосно бесплатно за проба — за изработка контактирајте нè.",
    intro_contact_title: "Контакт",
    intro_contact_prompt:
      "Подготвени сте од концепт да направиме реален сајт? Контактирајте нè — работиме брзо и поволно.",
    intro_button: "Генерирај",
  }
};

function useLoaderPhrases(lang: Lang) {
  const phrases = [
    DICT[lang].analyzing_layout,
    DICT[lang].generating_structure,
    DICT[lang].optimizing_spacing,
    DICT[lang].styling_components,
    DICT[lang].preloading_fonts,
    DICT[lang].final_touches,
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % phrases.length), 1200);
    return () => clearInterval(id);
  }, [lang]);
  return phrases[i];
}

function Loader({ phrase }: { phrase: string }) {
  return (
    <div className="loader-overlay">
      <div className="loader-dots"><span className="loader-dot"/><span className="loader-dot"/><span className="loader-dot"/></div>
      <div className="loader-phrase">{phrase}</div>
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const t = (k: string) => DICT[lang][k] || k;

  const [inputType, setInputType] = useState<"url" | "prompt">("url");
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const [normalHtml, setNormalHtml] = useState("");
  const [creativeHtml, setCreativeHtml] = useState("");
  const [variant, setVariant] = useState<"normal" | "creative">("normal");

  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [hintHidden, setHintHidden] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showIntro, setShowIntro] = useState(true); // NEW: intro overlay on first load

  // Status message + tone
  const [statusMsg, setStatusMsg] = useState(t("status_default"));
  const [statusTone, setStatusTone] = useState<"neutral" | "positive" | "negative">("neutral");

  // viewport-fit logic
  const headerRef = useRef<HTMLElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const [winW, setWinW] = useState(0);
  const [previewH, setPreviewH] = useState(560); // sane default

  const hasPreview = Boolean(normalHtml || creativeHtml);

  // recompute layout
  const recomputeLayout = () => {
    const hHeader = headerRef.current?.offsetHeight ?? 0;
    const hCtrl   = controlRef.current?.offsetHeight ?? 0;
    const vh = window.innerHeight;
    const GAPS = Math.max(24, Math.min(48, Math.round(vh * 0.04)));
    const h = Math.max(360, vh - hHeader - hCtrl - GAPS);
    setPreviewH(h);
    setWinW(window.innerWidth);
  };

  useLayoutEffect(() => {
    recomputeLayout();
    const onResize = () => recomputeLayout();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // pulse input on mount / switch
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.classList.remove("pulse-blue");
    void el.offsetWidth;
    el.classList.add("pulse-blue");
    const tmo = setTimeout(() => el.classList.remove("pulse-blue"), 2200);
    return () => clearTimeout(tmo);
  }, [inputType, lang]);

  // pulse status + flash tones
  useEffect(() => {
    const el = statusRef.current;
    if (!el) return;
    el.classList.remove("pulse-blue", "flash-green", "flash-red");
    void el.offsetWidth;
    el.classList.add("pulse-blue");
    if (statusTone === "positive") el.classList.add("flash-green");
    if (statusTone === "negative") el.classList.add("flash-red");
  }, [statusMsg, statusTone]);

  // keep default status in sync with language
  useEffect(() => {
    if (!hasPreview) setStatusMsg(t("status_default"));
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = (msg: string, tone: "neutral" | "positive" | "negative" = "neutral") => {
    setStatusMsg(msg);
    setStatusTone(tone);
  };

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNormalHtml("");
    setCreativeHtml("");
    setVariant("normal");
    setHintHidden(false);

    try {
      const payload = inputType === "url" ? { url, mode: "both" } : { prompt, mode: "both" };
      const { data } = await axios.post("/api/generate", payload);

      const gotNormal = typeof data?.normal?.html === "string" && data.normal.html.trim().length > 0;
      const gotCreative = typeof data?.creative?.html === "string" && data.creative.html.trim().length > 0;

      if (!gotNormal && !gotCreative) {
        throw new Error(data?.message || "No content returned (possibly rate limit or safety block).");
      }

      if (gotNormal) setNormalHtml(data.normal.html);
      if (gotCreative) setCreativeHtml(data.creative.html);

      updateStatus(t("status_success"), "positive");

      setTimeout(() => {
        recomputeLayout();
        stageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 40);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to generate site. Please try again.";
      updateStatus(msg, "negative");
      if (inputRef.current) {
        inputRef.current.classList.remove("pulse-blue", "flash-red");
        void inputRef.current.offsetWidth;
        inputRef.current.classList.add("pulse-blue", "flash-red");
      }
    } finally {
      setLoading(false);
    }
  };

  // Device sizing (mobile = portrait 16:9)
  const MOBILE_RATIO = 16 / 9;
  const desktopWidth = Math.max(320, Math.min(1100, 0.94 * (winW || 1100)));
  const desktopDims = { width: `${desktopWidth}px`, height: `${previewH}px` };

  const maxWMobile = Math.min(0.92 * (winW || 420), desktopWidth);
  let mobileW = maxWMobile;
  let mobileH = mobileW * MOBILE_RATIO;
  if (mobileH > previewH) {
    mobileH = previewH;
    mobileW = mobileH / MOBILE_RATIO;
  }
  const mobileDims = { width: `${mobileW}px`, height: `${mobileH}px` };
  const frameDims = device === "desktop" ? desktopDims : mobileDims;
  const frameWidthStyle: React.CSSProperties = { width: frameDims.width };

  // Loader phrase (i18n)
  const loaderPhrase = useLoaderPhrases(lang);

  // When intro closes, focus input for convenience
  const closeIntro = () => {
    setShowIntro(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="main-bg">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <title>{t("app_title")}</title>
      </Head>

      {/* NAVBAR */}
      <header className="header" ref={headerRef}>
        <div className="logo" aria-label="program.ly">
          <span className="logo-main">program</span>
          <span className="logo-accent">.ly</span>
        </div>

        <form className="input-bar" onSubmit={generate}>
          <div className="type-toggle-group">
            <button type="button" className={`type-toggle-btn ${inputType === "prompt" ? "active" : ""}`} onClick={() => setInputType("prompt")}>{t("text")}</button>
            <button type="button" className={`type-toggle-btn ${inputType === "url" ? "active" : ""}`} onClick={() => setInputType("url")}>{t("url")}</button>
          </div>
          <input
            ref={inputRef}
            className="main-input"
            placeholder={inputType === "prompt" ? t("placeholder_text") : t("placeholder_url")}
            value={inputType === "prompt" ? prompt : url}
            onChange={(e) => (inputType === "prompt" ? setPrompt(e.target.value) : setUrl(e.target.value))}
          />
          <button className="generate-btn" type="submit" disabled={loading}>
            {loading ? t("generating") : (<><span className="sparkle">✨</span>{t("generate")}</>)}
          </button>
        </form>

        <div className="header-icons">
          <button className="icon-btn" title={t("copy")} disabled aria-disabled="true">📋</button>
          <button className="icon-btn" title={t("download")} disabled aria-disabled="true">⤓</button>

          {/* Language toggle */}
          <button
            className="lang-toggle"
            onClick={() => setLang((l) => (l === "en" ? "mk" : "en"))}
            aria-label="Toggle language"
            title={DICT[lang].lang_toggle}
          >
            {DICT[lang].lang_toggle}
          </button>

          <button className="cta-contact" onClick={() => setShowContact(true)}>
            {t("contact_us")}
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="shell">
        {/* CONTROL PANEL — width matches device frame */}
        <div className="control-wrap">
          <div
            ref={controlRef}
            className={`control-bar ${device === "mobile" ? "compact" : ""}`}
            style={frameWidthStyle}
            role="group"
            aria-label="Preview controls"
          >
            <div className="group" aria-label="Variant">
              <span className="group-label">{t("variant")}</span>
              <div className="segment">
                <button
                  className={`seg-btn ${variant === "normal" ? "active" : ""}`}
                  onClick={() => setVariant("normal")}
                  disabled={!hasPreview}
                >
                  {t("standard")}
                </button>
                <button
                  className={`seg-btn ${variant === "creative" ? "active" : ""}`}
                  onClick={() => setVariant("creative")}
                  disabled={!hasPreview}
                >
                  {t("creative")}
                </button>
              </div>
            </div>

            {/* STATUS */}
            <div ref={statusRef} className="status-pill" role="status" aria-live="polite">
              {statusMsg}
            </div>

            <div className="group" aria-label="Device">
              <span className="group-label">{t("device")}</span>
              <div className="segment">
                <button className={`seg-btn ${device === "desktop" ? "active" : ""}`} onClick={() => setDevice("desktop")}>{t("desktop")}</button>
                <button
                  className={`seg-btn ${device === "mobile" ? "active" : ""}`}
                  onClick={() => setDevice("mobile")}
                  disabled
                  title="Mobile preview coming soon"
                  aria-disabled="true"
                >
                  {t("mobile")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PREVIEW STAGE */}
        <section ref={stageRef} className="stage">
          <div className="preview-card" style={frameDims}>
            <div className="frame-topbar" />

            {loading && <Loader phrase={loaderPhrase} />}

            {!loading && (
              <>
                {variant === "normal"
                  ? (normalHtml ? (
                      <Preview
                        html={normalHtml}
                        onUserScroll={() => setHintHidden(true)}
                        onLinkBlocked={() => {
                          setShowContact(true);
                          updateStatus(t("status_blocked"), "neutral");
                        }}
                      />
                    ) : (
                      <div className="placeholder">
                        <div className="mvp-icon">🖥️</div>
                        <div className="mvp-title">{t("desktop_mvp")}</div>
                        <p>{t("preview_here")}</p>
                      </div>
                    ))
                  : (creativeHtml ? (
                      <Preview
                        html={creativeHtml}
                        onUserScroll={() => setHintHidden(true)}
                        onLinkBlocked={() => {
                          setShowContact(true);
                          updateStatus(t("status_blocked"), "neutral");
                        }}
                      />
                    ) : (
                      <div className="placeholder">
                        <div className="mvp-icon">🖥️</div>
                        <div className="mvp-title">{t("desktop_mvp")}</div>
                        <p>{t("preview_here")}</p>
                      </div>
                    ))
                }
              </>
            )}

            {Boolean(normalHtml || creativeHtml) && !loading && (
              <div className={`hint ${hintHidden ? "hide" : ""}`} aria-hidden={hintHidden}>
                <span className="material-symbols-outlined">south</span>
                {t("scroll_inside")}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* CONTACT MODAL */}
      {showContact && (
        <div className="modal-backdrop" onClick={() => setShowContact(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={t("contact_us")}>
            <div className="modal-head">
              <div className="modal-title">
                <span className="material-symbols-outlined">call</span>
                {t("modal_title")}
              </div>
              <button className="modal-close" onClick={() => setShowContact(false)} aria-label="Close">✕</button>
            </div>
            <div className="modal-body">
              <div className="contact-row">
                <span className="material-symbols-outlined">mail</span>
                <a href="mailto:ilievskinenad04@gmail.com">ilievskinenad04@gmail.com</a>
              </div>
              <div className="contact-row">
                <span className="material-symbols-outlined">phone_iphone</span>
                <a href="tel:+38975692136">+38975692136</a>
              </div>
              <p className="modal-note">{t("note")}</p>
              <button className="modal-cta" onClick={() => (window.location.href = "mailto:ilievskinenad04@gmail.com")}>
                {t("send_email")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTRO OVERLAY (large, nearly full-screen) */}
      {showIntro && (
        <div className="intro-backdrop">
          <div className="intro-card" role="dialog" aria-modal="true" aria-label={t("intro_title")}>
            <div className="intro-head">
              <div className="intro-title">
                <span className="material-symbols-outlined">auto_awesome</span>
                {t("intro_title")}
              </div>
              <button className="intro-close" onClick={closeIntro} aria-label="Close">✕</button>
            </div>

            <div className="intro-body">
              <section className="intro-section">
                <h3 className="intro-section-title">
                  <span className="material-symbols-outlined">help</span>
                  {t("intro_what_title")}
                </h3>
                <p className="intro-text">{t("intro_what_body")}</p>
              </section>

              <section className="intro-section">
                <h3 className="intro-section-title">
                  <span className="material-symbols-outlined">lightbulb</span>
                  {t("intro_whytool_title")}
                </h3>
                <p className="intro-text">{t("intro_whytool_body")}</p>
              </section>

              <section className="intro-section">
                <h3 className="intro-section-title">
                  <span className="material-symbols-outlined">public</span>
                  {t("intro_whywebsite_title")}
                </h3>
                <ul className="intro-list">
                  <li>{t("intro_whywebsite_1")}</li>
                  <li>{t("intro_whywebsite_2")}</li>
                  <li>{t("intro_whywebsite_3")}</li>
                  <li>{t("intro_whywebsite_4")}</li>
                </ul>
              </section>

              <section className="intro-section">
                <h3 className="intro-section-title">
                  <span className="material-symbols-outlined">steps</span>
                  {t("intro_how_title")}
                </h3>
                <ol className="intro-steps">
                  <li>{t("intro_how_1")}</li>
                  <li>{t("intro_how_2")}</li>
                  <li>{t("intro_how_3")}</li>
                  <li>{t("intro_how_4")}</li>
                </ol>
              </section>

              <section className="intro-section">
                <h3 className="intro-section-title">
                  <span className="material-symbols-outlined">contact_phone</span>
                  {t("intro_contact_title")}
                </h3>
                <p className="intro-text">{t("intro_contact_prompt")}</p>
                <div className="intro-contacts">
                  <div className="contact-row">
                    <span className="material-symbols-outlined">mail</span>
                    <a href="mailto:ilievskinenad04@gmail.com">ilievskinenad04@gmail.com</a>
                  </div>
                  <div className="contact-row">
                    <span className="material-symbols-outlined">phone_iphone</span>
                    <a href="tel:+38975692136">+38975692136</a>
                  </div>
                </div>
              </section>
            </div>

            <div className="intro-cta-bar">
              <button className="intro-cta" onClick={closeIntro}>
                <span className="material-symbols-outlined">play_arrow</span>
                {t("intro_button")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
