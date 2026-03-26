import { Routes, Route } from "react-router-dom";
import { useState, createContext, useContext } from "react";
import LandingPage from "./pages/LandingPage";
import CommandCenterPage from "./pages/CommandCenterPage";
import DocsPage from "./pages/DocsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { MonitorPage } from "./monitor/MonitorPage";
import { ClaimsPage } from "./claims/ClaimsPage";

type Locale = "en" | "ar";
interface LocaleCtx { locale: Locale; setLocale: (l: Locale) => void; }
const LocaleContext = createContext<LocaleCtx>({ locale: "en", setLocale: () => {} });
export const useLocale = () => useContext(LocaleContext);

export default function App() {
  const [locale, setLocale] = useState<Locale>("en");
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <div dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-d-bg text-d-text font-sans">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/command-center" element={<CommandCenterPage />} />
          <Route path="/monitor" element={<MonitorPage />} />
          <Route path="/claims" element={<ClaimsPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </LocaleContext.Provider>
  );
}
