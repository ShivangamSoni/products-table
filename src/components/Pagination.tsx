import { ButtonHTMLAttributes } from "react";

import clsx from "clsx";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
    pageIndex,
    pageCount,
    maxButtons = 4,
    canPrevious,
    onPrevious,
    canNext,
    onNext,
    onChange,
}: {
    pageIndex: number;
    pageCount: number;
    canNext: boolean;
    canPrevious: boolean;
    onPrevious: () => void;
    onNext: () => void;
    onChange: (idx: number) => void;
    maxButtons?: number;
}) {
    const startPage = Math.max(1, pageIndex - Math.floor(maxButtons / 2));
    const endPage = Math.min(pageCount - 2, startPage + maxButtons - 1);

    return (
        <>
            <ActionButton onClick={onPrevious} disabled={!canPrevious}>
                <ChevronLeft size={20} />
            </ActionButton>

            <PageButton
                page={1}
                selected={pageIndex === 0}
                onClick={() => onChange(0)}
            />

            {startPage > 1 && <span className="px-3">...</span>}

            {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                const page = startPage + i;
                return (
                    <PageButton
                        key={page}
                        page={page + 1}
                        selected={pageIndex === page}
                        onClick={() => onChange(page)}
                    />
                );
            })}

            {endPage < pageCount - 2 && <span className="px-3">...</span>}

            <PageButton
                page={pageCount}
                selected={pageIndex === pageCount - 1}
                onClick={() => onChange(pageCount - 1)}
            />

            <ActionButton onClick={onNext} disabled={!canNext}>
                <ChevronRight size={20} />
            </ActionButton>
        </>
    );
}

function PageButton({
    page,
    selected,
    onClick,
}: {
    page: number;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            className={clsx(
                "px-3 py-1 border rounded outline-none hover:bg-gray-100 focus-visible:bg-gray-100",
                {
                    "bg-neutral-300 font-semibold": selected,
                }
            )}
            onClick={onClick}
            disabled={selected}
        >
            {page}
        </button>
    );
}
function ActionButton(
    props: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">
) {
    return (
        <button
            className="p-2 rounded text-gray-600 disabled:text-gray-300 outline-none hover:bg-gray-100 focus-visible:bg-gray-100"
            {...props}
        />
    );
}
