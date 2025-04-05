export default function ListLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1">
      {children}
    </div>
  );
}
