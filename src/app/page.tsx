import HeroSection from "./herosection/page";

import ChatbotWidget from "./chat/page";
import Navigation from "./navigation/page";

export default function Home() {
  return (
    <div className="grid min-h-screen">
      <Navigation />
      <HeroSection />
      <ChatbotWidget />
    </div>
  );
}
