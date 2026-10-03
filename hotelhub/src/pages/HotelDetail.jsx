import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { clearSelected, fetchHotelById, fetchHotelBySlug } from '../features/hotels/hotelSlice';
import HotelMap from '../components/HotelMap';
import { getImageUrl } from '../services/imageUrl';

export default function HotelDetail() {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { selected, loading, error } = useSelector((state) => state.hotels);

    useEffect(() => {
        dispatch(clearSelected());
        if (/^\d+$/.test(slug)) {
            dispatch(fetchHotelById(slug));
        } else {
            dispatch(fetchHotelBySlug(slug));
        }
    }, [dispatch, slug]);

    const hotelTitle = selected?.name || (slug ? slug.replace(/-/g, ' ') : 'Hotel details');

    if (loading || !selected) {
        return (
            <>
                <Helmet>
                    <title>{hotelTitle} | ERAMIKA</title>
                </Helmet>
                <p>{error || 'Loading...'}</p>
            </>
        );
    }

    const imageSrc = getImageUrl(selected.image);

    return (
        <>
            <Helmet>
                <title>{hotelTitle} | ERAMIKA</title>
                <meta name="description" content={selected.description} />
            </Helmet>

            <Link to="/hotels" className="back-link">
                ← Back to List
            </Link>

            <div className="detail-layout">
                <img className="detail-hero" src={imageSrc} alt={selected.name} />
                <div>
                    <h1>{selected.name}</h1>
                    <p className="price">₹{Number(selected.price).toLocaleString('en-IN')} / night</p>
                    <p>
                        ★ {selected.rating || 4.5} ({selected.reviews || 0} reviews)
                    </p>
                    <h3>Full Description</h3>
                    <p>{selected.description}</p>
                    <p><b>Latitude:</b> {selected.latitude}</p>
                    <p><b>Longitude:</b> {selected.longitude}</p>
                    <p><b>Price:</b> ₹{Number(selected.price).toLocaleString('en-IN')} / night</p>
                </div>
            </div>

            <h3>Location on Map</h3>
            <HotelMap
                latitude={selected.latitude}
                longitude={selected.longitude}
                name={selected.name}
            />
        </>
    );
}