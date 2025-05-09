import axios from './axios-customize';

/**
 *
Module Auth
 */

export const callRegister = (
  fullname,
  email,
  password,
) => {
  return axios.post('/auth/register', {
    fullname,
    email,
    password
  });
};

export const callLogin = (username, password) => {
  return axios.post('/auth/login', { username, password });
};

export const callFetchAccount = () => {
  return axios.get('/auth/account');
};

export const callMyAppointments = () => {
  return axios.get('/auth/my-appointments');
};


export const callRefreshToken = () => {
  return axios.get('/auth/refresh');
};

export const callLogout = () => {
  return axios.post('/auth/logout');
};

