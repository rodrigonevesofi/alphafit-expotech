import Header from "../components/layout/Header";
import ChatbotBox from "../components/chatbot/ChatbotBox";
import { useEffect } from "react";

export default function ChatbotPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="app-bg h-screen flex flex-col overflow-hidden">
      <Header />

      <div className="container flex-grow py-4 md:py-6 h-full flex flex-col">
        <ChatbotBox />
      </div>
    </div>
  );
}