import axios from './axios-customize';

/**
 *
Module Order
 */

export const callAddAppointmentCash = (
  vaccineId,
  patientId,
  centerId,
  appointmentDate,
  appointmentTime
) => {
  return axios.post('/appointments/cash', {
    vaccineId,
    patientId,
    centerId,
    appointmentDate,
    appointmentTime,
  });
};

export const callAddAppointmentCreditCard = (
  vaccineId,
  patientId,
  centerId,
  appointmentDate,
  appointmentTime
) => {
  return axios.post('/appointments/credit-card', {
    vaccineId,
    patientId,
    centerId,
    appointmentDate,
    appointmentTime,
  });
};

export const callUpdatePayment = (paymentId, vnpResponse) => {
  return axios.post(
    `/appointments/update-payment?paymentId=${paymentId}&vnpResponse=${vnpResponse}`
  );
};

export const callUpdateAppointment = (appointmentId, doctorId) => {
  return axios.put(`/appointments/${appointmentId}`, {
    doctorId,
  });
};

export const callCancelAppointment = (appointmentId) => {
  return axios.put(`/appointments/${appointmentId}/cancel`);
};

export const callCompleteAppointment = (appointmentId) => {
  return axios.put(`/appointments/${appointmentId}/complete`);
};

export const callFetchAppointment = (query) => {
  return axios.get(`/appointments?${query}`);
};

export const callMySchedule = (query) => {
  return axios.get(`/appointments/my-schedule?${query}`);
};
