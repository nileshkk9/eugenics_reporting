import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidenav from "./Sidenav";
import BottomNav from "./BottomNav";
import { Outlet } from "react-router-dom";
import { api } from "../../Api/requests";
import { useIsMobile } from "../../hooks/useIsMobile";

const Main = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState({});
  const [location, setLocation] = useState({ geolocation: "", fullgeolocation: "" });
  const isMobile = useIsMobile();

  const handleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    getGeoLocation();
    getUser();
  }, []);

  // Close sidebar when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile) setIsSidebarOpen(false);
  }, [isMobile]);

  const getGeoLocation = () => {
    if (navigator.geolocation) {
      return navigator.geolocation.watchPosition(
        async (position) => {
          const res = await api.getGeoLocation(
            position.coords.latitude,
            position.coords.longitude
          );
          setLocation({
            fullgeolocation: res.data.display_name,
            geolocation: res.data.address.suburb || res.data.address.county,
          });
        },
        () => {},
        { enableHighAccuracy: true }
      );
    }
  };

  const getUser = async () => {
    const userRes = await api.getUser();
    if (userRes.status === 200) setUser(userRes.data.user);
  };

  return (
    <div className="flex min-h-dvh bg-gray-50">
      {/* Mobile backdrop */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <Sidenav
        isOpen={isSidebarOpen}
        isMobile={isMobile}
        currentLocation={location.geolocation}
        onClose={closeSidebar}
        user={user}
      />

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${!isMobile ? "md:ml-[250px]" : ""}`}>
        <Navbar toggleSideNav={handleSidebar} />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 pb-24 md:pb-6 animate-fade-in">
          <Outlet context={{ location }} />
        </main>
      </div>

      <BottomNav user={user} />
    </div>
  );
};

export default Main;
