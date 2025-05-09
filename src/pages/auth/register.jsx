import { Link, useNavigate } from 'react-router-dom';
import { message, notification, Space, theme } from 'antd';

import { callRegister } from '../../config/api.auth';
import { LoginForm, ProConfigProvider, ProFormText } from '@ant-design/pro-components';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const handleSubmit = async (values) => {
    const { email, password, fullname } = values;
    const res = await callRegister(fullname, email, password);
    if (res?.data?.email) {
      message.success('Đăng ký tài khoản thành công!');
      navigate('/login')
    } else {
      notification.error({
        message: res.error,
        description:
          res.message && Array.isArray(res.message) ? res.message[0] : res.message,
        duration: 5
      })
    }
  };
  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: token.colorBgContainer }}>
        <LoginForm
          logo="https://github.githubassets.com/favicons/favicon.png"
          title="Github"
          subTitle="Đăng ký vào Shoppe Frontend"
          actions={
            <Space>
              Đã có tài khoản?
              <Link to="/login">Đăng nhập</Link>
            </Space>
          }
          onFinish={handleSubmit}
          submitter={{
            searchConfig: {
              submitText: 'Đăng ký',
            },
          }}
        >

          <>
            <ProFormText
              name="email"
              fieldProps={{
                size: 'large',
                prefix: <MailOutlined className="prefixIcon" style={{ marginRight: 10 }} />,
              }}
              placeholder="Email hoặc tên đăng nhập"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập email hoặc tên đăng nhập!',
                },
              ]}
            />
            <ProFormText
              name="fullname"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className="prefixIcon" style={{ marginRight: 10 }} />,
              }}
              placeholder="Họ và tên"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập họ và tên!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className="prefixIcon" style={{ marginRight: 10 }} />,
                strengthText:
                  'Mật khẩu của bạn cần phải chứa ít nhất 6 ký tự, bao gồm chữ cái và số.',
                statusRender: (value) => {
                  const getStatus = () => {
                    if (value && value.length > 12) {
                      return 'ok';
                    }
                    if (value && value.length > 6) {
                      return 'pass';
                    }
                    return 'poor';
                  };
                  const status = getStatus();
                  if (status === 'pass') {
                    return (
                      <div style={{ color: token.colorWarning }}>
                        Độ mạnh: Trung bình
                      </div>
                    );
                  }
                  if (status === 'ok') {
                    return (
                      <div style={{ color: token.colorSuccess }}>
                        Độ mạnh: Mạnh
                      </div>
                    );
                  }
                  return (
                    <div style={{ color: token.colorError }}>Độ mạnh: Yếu</div>
                  );
                },
              }}
              placeholder="Mật khẩu"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!',
                },
              ]}
            />
          </>


        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};

export default RegisterPage;
