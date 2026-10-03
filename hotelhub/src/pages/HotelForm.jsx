import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { createHotel, fetchHotelById, updateHotel } from '../features/hotels/hotelSlice';
import HotelMap from '../components/HotelMap';
import { getImageUrl } from '../services/imageUrl';

const empty = {
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    price: '',
    locationType: 'city',
};

export default function HotelForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selected } = useSelector((state) => state.hotels);

    const [form, setForm] = useState(empty);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isEdit) dispatch(fetchHotelById(id));
    }, [dispatch, id, isEdit]);

    useEffect(() => {
        if (isEdit && selected) {
            // The selected hotel arrives asynchronously after the route loads.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm({
                name: selected.name || '',
                description: selected.description || '',
                latitude: selected.latitude ?? '',
                longitude: selected.longitude ?? '',
                price: selected.price ?? '',
                locationType: selected.locationType || 'city',
            });
            setPreview(getImageUrl(selected.image));
        }
    }, [isEdit, selected]);

    const onChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const onImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const validate = () => {
        const next = {};
        if (!form.name.trim()) next.name = 'Hotel name is required';
        if (!form.description.trim()) next.description = 'Description is required';

        const lat = Number(form.latitude);
        if (form.latitude === '' || Number.isNaN(lat) || lat < -90 || lat > 90) {
            next.latitude = 'Latitude must be between -90 and 90';
        }

        const lng = Number(form.longitude);
        if (form.longitude === '' || Number.isNaN(lng) || lng < -180 || lng > 180) {
            next.longitude = 'Longitude must be between -180 and 180';
        }

        const price = Number(form.price);
        if (form.price === '' || Number.isNaN(price) || price <= 0) {
            next.price = 'Price must be greater than 0';
        }

        if (!isEdit && !imageFile) next.image = 'Hotel image is required';
        if (imageFile) {
            const okType = ['image/jpeg', 'image/png', 'image/webp'].includes(imageFile.type);
            if (!okType) next.image = 'Only JPG, PNG, WEBP allowed';
            if (imageFile.size > 5 * 1024 * 1024) next.image = 'Image must be less than 5MB';
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);

        const data = new FormData();
        data.append('name', form.name);
        data.append('description', form.description);
        data.append('latitude', form.latitude);
        data.append('longitude', form.longitude);
        data.append('price', form.price);
        data.append('locationType', form.locationType);
        if (imageFile) data.append('image', imageFile);

        try {
            if (isEdit) {
                await dispatch(updateHotel({ id, formData: data })).unwrap();
            } else {
                await dispatch(createHotel(data)).unwrap();
            }
            navigate('/hotels');
        } catch (error) {
            setErrors({ submit: error || 'Could not save hotel. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>
                    Add Hotel | ERAMIKA
                </title>
                <meta
                    name="description"
                    content={isEdit ? 'Update hotel details.' : 'Add a new hotel with image and location.'}
                />
            </Helmet>

            <Link to="/hotels" className="back-link">
                ← Back to Hotels
            </Link>
            <h1>{isEdit && selected?.name ? `Edit ${selected.name}` : isEdit ? 'Edit Hotel' : 'Add Hotel'}</h1>
            <p className="muted">Fill in the details below to {isEdit ? 'update' : 'add a new'} hotel</p>

            <div className="form-layout">
                <form className="hotel-form" onSubmit={onSubmit}>
                    <label>Hotel Image *</label>
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onImage} />
                    <small>JPG, PNG, WEBP (Max 5MB)</small>
                    {errors.image && <span className="error">{errors.image}</span>}
                    {errors.submit && <span className="error">{errors.submit}</span>}

                    <label>Hotel Name *</label>
                    <input name="name" value={form.name} onChange={onChange} placeholder="Enter hotel name" />
                    {errors.name && <span className="error">{errors.name}</span>}

                    <label>Description *</label>
                    <textarea
                        name="description"
                        maxLength={500}
                        value={form.description}
                        onChange={onChange}
                        placeholder="Enter hotel description"
                    />
                    <small>{form.description.length}/500</small>
                    {errors.description && <span className="error">{errors.description}</span>}

                    <div className="row">
                        <div>
                            <label>Latitude *</label>
                            <input
                                name="latitude"
                                value={form.latitude}
                                onChange={onChange}
                                placeholder="Enter latitude (-90 to 90)"
                            />
                            {errors.latitude && <span className="error">{errors.latitude}</span>}
                        </div>
                        <div>
                            <label>Longitude *</label>
                            <input
                                name="longitude"
                                value={form.longitude}
                                onChange={onChange}
                                placeholder="Enter longitude (-180 to 180)"
                            />
                            {errors.longitude && <span className="error">{errors.longitude}</span>}
                        </div>
                    </div>

                    <label>Price per night *</label>
                    <input
                        name="price"
                        type="number"
                        value={form.price}
                        onChange={onChange}
                        placeholder="Enter price (e.g. 100.00)"
                    />
                    {errors.price && <span className="error">{errors.price}</span>}

                    <label>Stay type *</label>
                    <select name="locationType" value={form.locationType} onChange={onChange}>
                        <option value="city">City hotel</option>
                        <option value="beach">Beach & retreat</option>
                    </select>

                    <div className="rules">
                        <strong>Validation Rules</strong>
                        <ul>
                            <li>All fields are required</li>
                            <li>Latitude: -90 to 90</li>
                            <li>Longitude: -180 to 180</li>
                            <li>Price must be greater than 0</li>
                            <li>Image size must be less than 5MB</li>
                        </ul>
                    </div>

                    <div className="form-actions">
                        <button className="btn btn-primary" type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Hotel'}
                        </button>
                        <button className="btn btn-ghost" type="button" onClick={() => navigate('/hotels')}>
                            Cancel
                        </button>
                    </div>
                </form>

                <aside className="preview-panel">
                    <h3>Image Preview</h3>
                    {preview ? (
                        <img src={preview} alt="Preview" />
                    ) : (
                        <div className="preview-empty">Your selected image will appear here</div>
                    )}

                    <div className="preview-meta">
                        <h3>Hotel Preview</h3>
                        <p><b>Name:</b> {form.name || '-'}</p>
                        <p><b>Description:</b> {form.description || '-'}</p>
                        <p>
                            <b>Location:</b> {form.latitude || '-'}, {form.longitude || '-'}
                        </p>
                        <p><b>Price:</b> {form.price ? `₹${form.price}` : '-'}</p>
                    </div>

                    <HotelMap latitude={form.latitude} longitude={form.longitude} name={form.name} />
                </aside>
            </div>
        </>
    );
}