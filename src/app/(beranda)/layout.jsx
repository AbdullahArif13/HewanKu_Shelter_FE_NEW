import { Row } from "@/components/shared/custom_widget";
import SidebarBeranda from "@/components/shared/sidebar_beranda";

export default function BerandaLayout({ children }) {
  return (
    <Row className="min-w-screen bg-[#F2F2F2]">
      <SidebarBeranda />
      <div className="flex-1 min-h-screen p-12 bg-[url('/images/bg_beranda.png')] bg-no-repeat bg-[size:100%] bg-bottom">
        {children}
      </div>
    </Row>
  );
}
