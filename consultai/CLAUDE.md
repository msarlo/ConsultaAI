# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ConsultaAI is a Next.js 15 application with a real-time chat interface built using WebSockets. The application provides a consulting service chatbot with predefined questions and API news integration.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

Development server runs at http://localhost:3000

## Architecture

### Application Structure

**Routes:**
- `/` - Landing page (home)
- `/chat` - Main chat interface with sidebar

**Component Organization:**
- `src/app/components/` - Page-specific components (Header, Sidebar, Chat)
- `src/components/ui/` - shadcn/ui components (button, card, input, scroll-area)
- `src/app/hooks/` - Custom React hooks (WebSocket management)
- `src/lib/` - Utility functions (Tailwind class merging)

### Key Architectural Patterns

**WebSocket Communication:**
The chat system uses a custom WebSocket hook (`useChatWebsocket`) that:
- Connects to a configurable WebSocket URL (currently using echo.websocket.org for testing)
- Manages message state with proper typing (`Message` interface)
- Handles connection status and error states
- Automatically adds welcome messages and processes responses

**State Flow in Chat Page:**
1. ChatPage ([src/app/chat/page.tsx](src/app/chat/page.tsx)) manages `selectedQuestion` state
2. Sidebar emits question clicks via `onPerguntaClick` callback
3. Chat component receives `initialMessage` prop and sends it via WebSocket when connected
4. The state resets after 100ms to allow re-clicking the same question

**Message Structure:**
```typescript
interface Message {
  autor: 'usuario' | 'bot';
  conteudo: string;
  timestamp: Date;
}
```

### UI Framework

Uses shadcn/ui with the following configuration ([components.json](components.json)):
- Style: "new-york"
- Base color: "neutral"
- Icon library: lucide-react
- Path aliases configured for `@/components`, `@/lib`, `@/hooks`

### Styling

- Tailwind CSS v4 with PostCSS
- Custom fonts: Geist Sans and Geist Mono
- Global styles in [src/app/globals.css](src/app/globals.css)

### TypeScript Configuration

Path alias `@/*` maps to `./src/*` for clean imports throughout the application.

## External Integrations

**Public APIs Sidebar:**
Fetches from https://api.publicapis.org/entries to display available public APIs in the sidebar. Currently shows the first 5 entries.

**WebSocket:**
Default connection to wss://echo.websocket.org (echo server for testing). Update the URL in `useChatWebsocket` hook when integrating with a real chat backend.

## Chat Features

**Export Functionality:**
The Chat component includes a "Salvar Conversa" button that exports the conversation as JSON with:
- Unique chat ID (UUID)
- ISO timestamp
- All messages (author and content)

**Auto-scroll:**
Messages automatically scroll to the bottom using a ref-based approach when new messages arrive.

**Keyboard Support:**
- Enter key sends messages
- Shift+Enter allows multi-line input (handled via `onKeyPress`)
