"use client";

import type React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface PageSkeletonProps {
	children: React.ReactNode;
	className?: string;
}

interface HeaderSkeletonProps {
	showSubtitle?: boolean;
	showButton?: boolean;
	titleWidth?: string;
	subtitleWidth?: string;
	className?: string;
}

interface StatsSkeletonProps {
	count?: number;
	columns?: 2 | 3 | 4 | 5;
	height?: string;
	className?: string;
}

interface FiltersSkeletonProps {
	count?: number;
	columns?: 2 | 3 | 4 | 5;
	height?: string;
	className?: string;
}

interface GridSkeletonProps {
	count?: number;
	columns?: {
		sm?: 1 | 2;
		md?: 1 | 2 | 3;
		lg?: 1 | 2 | 3 | 4;
		xl?: 1 | 2 | 3 | 4 | 5;
	};
	height?: string;
	className?: string;
}

interface ListSkeletonProps {
	count?: number;
	height?: string;
	showAvatar?: boolean;
	showActions?: boolean;
	className?: string;
}

interface TableSkeletonProps {
	rows?: number;
	columns?: number;
	showHeader?: boolean;
	className?: string;
}

// Main PageSkeleton component
function PageSkeleton({ children, className = "" }: PageSkeletonProps) {
	return (
		<div
			className={`min-h-screen bg-gradient-to-br from-background to-muted/20 ${className}`}
		>
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				<div className="space-y-8">{children}</div>
			</div>
		</div>
	);
}

// Header Skeleton Component
function HeaderSkeleton({
	showSubtitle = true,
	showButton = true,
	titleWidth = "w-64",
	subtitleWidth = "w-96",
	className = "",
}: HeaderSkeletonProps) {
	return (
		<div className={`space-y-4 ${className}`}>
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<Skeleton className={`h-8 ${titleWidth}`} />
					{showSubtitle && <Skeleton className={`h-4 ${subtitleWidth}`} />}
				</div>
				{showButton && <Skeleton className="h-10 w-32" />}
			</div>
		</div>
	);
}

