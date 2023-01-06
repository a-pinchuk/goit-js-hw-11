import axios from 'axios';

const baseUrl = 'https://pixabay.com/api/?';

export async function fetchImg(content, page) {
  const searchParams = new URLSearchParams({
    key: '32614243-5c13f08404019c5c5c85a7837',
    q: content,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: page,
  });
  return axios.get(`${baseUrl}${searchParams}`);
}
