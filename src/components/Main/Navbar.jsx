import { useNavigate, useLocation } from "react-router-dom";
import { LOCAL_AUTH_KEY } from "../../utils/constants";
import { Menu, LogOut } from "lucide-react";
import { Button } from "../ui/button";

const PAGE_TITLES = {
  upload: "Upload Entries",
  reports: "Reports",
  download: "Download Report",
  "regional-report": "Regional Report",
  "invite-user": "Invite User",
};

const Navbar = ({ toggleSideNav }) => {
  const navigate = useNavigate();
  const path = useLocation().pathname.split("/").pop();
  const title = PAGE_TITLES[path] || "Eugenics";

  const logout = () => {
    localStorage.removeItem(LOCAL_AUTH_KEY);
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-4 h-14 bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSideNav}
          aria-label="Toggle navigation"
          className="h-10 w-10"
        >
          <Menu size={22} />
        </Button>
        <h1 className="text-base font-semibold text-gray-800">{title}</h1>
      </div>

      <Button
        variant="destructive"
        size="sm"
        onClick={logout}
        className="gap-2 h-9"
      >
        <LogOut size={16} />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </header>
  );
};

export default Navbar;
