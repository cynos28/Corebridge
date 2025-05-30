import Link from "next/link";
import Menu from "../component/Menu";
import Navbar from "../component/Navbar";
import Image from "next/image";
import { AnnouncementProvider } from "../../context/AnnouncementContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AnnouncementProvider>
      <div className="h-screen flex">
        {/* LEFT */}
        <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
          <Link
            href="/"
            className="flex items-center justify-center lg:justify-start gap-2"
          >
            <Image src="/logo.png" alt="logo" width={32} height={32} />
            <span className="hidden lg:block font-bold">Corbridge</span>
          </Link>
          <Menu />
        </div>
        {/* RIGHT */}
        <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
          <Navbar />
          {children}
        </div>
      </div>
    </AnnouncementProvider>
  );
}
