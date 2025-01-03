import { useState } from "react";
import {
    ColumnFiltersState,
    ColumnSort,
    createColumnHelper,
    FilterFn,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFacetedMinMaxValues,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getGroupedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    GroupingState,
    useReactTable,
} from "@tanstack/react-table";
import Fuse from "fuse.js";
import { clsx } from "clsx";
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronDown,
    ChevronRight,
    ChevronsRight,
    ChevronUp,
    Eye,
    Layers,
    ListFilter,
} from "lucide-react";

import { Pagination } from "../Pagination";
import SidePanel from "../sidepanel/SidePanel";
import Sorting from "./SIdePanels/Sorting";
import Toggle from "./SIdePanels/Toggle";
import Group from "./SIdePanels/Group";
import Filter, { FiltersType } from "./SIdePanels/Filter";

import { formatDate } from "../../utils/date";
import mockdata from "../../data/data.json";

export type ProductType = {
    id: number;
    name: string;
    category: string;
    subcategory: string;
    createdAt: string;
    updatedAt: string;
    price: number;
    sale_price?: number | null;
};

const fuzzyFilter: FilterFn<ProductType> = (
    row,
    columnId,
    filterValue: string
) => {
    // Return true if there's no filter value
    if (!filterValue || typeof filterValue !== "string") {
        return true;
    }

    const searchValue = row.getValue(columnId);

    // Return false if the value to search is not a string
    if (typeof searchValue !== "string") {
        return false;
    }

    const fuse = new Fuse([searchValue], {
        threshold: 0.5,
    });

    return fuse.search(filterValue).length > 0;
};

const columnHelper = createColumnHelper<ProductType>();

const columns = [
    columnHelper.accessor("id", {
        cell: (info) => {
            if (info.cell.getIsAggregated()) {
                return null;
            }
            return info.getValue();
        },
        header: "ID",
    }),
    columnHelper.accessor("name", {
        cell: (info) => {
            if (info.cell.getIsAggregated()) {
                return null;
            }
            return info.getValue();
        },
        header: "Name",
        filterFn: fuzzyFilter,
    }),
    columnHelper.accessor("category", {
        cell: (info) => {
            if (info.cell.getIsAggregated()) {
                return null;
            }
            return info.getValue();
        },
        header: "Category",
        filterFn: "arrIncludesSome",
    }),
    columnHelper.accessor("subcategory", {
        cell: (info) => {
            if (info.cell.getIsAggregated()) {
                return null;
            }
            return info.getValue();
        },
        header: "Subcategory",
        filterFn: "arrIncludesSome",
    }),
    columnHelper.accessor("createdAt", {
        cell: (info) => {
            if (info.cell.getIsAggregated()) {
                return null;
            }
            return formatDate(info.getValue());
        },
        header: "Created At",
    }),
    columnHelper.accessor("updatedAt", {
        cell: (info) => {
            if (info.cell.getIsAggregated()) {
                return null;
            }
            return formatDate(info.getValue());
        },
        header: "Updated At",
    }),
    columnHelper.accessor("price", {
        cell: (info) => {
            if (info.cell.getIsAggregated()) {
                return null;
            }
            return info.getValue();
        },
        header: "Price",
        filterFn: "inNumberRange",
    }),
    columnHelper.accessor("sale_price", {
        cell: (info) => {
            if (info.cell.getIsAggregated()) {
                return null;
            }
            return info.getValue();
        },
        header: "Sale Price",
    }),
];

const expanderColumn = columnHelper.display({
    id: "expander",
    header: () => <ChevronsRight size={16} />,
    cell: ({ row }) => {
        const canExpand = row.getCanExpand();
        const isExpanded = row.getIsExpanded();
        return (
            <button disabled={!canExpand} onClick={() => row.toggleExpanded()}>
                {canExpand ? (
                    isExpanded ? (
                        <ChevronUp size={16} />
                    ) : (
                        <ChevronDown size={16} />
                    )
                ) : (
                    <ChevronRight className="text-gray-300" size={16} />
                )}
            </button>
        );
    },
});

const defaultFilterState: FiltersType = {
    name: "",
    category: [""],
    subcategory: [""],
    price: [],
};

