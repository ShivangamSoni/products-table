import React, { useState } from "react";

interface PriceRangeProps {
    min: number;
    max: number;
    defaultMin: number;
    defaultMax: number;
    step?: number;
    onChange: (values: { min: number; max: number }) => void;
    formatValue?: (value: number) => string;
}

export function PriceRange({
    min,
    max,
    defaultMin,
    defaultMax,
    step = 1,
    onChange,
    formatValue = (value) => `$${value.toLocaleString()}`,
}: PriceRangeProps) {
    const [minValue, setMinValue] = useState(defaultMin);
    const [maxValue, setMaxValue] = useState(defaultMax);
    const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);

    const calculateLeftPosition = (value: number) => {
        return ((value - min) / (max - min)) * 100;
    };

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Number(e.target.value), maxValue - step);
        setMinValue(value);
        onChange({ min: value, max: maxValue });
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(e.target.value), minValue + step);
        setMaxValue(value);
        onChange({ min: minValue, max: value });
    };

    return (
        <div className="relative w-full pt-10 pb-4 px-2">
            {/* Track and Range */}
            <div className="absolute h-2 w-full bg-gray-200 rounded">
                <div
                    className="absolute h-full bg-blue-500 rounded"
                    style={{
                        left: `${calculateLeftPosition(minValue)}%`,
                        right: `${100 - calculateLeftPosition(maxValue)}%`,
                    }}
                />
            </div>

            {/* Min Thumb Tooltip */}
            <div
                className={`absolute -top-2 transform -translate-x-1/2 ${
                    isDragging === "min" ? "z-30" : "z-20"
                }`}
                style={{ left: `${calculateLeftPosition(minValue)}%` }}
            >
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm mb-1 whitespace-nowrap">
                    {formatValue(minValue)}
                </div>
            </div>

            {/* Max Thumb Tooltip */}
            <div
                className={`absolute -top-2 transform -translate-x-1/2 ${
                    isDragging === "max" ? "z-30" : "z-20"
                }`}
                style={{ left: `${calculateLeftPosition(maxValue)}%` }}
            >
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm mb-1 whitespace-nowrap">
                    {formatValue(maxValue)}
                </div>
            </div>

            {/* Range Inputs */}
            <input
                type="range"
                min={min}
                max={max}
                value={minValue}
                step={step}
                onChange={handleMinChange}
                onMouseDown={() => setIsDragging("min")}
                onMouseUp={() => setIsDragging(null)}
                onTouchStart={() => setIsDragging("min")}
                onTouchEnd={() => setIsDragging(null)}
                className="absolute w-full top-10 h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxValue}
                step={step}
                onChange={handleMaxChange}
                onMouseDown={() => setIsDragging("max")}
                onMouseUp={() => setIsDragging(null)}
                onTouchStart={() => setIsDragging("max")}
                onTouchEnd={() => setIsDragging(null)}
                className="absolute w-full top-10 h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
            />
        </div>
    );
}
