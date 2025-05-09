/* eslint-disable import/no-extraneous-dependencies */
import { Outlet } from 'react-router-dom';

import Loading from '../share/loading';
import { useEffect, useState } from 'react';
import Navbar from './navbar/_navbar';

import Footer from './_footer';

import AOS from 'aos';
import 'aos/dist/aos.css';

const LayoutClient = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'slide',
      once: true
    });
  }, []);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <div className='container section mt-3'>
        <Outlet />
      </div>
      <Footer />
    </>

  );
};

export default LayoutClient;
