export class UnsplashApi {
  static BASE_URL = 'https://pixabay.com';
  static KEY = '35149323-7d9a8cd32882ff02286729e57';

  constructor() {
    this.query = '';
    this.page = 1;
  }

  fetchPhotosByQuery() {
    const searchParams = new URLSearchParams({
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: this.page,
      per_page: 4,
    });
    return fetch(
      `${UnsplashApi.BASE_URL}/api/?key=${UnsplashApi.KEY}&${searchParams}`
    ).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
  }
}

// <!-- axios
//   .get(
//     'https://pixabay.com/api/?key=35149323-7d9a8cd32882ff02286729e57&q=yellow+flowers&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40'
//   )
//   .then(response => {
//     return response.data;
//   })
//   .then(data => {
//     console.log(data);
//   })
//   .catch(err => {
//     console.log(err);
//   }); -->

// fetch(
//   'https://pixabay.com/api/?key=35149323-7d9a8cd32882ff02286729e57&q=yellow+flowers&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40'
// )
//   .then(response => {
//     if (!response.ok) {
//       throw new Error(response.status);
//     }
//     return response.json();
//   })
//   .then(data => {
//     console.log(data);
//   })
//   .catch(err => {
//     console.log(err);
//   });
