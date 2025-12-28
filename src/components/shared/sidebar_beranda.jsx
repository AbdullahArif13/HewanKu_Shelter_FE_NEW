"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IconAssets, ImageAssets } from "@/common/constant/assets";
import { cn } from "@/lib/utils";
import { Column, Container, Text } from "./custom_widget";

export default function SidebarBeranda() {
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
      label: "Akun",
      href: "/profile",
      icon: IconAssets.profile,
      iconActive: IconAssets.profileActive,
    },
  ];

  const isActive = (href) =>
    pathname === href || pathname?.startsWith(href + "/");

  const handleLogout = () => {
    // 🔐 nanti sesuaikan dengan auth kamu
    // localStorage.removeItem("token");
    // cookies.remove("token");
    router.push("/login");
  };

  return (
    <Container className="w-[88px] min-h-screen bg-white flex flex-col items-center py-15">
      <Column className="flex flex-col gap-8 flex-1">
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition",
                active ? "text-orange-500" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Image
                src={active ? item.iconActive : item.icon}
                alt={item.label}
                width={22}
                height={22}
                className="object-cover"
              />
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </Column>
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
