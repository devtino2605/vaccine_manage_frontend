import { useEffect, useState } from 'react';
import { Button, Col, message, Pagination, Row } from 'antd';
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';

import { callFetchVaccine } from '../../config/api.vaccine';
import ModalOrder from '../../components/modal/modal.order';
import Search from '../../components/client/search/_search';
import './_shop.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ShopPage = () => {
  const user = useSelector((state) => state.account.user);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)'); // Thay đổi theo nhu cầu
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (e) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [vaccine, setVaccine] = useState(null);
  const [displayVaccine, setDisplayVaccine] = useState(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('');
  const [sortQuery, setSortQuery] = useState('sort=name,desc');

  useEffect(() => {
    setCurrent(1);
    setPageSize(100);
    setFilter('');
    setSortQuery('sort=name,desc');
    fetchVaccine();
  }, [current, pageSize, filter, sortQuery]);

  const fetchVaccine = async () => {
    let query = `page=${current}&size=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    const res = await callFetchVaccine(query);
    if (res && res.data) {
      setDisplayVaccine(res.data.result);
      setTotal(res.data.meta.total);
    }
  };
  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };
  return (
    <>
      <Search total={total} isMobile={isMobile} />
      <Row gutter={[20, 20]} data-aos="fade-up" data-aos-delay="">
        {displayVaccine &&
          displayVaccine.map((vaccine, index) => {
            return (
              <Col
                key={index}
                xs={24} // Mobile (<576px)
                sm={12} // Tablet (≥576px)
                md={8} // Laptop (≥768px)
                lg={6} // Desktop (≥992px)
                xl={6} // Large desktop (≥1200px)
                style={{ justifyItems: 'center' }}
              >
                <div className="product-card">
                  <div className="img">
                    <img
                      src={`http://localhost:8080/storage/vaccine/${vaccine.image}`}
                      alt="Product"
                    />
                    <div className="add-to-cart-icon">
                      <ShoppingCartOutlined className="icon" />
                      <PlusOutlined className="icon" />
                    </div>
                  </div>
                  <div className="product-detail">
                    <h5 style={{ fontWeight: 'bold' }}>${vaccine.name}</h5>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>${vaccine.price}</span>
                      <span>Viet Nam</span>
                    </div>
                    <Button
                      type="primary"
                      onClick={() => {
                        user.id
                          ? setOpenModal(true)
                          : message.error('Please login to order vaccine');
                        setVaccine(vaccine);
                      }}
                      style={{ marginTop: '10px', width: '100%' }}
                    >
                      <PlusOutlined />
                      Đăng ký tiêm chủng
                    </Button>
                  </div>
                </div>
              </Col>
            );
          })}
      </Row>

      <Pagination
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
        defaultCurrent={3}
        total={500}
        style={{ marginTop: '20px' }}
      />

      <ModalOrder
        openModal={openModal}
        setOpenModal={setOpenModal}
        vaccine={vaccine}
      />
    </>
  );
};

export default ShopPage;
