import axios from './axios-customize';

import solanaClient from './solnana';

/**
 *
Module Order
 */

export const callAddAppointmentCash = async (
  vaccineId,
  patientId,
  centerId,
  appointmentDate,
  appointmentTime
) => {
  try {
    await solanaClient.initializeCounter();
    const result = await solanaClient.initializeVaccinationRecord({
      patient_id: patientId,
      vaccine_id: vaccineId,
      appointment_date: appointmentDate,
      center_id: centerId,
    });

    // if (result.tx_signature) {
    //   // Step 2: Update appointment with blockchain signature
    //   return axios.put(`/appointments/${result.record.appointment_id}/signature`, {
    //     signature: result.tx_signature
    //   });
    // }
    console.log(result);

    return result; 
  } catch (error) {
    throw new Error(`Failed to create appointment: ${error.message}`);
  }
};

export const callAddAppointmentCreditCard = async (
  vaccineId,
  patientId,
  centerId,
  appointmentDate,
  appointmentTime,
) => {
  try {
    // Step 1: Create appointment on server first
    const appointmentResponse = await axios.post('/appointments/credit-card', {
      vaccineId,
      patientId,
      centerId,
      appointmentDate,
      appointmentTime
    });

    if (appointmentResponse.data && appointmentResponse.data.appointmentId) {
      // Step 2: Initialize blockchain record with the appointment_id
      const initResult = await solanaClient.initializeVaccinationRecord({
        appointment_id: appointmentResponse.data.appointmentId,
        patient_id: patientId,
        vaccine_id: vaccineId,
        appointment_date: appointmentDate,
        status: "PENDING",
        center_id: centerId,
      });

      if (initResult.tx_signature) {
        // Step 3: Process payment
        const paymentResult = await solanaClient.processPayment({
          payment_id: appointmentResponse.data.paymentId,
          amount: appointmentResponse.data.amount,
          appointment_id: appointmentResponse.data.appointmentId
        });

        if (paymentResult.tx_signature) {
          // Step 4: Update appointment with both signatures
          return axios.put(`/appointments/${appointmentResponse.data.appointmentId}/signature`, {
            signature: initResult.tx_signature,
            paymentSignature: paymentResult.tx_signature
          });
        }
      }
    }
    return appointmentResponse;
  } catch (error) {
    throw new Error(`Failed to create appointment: ${error.message}`);
  }
};

export const callUpdatePayment = (paymentId, signature) => {
  return axios.post(
    `/appointments/update-payment?paymentId=${paymentId}&vnpResponse=${signature}`
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
