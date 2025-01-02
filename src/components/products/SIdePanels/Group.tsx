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
    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = Array.from(e.target.selectedOptions).map(
            (opt) => opt.value
        );
        onChange(options);
    };

    return (
        <div>
            <label htmlFor="grouping">Group By:</label>
            <select
                id="grouping"
                multiple
                value={selectedGroupBy}
                onChange={handleSelectionChange}
            >
                <option value="category">Category</option>
                <option value="subcategory">Subcategory</option>
            </select>
            <button onClick={onApply}>Apply Group</button>
            <button onClick={onClear}>Clear Group</button>
        </div>
    );
}
