import { mockHotels } from '../app/data/mockHotels';
import { hotelSlug } from '../utils/hotelSlug';

let hotels = [...mockHotels];
let nextId = 7;

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

function parseFormData(data) {
  if (data instanceof FormData) {
    const file = data.get('image');
    let image;
    if (file && file instanceof File && file.size > 0) {
      image = URL.createObjectURL(file);
    }
    return {
      name: data.get('name'),
      description: data.get('description'),
      price: Number(data.get('price')),
      latitude: Number(data.get('latitude')),
      longitude: Number(data.get('longitude')),
      image,
    };
  }
  return data;
}

export async function mockRequest(method, url, body, config) {
  await delay();
  const [path] = url.split('?');
  const idMatch = path.match(/\/hotels\/(\d+)/);
  const id = idMatch ? Number(idMatch[1]) : null;

  if (method === 'GET' && path === '/hotels') {
    const params = config?.params || {};
    const page = Number(params.page || 1);
    const limit = Number(params.limit || 6);
    const search = (params.search || '').toLowerCase();
    const minPrice = params.minPrice === '' || params.minPrice == null ? null : Number(params.minPrice);
    const maxPrice = params.maxPrice === '' || params.maxPrice == null ? null : Number(params.maxPrice);
    const locationType = params.locationType || 'all';

    let filtered = hotels.filter((h) => h.name.toLowerCase().includes(search));
    if (locationType !== 'all') {
      filtered = filtered.filter((h) => h.locationType === locationType);
    }
    if (minPrice != null && !Number.isNaN(minPrice)) {
      filtered = filtered.filter((h) => h.price >= minPrice);
    }
    if (maxPrice != null && !Number.isNaN(maxPrice)) {
      filtered = filtered.filter((h) => h.price <= maxPrice);
    }

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const pageHotels = filtered.slice(start, start + limit);

    return {
      data: {
        hotels: pageHotels,
        total,
        page,
        totalPages,
      },
    };
  }

  if (method === 'GET' && path.startsWith('/hotels/slug/')) {
    const slug = decodeURIComponent(path.replace('/hotels/slug/', ''));
    const hotel = hotels.find((h) => hotelSlug(h.name) === slug);
    if (!hotel) throw { response: { data: { message: 'Hotel not found' } } };
    return { data: hotel };
  }

  if (method === 'GET' && id) {
    const hotel = hotels.find((h) => h.id === id);
    if (!hotel) {
      const error = { response: { data: { message: 'Hotel not found' } } };
      throw error;
    }
    return { data: hotel };
  }

  if (method === 'POST' && path === '/hotels') {
    const parsed = parseFormData(body);
    const hotel = {
      id: nextId++,
      rating: 4.5,
      reviews: 0,
      image: parsed.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      ...parsed,
    };
    hotels = [hotel, ...hotels];
    return { data: hotel };
  }

  if (method === 'PUT' && id) {
    const parsed = parseFormData(body);
    hotels = hotels.map((h) => {
      if (h.id !== id) return h;
      return {
        ...h,
        ...parsed,
        image: parsed.image || h.image,
      };
    });
    return { data: hotels.find((h) => h.id === id) };
  }

  if (method === 'DELETE' && id) {
    hotels = hotels.filter((h) => h.id !== id);
    return { data: { message: 'Hotel deleted successfully' } };
  }

  throw new Error(`Mock API: unhandled ${method} ${url}`);
}