// Stats Skeleton Component
function StatsSkeleton({
	count = 4,
	columns = 4,
	height = "h-24",
	className = "",
}: StatsSkeletonProps) {
	const gridCols = {
		2: "grid-cols-1 md:grid-cols-2",
		3: "grid-cols-1 md:grid-cols-3",
		4: "grid-cols-1 md:grid-cols-4",
		5: "grid-cols-1 md:grid-cols-5",
	};

	return (
		<div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
			{Array.from({ length: count }, (_, i) => (
				<Card key={i}>
					<CardContent className="p-6">
						<div className="flex items-center gap-3">
							<Skeleton className="h-10 w-10 rounded-lg" />
							<div className="space-y-2">
								<Skeleton className="h-6 w-12" />
								<Skeleton className="h-4 w-20" />
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

// Filters Skeleton Component
function FiltersSkeleton({
	count = 4,
	columns = 4,
	height = "h-10",
	className = "",
}: FiltersSkeletonProps) {
	const gridCols = {
		2: "grid-cols-1 md:grid-cols-2",
		3: "grid-cols-1 md:grid-cols-3",
		4: "grid-cols-1 md:grid-cols-4",
		5: "grid-cols-1 md:grid-cols-5",
	};

	return (
		<Card className={className}>
			<CardContent className="p-6">
				<div className={`grid ${gridCols[columns]} gap-4`}>
					{Array.from({ length: count }, (_, i) => (
						<div key={i} className="space-y-2">
							<Skeleton className="h-4 w-20" />
							<Skeleton className={height} />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

// Grid Skeleton Component (for cards like sheets, templates, etc.)
function GridSkeleton({
	count = 6,
	columns = { md: 2, lg: 3 },
	height = "h-64",
	className = "",
}: GridSkeletonProps) {
	const gridClasses = [
		"grid gap-6",
		columns.sm && `grid-cols-${columns.sm}`,
		columns.md && `md:grid-cols-${columns.md}`,
		columns.lg && `lg:grid-cols-${columns.lg}`,
		columns.xl && `xl:grid-cols-${columns.xl}`,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={`${gridClasses} ${className}`}>
			{Array.from({ length: count }, (_, i) => (
				<Card key={i}>
					<CardContent className="p-6">
						<div className="space-y-4">
							{/* Header */}
							<div className="space-y-2">
								<Skeleton className="h-6 w-3/4" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-2/3" />
							</div>

							{/* Badges */}
							<div className="flex gap-2">
								<Skeleton className="h-6 w-16 rounded-full" />
								<Skeleton className="h-6 w-20 rounded-full" />
							</div>

							{/* Stats */}
							<div className="grid grid-cols-2 gap-4">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
							</div>

							{/* Footer */}
							<div className="flex justify-between items-center pt-2 border-t">
								<Skeleton className="h-3 w-24" />
								<Skeleton className="h-3 w-16" />
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

// List Skeleton Component (for list views)
function ListSkeleton({
	count = 5,
	height = "h-16",
	showAvatar = false,
	showActions = true,
	className = "",
}: ListSkeletonProps) {
	return (
		<div className={`space-y-4 ${className}`}>
			{Array.from({ length: count }, (_, i) => (
				<Card key={i}>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4 flex-1">
								{showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
								<div className="space-y-2 flex-1">
									<Skeleton className="h-5 w-1/3" />
									<Skeleton className="h-4 w-2/3" />
								</div>
							</div>
							{showActions && (
								<div className="flex gap-2">
									<Skeleton className="h-8 w-8" />
									<Skeleton className="h-8 w-8" />
									<Skeleton className="h-8 w-8" />
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

// Table Skeleton Component
function TableSkeleton({
	rows = 5,
	columns = 4,
	showHeader = true,
	className = "",
}: TableSkeletonProps) {
	return (
		<Card className={className}>
			<CardContent className="p-0">
				<div className="overflow-hidden">
					{showHeader && (
						<div className="border-b p-4">
							<div
								className="grid gap-4"
								style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
							>
								{Array.from({ length: columns }, (_, i) => (
									<Skeleton key={i} className="h-4 w-20" />
								))}
							</div>
						</div>
					)}
					<div className="divide-y">
						{Array.from({ length: rows }, (_, i) => (
							<div key={i} className="p-4">
								<div
									className="grid gap-4"
									style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
								>
									{Array.from({ length: columns }, (_, j) => (
										<Skeleton key={j} className="h-4 w-full" />
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Search Results Skeleton
function SearchSkeleton({
	count = 3,
	className = "",
}: {
	count?: number;
	className?: string;
}) {
	return (
		<div className={`space-y-6 ${className}`}>
			{Array.from({ length: count }, (_, i) => (
				<Card key={i}>
					<CardContent className="p-6">
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<Skeleton className="h-4 w-16 rounded-full" />
								<Skeleton className="h-4 w-20 rounded-full" />
							</div>
							<Skeleton className="h-6 w-3/4" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-2/3" />
							<div className="flex items-center gap-4 pt-2">
								<Skeleton className="h-3 w-24" />
								<Skeleton className="h-3 w-16" />
								<Skeleton className="h-3 w-20" />
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

// Form Skeleton Component
function FormSkeleton({
	fields = 4,
	showSubmit = true,
	className = "",
}: {
	fields?: number;
	showSubmit?: boolean;
	className?: string;
}) {
	return (
		<Card className={className}>
			<CardContent className="p-6">
				<div className="space-y-6">
					{Array.from({ length: fields }, (_, i) => (
						<div key={i} className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-10 w-full" />
						</div>
					))}
					{showSubmit && (
						<div className="flex justify-end gap-2 pt-4">
							<Skeleton className="h-10 w-20" />
							<Skeleton className="h-10 w-24" />
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

// Attach child components to main component
PageSkeleton.Header = HeaderSkeleton;
PageSkeleton.Stats = StatsSkeleton;
PageSkeleton.Filters = FiltersSkeleton;
PageSkeleton.Grid = GridSkeleton;
PageSkeleton.List = ListSkeleton;
PageSkeleton.Table = TableSkeleton;
PageSkeleton.Search = SearchSkeleton;
PageSkeleton.Form = FormSkeleton;

export default PageSkeleton;

// Export individual components for direct use
export {
	HeaderSkeleton,
	StatsSkeleton,
	FiltersSkeleton,
	GridSkeleton,
	ListSkeleton,
	TableSkeleton,
	SearchSkeleton,
	FormSkeleton,
};
