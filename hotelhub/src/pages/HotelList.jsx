import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { clearSuccess, deleteHotel, fetchHotels } from '../features/hotels/hotelSlice';
import HotelCard from '../components/HotelCard';
import Pagination from '../components/Pagination';
import SuccessModal from '../components/SuccessModal';

export default function HotelList() {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { items, page, totalPages, total, loading, error, successMessage } = useSelector(
        (state) => state.hotels
    );

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [locationType, setLocationType] = useState('all');

    useEffect(() => {
        dispatch(fetchHotels({ page: 1, search, minPrice, maxPrice, locationType }));
    }, [dispatch, search, minPrice, maxPrice, locationType]);

    const onFilter = (e) => {
        e.preventDefault();
        dispatch(fetchHotels({ page: 1, search, minPrice, maxPrice, locationType }));
    };

    const onPageChange = (p) => {
        dispatch(fetchHotels({ page: p, search, minPrice, maxPrice, locationType }));
    };

    const onDelete = async (hotel) => {
        const ok = window.confirm(`Delete ${hotel.name}?`);
        if (ok) {
            await dispatch(deleteHotel(hotel.id));
        }
    };

    return (
        <>
            <Helmet>
                <title>Manage Hotels | ERAMIKA</title>
                <meta name="description" content="Browse, search, and manage all hotels." />
            </Helmet>

            <div className="page-head">
                <div>
                    <h1>Manage Hotels</h1>
                    <p>Browse and manage all hotels</p>
                </div>
                <Link className="btn btn-primary" to="/hotels/add">
                    + Add Hotel
                </Link>
            </div>

            <form className="filters" onSubmit={onFilter}>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by hotel name..."
                />
                <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                />
                <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                />
                <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                    aria-label="Filter by stay type"
                >
                    <option value="all">All stay types</option>
                    <option value="city">City hotels</option>
                    <option value="beach">Beach & retreat</option>
                </select>
                <button className="btn btn-primary" type="submit">
                    Filter
                </button>
            </form>

            {error && <p className="error">{error}</p>}

            {loading ? (
                <p>Loading hotels...</p>
            ) : (
                <div className="card-grid">
                    {items.map((hotel) => (
                        <HotelCard key={hotel.id} hotel={hotel} onDelete={onDelete} />
                    ))}
                </div>
            )}

            <div className="list-footer">
                <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
                <p>Total {total} hotels</p>
            </div>

            <SuccessModal
                open={Boolean(successMessage)}
                title={successMessage}
                message="Your hotel changes have been saved."
                onClose={() => dispatch(clearSuccess())}
            />
        </>
    );
}