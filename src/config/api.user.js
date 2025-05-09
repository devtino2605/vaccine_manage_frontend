import axios from './axios-customize';
/**
 *
Module User
 */

export const callCreateUser = (
  fullname,
  email,
  phoneNumber,
  roleName,
  birthday,
  address,
  centerName
) => {
  return axios.post('/users', {
    fullname,
    email,
    phoneNumber,
    roleName,
    birthday,
    address,
    centerName,
  });
};

export const callUpdateUser = (
  userId,
  fullname,
  phoneNumber,
  birthday,
  address,
  centerName
) => {
  return axios.put(`/users/${userId}`, {
    fullname,
    phoneNumber,
    birthday,
    address,
    centerName
  });
};

export const callFetchUser = (query) => {
  return axios.get(`/users?${query}`);
};

export const callDeleteUser = (id) => {
  return axios.delete(`/users/${id}`);
};

export const callFetchDoctor = () => {
  return axios.get('/users/doctors');
}
