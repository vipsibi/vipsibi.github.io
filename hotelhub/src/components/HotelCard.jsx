import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/imageUrl';
import { hotelSlug } from '../utils/hotelSlug';

export default function HotelCard({ hotel, onDelete }) {
    const imageSrc = getImageUrl(hotel.image);
    return (
        <article className="hotel-card">
            <Link to={`/hotels/${hotelSlug(hotel.name)}`} aria-label={`View ${hotel.name} details`}>
                <img src={imageSrc} alt={hotel.name} />
            </Link>
            <div className="card-body">
                <div className="hotel-card-topline">
                    <span className="location-label">
                        {hotel.locationType === 'city' ? 'City stay' : 'Beach & retreat'}
                    </span>
                </div>
                <h3><Link to={`/hotels/${hotelSlug(hotel.name)}`}>{hotel.name}</Link></h3>
                <p className="price">₹{Number(hotel.price).toLocaleString('en-IN')} / night</p>
                <p className="desc">{hotel.description}</p>
                <div className="card-actions">
                    <Link className="btn btn-ghost" to={`/hotels/${hotelSlug(hotel.name)}`}>
                        View Details
                    </Link>
                    <Link className="btn btn-edit" to={`/hotels/${hotel.id}/edit`}>
                        Edit
                    </Link>
                    <button className="btn btn-danger" type="button" onClick={() => onDelete(hotel)}>
                        Delete
                    </button>
                </div>
            </div>
        </article>
    );
}