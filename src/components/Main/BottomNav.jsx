import { Link, useLocation } from "react-router-dom";
import { Upload, FileText, Download, BarChart3, UserPlus } from "lucide-react";
import { LEVEL } from "../../utils/constants";
import { cn } from "../../lib/utils";

const BottomNav = ({ user }) => {
  const { pathname } = useLocation();
  const active = pathname.split("/").pop();

  const isAdmin = user?.level === LEVEL.ADMIN;
  const isManager = user?.level === LEVEL.MANAGER;

  const links = [
    { to: "/main/upload", label: "Upload", Icon: Upload, id: "upload" },
    { to: "/main/reports", label: "Reports", Icon: FileText, id: "reports" },
    { to: "/main/download", label: "Download", Icon: Download, id: "download" },
    ...(isAdmin || isManager
      ? [{ to: "/main/regional-report", label: "Regional", Icon: BarChart3, id: "regional-report" }]
      : []),
    ...(isAdmin
      ? [{ to: "/main/invite-user", label: "Invite", Icon: UserPlus, id: "invite-user" }]
      : []),
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex md:hidden z-10">
      {links.map(({ to, label, Icon, id }) => (
        <Link
          key={id}
          to={to}
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-2 min-h-[56px] text-xs gap-1 transition-colors",
            active === id
              ? "text-sidebar font-semibold"
              : "text-gray-500 hover:text-gray-800"
          )}
        >
          <Icon size={20} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;
