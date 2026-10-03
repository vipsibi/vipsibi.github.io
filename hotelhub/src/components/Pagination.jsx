export default function Pagination({ page, totalPages, onPageChange }) {
    const pages = [];
    for (let i = 1; i <= totalPages; i += 1) {
        pages.push(i);
    }

    return (
        <div className="Pagination">
            <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                Previous
            </button>
            {pages.map((p) => (
                <button
                    key={p}
                    type="button"
                    className={p === page ? 'active' : ''}
                    onClick={() => onPageChange(p)}
                >
                    {p}
                </button>
            ))}
            <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                Next
            </button>
        </div>
    );
}