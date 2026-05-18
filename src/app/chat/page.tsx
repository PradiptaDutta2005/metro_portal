// page.tsx

import ChatbotWidgetClient from "./ChatClient";

// ✅ Dynamic rendering flag must be at top-level, after imports are allowed here
export const dynamic = "force-dynamic";

export default function ChatPage() {
  return <ChatbotWidgetClient />;
}
