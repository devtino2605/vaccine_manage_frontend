'use strict'
import { PageContainer } from '@ant-design/pro-components';
import { Button, message, Result, Steps } from 'antd'
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { callUpdatePayment } from '../../config/api.appointment';
const description = 'This is a description.';
const SuccessPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const vnpResponse = searchParams.get('vnp_ResponseCode');
    const paymentId = searchParams.get('vnp_OrderInfo');
    const[error , setError] = useState(null)
    useEffect(() => {
        const handlePaymentCallback = async () => {
          if (vnpResponse && paymentId) {
            try {
              await callUpdatePayment(paymentId, vnpResponse);
              message.destroy(); // Xóa các thông báo trước đó
              if (vnpResponse === '00') {
                message.success('Đặt lịch thành công');
              } else {
                message.error('Đặt lịch thất bại');
                setError(true);
              }
            } catch (error) {
              message.destroy();
              message.error('Có lỗi xảy ra khi cập nhật thanh toán');
            }
          }
        };
      
        handlePaymentCallback();
      }, [vnpResponse, paymentId]);
    return (
        <PageContainer>
            <Result
                status={ error ? 'error' : 'success'}
                title={ error ? 'Appointment Failed' : 'Successfully Vaccination Schedule!'}
                subTitle={ error ? 'You have cancelled your appointment, please check again!' : 'Please arrive on time for your appointment, thank you!'}
                extra={[
                    <Button type="primary" key="console">
                      <Link  style={{color: 'white'}} to="/">Go to home!</Link>  
                    </Button>,
                    error ? <Button color="danger" variant="outlined">Try again!</Button> : <Button key="buy">Export appointment</Button>,
                ]}
            />

            <Steps
                current={error ? 1 : 2}
                status={error ? 'error' : 'finish'}
                items={[
                    {
                        title: 'Finished Order',
                        description,
                    },
                    {
                        title: 'In Progress',
                        description,
                    },
                    {
                        title: 'Waiting',
                        description,
                    },
                ]}
            />
        </PageContainer>


    )
}

export default SuccessPage