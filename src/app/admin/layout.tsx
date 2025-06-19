export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Admin navigation/sidebar can go here */}
      <main>{children}</main>
    </div>
  );
} 