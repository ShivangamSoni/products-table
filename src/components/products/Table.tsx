import { useState } from "react";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";

import mockdata from "../../data/data.json";

type ProductType = {
    id: number;
    name: string;
    category: string;
    subcategory: string;
    createdAt: string;
    updatedAt: string;
    price: number;
    sale_price?: number | null;
};

const columnHelper = createColumnHelper<ProductType>();

const columns = [
    columnHelper.accessor("id", {
        cell: (info) => info.getValue(),
        header: "ID",
    }),
    columnHelper.accessor("name", {
        cell: (info) => info.getValue(),
        header: "Name",
    }),
    columnHelper.accessor("category", {
        cell: (info) => info.getValue(),
        header: "Category",
    }),
    columnHelper.accessor("subcategory", {
        cell: (info) => info.getValue(),
        header: "Subcategory",
    }),
    columnHelper.accessor("createdAt", {
        cell: (info) => info.getValue(),
        header: "Created At",
    }),
    columnHelper.accessor("updatedAt", {
        cell: (info) => info.getValue(),
        header: "Updated At",
    }),
    columnHelper.accessor("price", {
        cell: (info) => info.getValue(),
        header: "Price",
    }),
    columnHelper.accessor("sale_price", {
        cell: (info) => info.getValue(),
        header: "Sale Price",
    }),
];

export default function ProductsTable() {
    const [data] = useState<ProductType[]>(() => [...mockdata]);

    const tableManager = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="flex flex-col gap-4 min-h-full max-w-screen-xl mx-auto py-16 px-8">
            <div>Actions</div>

            <table>
                <thead>
                    {tableManager.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="border-y">
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="py-3 text-sm font-extrabold tracking-wide"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        <ArrowUpDown
                                            className="text-neutral-300"
                                            size={20}
                                        />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
            </table>

            <div>Pagination</div>
        </div>
    );
}
