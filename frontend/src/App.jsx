import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Reader from "./pages/Reader";
import SpeakAloud from "./pages/SpeakAloud";
import Settings from "./pages/Settings";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/reader" element={<Reader />} />
        <Route path="/reader/:id" element={<Reader />} />
        <Route path="/speak" element={<SpeakAloud />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

export default App;
