"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navigation = () => {
    const pathName = usePathname();
    return (
        <nav>
            <Link href="/" className={pathName === "/" ? "font-bold mr-4" : "mr-4 text-blue-500"}>Home</Link>
            <Link href="/dashboard" className={pathName === "/dashboard" ? "font-bold mr-4" : "mr-4 text-blue-500"}>Dashboard</Link>
        </nav>
    )
}