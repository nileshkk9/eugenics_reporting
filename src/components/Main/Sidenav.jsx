import { Link, useLocation } from "react-router-dom";
import { LEVEL } from "../../utils/constants";
import { Upload, FileText, Download, BarChart3, MapPin, UserPlus, ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";

const NAV_LINKS = [
  { to: "upload", label: "Upload Data", Icon: Upload, id: "upload" },
  { to: "reports", label: "Entries", Icon: FileText, id: "reports" },
  { to: "download", label: "Download Excel", Icon: Download, id: "download" },
];

const Sidenav = ({ isOpen, isMobile, currentLocation, onClose, user }) => {
  const { pathname } = useLocation();
  const active = pathname.split("/").pop();

  const isAdmin = user.level === LEVEL.ADMIN;
  const isManager = user.level === LEVEL.MANAGER;

  const allLinks = [
    ...NAV_LINKS,
    ...(isAdmin || isManager
      ? [{ to: "regional-report", label: "Regional Report", Icon: BarChart3, id: "regional-report" }]
      : []),
    ...(isAdmin
      ? [{ to: "invite-user", label: "Invite User", Icon: UserPlus, id: "invite-user" }]
      : []),
  ];

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full w-[260px] bg-sidebar text-white z-30 flex flex-col transition-transform duration-300 ease-in-out shadow-xl",
        isMobile
          ? isOpen ? "translate-x-0" : "-translate-x-full"
          : "translate-x-0"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-sidebar-header">
        <img src="/logo.png" alt="Eugenics logo" className="h-9 w-9 object-contain rounded" />
        <span className="text-lg font-bold tracking-wide">Eugenics</span>
      </div>

      {/* User info */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold shrink-0">
          {user.name ? user.name.charAt(0).toUpperCase() : "?"}
        </div>
        <span className="text-sm font-medium truncate">{user.name || "Loading..."}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="space-y-1">
          {allLinks.map(({ to, label, Icon, id }) => (
            <li key={id}>
              <Link
                to={to}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium min-h-[44px] transition-colors",
                  active === id
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon size={18} className="shrink-0" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10 space-y-2">
        {currentLocation && (
          <div className="flex items-center gap-2 text-sm text-white/70">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">{currentLocation}</span>
          </div>
        )}
        <a
          href="https://www.eugenicspharma.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition-colors"
        >
          <ExternalLink size={14} />
          Back to website
        </a>
      </div>
    </aside>
  );
};

export default Sidenav;
