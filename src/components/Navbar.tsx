"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon, PlusCircle, LogOut, User } from "lucide-react";
import { useState } from "react";

const navItems = [
	{ href: "/dashboard", label: "Dashboard" },
	{ href: "/sheets", label: "My Sheets" },
	{ href: "/templatess", label: "Templates" },
	{ href: "/analytics", label: "Analytics" },
	{ href: "/sessions", label: "Sessions" },
];

export default function Navbar() {
	const { data: session, status } = useSession();
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	const user = session?.user;
	const isAuthenticated = status === "authenticated";

	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between">
				<Link href="/" className="flex items-center space-x-2">
					<span className="text-xl font-bold tracking-tight">Sheetly</span>
				</Link>

				<nav className="hidden md:flex items-center space-x-6">
					{navItems.map(({ href, label }) => (
						<Link
							key={href}
							href={href}
							className={`text-sm transition-colors hover:text-foreground/80 ${
								pathname === href
									? "font-medium text-foreground"
									: "text-foreground/60"
							}`}
						>
							{label}
						</Link>
					))}
				</nav>

				<div className="flex items-center space-x-4">
					{isAuthenticated && (
						<Link href="/sheets/new" className="hidden md:block">
							<Button size="sm" variant="outline" className="gap-1">
								<PlusCircle className="h-4 w-4" />
								<span>New Sheet</span>
							</Button>
						</Link>
					)}

					{isAuthenticated ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-8 w-8 rounded-full"
								>
									<Avatar className="h-8 w-8">
										<AvatarImage
											src={user?.image || ""}
											alt={user?.name || ""}
										/>
										<AvatarFallback className="text-xs">
											{user?.name?.[0]}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="end" forceMount>
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium leading-none">
											{user?.name}
										</p>
										<p className="text-xs leading-none text-muted-foreground">
											{user?.email}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link
										href="/profile"
										className="cursor-pointer flex w-full items-center"
									>
										<User className="mr-2 h-4 w-4" />
										<span>Profile</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => signOut()}
									className="cursor-pointer text-destructive focus:text-destructive"
								>
									<LogOut className="mr-2 h-4 w-4" />
									<span>Log out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Link href="/auth/signin">
							<Button size="sm">Login</Button>
						</Link>
					)}

					{/* Mobile Menu */}
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button size="icon" variant="ghost" className="md:hidden">
								<MenuIcon className="h-5 w-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="pr-0">
							<div className="flex flex-col gap-6 px-2 py-4">
								<div className="flex flex-col space-y-4">
									{navItems.map(({ href, label }) => (
										<Link
											key={href}
											href={href}
											onClick={() => setOpen(false)}
											className={`text-sm transition-colors hover:text-foreground/80 ${
												pathname === href
													? "font-medium text-foreground"
													: "text-foreground/60"
											}`}
										>
											{label}
										</Link>
									))}
								</div>

								<div className="flex flex-col space-y-3">
									{isAuthenticated ? (
										<>
											<Link href="/sheets/new" onClick={() => setOpen(false)}>
												<Button
													size="sm"
													variant="outline"
													className="w-full justify-start gap-2"
												>
													<PlusCircle className="h-4 w-4" />
													New Sheet
												</Button>
											</Link>
											<Link href="/profile" onClick={() => setOpen(false)}>
												<Button
													size="sm"
													variant="ghost"
													className="w-full justify-start gap-2"
												>
													<User className="h-4 w-4" />
													Profile
												</Button>
											</Link>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => {
													signOut();
													setOpen(false);
												}}
												className="w-full justify-start gap-2 text-destructive hover:text-destructive"
											>
												<LogOut className="h-4 w-4" />
												Log out
											</Button>
										</>
									) : (
										<Link href="/auth/signin" onClick={() => setOpen(false)}>
											<Button size="sm" className="w-full">
												Login
											</Button>
										</Link>
									)}
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
