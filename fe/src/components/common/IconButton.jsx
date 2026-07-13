export default function IconButton({ onClick, title, colorClass, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 text-gray-400 cursor-pointer rounded-md transition-colors ${colorClass}`}
    >
      {children}
    </button>
  );
}