import ChatBot from '@/components/ChatBot';

export default function HomePage() {
  return (
    <main className="flex-1 w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-stretch p-0 min-h-0">
      <div className="w-full h-full flex flex-col overflow-hidden bg-white">
        <ChatBot />
      </div>
    </main>
  );
}