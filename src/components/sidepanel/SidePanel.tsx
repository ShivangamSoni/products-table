import clsx from "clsx";

import { X } from "lucide-react";

export default function SidePanel({
    title,
    isOpen,
    onClose,
    children,
}: {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Overlay */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/50 transition-opacity",
                    {
                        "opacity-100": isOpen,
                        "opacity-0 pointer-events-none": !isOpen,
                    }
                )}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={clsx(
                    "fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
                    {
                        "translate-x-0": isOpen,
                        "translate-x-full": !isOpen,
                    }
                )}
            >
                <div className="p-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <>{children}</>
                </div>
            </div>
        </>
    );
}
