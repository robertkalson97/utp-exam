import { AppConfig } from './src/app/app.config';

export const APP_DI_CONFIG: AppConfig = {

  // here is the URL you need
  apiEndpoint: 'https://uptracker-api.herokuapp.com/api/v1',


  streetView: {
    apiKey: 'AIzaSyAkbvjQdD4qOQGppnPEh6nhGn5eaWicU9A',
    endpoint: 'https://maps.googleapis.com/maps/api/streetview'
  },
  taxRate: {
    apiKey: '0nWPlT+M7Vmj9z1CWGe5Wq5HugwGSaYU06C1wE4S5KMl7iycJ9p2NedJ3D7PmMqNYXUCCnKMRFpG1nacqYRiuQ==',
    endpoint: 'https://taxrates.api.avalara.com:443/address'
  },
  googlePlaces: {
    apiKey: 'AIzaSyAlyHuyNFN1NVXRLWw4To_g7IhwblXLoww',
  }
};
