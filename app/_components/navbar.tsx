"use client";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import * as Models from "../_helpers/models";

const icon = "https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500";

const navItems: Models.NavItem[] = [
  {
    text: "Home",
    href: "/",
  },
  {
    text: "Pricing",
    href: "#pricing",
  },
  {
    text: "FAQ",
    href: "#faq",
  },
];

export default function Navbar() {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Hamburger */}
          <button
            type="button"
            className="absolute left-0 p-4 hover:opacity-75 active:opacity-50 sm:hidden"
            onClick={() => setHamburgerOpen(!hamburgerOpen)}
          >
            <svg
              className="block h-6 w-6"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          {/* Main Items */}
          <div className="flex flex-1 justify-center sm:justify-start">
            {/* Icon */}
            <div className="flex flex-shrink-0 items-center">
              <Image
                className="h-8 w-auto"
                loader={() => icon}
                src={icon}
                alt="icon"
                width={50}
                height={50}
                unoptimized
              />
            </div>
            {/* Nav Items */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4 py-2">
                {navItems.map((item) => {
                  if (pathname !== "/" && item.href != "/") return;
                  return (
                    <Link
                      key={item.text.toLowerCase() + "-nav"}
                      href={item.href}
                      className={
                        "px-3 " +
                        (pathname === item.href
                          ? "pointer-events-none font-bold"
                          : "font-light")
                      }
                    >
                      {item.text}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Profile*/}
          <div className="absolute right-0 flex items-center p-4">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
      {/* Hamburger Menu */}
      <div className={hamburgerOpen ? "sm:hidden" : "hidden"}>
        <hr />
        <div className="space-y-4 py-3 text-center">
          {navItems.map((item) => {
            if (pathname !== "/" && item.href != "/") return;
            return (
              <Link
                key={item.text.toLowerCase() + "-hamburger-nav"}
                href={item.href}
                className={
                  "block " +
                  (pathname === item.href
                    ? "pointer-events-none font-bold"
                    : "font-light")
                }
                onClick={() => setHamburgerOpen(false)}
              >
                {item.text}
              </Link>
            );
          })}
        </div>
        <hr />
      </div>
    </nav>
  );
}
