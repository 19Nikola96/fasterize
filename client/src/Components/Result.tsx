import React, { useEffect } from 'react'
import { ApiResponse } from '../Types'

const Result: React.FC<ApiResponse>  = ({ url, plugged, statusCode, fstrzFlags, cloudfrontStatus, cloudfrontPOP, date }) => {

    useEffect(() => {
        let statusIcon = document.getElementById(url)        
        
        if (fstrzFlags.includes('optimisée') && plugged === true) {
            statusIcon!.style.color = 'green'  
        } 
        if (plugged === true && fstrzFlags.includes('optimisée') === false) {
            statusIcon!.style.color = 'orange'  
        }
        if (plugged === false) {
            statusIcon!.style.color = 'red'  
        }        
    }, [fstrzFlags, plugged, url])

    return (
        <li className="li-row">
            <div className="date">{date}</div>
            <div className="url">{url}</div>
            <div id={url} className={`status`}>
                <i className="fas fa-cloud"></i>
            </div>
            { plugged
                ? <>
                    <div className="flags"> {fstrzFlags.map((flag, index) => {
                        return <span key={index}>{flag}</span>
                        })}
                    </div>
                    <div className="cld-status"> {cloudfrontStatus.length > 0 ? <span>{cloudfrontStatus}</span> : ''} </div>
                    <div className="cld-pop">{cloudfrontPOP}</div>
                  </>

                : <>
                    <div className="flags"></div>
                    <div className="cld-status"></div>
                    <div className="cld-pop"></div>
                  </>
            }        
            
        </li>
    )
}

export default Result
