import { ChangeEvent, useState } from "react";
import { Table } from "@tanstack/react-table";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { ProductType } from "../Table";
import { MultiSelect } from "../../MultiSelect";
import { PriceRange } from "../../PriceRange";
import { formatDate, getMinMaxDates } from "../../../utils/date";
import moment from "moment";

export type FiltersType = {
    name: string;
    category: string[];
    subcategory: string[];
    createdAt: string[];
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

    const dateRange = getMinMaxDates(
        Array.from(
            tableManager.getColumn("createdAt")!.getFacetedUniqueValues().keys()
        )
    );
    const [isCreatedDatePickerOpen, setIsCreatedDatePickerOpen] =
        useState(false);
    const [ranges, setRanges] = useState<Range[]>([
        {
            startDate: new Date(dateRange[0]) as unknown as Date,
            endDate: new Date(dateRange[1]) as unknown as Date,
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

    function handleCategoryChange(selected: string[]) {
        setCategory(selected);
        onChange({
            ...filters,
            category: selected.length === 0 ? [""] : selected,
        });
    }

    function handleSubCategoryChange(selected: string[]) {
        setSubCategory(selected);
        onChange({
            ...filters,
            subcategory: selected.length === 0 ? [""] : selected,
        });
    }

    function handleDateChange(item: RangeKeyDict) {
        const newRange = item.selection;
        setRanges([newRange]);
        onChange({
            ...filters,
            createdAt: [
                moment(newRange.startDate).format("DD-MMM-YYYY"),
                moment(newRange.endDate).format("DD-MMM-YYYY"),
            ],
        });
    }

    function handlePriceChange({ min, max }: { min: number; max: number }) {
        onChange({ ...filters, price: [min, max] });
    }

    function handleSalePriceChange({ min, max }: { min: number; max: number }) {
        onChange({ ...filters, sale_price: [min, max] });
    }

    return (
        <div className="space-y-3">
            <input
                type="text"
                value={filters.name}
                onChange={handleNameChange}
                placeholder="Search Name"
            />

            <MultiSelect
                options={categories}
                selectedOptions={category}
                onChange={handleCategoryChange}
                placeholder="Select Categories"
            />

            <MultiSelect
                options={subcategories}
                selectedOptions={subcategory}
                onChange={handleSubCategoryChange}
                placeholder="Select Sub-Categories"
            />

            <div className="grid relative">
                <button
                    onClick={() => setIsCreatedDatePickerOpen((prev) => !prev)}
                >
                    {formatDate(ranges[0].startDate ?? "")} To{" "}
                    {formatDate(ranges[0].endDate ?? "")}
                </button>
                {isCreatedDatePickerOpen && (
                    <div className="absolute top-full z-[1000] border border-black">
                        <DateRange
                            editableDateInputs
                            onChange={handleDateChange}
                            moveRangeOnFirstSelection={false}
                            ranges={ranges}
                            minDate={new Date(dateRange[0])}
                            maxDate={new Date(dateRange[1])}
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

            <PriceRange
                min={priceRange![0]}
                max={priceRange![1]}
                defaultMin={minPrice}
                defaultMax={maxPrice}
                onChange={handlePriceChange}
            />

            <PriceRange
                min={salePriceRange![0]}
                max={salePriceRange![1]}
                defaultMin={minSalePrice}
                defaultMax={maxSalePrice}
                onChange={handleSalePriceChange}
            />
        </div>
    );
}
