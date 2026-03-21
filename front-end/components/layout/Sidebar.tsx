"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Search,
  User,
  Home,
  Tv,
  Film,
  LayoutGrid,
  Trophy,
  Star,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NavItem = ({
  href,
  icon: Icon,
  label,
  isExpanded,
}: {
  href: string;
  icon: any;
  label: string;
  isExpanded: boolean;
}) => (
  <Link
    href={href}
    className="group flex items-center w-full px-6 py-2 text-gray-400 hover:text-white transition-all duration-300 relative"
  >
    <Icon className="w-6 h-6 shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:text-white" />
    <span
      className={cn(
        "ml-6 text-lg font-bold whitespace-nowrap overflow-hidden transition-all duration-300",
        isExpanded
          ? "w-40 opacity-100 translate-x-0"
          : "w-0 opacity-0 -translate-x-4",
      )}
    >
      {label}
    </span>
    {/* Hover Indicator */}
    <div className="absolute left-0 w-1 h-0 bg-primary transition-all duration-300 group-hover:h-8 rounded-r-full" />
  </Link>
);

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <nav
      className={cn(
        "fixed left-0 top-0 h-full z-50 flex flex-col items-start py-8 transition-all duration-300 ease-in-out",
        isHovered
          ? "w-64 bg-linear-to-r from-black via-black/80 to-transparent"
          : "w-20 bg-linear-to-r from-black/60 to-transparent",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className="px-6 mb-4">
        <Link
          href="/"
          className="text-primary hover:scale-110 transition-transform inline-block"
        >
          <Star className="w-8 h-8 fill-current" />
        </Link>
      </div>

      {/* Primary Navigation */}
      <div className="flex flex-col items-start w-full gap-2 grow">
        <NavItem href="/" icon={Home} label="Home" isExpanded={isHovered} />
        <NavItem
          href="/search"
          icon={Search}
          label="Search"
          isExpanded={isHovered}
        />
        <NavItem href="/tv" icon={Tv} label="TV" isExpanded={isHovered} />
        <NavItem
          href="/movies"
          icon={Film}
          label="Movies"
          isExpanded={isHovered}
        />
        <NavItem
          href="/sports"
          icon={Trophy}
          label="Sports"
          isExpanded={isHovered}
        />
        <NavItem
          href="/sparks"
          icon={Zap}
          label="Sparks"
          isExpanded={isHovered}
        />
        <NavItem
          href="/categories"
          icon={LayoutGrid}
          label="Categories"
          isExpanded={isHovered}
        />
        <NavItem
          href="/myspace"
          icon={User}
          label="My Space"
          isExpanded={isHovered}
        />
      </div>
    </nav>
  );
};

export default Sidebar;
