import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Lang = "en" | "mk";

const DICT: Record<Lang, Record<string, string>> = {
  en: {
    tab_title: "✏️ program.ly — Home",
    brand_main: "program",
    brand_dot: ".ly",

    nav_open_generator: "Open Generator",
    nav_contact: "Contact",

    hero_kicker: "From idea to website",
    hero_headline_big: "Launch a site concept in seconds.",
    hero_sub:
      "An AI-assisted sandbox that turns your brief or URL into a beautiful, scrollable homepage preview.",
    hero_badge: "AI powered",
    hero_generate: "Generate",

    how_title: "How the tool works",
    how_step1:
      "Paste your existing website URL or write a short brief for a brand-new site.",
    how_step2:
      "Get a free on-the-spot concept preview — Standard and Creative variants.",
    how_step3:
      "If you like the direction, we’ll build your full site fast and affordably.",

    services_title: "Our services",
    services_p1:
      "A fast concept tool that helps you explore how your website could look — before you commit.",
    services_p2:
      "We then craft a complete, production-ready website with custom design, performance tuning and ongoing support.",
    services_p3: "Ongoing site management and 24/7 support",
    services_cta: "See what we can do",

    // USPs (English)
    usp1_t: "Lowest price on the market",
    usp1_d: "If you find a lower offer, you pay that price with us.",
    usp2_t: "Record-fast delivery",
    usp2_d: "Your project is our only focus — get your site in a few days.",
    usp3_t: "Pay only if you like it",
    usp3_d: "Zero risk. If you’re not happy with the result, you pay nothing.",

    examples_title: "Concept previews",
    examples_note: "Two hard-coded interactive previews you can scroll.",
    concept1: "Concept 1 — AURA (Luxury Real Estate)",
    concept2: "Concept 2 — SportSphere (Live Sports)",

    client_title: "Client example",
    client_note:
      "A larger live embed showing a real client site. If the site blocks embedding, use the button to open it in a new tab.",

    contact_title: "Write to us!",
    contact_phone: "Phone",
    contact_email: "Email",
    lang_toggle: "MK",

    open_new_tab: "Open in new tab",
  },

  mk: {
    tab_title: "✏️ program.ly — Почетна",
    brand_main: "program",
    brand_dot: ".ly",

    nav_open_generator: "Отвори генератор",
    nav_contact: "Контакт",

    hero_kicker: "AI АЛАТКА",
    hero_headline_big: "ОД ИДЕЈА ДО ВЕБ СТРАНА",
    hero_sub: "ГРАДИМЕ ВЕБ-СТРАНИ РАКА ПОД РАКА СО AI",
    hero_badge: "За 2 минути",
    hero_generate: "Генерирај",

    how_title: "Како функционира алатката",
    how_step1:
      "Внеси линк од постоечки вебсајт или опиши како сакаш да изгледа твојот вебсајт",
    how_step2: "Генерирај бесплатен преглед на сајтот",
    how_step3:
      "Доколку ти се допаѓа пиши ни за да го изработиме целиот вебсајт",

    services_title: "Нашите услуги",
    services_p1:
      "БЕСПЛАТНА АЛАТКА СО КОЈА МОЖЕШ ДА ВИДИШ КАКО ЌЕ ИЗГЛЕДА ТВОЈОТ ВЕБСАЈТ",
    services_p2: "ИЗРАБОТКА НА ЦЕЛОСЕН ВЕБСАЈТ ЗА ЕДНА НЕДЕЛА*",
    services_p3: "МЕНАЏИРАЊЕ НА САЈТОТ И ТЕХНИЧКА ПОДДРШКА 24/7",
    services_cta: "Погледни што нудиме",

    // USPs (Macedonian)
    usp1_t: "Најниска цена на пазарот",
    usp1_d:
      "Доколку најдеш понуда со пониска цена – кај нас плаќаш по таа цена",
    usp2_t: "Рекордно брза изработка",
    usp2_d:
      "Твојот проект е нашиот единствен фокус – добиваш сајт за неколку дена",
    usp3_t: "Плаќаш само ако ти се допаѓа",
    usp3_d:
      "Без ризик. Ако не си задоволен од крајниот производ – не плаќаш ништо",

    examples_title: "Концепт прегледи",
    examples_note: "Погледни неколку концепти креирани со нашата AI алатка",
    concept1: "Концепт 1 — AURA (Луксузен недвижнини)",
    concept2: "Концепт 2 — SportSphere (Спорт уживо)",

    client_title: "Клиент пример",
    client_note:
      "Преглед на вебсајтот на еден од нашите клиенти",

    contact_title: "Пишете ни!",
    contact_phone: "Телефон",
    contact_email: "Е-пошта",
    lang_toggle: "EN",

    open_new_tab: "Отвори во нов таб",
  },
};

