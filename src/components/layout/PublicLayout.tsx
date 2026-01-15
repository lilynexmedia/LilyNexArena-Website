import { Outlet } from "react-router-dom";
import { MobileBottomNavbar } from "./MobileBottomNavbar";

/**
 * PublicLayout wraps all public pages and ensures the mobile bottom navbar
 * is mounted only once at the root level, preventing re-renders on navigation.
 */
export function PublicLayout() {
  return (
    <>
      <Outlet />
      <MobileBottomNavbar />
    </>
  );
}
