"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { IconAssets } from "@/common/constant/assets";
import { cn } from "@/lib/utils";
import { Column, Container, Text } from "./custom_widget";
import { useShelter } from "@/contexts/shelter-context";
import { useAuth } from "@/contexts/auth-context";

export default function SidebarBeranda() {
  const { user, isLoading: authLoading } = useAuth();
  const { hasShelter, isLoading } = useShelter();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      label: "Menu",
      href: "/home",
      icon: IconAssets.menu,
      iconActive: IconAssets.menuActive,
    },
    {
      label: "Form",
      href: "/form",
      icon: IconAssets.form,
      iconActive: IconAssets.formActive,
    },
    {
      label: "Pembayaran",
      href: "/pembayaran",
      icon: IconAssets.payment,
      iconActive: IconAssets.paymentActive,
    },
    {
      label: "Shelter",
      href: "/profile_shelter",
      icon: IconAssets.profile,
      iconActive: IconAssets.profileActive,
    },
  ];

  const isActive = (href) =>
    pathname === href || pathname?.startsWith(href + "/");

  const handleNavigate = (href) => {
    // allow navigation regardless of shelter state so sidebar items are clickable
    router.push(href);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (authLoading || isLoading) return null;

  // Default active color can be overridden with CSS variable `--sidebar-active-color`.
  // Example override: `:root { --sidebar-active-color: #0ea5e9; }` or set inline style on a parent element.
  const activeColorVar = "var(--sidebar-active-color, #FF8D28)";

  return (
    <Container
      className="w-[88px] min-h-screen bg-white flex flex-col items-center py-6"
    >
      {/* MENU */}
      <Column className="flex flex-col gap-8 flex-1">
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <button
              key={item.href}
              onClick={() => handleNavigate(item.href)}
              // clickable even if no shelter; visual still shows disabled look
              className={cn(
                "relative flex flex-col items-center gap-1 transition w-full",
                !hasShelter ? "opacity-70" : "hover:text-gray-700 cursor-pointer"
              )}
              aria-current={active ? "true" : undefined}
              style={active ? { color: activeColorVar } : undefined}
            >
              <div className="flex flex-col items-center gap-1 w-full">
                <div className="pt-1">
                  <Image
                    src={active ? item.iconActive : item.icon}
                    alt={item.label}
                    width={active ? 26 : 22}
                    height={active ? 26 : 22}
                    className="object-cover"
                  />
                </div>
                <span className={cn(active ? "text-[11px] font-semibold" : "text-[11px] font-medium")}>
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </Column>

      {/* LOGOUT (TETAP AKTIF) */}
      <button
        onClick={handleLogout}
        className="mt-6 flex flex-col items-center gap-1 text-gray-500 hover:text-red-500 transition cursor-pointer"
      >
        <Image src={IconAssets.signOut} alt="Sign Out" width={20} height={20} />
        <Text className="text-[11px] font-medium">Keluar</Text>
      </button>
    </Container>
  );
}
