import { useEffect } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { setRefreshTokenAction } from '../../redux/slice/accountSlide';

const LayoutApp = (props) => {
  const { children } = props;

  const isRefreshToken = useSelector((state) => state.account.isRefreshToken);
  const errorRefreshToken = useSelector((state) => state.account.errorRefreshToken);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle refresh token error
  useEffect(() => {
    if (isRefreshToken === true) {
      localStorage.removeItem('access_token');
      message.error(errorRefreshToken);
      dispatch(setRefreshTokenAction({ status: false, message: '' }));
      navigate('/login');
    }
  }, [isRefreshToken, errorRefreshToken, dispatch, navigate]);

  return <>{children}</>;
};

LayoutApp.propTypes = {
  children: PropTypes.node.isRequired, // Đảm bảo children là bắt buộc và là một node hợp lệ
};

export default LayoutApp;