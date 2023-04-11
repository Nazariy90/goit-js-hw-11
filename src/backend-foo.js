import axios from 'axios';

export class UnsplashApi {
  static BASE_URL = 'https://pixabay.com';
  static KEY = '35149323-7d9a8cd32882ff02286729e57';

  constructor() {
    this.query = '';
    this.per_page = 5;
    this.page = 1;
  }

  fetchPhotosByQuery() {
    const searchParams = {
      params: {
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: this.page,
        per_page: this.per_page,
      },
    };

    return axios.get(
      `${UnsplashApi.BASE_URL}/api/?key=${UnsplashApi.KEY}`,
      searchParams
    );
  }
}
