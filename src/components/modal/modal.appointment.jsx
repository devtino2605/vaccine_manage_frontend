import { useEffect, useState } from 'react';
import { CheckSquareOutlined } from '@ant-design/icons';
import { Col, Form, message, notification, Row } from 'antd';
import { FooterToolbar, ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { callFetchDoctor } from '../../config/api.user';
import { callUpdateAppointment } from '../../config/api.appointment';
import '../../styles/reset.scss';

dayjs.extend(customParseFormat);

const ModalAppointment = (props) => {
  const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

  const [form] = Form.useForm();
  const [animation, setAnimation] = useState('open');
  const [listDoctor, setListDoctor] = useState([]);

  // Fetch doctor list
  useEffect(() => {
    fetchDoctor();
  }, []); // Empty dependency array to run only once when the component mounts

  const fetchDoctor = async () => {
    const res = await callFetchDoctor();
    if (res && res.data) {
      setListDoctor(res.data.result);
    }
  };

  // Handle form submission
  const submitAppointment = async (valuesForm) => {
    const { doctorId } = valuesForm;
    const res = await callUpdateAppointment(dataInit.appointmentId, doctorId);

    if (res.data) {
      message.success('Appointment updated successfully');
      handleReset();
      reloadTable();
    } else {
      notification.error({
        message: 'An error occurred',
        description: res.message,
      });
    }
  };

  // Reset form and close modal
  const handleReset = async () => {
    form.resetFields();
    setDataInit(null);

    // Add animation when closing the modal
    setAnimation('close');
    await new Promise((resolve) => setTimeout(resolve, 400));
    setOpenModal(false);
    setAnimation('open');
  };

  return (
    <>
      {openModal && (
        <ModalForm
          title="Update Appointment"
          open={openModal}
          modalProps={{
            onCancel: () => {
              handleReset();
            },
            afterClose: () => handleReset(),
            destroyOnClose: true,
            footer: null,
            keyboard: false,
            maskClosable: false,
            className: `modal-company ${animation}`,
            rootClassName: `modal-company-root ${animation}`,
          }}
          scrollToFirstError
          preserve={false}
          form={form}
          onFinish={submitAppointment}
          initialValues={dataInit}
          submitter={{
            render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
            submitButtonProps: {
              icon: <CheckSquareOutlined />,
            },
            searchConfig: {
              resetText: 'Cancel',
              submitText: <>Update</>,
            },
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <ProFormText label="Vaccine Name" name="vaccineName" disabled />
            </Col>
            <Col span={12}>
              <ProFormText label="Patient Name" name="patientName" disabled />
            </Col>
            <Col span={12}>
              <ProFormText label="Appointment Date" name="appointmentDate" disabled />
            </Col>
            <Col span={12}>
              <ProFormText label="Appointment Time" name="appointmentTime" disabled />
            </Col>
            <Col span={12}>
              <ProFormText label="Status" name="status" disabled />
            </Col>
            <Col span={12}>
              <ProFormSelect
                width="100%"
                name="doctorId"
                label="Assign Doctor"
                placeholder="Select Doctor"
                options={listDoctor.map((doctor) => ({
                  label: doctor.fullname,
                  value: doctor.userId,
                }))}
                rules={[
                  {
                    required: true,
                    message: 'Please select a doctor!',
                  },
                ]}
              />
            </Col>
          </Row>
        </ModalForm>
      )}
    </>
  );
};

export default ModalAppointment;