export default function ProductsTable() {
    const [data] = useState<ProductType[]>(() => [...mockdata]);

    const [sidePanelStatus, setSidePanelStatus] = useState<
        "close" | "sort" | "toggle" | "group" | "filter"
    >("filter");

    const [sorting, setSorting] = useState<ColumnSort[]>([]);

    const [columnVisibility, setColumnVisibility] = useState({});

    const [grouping, setGrouping] = useState<GroupingState>([]);
    const [selectedGroupBy, setSelectedGroupBy] = useState<string[]>([]);
    const [expanded, setExpanded] = useState({});

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sidePanelFilters, setSidePanelFilters] =
        useState<FiltersType>(defaultFilterState);

    const tableManager = useReactTable({
        data,
        columns: grouping.length == 0 ? columns : [expanderColumn, ...columns],

        state: {
            sorting,
            columnVisibility,
            grouping,
            expanded,
            columnFilters,
        },

        initialState: {
            pagination: {
                pageSize: 10,
            },
        },

        // Required for everything
        getCoreRowModel: getCoreRowModel(),

        // Pagination
        getPaginationRowModel: getPaginationRowModel(),

        // Sorting
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        enableMultiSort: true,
        isMultiSortEvent: () => true,

        // Visibility/Toggle
        onColumnVisibilityChange: setColumnVisibility,

        // Grouping
        getGroupedRowModel: getGroupedRowModel(),
        onGroupingChange: setGrouping,
        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange: setExpanded,

        // Filtering
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
    });

    function closeSidePanel() {
        setSidePanelStatus("close");
    }

    const handleApplyGroup = () => {
        setGrouping(selectedGroupBy);
    };

    const handleClearGroup = () => {
        setSelectedGroupBy([]);
        setGrouping([]);
    };

    const handleFiltersChange = (newFilters: FiltersType) => {
        setSidePanelFilters(newFilters);
        setColumnFilters(
            Object.entries(newFilters).map(([key, value]) => ({
                id: key,
                value: value,
            }))
        );
    };

    return (
        <div className="flex flex-col gap-4 min-h-full max-w-screen-xl mx-auto py-16 px-8">
            <div className="flex items-center justify-end gap-6">
                <button
                    onClick={() => setSidePanelStatus("toggle")}
                    className="outline-none  p-0.5 rounded border border-transparent hover:border-current hover:bg-gray-200 focus-visible:border-current focus-visible:bg-gray-200"
                >
                    <span className="sr-only">Toggle Columns</span>
                    <Eye className="text-gray-600" size={24} />
                </button>
                <button
                    onClick={() => setSidePanelStatus("sort")}
                    className="outline-none p-0.5 rounded border border-transparent hover:border-current hover:bg-gray-200 focus-visible:border-current focus-visible:bg-gray-200"
                >
                    <span className="sr-only">Sort Data</span>
                    <ArrowUpDown className="text-gray-600" size={24} />
                </button>
                <button
                    onClick={() => setSidePanelStatus("filter")}
                    className="outline-none  p-0.5 rounded border border-transparent hover:border-current hover:bg-gray-200 focus-visible:border-current focus-visible:bg-gray-200"
                >
                    <span className="sr-only">Filter</span>
                    <ListFilter className="text-gray-600" size={24} />
                </button>
                <button
                    onClick={() => setSidePanelStatus("group")}
                    className="outline-none  p-0.5 rounded border border-transparent hover:border-current hover:bg-gray-200 focus-visible:border-current focus-visible:bg-gray-200"
                >
                    <span className="sr-only">Group Data</span>
                    <Layers className="text-gray-600" size={24} />
                </button>
            </div>

            <table>
                <thead>
                    {tableManager.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="border-y">
                            {headerGroup.headers.map((header) => {
                                const isSorted = header.column.getIsSorted();
                                return (
                                    <th
                                        key={header.id}
                                        className="py-3 font-extrabold tracking-wide"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}

                                            {header.id !== "expander" && (
                                                <>
                                                    {!isSorted ? (
                                                        <ArrowUpDown
                                                            size={16}
                                                            className="text-neutral-300"
                                                        />
                                                    ) : isSorted === "asc" ? (
                                                        <ArrowDown
                                                            size={16}
                                                            className="text-neutral-300"
                                                        />
                                                    ) : (
                                                        <ArrowUp
                                                            size={16}
                                                            className="text-neutral-300"
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>

                <tbody>
                    {tableManager.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className={clsx("py-2", {
                                        "text-center": cell.column.id !== "id",
                                    })}
                                >
                                    {cell.getIsGrouped() ? (
                                        <button
                                            onClick={row.getToggleExpandedHandler()}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}{" "}
                                            ({row.subRows.length})
                                        </button>
                                    ) : cell.getIsAggregated() ? (
                                        flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )
                                    ) : cell.getIsPlaceholder() ? null : (
                                        flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex items-center justify-center space-x-2">
                <Pagination
                    pageCount={tableManager.getPageCount()}
                    pageIndex={tableManager.getState().pagination.pageIndex}
                    canPrevious={tableManager.getCanPreviousPage()}
                    canNext={tableManager.getCanNextPage()}
                    onChange={(idx) => tableManager.setPageIndex(idx)}
                    onPrevious={tableManager.previousPage}
                    onNext={tableManager.nextPage}
                />
            </div>

            {sidePanelStatus === "sort" && (
                <SidePanel
                    title={"Sorting Options"}
                    isOpen
                    onClose={closeSidePanel}
                >
                    <Sorting tableManager={tableManager} />
                </SidePanel>
            )}

            {sidePanelStatus === "toggle" && (
                <SidePanel
                    title={"Show/Hide Columns"}
                    isOpen
                    onClose={closeSidePanel}
                >
                    <Toggle
                        tableManager={tableManager}
                        setColumnVisibility={setColumnVisibility}
                    />
                </SidePanel>
            )}

            {sidePanelStatus === "group" && (
                <SidePanel
                    title={"Create Groups"}
                    isOpen
                    onClose={closeSidePanel}
                >
                    <Group
                        selectedGroupBy={selectedGroupBy}
                        onChange={setSelectedGroupBy}
                        onApply={handleApplyGroup}
                        onClear={handleClearGroup}
                    />
                </SidePanel>
            )}

            {sidePanelStatus === "filter" && (
                <SidePanel title={"Filters"} isOpen onClose={closeSidePanel}>
                    <Filter
                        tableManager={tableManager}
                        filters={sidePanelFilters}
                        onChange={handleFiltersChange}
                    />
                </SidePanel>
            )}
        </div>
    );
}
