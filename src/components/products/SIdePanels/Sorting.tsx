import { Table } from "@tanstack/react-table";

import { ProductType } from "../Table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export default function Sorting({
    tableManager,
}: {
    tableManager: Table<ProductType>;
}) {
    return (
        <div>
            <ul className="space-y-3 mb-6">
                {tableManager.getAllLeafColumns().map((column) => {
                    const isSorted = column.getIsSorted();
                    return (
                        column.id !== "expander" && (
                            <li key={column.id}>
                                <button
                                    className="outline-none w-full flex items-center justify-start gap-3 p-3 border rounded hover:bg-gray-100 focus-visible:bg-gray-100"
                                    onClick={column.getToggleSortingHandler()}
                                >
                                    {column.columnDef.header?.toString()}
                                    {!isSorted ? (
                                        <ArrowUpDown size={16} />
                                    ) : isSorted === "asc" ? (
                                        <ArrowDown size={16} />
                                    ) : (
                                        <ArrowUp size={16} />
                                    )}
                                </button>
                            </li>
                        )
                    );
                })}
            </ul>

            <button
                className="outline-none w-full text-center p-3 border-2 border-blue-300 rounded hover:bg-gray-100 focus-visible:bg-gray-100"
                onClick={() => tableManager.resetSorting()}
            >
                Clear Sort
            </button>
        </div>
    );
}
