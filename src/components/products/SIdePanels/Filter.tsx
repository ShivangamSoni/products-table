import { ChangeEvent, ReactNode, useState } from "react";
import { Table } from "@tanstack/react-table";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import moment from "moment";

import { ProductType } from "../Table";
import { MultiSelect } from "../../MultiSelect";
import { PriceRange } from "../../PriceRange";
import { formatDate, getMinMaxDates } from "../../../utils/date";
import { RotateCcw } from "lucide-react";

export type FiltersType = {
    name: string;
    category: string[];
    subcategory: string[];
    createdAt: string[];
    updatedAt: string[];
    price: number[];
    sale_price: number[];
};

export default function Filter({
    tableManager,
    filters,
    onChange,
}: {
    tableManager: Table<ProductType>;
    filters: FiltersType;
    onChange: (filter: FiltersType) => void;
}) {
    const [category, setCategory] = useState<string[]>(
        filters.category[0] === "" ? [] : filters.category
    );
    const [subcategory, setSubCategory] = useState<string[]>(
        filters.subcategory[0] === "" ? [] : filters.subcategory
    );

    const categories: string[] = Array.from(
        tableManager.getColumn("category")!.getFacetedUniqueValues().keys()
    ).sort();

    const subcategories: string[] = Array.from(
        tableManager.getColumn("subcategory")!.getFacetedUniqueValues().keys()
    ).sort();

    const createdDateRange = getMinMaxDates(
        Array.from(
            tableManager.getColumn("createdAt")!.getFacetedUniqueValues().keys()
        )
    );
    const [isCreatedDatePickerOpen, setIsCreatedDatePickerOpen] =
        useState(false);
    const [createdRanges, setCreatedRanges] = useState<Range[]>([
        {
            startDate:
                filters.createdAt[0] !== ""
                    ? new Date(filters.createdAt[0])
                    : new Date(createdDateRange[0]),
            endDate:
                filters.createdAt[1] !== ""
                    ? new Date(filters.createdAt[1])
                    : new Date(createdDateRange[1]),
            key: "selection",
        },
    ]);

    const updatedDateRange = getMinMaxDates(
        Array.from(
            tableManager.getColumn("updatedAt")!.getFacetedUniqueValues().keys()
        )
    );
    const [isUpdatedDatePickerOpen, setIsUpdatedDatePickerOpen] =
        useState(false);
    const [updatedRanges, setUpdatedRanges] = useState<Range[]>([
        {
            startDate:
                filters.updatedAt[0] !== ""
                    ? new Date(filters.updatedAt[0])
                    : new Date(updatedDateRange[0]),
            endDate:
                filters.updatedAt[1] !== ""
                    ? new Date(filters.updatedAt[1])
                    : new Date(updatedDateRange[1]),
            key: "selection",
        },
    ]);

    const priceRange = tableManager
        .getColumn("price")!
        .getFacetedMinMaxValues();
    const minPrice = filters.price[0] ?? priceRange![0];
    const maxPrice = filters.price[1] ?? priceRange![1];

    const salePriceRange = tableManager
        .getColumn("sale_price")!
        .getFacetedMinMaxValues();
    const minSalePrice = filters.sale_price[0] ?? salePriceRange![0];
    const maxSalePrice = filters.sale_price[1] ?? salePriceRange![1];

    function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
        onChange({ ...filters, name: e.target.value });
    }

    const resetName = () => onChange({ ...filters, name: "" });

    function handleCategoryChange(selected: string[]) {
        setCategory(selected);
        onChange({
            ...filters,
            category: selected.length === 0 ? [""] : selected,
        });
    }

    const resetCategory = () => handleCategoryChange([]);

    function handleSubCategoryChange(selected: string[]) {
        setSubCategory(selected);
        onChange({
            ...filters,
            subcategory: selected.length === 0 ? [""] : selected,
        });
    }

    const resetSubCategory = () => handleSubCategoryChange([]);

    function handleCreatedDateChange(item: RangeKeyDict) {
        const newRange = item.selection;
        setCreatedRanges([newRange]);
        onChange({
            ...filters,
            createdAt: [
                moment(newRange.startDate).format("DD-MMM-YYYY"),
                moment(newRange.endDate).format("DD-MMM-YYYY"),
            ],
        });
    }

    const resetCreatedAt = () =>
        handleCreatedDateChange({
            selection: {
                startDate: new Date(createdDateRange[0]),
                endDate: new Date(createdDateRange[1]),
                key: "selection",
            },
        });

    function handleUpdatedDateChange(item: RangeKeyDict) {
        const newRange = item.selection;
        setUpdatedRanges([newRange]);
        onChange({
            ...filters,
            updatedAt: [
                moment(newRange.startDate).format("DD-MMM-YYYY"),
                moment(newRange.endDate).format("DD-MMM-YYYY"),
            ],
        });
    }

    const resetUpdatedAt = () =>
        handleUpdatedDateChange({
            selection: {
                startDate: new Date(updatedDateRange[0]),
                endDate: new Date(updatedDateRange[1]),
                key: "selection",
            },
        });

    function handlePriceChange({ min, max }: { min: number; max: number }) {
        onChange({ ...filters, price: [min, max] });
    }

    const resetPrice = () =>
        handlePriceChange({
            min: priceRange![0],
            max: priceRange![1],
        });

    function handleSalePriceChange({ min, max }: { min: number; max: number }) {
        onChange({ ...filters, sale_price: [min, max] });
    }

    const resetSalePrice = () =>
        handleSalePriceChange({
            min: salePriceRange![0],
            max: salePriceRange![1],
        });

    function resetFilters() {
        resetCategory();
        resetSubCategory();
        resetCreatedAt();
        resetUpdatedAt();
        resetPrice();
        resetSalePrice();
        resetName();
    }

    return (
        <div className="space-y-3">
            <FilterItem
                title="Name"
                btnLabel="Clear Name Filter"
                onClear={resetName}
            >
                <input
                    className="min-h-[42px] w-full p-1.5 border border-gray-300 rounded-lg bg-white cursor-text flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
                    type="text"
                    value={filters.name}
                    onChange={handleNameChange}
                    placeholder="Search Name"
                />
            </FilterItem>

            <FilterItem
                title="Category"
                btnLabel="Clear Category Filter"
                onClear={resetCategory}
            >
                <MultiSelect
                    options={categories}
                    selectedOptions={category}
                    onChange={handleCategoryChange}
                    placeholder="Select Categories"
                />
            </FilterItem>

            <FilterItem
                title="Sub Category"
                btnLabel="Clear Sub-Category Filter"
                onClear={resetSubCategory}
            >
                <MultiSelect
                    options={subcategories}
                    selectedOptions={subcategory}
                    onChange={handleSubCategoryChange}
                    placeholder="Select Sub-Categories"
                />
            </FilterItem>

            <FilterItem
                title="Created At"
                btnLabel="Reset Created At Filter"
                onClear={resetCreatedAt}
            >
                <div className="grid relative">
                    <button
                        className="min-h-[42px] p-1.5 border border-gray-300 rounded-lg bg-white flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
                        onClick={() =>
                            setIsCreatedDatePickerOpen((prev) => !prev)
                        }
                    >
                        {formatDate(createdRanges[0].startDate ?? "")} To{" "}
                        {formatDate(createdRanges[0].endDate ?? "")}
                    </button>
                    {isCreatedDatePickerOpen && (
                        <div className="absolute top-full z-[1000] border border-black">
                            <DateRange
                                editableDateInputs
                                onChange={handleCreatedDateChange}
                                moveRangeOnFirstSelection={false}
                                ranges={createdRanges}
                                minDate={new Date(createdDateRange[0])}
                                maxDate={new Date(createdDateRange[1])}
                                onRangeFocusChange={(range) => {
                                    // Both these values are 0 when the range selection has been made
                                    if (range[0] === 0 && range[1] === 0) {
                                        setIsCreatedDatePickerOpen(false);
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
            </FilterItem>

            <FilterItem
                title="Updated At"
                btnLabel="Reset Updated At Filter"
                onClear={resetUpdatedAt}
            >
                <div className="grid relative">
                    <button
                        className="min-h-[42px] p-1.5 border border-gray-300 rounded-lg bg-white cursor-text flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
                        onClick={() =>
                            setIsUpdatedDatePickerOpen((prev) => !prev)
                        }
                    >
                        {formatDate(updatedRanges[0].startDate ?? "")} To{" "}
                        {formatDate(updatedRanges[0].endDate ?? "")}
                    </button>
                    {isUpdatedDatePickerOpen && (
                        <div className="absolute top-full z-[1000] border border-black">
                            <DateRange
                                editableDateInputs
                                onChange={handleUpdatedDateChange}
                                moveRangeOnFirstSelection={false}
                                ranges={updatedRanges}
                                minDate={new Date(updatedDateRange[0])}
                                maxDate={new Date(updatedDateRange[1])}
                                onRangeFocusChange={(range) => {
                                    // Both these values are 0 when the range selection has been made
                                    if (range[0] === 0 && range[1] === 0) {
                                        setIsUpdatedDatePickerOpen(false);
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
            </FilterItem>

            <FilterItem
                title="Price"
                btnLabel="Reset Price"
                onClear={resetPrice}
            >
                <div className="pl-5 pt-2">
                    <PriceRange
                        min={priceRange![0]}
                        max={priceRange![1]}
                        defaultMin={minPrice}
                        defaultMax={maxPrice}
                        onChange={handlePriceChange}
                    />
                </div>
            </FilterItem>

            <FilterItem
                title="Sale Price"
                btnLabel="Reset Sale Price"
                onClear={resetSalePrice}
            >
                <div className="pl-5 pt-2">
                    <PriceRange
                        min={salePriceRange![0]}
                        max={salePriceRange![1]}
                        defaultMin={minSalePrice}
                        defaultMax={maxSalePrice}
                        onChange={handleSalePriceChange}
                    />
                </div>
            </FilterItem>

            <button
                className="outline-none w-full text-center p-3 border-2 border-blue-300 rounded hover:bg-gray-100 focus-visible:bg-gray-100"
                onClick={resetFilters}
            >
                Clear Filters
            </button>
        </div>
    );
}

function FilterItem({
    title,
    btnLabel,
    children,
    onClear,
}: {
    title: string;
    btnLabel: string;
    children: ReactNode;
    onClear: () => void;
}) {
    return (
        <div className="bg-blue-50 border p-2 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
                <span className="font-semibold">{title}</span>
                <button
                    onClick={onClear}
                    className="outline-none  p-0.5 rounded border border-transparent hover:border-current hover:bg-gray-200 focus-visible:border-current focus-visible:bg-gray-200"
                >
                    <span className="sr-only">{btnLabel}</span>
                    <RotateCcw size={20} />
                </button>
            </div>
            <div className="pr-6">{children}</div>
        </div>
    );
}
