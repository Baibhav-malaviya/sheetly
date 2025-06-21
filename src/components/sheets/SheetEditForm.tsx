"use client";

import type React from "react";
import { useState } from "react";
import type { ISheetDocument as ISheet } from "@/types/sheet.type";
import type { UpdateSheetData } from "@/lib/api/sheets";
import { SheetCategory, SheetDifficulty } from "@/types/sheet.type";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface SheetEditFormProps {
	sheet: ISheet;
	onSubmit: (data: UpdateSheetData) => Promise<void>;
	children?: (formData: UpdateSheetData, isValid: boolean) => React.ReactNode;
}

export default function SheetEditForm({
	sheet,
	onSubmit,
	children,
}: SheetEditFormProps) {
	const [formData, setFormData] = useState<UpdateSheetData>({
		name: sheet.name,
		description: sheet.description || "",
		category: sheet.category,
		difficulty: sheet.difficulty,
		isPublic: sheet.isPublic,
		tags: sheet.tags || [],
	});

	const [newTag, setNewTag] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name?.trim()) {
			newErrors.name = "Name is required";
		} else if (formData.name.trim().length < 3) {
			newErrors.name = "Name must be at least 3 characters";
		}

		if (formData.description && formData.description.length > 500) {
			newErrors.description = "Description must be less than 500 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (validateForm()) {
			await onSubmit(formData);
		}
	};

	const handleInputChange = (field: keyof UpdateSheetData, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const addTag = () => {
		if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
			setFormData((prev) => ({
				...prev,
				tags: [...(prev.tags || []), newTag.trim()],
			}));
			setNewTag("");
		}
	};

	const removeTag = (tagToRemove: string) => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
		}));
	};

	const isValid = validateForm();

	// If children function is provided, use it for custom rendering
	if (children) {
		return <>{children(formData, isValid)}</>;
	}

	return (
		<div className="space-y-6">
			{/* Name */}
			<div className="space-y-2">
				<Label htmlFor="name">Name *</Label>
				<Input
					id="name"
					value={formData.name || ""}
					onChange={(e) => handleInputChange("name", e.target.value)}
					placeholder="Enter sheet name..."
					className={errors.name ? "border-red-500" : ""}
				/>
				{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
			</div>

			{/* Description */}
			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					value={formData.description || ""}
					onChange={(e) => handleInputChange("description", e.target.value)}
					placeholder="Enter sheet description..."
					rows={3}
					className={errors.description ? "border-red-500" : ""}
				/>
				<div className="flex justify-between text-xs text-muted-foreground">
					<span>
						{errors.description && (
							<span className="text-red-500">{errors.description}</span>
						)}
					</span>
					<span>{formData.description?.length || 0}/500</span>
				</div>
			</div>

			{/* Category and Difficulty */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>Category</Label>
					<Select
						value={formData.category}
						onValueChange={(value) => handleInputChange("category", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select category" />
						</SelectTrigger>
						<SelectContent>
							{Object.values(SheetCategory).map((category) => (
								<SelectItem key={category} value={category}>
									{category}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label>Difficulty</Label>
					<Select
						value={formData.difficulty}
						onValueChange={(value) => handleInputChange("difficulty", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select difficulty" />
						</SelectTrigger>
						<SelectContent>
							{Object.values(SheetDifficulty).map((difficulty) => (
								<SelectItem key={difficulty} value={difficulty}>
									<div className="flex items-center gap-2">
										<div
											className={`w-2 h-2 rounded-full ${
												difficulty === "Easy"
													? "bg-green-500"
													: difficulty === "Medium"
													? "bg-yellow-500"
													: "bg-red-500"
											}`}
										/>
										{difficulty}
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Public/Private Toggle */}
			<div className="flex items-center justify-between p-4 border rounded-lg">
				<div className="space-y-1">
					<Label htmlFor="isPublic" className="text-base font-medium">
						Public Sheet
					</Label>
					<p className="text-sm text-muted-foreground">
						Make this sheet visible to other users in the community
					</p>
				</div>
				<Switch
					id="isPublic"
					checked={formData.isPublic}
					onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
				/>
			</div>

			{/* Tags */}
			<div className="space-y-2">
				<Label>Tags</Label>
				<div className="flex flex-wrap gap-2 mb-2">
					{formData.tags?.map((tag) => (
						<Badge key={tag} variant="secondary" className="gap-1">
							{tag}
							<Button
								variant="ghost"
								size="sm"
								className="h-auto p-0 hover:bg-transparent"
								onClick={() => removeTag(tag)}
							>
								<X className="h-3 w-3" />
							</Button>
						</Badge>
					))}
				</div>
				<div className="flex gap-2">
					<Input
						value={newTag}
						onChange={(e) => setNewTag(e.target.value)}
						placeholder="Add a tag..."
						onKeyPress={(e) =>
							e.key === "Enter" && (e.preventDefault(), addTag())
						}
					/>
					<Button
						type="button"
						variant="outline"
						onClick={addTag}
						disabled={!newTag.trim()}
					>
						<Plus className="h-4 w-4" />
					</Button>
				</div>
				<p className="text-xs text-muted-foreground">
					Press Enter or click + to add a tag
				</p>
			</div>
		</div>
	);
}