function ClientEmbed({
  src,
  title,
  tOpen,
}: {
  src: string;
  title: string;
  tOpen: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    setLoaded(false);
    setTimedOut(false);

    const timeoutId = setTimeout(() => {
      if (!loaded) setTimedOut(true);
    }, 4000);

    const paintFailsafe = setTimeout(() => {
      if (!loaded) {
        setLoaded(true);
        setTimedOut(false);
      }
    }, 3500);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(paintFailsafe);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const markLoaded = () => {
    setLoaded(true);
    setTimedOut(false);
  };

  const markError = () => {
    setTimedOut(true);
  };

  return (
    <div className="client-embed">
      {!loaded && (
        <div className="client-fallback">
          <div className="client-fallback-inner">
            <div className="loader-dots">
              <span className="loader-dot" />
              <span className="loader-dot" />
              <span className="loader-dot" />
            </div>
            <div>
              {timedOut ? (
                <>
                  <p>
                    Couldn’t display the site here (it may block embedding).
                  </p>
                  <p>
                    <a
                      className="generate-btn as-link"
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {tOpen}
                    </a>
                  </p>
                </>
              ) : (
                <p>Loading live preview…</p>
              )}
            </div>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        className="client-iframe"
        title={title}
        src={src}
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={markLoaded}
        onLoadCapture={markLoaded}
        onError={markError}
        sandbox="allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}

export default function HomeLanding() {
  const [lang, setLang] = useState<Lang>("mk");
  const t = (k: string) => DICT[lang][k] || k;

  const concepts = [
    { title: t("concept1"), src: "/concepts/concept-1.html" },
    { title: t("concept2"), src: "/concepts/concept-2.html" },
  ];

  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="main-bg">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{t("tab_title")}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </Head>

      {/* HEADER */}
      <header className="header">
        <div className="logo" aria-label="program.ly">
          <span className="logo-main">{DICT[lang].brand_main}</span>
          <span className="logo-accent">{DICT[lang].brand_dot}</span>
        </div>

        <div className="home-nav">
          <Link href="/generator" className="generate-btn as-link">
            {t("nav_open_generator")}
          </Link>

          <a href="#contact" className="cta-contact as-link">
            {t("nav_contact")}
          </a>

          <button
            className="lang-toggle"
            onClick={() => setLang((l) => (l === "en" ? "mk" : "en"))}
            title={DICT[lang].lang_toggle}
          >
            {DICT[lang].lang_toggle}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-left">
          <div className="home-kicker">
            <span className="material-symbols-outlined">bolt</span>
            {t("hero_kicker")}
          </div>
        <h1 className="home-title">{t("hero_headline_big")}</h1>
          <p className="home-sub">{t("hero_sub")}</p>
          <div className="home-cta-row">
            <Link href="/generator" className="generate-btn">
              ✨ {t("hero_generate")}
            </Link>
            <span className="home-badge">{t("hero_badge")}</span>
          </div>
        </div>

        <div className="home-hero-right" aria-hidden>
          <img
            src="/1.gif"
            alt="Creative website concept (animated)"
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              el.onerror = null;
              el.src = "/fallback1.jpg";
            }}
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="home-section">
        <h2 className="home-h2">{t("how_title")}</h2>
        <div className="home-steps">
          <div className="home-step">
            <div className="num">1</div>
            <p>{t("how_step1")}</p>
          </div>
          <div className="home-step">
            <div className="num">2</div>
            <p>{t("how_step2")}</p>
          </div>
          <div className="home-step">
            <div className="num">3</div>
            <p>{t("how_step3")}</p>
          </div>
        </div>
      </section>

{/* SERVICES */}
<section className="home-section home-services">
  <div className="svc-card">
    <div className="svc-media">
      <img
        src="/2.gif"
        alt="Design and development (animated)"
        loading="lazy"
        onError={(e) => {
          const el = e.currentTarget as HTMLImageElement;
          el.onerror = null;
          el.src = "/fallback2.jpg";
        }}
      />
    </div>

    <div className="svc-body">
      <h3 className="svc-title">{t("services_title")}</h3>

      {/* Main service bullets (compact, bold, readable) */}
      <ul className="svc-bullets">
        <li>
          <span className="material-symbols-outlined">visibility</span>
          {t("services_p1")}
        </li>
        <li>
          <span className="material-symbols-outlined">rocket_launch</span>
          {t("services_p2")}
        </li>
        <li>
          <span className="material-symbols-outlined">support_agent</span>
          {t("services_p3")}
        </li>
      </ul>

      {/* USPs as neat cards */}
      <div className="svc-usps">
        <div className="svc-usp">
          <div className="svc-usp-title">
            <span className="material-symbols-outlined">price_check</span>
            {t("usp1_t")}
          </div>
          <div className="svc-usp-desc">{t("usp1_d")}</div>
        </div>
        <div className="svc-usp">
          <div className="svc-usp-title">
            <span className="material-symbols-outlined">bolt</span>
            {t("usp2_t")}
          </div>
          <div className="svc-usp-desc">{t("usp2_d")}</div>
        </div>
        <div className="svc-usp">
          <div className="svc-usp-title">
            <span className="material-symbols-outlined">thumb_up</span>
            {t("usp3_t")}
          </div>
          <div className="svc-usp-desc">{t("usp3_d")}</div>
        </div>
      </div>

      <a href="#concepts" className="svc-cta generate-btn as-link">
        {t("services_cta")}
      </a>
    </div>
  </div>
</section>


      {/* CONCEPTS */}
      <section className="home-section" id="concepts">
        <h2 className="home-h2">{t("examples_title")}</h2>
        <p className="home-note">{t("examples_note")}</p>

        {/* Desktop / tablet */}
        {!isMobile && (
          <div className="concept-grid two-cols">
            {[
              { title: t("concept1"), src: "/concepts/concept-1.html" },
              { title: t("concept2"), src: "/concepts/concept-2.html" },
            ].map((c, i) => (
              <article key={i} className="concept-card">
                <div className="concept-frame" role="region" aria-label={c.title}>
                  <iframe
                    className="concept-iframe"
                    src={c.src}
                    title={c.title}
                    loading="lazy"
                    sandbox="allow-same-origin allow-scripts"
                  />
                </div>
                <div className="concept-meta">
                  <div className="concept-title">{c.title}</div>
                  <div className="concept-actions">
                    <a
                      className="as-link"
                      href={c.src}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("open_new_tab")}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Mobile tabs */}
        {isMobile && (
          <div className="concept-tabs">
            <div className="tab-buttons">
              {[0, 1].map((i) => (
                <button
                  key={i}
                  className={`tab-btn ${activeTab === i ? "active" : ""}`}
                  onClick={() => setActiveTab(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="tab-frame">
              <iframe
                className="concept-iframe"
                src={concepts[activeTab].src}
                title={concepts[activeTab].title}
                loading="lazy"
                sandbox="allow-same-origin allow-scripts"
              />
            </div>

            <div className="concept-meta">
              <div className="concept-title">{concepts[activeTab].title}</div>
              <div className="concept-actions">
                <a
                  className="as-link"
                  href={concepts[activeTab].src}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("open_new_tab")}
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* CLIENT EXAMPLE */}
      <section className="home-section" id="client">
        <h2 className="home-h2">{t("client_title")}</h2>
        <p className="home-note">{t("client_note")}</p>

        <div className="client-wrap">
          <ClientEmbed
            src="https://urbanvibeapartments.com/"
            title="Urban Vibe Apartments"
            tOpen={t("open_new_tab")}
          />

          <aside className="client-side" aria-label="Animated feature preview">
            <img
              src="/3.gif"
              alt="Animated feature preview"
              loading="lazy"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.onerror = null;
                el.src = "/fallback3.jpg";
              }}
            />
          </aside>
        </div>
      </section>

      {/* CONTACT */}
      <section className="home-section home-contact" id="contact">
        <h2 className="home-h2">{t("contact_title")}</h2>
        <div className="contact-card">
          <div className="contact-row">
            <span className="material-symbols-outlined">phone_in_talk</span>
            <div>
              <div className="contact-label">{t("contact_phone")}</div>
              <a href="tel:+38975692136">+389 75 692 136</a>
            </div>
          </div>

          <div className="contact-row">
            <span className="material-symbols-outlined">alternate_email</span>
            <div>
              <div className="contact-label">{t("contact_email")}</div>
              <a href="mailto:ilievskinenad04@gmail.com">
                ilievskinenad04@gmail.com
              </a>
            </div>
          </div>

          <div className="contact-actions">
            <Link href="/generator" className="generate-btn as-link">
              Open Generator
            </Link>
            <a
              className="cta-contact as-link"
              href="mailto:ilievskinenad04@gmail.com"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="logo" aria-label="program.ly">
          <span className="logo-main">{DICT[lang].brand_main}</span>
          <span className="logo-accent">{DICT[lang].brand_dot}</span>
        </div>
        <div className="home-foot-links">
          <Link href="/" className="as-link">
            /
          </Link>
          <a href="#concepts" className="as-link">
            Concepts
          </a>
          <a href="#client" className="as-link">
            Client
          </a>
          <a href="#contact" className="as-link">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
