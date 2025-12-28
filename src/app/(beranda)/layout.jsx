import { Row } from "@/components/shared/custom_widget";
import SidebarBeranda from "@/components/shared/sidebar_beranda";

export default function BerandaLayout({ children }) {
  return (
    <Row className="min-w-screen bg-gray-50">
      <SidebarBeranda />
      {children}
    </Row>
  );
}
