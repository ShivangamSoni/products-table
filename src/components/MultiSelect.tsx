import { useState, useRef, useEffect } from "react";

import { X } from "lucide-react";

export function MultiSelect({
    options,
    selectedOptions,
    onChange,
    placeholder = "Select options...",
}: {
    options: string[];
    selectedOptions: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(
        (option) =>
            !selectedOptions.find((selected) => selected === option) &&
            option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option: string) => {
        onChange([...selectedOptions, option]);
        setSearchTerm("");
    };

    const handleRemove = (optionToRemove: string) => {
        onChange(selectedOptions.filter((option) => option !== optionToRemove));
    };

    return (
        <div className="w-full max-w-xl" ref={wrapperRef}>
            <div className="relative">
                <div
                    className="min-h-[42px] p-1.5 border border-gray-300 rounded-lg bg-white cursor-text flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
                    onClick={() => setIsOpen(true)}
                >
                    {selectedOptions.map((option) => (
                        <span
                            key={option}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                        >
                            {option}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(option);
                                }}
                                className="hover:bg-blue-200 rounded-full p-0.5"
                            >
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                    <input
                        type="text"
                        className="flex-1 outline-none min-w-[120px] bg-transparent"
                        placeholder={
                            selectedOptions.length === 0 ? placeholder : ""
                        }
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                    />
                </div>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-2 text-gray-500">
                                No options found
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelect(option)}
                                >
                                    {option}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
