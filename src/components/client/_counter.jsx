import React, { useState, useEffect, useRef } from 'react';
import CountUp from 'react-countup';

const Counter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Khi section xuất hiện trong viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Ngừng observe sau khi đã trigger lần đầu
          observer.unobserve(counterRef.current);
        }
      },
      {
        threshold: 0.1, // Trigger khi 10% của element xuất hiện trong viewport
      }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    // Cleanup
    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  return (
    <div
      className="section sec-3 pt-0 section-counter"
      ref={counterRef}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="counter">
              <span className="countup">
                {isVisible && (
                  <CountUp end={12582182} separator="," duration={2} />
                )}
              </span>
              <span className="caption">Total Infected</span>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="counter">
              <span className="countup">
                {isVisible && (
                  <CountUp end={391} separator="," duration={2} />
                )}
              </span>
              <span className="caption">Total Volunteer</span>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="counter">
              <span className="countup">
                {isVisible && (
                  <CountUp end={3321} separator="," duration={2} />
                )}
              </span>
              <span className="caption">Medical Doctors</span>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="counter">
              <span className="countup">
                {isVisible && (
                  <CountUp end={9818} separator="," duration={2} />
                )}
              </span>
              <span className="caption">Facilities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counter;