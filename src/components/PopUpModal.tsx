"use client";

import type React from "react";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EditModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description?: string;
	children: React.ReactNode;
	onSave: () => Promise<void> | void;
	isLoading?: boolean;
	saveButtonText?: string;
	cancelButtonText?: string;
	maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

function PopUpModal({
	isOpen,
	onClose,
	title,
	description,
	children,
	onSave,
	isLoading = false,
	saveButtonText = "Save Changes",
	cancelButtonText = "Cancel",
	maxWidth = "md",
}: EditModalProps) {
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		try {
			setIsSaving(true);
			await onSave();
			onClose();
		} catch (error) {
			// Error handling is done in the parent component
		} finally {
			setIsSaving(false);
		}
	};

	const maxWidthClasses = {
		sm: "max-w-sm",
		md: "max-w-md",
		lg: "max-w-lg",
		xl: "max-w-xl",
		"2xl": "max-w-2xl",
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				className={`${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-y-auto`}
			>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>

				<div className="py-4">{children}</div>

				<DialogFooter className="gap-2">
					<Button
						variant="outline"
						onClick={onClose}
						disabled={isSaving || isLoading}
					>
						{cancelButtonText}
					</Button>
					<Button onClick={handleSave} disabled={isSaving || isLoading}>
						{(isSaving || isLoading) && (
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						)}
						{saveButtonText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default PopUpModal;
