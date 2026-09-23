import Bolt from "@/components/Bolt";
import EntryForm from "@/components/EntryForm";
import { asset } from "@/lib/asset";

const Index = () => {
  return (
    <main
      className="halftone-bg relative min-h-screen overflow-x-hidden"
      style={{ backgroundImage: `url(${asset("bg.jpg")})` }}
    >
      {/* soft vignette so the panels pop */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[hsl(var(--sky))]/40 via-transparent to-[hsl(var(--ink))]/60" />

      {/* floating bolts */}
      <Bolt className="bolt-float absolute left-[3%] top-[6%] w-10 sm:w-14 lg:w-20" style={{ "--r": "-18deg" } as React.CSSProperties} />
      <Bolt className="bolt-float absolute right-[4%] top-[10%] w-10 sm:w-14 lg:w-20" style={{ "--r": "22deg", animationDelay: "-1.2s" } as React.CSSProperties} flip />
      <Bolt className="bolt-float absolute left-[6%] top-[46%] hidden w-14 md:block lg:w-20" style={{ "--r": "12deg", animationDelay: "-2s" } as React.CSSProperties} />
      <Bolt className="bolt-float absolute right-[5%] top-[58%] hidden w-14 md:block lg:w-20" style={{ "--r": "-28deg", animationDelay: "-0.6s" } as React.CSSProperties} flip />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 pb-16 pt-8 sm:px-6 sm:pt-12">
        {/* Title lockup, lifted straight from the poster */}
        <header className="w-full">
          <img
            src={asset("stoketoberfest-title.png")}
            alt="Stoketoberfest"
            width={587}
            height={325}
            className="mx-auto w-[88%] max-w-[560px] drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]"
          />
        </header>

        {/* Prize bubble */}
        <section aria-labelledby="prize" className="bubble mt-6 w-full px-4 py-7 text-center sm:mt-8 sm:px-10 sm:py-9">
          <h1 id="prize" className="poster-heading">
            <span className="block text-[4.9vw] sm:text-4xl">Win a 12-day ALL IN</span>
            <span className="block text-[7.2vw] sm:text-6xl">Indonesia trip</span>
            <span className="block text-[4.9vw] sm:text-4xl">for you + a mate</span>
          </h1>
          <p className="mt-3 text-sm font-bold text-[hsl(var(--ink))]/75 sm:text-base">Flights not provided*</p>
        </section>

        {/* Entry form bubble */}
        <section aria-labelledby="enter" className="bubble mt-12 w-full max-w-xl px-5 py-7 sm:mt-14 sm:px-9 sm:py-9">
          <h2 id="enter" className="graffiti text-center text-4xl leading-none sm:text-5xl">
            Enter here
          </h2>
          <p className="mt-2 text-center text-sm font-bold text-[hsl(var(--ink))]/75">
            Drop your details below. One entry per person.
          </p>
          <div className="mt-6">
            <EntryForm />
          </div>
        </section>

        {/* Discount bubble, from the poster */}
        <section aria-labelledby="discount" className="bubble bubble-tail mt-14 w-full max-w-xl px-4 py-7 text-center sm:mt-16 sm:px-10">
          <p className="poster-heading text-[4.6vw] sm:text-2xl">Heading to Southeast Asia</p>
          <p id="discount" className="poster-heading text-[6.4vw] sm:text-4xl">after Oktoberfest?</p>
          <p className="poster-heading mt-4 text-[11vw] sm:text-6xl">Get 10% off</p>
          <p className="mt-1 text-lg font-extrabold sm:text-2xl">
            use code: <span className="font-black tracking-wide">stoketravel</span>
          </p>
          <a
            href="https://madmonkeyhostels.com"
            target="_blank"
            rel="noreferrer"
            className="btn-poster mt-6 whitespace-normal text-base sm:!w-auto sm:px-8 sm:text-lg"
          >
            Book now @ madmonkeyhostels.com
          </a>
        </section>

        {/* Footer */}
        <footer className="mt-20 flex w-full flex-col items-center gap-6 text-center text-white sm:mt-24 sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div className="flex items-center gap-4">
            <img src={asset("all-in.png")} alt="ALL IN by Mad Monkey" width={96} height={96} className="h-20 w-20 rounded-2xl bg-white p-1 sm:h-24 sm:w-24" loading="lazy" />
            <div>
              <p className="text-sm font-extrabold sm:text-base">24+ locations across 6 countries in Southeast Asia.</p>
              <p className="text-sm font-semibold text-white/85 sm:text-base">Social hostels, group trips, tours &amp; experiences.</p>
            </div>
          </div>
          <a href="https://madmonkeyhostels.com" target="_blank" rel="noreferrer" aria-label="Mad Monkey Hostels" className="shrink-0">
            <img src={asset("mm-logo.png")} alt="Mad Monkey" width={180} height={68} className="h-14 w-auto rounded-xl bg-white px-3 py-1.5 sm:h-16" loading="lazy" />
          </a>
        </footer>
      </div>
    </main>
  );
};

export default Index;
