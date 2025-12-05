interface QuickActionsProps {
  actions: string[];
  onAction: (action: string) => void;
  disabled?: boolean;
}

export default function QuickActions({ actions, onAction, disabled = false }: QuickActionsProps) {
  return (
    <div className="px-4 py-2 bg-transparent border-t border-transparent">
      <div 
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        tabIndex={0}
        aria-label="Ações rápidas"
        aria-orientation="horizontal"
      >
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => onAction(action)}
            disabled={disabled}
            className="px-4 py-2 bg-white text-blue-600 rounded-full text-sm font-medium whitespace-nowrap hover:bg-blue-50 hover:shadow-md transition-all duration-200 border border-blue-200 flex-shrink-0 disabled:opacity-50"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}