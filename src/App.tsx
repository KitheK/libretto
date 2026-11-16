import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChapterPage } from "./components/ChapterPage";
import { ContentsPage } from "./components/ContentsPage";
import { HomePage } from "./components/HomePage";
import { ManualLayout } from "./components/ManualLayout";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/contents"
          element={
            <ManualLayout>
              <ContentsPage />
            </ManualLayout>
          }
        />
        <Route
          path="/chapters/:slug"
          element={
            <ManualLayout>
              <ChapterPage />
            </ManualLayout>
          }
        />
        <Route
          path="*"
          element={
            <ManualLayout>
              <ChapterPage />
            </ManualLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
