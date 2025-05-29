import React from 'react'
import Link from 'next/link'

const ViewProfileCards = () => {
  return (
    <div className="row mb-30">
        <div className="col-lg-4">
            <div className="dashboard-top-box rounded-bottom panel-bg">
                <div className="left">
                    <h3>$34,152</h3>
                    <p>Shipping fees are not</p>
                    <Link href="#">View net earnings</Link>
                </div>
                <div className="right">
                    <span className="text-primary">+16.24%</span>
                    <div className="part-icon rounded">
                        <span><i className="fa-light fa-dollar-sign"></i></span>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-lg-4 col-6 col-xs-12">
            <div className="dashboard-top-box rounded-bottom panel-bg">
                <div className="left">
                    <h3>36,894</h3>
                    <p>Orders</p>
                    <Link href="#">Excluding orders in transit</Link>
                </div>
                <div className="right">
                    <span className="text-primary">+16.24%</span>
                    <div className="part-icon rounded">
                        <span><i className="fa-light fa-bag-shopping"></i></span>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-lg-4 col-6 col-xs-12">
            <div className="dashboard-top-box rounded-bottom panel-bg">
                <div className="left">
                    <h3>$34,152</h3>
                    <p>Customers</p>
                    <Link href="#">See details</Link>
                </div>
                <div className="right">
                    <span className="text-primary">+16.24%</span>
                    <div className="part-icon rounded">
                        <span><i className="fa-light fa-user"></i></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ViewProfileCards