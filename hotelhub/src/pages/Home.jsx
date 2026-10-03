import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchHotels } from '../features/hotels/hotelSlice';
import { hotelSlug } from '../utils/hotelSlug';

export default function Home() {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.hotels);
    const [amount, setAmount] = useState('all');
    const [location, setLocation] = useState('all');
    const [reviews, setReviews] = useState('all');
    const [rateUnit, setRateUnit] = useState('night');
    const [page, setPage] = useState(0);
    const [zoomedImage, setZoomedImage] = useState(null);

    useEffect(() => {
        dispatch(fetchHotels({ page: 1, minPrice: '', maxPrice: '' }));
    }, [dispatch]);

    const filteredHotels = useMemo(() => items.filter((hotel) => {
        const matchesAmount = amount === 'all'
            || (amount === 'value' && hotel.price < 3500)
            || (amount === 'premium' && hotel.price >= 3500);
        const matchesLocation = location === 'all' || hotel.locationType === location;
        const matchesReviews = reviews === 'all' || hotel.rating >= Number(reviews);
        return matchesAmount && matchesLocation && matchesReviews;
    }), [amount, items, location, reviews]);

    const pageCount = Math.max(1, Math.ceil(filteredHotels.length / 3));
    const activePage = Math.min(page, pageCount - 1);
    const visibleHotels = filteredHotels.slice(activePage * 3, activePage * 3 + 3);

    const getImageSrc = (image) => (
        image?.startsWith('http') || image?.startsWith('blob:') ? image : `http://localhost:5000${image}`
    );

    return (
        <>
            <Helmet>
                <title>ERAMIKA | Find Your Perfect Stay</title>
                <meta
                    name="description"
                    content="Explore the best hotels around the world. Search, compare prices, and book your stay."
                />
            </Helmet>

            <section className="hero">
                <div className="hero-copy">
                    <p className="eyebrow">ERAMIKA / STAY CURATED</p>
                    <h1>Experience Stays Beyond Ordinary</h1>
                    <p>Thoughtful rooms, unforgettable places, and the feeling of arriving somewhere meant for you.</p>
                    <form
                        className="hero-search"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const q = e.target.search.value;
                            window.location.href = `/hotels?search=${encodeURIComponent(q)}`;
                        }}
                    >
                        <input name="search" placeholder="Where do you want to wake up?" />
                        <button className="btn btn-primary" type="submit">
                            Explore stays
                        </button>
                    </form>
                    <div className="hero-chips">
                        <span>Curated locations</span>
                        <span>Honest prices</span>
                        <span>Warm hospitality</span>
                    </div>
                </div>
            </section>

            <section className="featured">
                <div className="section-head featured-heading">
                    <div>
                        <p className="eyebrow">STAY A LITTLE LONGER</p>
                        <h2>Featured hotels</h2>
                    </div>
                    <Link className="text-link" to="/hotels">View all stays <span>↗</span></Link>
                </div>
                <div className="rate-toggle" aria-label="Choose price display">
                    <span>Show rates by</span>
                    <button type="button" className={rateUnit === 'night' ? 'active' : ''} onClick={() => setRateUnit('night')}>Night</button>
                    <button type="button" className={rateUnit === 'day' ? 'active' : ''} onClick={() => setRateUnit('day')}>Day</button>
                </div>
                <div className="home-filters" aria-label="Featured hotel filters">
                    <label>Amount
                        <select value={amount} onChange={(e) => setAmount(e.target.value)}>
                            <option value="all">Any price</option>
                            <option value="value">Under ₹3,500</option>
                            <option value="premium">₹3,500 and above</option>
                        </select>
                    </label>
                    <label>Location
                        <select value={location} onChange={(e) => setLocation(e.target.value)}>
                            <option value="all">Everywhere</option>
                            <option value="city">City hotels</option>
                            <option value="beach">Beach & retreat</option>
                        </select>
                    </label>
                    <label>Reviews
                        <select value={reviews} onChange={(e) => setReviews(e.target.value)}>
                            <option value="all">Any rating</option>
                            <option value="4">4.0+ rated</option>
                            <option value="4.5">4.5+ rated</option>
                        </select>
                    </label>
                </div>
                <div className="featured-grid">
                    {loading && <p className="empty-state">Curating your stays...</p>}
                    {!loading && visibleHotels.length === 0 && <p className="empty-state">No stays match those filters.</p>}
                    {!loading && visibleHotels.map((hotel) => (
                        <article key={hotel.id} className="featured-card">
                            <Link to={`/hotels/${hotelSlug(hotel.name)}`} className="featured-image-link">
                                <img
                                    src={
                                        getImageSrc(hotel.image)
                                    }
                                    alt={hotel.name}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setZoomedImage({ src: getImageSrc(hotel.image), name: hotel.name });
                                    }}
                                />
                                <span className="image-hint">Click to zoom</span>
                            </Link>
                            <div className="featured-card-body">
                                <div className="hotel-card-topline">
                                    <span className="location-label">{hotel.locationType === 'city' ? 'City stay' : 'Beach & retreat'}</span>
                                    <span className="rating">★ {hotel.rating} <small>({hotel.reviews})</small></span>
                                </div>
                                <h3>{hotel.name}</h3>
                                <p className="price">₹{Number(hotel.price).toLocaleString('en-IN')} <span>/ {rateUnit}</span></p>
                                <p className="desc">{hotel.description}</p>
                                <Link className="card-link" to={`/hotels/${hotelSlug(hotel.name)}`}>View stay <span>→</span></Link>
                            </div>
                        </article>
                    ))}
                </div>
                <div className="featured-navigation">
                    <span>{String(activePage + 1).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}</span>
                    <div>
                        <button type="button" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={activePage === 0}>← Previous</button>
                        <button type="button" onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} disabled={activePage >= pageCount - 1}>Next →</button>
                    </div>
                </div>
            </section>
            {zoomedImage && (
                <button className="image-modal" type="button" aria-label="Close image preview" onClick={() => setZoomedImage(null)}>
                    <img src={zoomedImage.src} alt={zoomedImage.name} />
                    <span>Close preview ×</span>
                </button>
            )}
        </>
    );
}