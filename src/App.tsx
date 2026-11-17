import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ManualLayout } from "./components/ManualLayout";

const HomePage = lazy(() => import("./components/HomePage").then((m) => ({ default: m.HomePage })));
const ContentsPage = lazy(() => import("./components/ContentsPage").then((m) => ({ default: m.ContentsPage })));
const ChapterPage = lazy(() => import("./components/ChapterPage").then((m) => ({ default: m.ChapterPage })));

function RouteFallback() {
  return (
    <div className="route-fallback mono" role="status">
      LOADING…
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
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
      </Suspense>
    </BrowserRouter>
  );
}
