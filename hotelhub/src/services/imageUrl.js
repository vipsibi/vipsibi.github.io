const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export function getImageUrl(image) {
    if (!image) return '';
    if (image.startsWith('http') || image.startsWith('blob:')) return image;
    return `${API_ORIGIN}${image}`;
}