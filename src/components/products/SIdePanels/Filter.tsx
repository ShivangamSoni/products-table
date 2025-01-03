import { Table } from "@tanstack/react-table";
import { ProductType } from "../Table";
import { MultiSelect } from "../../MultiSelect";
import { useState } from "react";

export type FiltersType = {
    category: string[];
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
    const [category, setCategory] = useState<string[]>([]);

    const categories: string[] = Array.from(
        (
            tableManager.getColumn("category")?.getFacetedUniqueValues() ?? []
        ).keys()
    ).sort();

    function handleCategoryChange(selected: string[]) {
        setCategory(selected);
        onChange({
            ...filters,
            category: selected,
        });
    }

    return (
        <div>
            <MultiSelect
                options={categories}
                selectedOptions={category}
                onChange={handleCategoryChange}
                placeholder="Select Categories"
            />
        </div>
    );
}
