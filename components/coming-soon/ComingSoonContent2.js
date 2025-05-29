import React, { useContext } from 'react'
import Link from 'next/link'
import { DigiContext } from '@/context/DigiContext'

const ComingSoonContent2 = () => {
    const {isTimerState} = useContext(DigiContext)
  return (
    <div className="main-content p-0">
        <div className="panel coming-soon-panel coming-soon-panel-2">
            <div className="panel-body h-100 d-flex flex-column align-items-center justify-content-center">
                <div className="part-img">
                    <img src="assets/images/coming-soon-2.png" alt="coming-soon"/>
                </div>
                <div className="part-txt">
                    <ul className="countdown">
                        <li><span className="days">{isTimerState.days || 0}</span><p className="days_text">Days</p></li>
                        <li className="seperator">:</li>
                        <li><span className="hours">{isTimerState.hours || '00'}</span><p className="hours_text">Hours</p></li>
                        <li className="seperator">:</li>
                        <li><span className="minutes">{isTimerState.minutes || '00'}</span><p className="minutes_text">Minutes</p></li>
                        <li className="seperator">:</li>
                        <li><span className="seconds">{isTimerState.seconds || '00'}</span><p className="seconds_text">Seconds</p></li>
                    </ul>
                    <Link href="/" className="btn btn-primary py-2 px-5 rounded-pill">Go To Home</Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ComingSoonContent2