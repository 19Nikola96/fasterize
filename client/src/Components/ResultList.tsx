import React, { useEffect, useState } from 'react'
import '../Components/Style/ResultList.css'
import { ResultData } from '../Types'
import { getDate } from '../Utilities'
import LiSkeleton from './LiSkeleton'
import Result from './Result'

type Props = {
    displayResult: string[]
    displayError: (bool: boolean, errorStatus: string) => void
    urlToStoredResult: string
}

const ResultList: React.FC<Props>  = ({ displayResult, displayError, urlToStoredResult }) => {
    const [resultArray, setResultArray] = useState<ResultData []>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setLoading(true)
                
        if (urlToStoredResult.length === 0) {
            fetch('http://localhost:5000/')
            .then(res => res.json())
            .then(data => {  
                let statusError;                

                if (data.apiResponse.plugged === undefined) {
                    statusError = data.apiResponse.substr(0, 5)    
                }                
                                 
                if (statusError !== 'error') {
                    data.date = getDate()     
                    
                    let prevAnalysis = JSON.parse(localStorage.getItem('previousAnalysis') || '[]')
        
                    prevAnalysis.push(data)                
                    
                    setResultArray([...resultArray, data])
                    
                    localStorage.setItem('previousAnalysis', JSON.stringify(prevAnalysis))
                    
                    setLoading(false)
                } else {
                    setLoading(false)                    

                    displayError(true, data.apiResponse)                    
                }                          
                           
            })
        } else {            
            let prevAnalysis: ResultData[] = JSON.parse(localStorage.getItem('previousAnalysis') || '[]')   
            
            prevAnalysis.forEach((analysis) => {                                
                if (analysis.url === urlToStoredResult) {
                    setResultArray([...resultArray, analysis])   
                    setLoading(false)     
                }
            })            
        }       
    }, [displayResult])

    return (
        <ul id="result-list">
            <li className="li-head">
                <div>Date</div>
                <div>URL</div>
                <div>Status</div>
                <div>Flags</div>
                <div>Cloudfront status</div>
                <div>Cloudfront pop</div>
            </li>                 
            { resultArray.map((element, index) => {                
                return <Result 
                            key={index}
                            url={element.url}
                            date={element.date}
                            plugged={element.apiResponse.plugged} 
                            statusCode={element.apiResponse.statusCode} 
                            fstrzFlags={element.apiResponse.fstrzFlags}
                            cloudfrontStatus={element.apiResponse.cloudfrontStatus}
                            cloudfrontPOP={element.apiResponse.cloudfrontPOP} 
                        />
            })}
            { loading ? <LiSkeleton /> : '' }  
        </ul>
    )
}

export default ResultList
