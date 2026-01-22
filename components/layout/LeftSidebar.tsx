'use client';

export default function LeftSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 bg-black/60 backdrop-blur border-r border-white/10">
      <div className="p-4">
        <div className="mb-8 flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-white/10" />
          <span className="text-sm font-semibold text-white">Upcube</span>
        </div>

        <nav className="space-y-1 text-sm text-white/70">
          <NavItem active>Explore</NavItem>
          <NavItem>Create</NavItem>
          <NavItem>Library</NavItem>
          <NavItem>Profile</NavItem>
        </nav>
      </div>
    </aside>
  );
}

function NavItem({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={[
        'rounded-xl px-3 py-2 cursor-pointer',
        active
          ? 'bg-white/10 text-white'
          : 'hover:bg-white/5 hover:text-white',
      ].join(' ')}
    >
      {children}
    </div>
  );
}
