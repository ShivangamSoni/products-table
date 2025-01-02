import { MultiSelect } from "../../MultiSelect";

export default function Group({
    selectedGroupBy,
    onChange,
    onApply,
    onClear,
}: {
    selectedGroupBy: string[];
    onChange: (selected: string[]) => void;
    onApply: () => void;
    onClear: () => void;
}) {
    return (
        <div>
            <MultiSelect
                options={["category", "subcategory"]}
                selectedOptions={selectedGroupBy}
                onChange={onChange}
            />

            <button
                className="mb-3 mt-6 outline-none w-full text-center p-3 border-2 border-blue-300 rounded hover:bg-gray-100 focus-visible:bg-gray-100"
                onClick={onClear}
            >
                Clear Group
            </button>
            <button
                className="outline-none w-full text-center p-3 border-2 border-blue-300 rounded hover:bg-gray-100 focus-visible:bg-gray-100"
                onClick={onApply}
            >
                Apply Group
            </button>
        </div>
    );
}
