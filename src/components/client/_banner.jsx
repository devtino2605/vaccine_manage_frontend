import React from 'react'

const Banner = () => {
    return (
        <div className="container mt-4">
            <div className="bg-img-2 overlay d-flex justify-content-center align-items-center" style={{ backgroundImage: 'url(\'/images/gal_2.jpg\')', backgroundSize: 'cover', height: '300px' }}>
                <div className="intro ">
                    <h2 className="mb-3">Help Us Fight Covid19</h2>
                    <p><a href="#" className="btn btn-primary">Get in touch</a></p>
                </div>
            </div>
        </div>
    )
}

export default Banner