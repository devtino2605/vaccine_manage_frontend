import { useEffect } from 'react';
import { message, notification, Space, theme } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { callLogin } from '../../config/api.auth';

import { setUserLoginInfo } from './../../redux/slice/accountSlide';
import { LoginForm, ProConfigProvider, ProFormText } from '@ant-design/pro-components';
import { LockOutlined, MailOutlined } from '@ant-design/icons';


const LoginPage = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
 

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values) => {
    const { email, password } = values;
    const res = await callLogin(email, password);
    if (res?.data) {
      localStorage.setItem('access_token', res.data.access_token);
      dispatch(setUserLoginInfo(res.data.user));
      message.success('Đăng nhập tài khoản thành công!');
      // navigate('/');
    } else {
      notification.error({
        message: 'Đăng nhập thất bại',
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }
  };

  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: token.colorBgContainer }}>
        <LoginForm
          logo='https://github.githubassets.com/favicons/favicon.png'
          title='Github'
          subTitle='Đăng nhập vào Shoppe Frontend'
          actions={
            <Space>
              Chưa có tài khoản?
              <Link to='/register'>Đăng ký</Link>
            </Space>
          }
          onFinish={handleSubmit}
          submitter={{
            searchConfig: {
              submitText: 'Đăng nhập',
            },
          }}
        >

          <>
            <ProFormText
              name='email'
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
            <ProFormText.Password
              name='password'
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

export default LoginPage;
