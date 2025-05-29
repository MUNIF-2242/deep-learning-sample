import Link from 'next/link'
import React from 'react'

const ComingSoonContent = () => {
  return (
    <div className="main-content p-0">
        <div className="panel coming-soon-panel">
            <div className="panel-body h-100 d-flex flex-column align-items-center justify-content-center">
                <div className="part-img">
                    <img src="assets/images/coming-soon.png" alt="coming-soon"/>
                </div>
                <div className="part-txt">
                    <Link href="/" className="btn btn-primary py-2 px-5 rounded-pill">Go To Home</Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ComingSoonContent