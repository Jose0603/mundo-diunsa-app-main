import axios, { AxiosResponse } from 'axios';

export type { AxiosResponse, AxiosError } from 'axios';

// export const baseURL = 'https://41bb-131-108-233-223.ngrok-free.app';
export const baseURL = 'https://apimd.dapplications.tech';

const API = axios.create({
  baseURL: baseURL + '/api',
});

export default API;
