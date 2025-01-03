import { Table } from "@tanstack/react-table";
import { ProductType } from "../Table";
import { MultiSelect } from "../../MultiSelect";
import { ChangeEvent, useState } from "react";

export type FiltersType = {
    name: string;
    category: string[];
    subcategory: string[];
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
    const [category, setCategory] = useState<string[]>(filters.category);
    const [subcategory, setSubCategory] = useState<string[]>(
        filters.subcategory
    );

    const categories: string[] = Array.from(
        (
            tableManager.getColumn("category")?.getFacetedUniqueValues() ?? []
        ).keys()
    ).sort();

    const subcategories: string[] = Array.from(
        (
            tableManager.getColumn("subcategory")?.getFacetedUniqueValues() ??
            []
        ).keys()
    ).sort();

    function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
        onChange({ ...filters, name: e.target.value });
    }

    function handleCategoryChange(selected: string[]) {
        setCategory(selected);
        onChange({
            ...filters,
            category: selected,
        });
    }

    function handleSubCategoryChange(selected: string[]) {
        setSubCategory(selected);
        onChange({
            ...filters,
            subcategory: selected,
        });
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
        </div>
    );
}
