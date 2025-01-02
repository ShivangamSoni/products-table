import { useState } from "react";
import { Table, VisibilityState } from "@tanstack/react-table";

import { ProductType } from "../Table";

export default function Toggle({
    tableManager,
    setColumnVisibility,
}: {
    tableManager: Table<ProductType>;
    setColumnVisibility: (v: object) => void;
}) {
    const [visibility, setVisibility] = useState<VisibilityState>(
        tableManager.getAllLeafColumns().reduce(
            (acc, column) => ({
                ...acc,
                [column.id]: column.getIsVisible(),
            }),
            {}
        )
    );

    function apply() {
        setColumnVisibility(visibility);
    }

    function clear() {
        setVisibility((prev) =>
            Object.keys(prev).reduce((acc, v) => ({ ...acc, [v]: true }), {})
        );
    }

    return (
        <div>
            <ul className="space-y-3 mb-6">
                {tableManager.getAllLeafColumns().map((column) => (
                    <li key={column.id}>
                        <label className="flex items-center justify-between cursor-pointer gap-3 p-3 border rounded hover:bg-gray-100 focus-visible:bg-gray-100">
                            {column.id}
                            <input
                                type="checkbox"
                                checked={visibility[column.id]}
                                onChange={() =>
                                    setVisibility((prev) => ({
                                        ...prev,
                                        [column.id]: !prev[column.id],
                                    }))
                                }
                                className="sr-only peer"
                            />
                            <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                    </li>
                ))}
            </ul>

            <button
                className="mb-3 outline-none w-full text-center p-3 border-2 border-blue-300 rounded hover:bg-gray-100 focus-visible:bg-gray-100"
                onClick={clear}
            >
                Show all columns
            </button>
            <button
                className="outline-none w-full text-center p-3 border-2 border-blue-300 rounded hover:bg-gray-100 focus-visible:bg-gray-100"
                onClick={apply}
            >
                Apply
            </button>
        </div>
    );
}
