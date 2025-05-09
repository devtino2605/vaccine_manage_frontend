import {
  HeartOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Drawer, Dropdown, Menu, message, Space } from 'antd';
import { useEffect, useState } from 'react';
import './_navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { callLogout } from '../../../config/api.auth';
import { setLogoutAction } from '../../../redux/slice/accountSlide';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [current, setCurrent] = useState('/');
  const location = useLocation();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location]);

  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res && +res.statusCode === 200) {
      dispatch(setLogoutAction({}));
      message.success('Đăng xuất thành công');
      navigate('/');
    }
  };

  const items = [
    {
      label: `Welcome ${user?.fullname}`,
    },

    user.roleName !== 'PATIENT'
      ? {
          key: 'system',
          label: <Link to="/admin/dashboard">Trang quản trị</Link>,
        }
      : {
          key: 'profile',
          label: <Link to="/profile">Hồ sơ</Link>,
        },
    {
      key: 'logout',
      danger: true,
      label: <label onClick={handleLogout}>Đăng xuất</label>,
    },
  ];

  return (
    <div
      className="fixed-top"
      style={{
        backgroundColor: 'rgb(255, 255, 255)',
        boxShadow: '0 4px 8px rgba(179, 179, 179, 0.1)',
        zIndex: 100,
      }}
    >
      <div className="navbar container">
        <div
          style={{
            fontSize: '22px',
            fontWeight: 'bold',
            color: 'rgb(0, 132, 255)',
            textTransform: 'uppercase',
            fontFamily: 'Poppins',
          }}
        >
          Vaccine
        </div>

        {/* Desktop Menu */}
        <ul className="menu-mid">
          <li className={current === '/' ? 'menu-active' : ''}>
            <Link to="/">Home</Link>
          </li>
          <li className={current === '/shop' ? 'menu-active' : ''}>
            <Link to="/shop">Shop</Link>
          </li>
          <li className={current === '/blog' ? 'menu-active' : ''}>
            <Link to="/blog">Blog</Link>
          </li>
        </ul>

        {/* Profile/Auth Section */}
        {isAuthenticated ? (
          <div className="menu-profile">
            <Dropdown menu={{ items }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar size={35} icon={<UserOutlined />} />
                </Space>
              </a>
            </Dropdown>
            <HeartOutlined />
            <ShoppingCartOutlined />
            <div className="mobile-menu-icon" onClick={showDrawer}>
              <MenuOutlined />
            </div>
          </div>
        ) : (
          <Space>
            <Button type="primary">
              <Link to="/login" style={{ color: 'white' }}>
                Đăng nhập
              </Link>
            </Button>
            <div className="mobile-menu-icon" onClick={showDrawer}>
              <MenuOutlined />
            </div>
          </Space>
        )}
      </div>

      {/* Drawer for Mobile Menu */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        width={250}
      >
        <ul className="mobile-menu">
          <li
            onClick={closeDrawer}
            className={current === '/' ? 'menu-active' : ''}
          >
            <Link to="/">Home</Link>
          </li>
          <li
            onClick={closeDrawer}
            className={current === '/shop' ? 'menu-active' : ''}
          >
            <Link to="/shop">Shop</Link>
          </li>
        </ul>
      </Drawer>
    </div>
  );
};

export default Navbar;
