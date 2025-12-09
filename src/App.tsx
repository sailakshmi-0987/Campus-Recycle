import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ChatProvider } from "./context/ChatContext";
import HomePage from "./pages/HomePage";
import Contact from "./pages/Contact";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import HowItWorks from "./pages/HowItWorks";
import Guidelines from "./pages/Guidelines";
import LostFoundPage from "./pages/LostFoundPage";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <DataProvider>
          <ChatProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq's" element={<FAQ />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/guidelines" element={<Guidelines />} />
                <Route path="/lost-found" element={<LostFoundPage />} />

              </Routes>
            </BrowserRouter>
          </ChatProvider>
        </DataProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
