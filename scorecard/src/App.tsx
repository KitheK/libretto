import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ContentProvider } from "./lib/ContentContext";
import { ChapterPage } from "./pages/ChapterPage";
import { ContentsPage } from "./pages/ContentsPage";
import { ExportPage } from "./pages/ExportPage";
import { ScorecardPage } from "./pages/ScorecardPage";
import { WritePage } from "./write/WritePage";

export function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ScorecardPage />} />
            <Route path="/contents" element={<ContentsPage />} />
            <Route path="/chapters/:slug" element={<ChapterPage />} />
            <Route path="/export" element={<ExportPage />} />
            {import.meta.env.DEV ? <Route path="/write/*" element={<WritePage />} /> : null}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}
