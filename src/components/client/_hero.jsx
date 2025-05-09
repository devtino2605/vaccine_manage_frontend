import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className="hero">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-5 h-100">
          <div className="masthead" data-aos="fade-up" data-aos-delay="">
            <h1>XedLab is leading medical institution for Covid-19</h1>
            <p className="mb-5">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita voluptatum quo soluta vero perspiciatis cumque sed doloremque nihil aliquid at?.</p>
            <p>
              <Link to="/shop" className="btn btn-primary me-4 text-uppercase">Get appointment</Link>
              <Link to="/blog">Learn more</Link>
            </p>
          </div>
        </div>
        <div className="col-lg-7" data-aos="fade-up" data-aos-delay="100">
          <div className="video-img-wrap">
            <a href="https://www.youtube.com/watch?v=mwtbEGNABWU" className="video-play-btn glightbox3">
              <span className="icon-play" />
            </a>
            <img src="images/hero-img-min.png" alt="Image" className="img-fluid" />
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Hero