"use client";

import { useRouter } from "next/navigation";
import { Menu, LogOut, UserCheck } from "lucide-react";
import { useAdminUser } from "./AdminContext";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const router = useRouter();
  const { currentUser, allStaffUsers, switchUser } = useAdminUser();

  const handleLogout = () => {
    // In mock front-end, route to /admin/login
    router.push("/admin/login");
  };

  return (
    <header className="h-16 bg-warm-white border-b border-caramel/15 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger & current context */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-lg text-mocha hover:text-espresso hover:bg-cream md:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="hidden sm:inline-block text-xs font-serif italic text-mocha">
          Staff Console
        </span>
      </div>

      {/* Right: Mock User Role Switcher, Current User & Logout */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Clearly marked mock Role Previewer */}
        <div className="flex items-center gap-1.5 bg-cream/80 border border-caramel/25 rounded-lg px-2.5 py-1.5">
          <UserCheck className="w-3.5 h-3.5 text-caramel shrink-0" />
          <label htmlFor="mock-role-select" className="text-[11px] font-medium text-mocha hidden md:inline">
            Preview Role:
          </label>
          <select
            id="mock-role-select"
            value={currentUser.id}
            onChange={(e) => switchUser(e.target.value)}
            className="text-xs bg-transparent text-espresso font-medium focus:outline-none cursor-pointer pr-1"
            aria-label="Switch mock staff user and role"
          >
            {allStaffUsers.map((u) => (
              <option key={u.id} value={u.id} className="bg-warm-white text-espresso">
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>

        {/* Staff badge */}
        <div className="hidden lg:flex flex-col text-right">
          <span className="text-xs font-medium text-espresso leading-tight">
            {currentUser.name}
          </span>
          <span className="text-[10px] text-caramel uppercase tracking-wider font-semibold">
            {currentUser.role}
          </span>
        </div>

        {/* Logout action */}
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 text-xs text-mocha hover:text-caramel-dark hover:bg-cream active:bg-caramel/15 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-caramel/20"
          aria-label="Sign out of admin portal"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
