import React, { useState } from 'react'
import { validURL } from '../Utilities'
import '../Components/Style/Form.css'
import { ResultData } from '../Types'

type Props = {
    parentCallback: (analysis: string) => void
    error: boolean | string
    displayError: (bool: boolean, errorStatus: string) => void
}

const Form: React.FC<Props> = ({ parentCallback, error, displayError }) => {
    const [value, setValue]= useState<string>('')
    const [invalidUrl, setInvalidUrl]= useState<boolean>(false)
    const [urlAnalyzedBefore, setUrlAnalyzedBefore]= useState<boolean>(false)

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({value})
    };
      
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        displayError(false, 'no error message')
        setInvalidUrl(false)   
        setUrlAnalyzedBefore(false)   

        setValue(e.target.value)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()       

        if (validURL(value) === true) {
            let prevAnalysis: ResultData[] = JSON.parse(localStorage.getItem('previousAnalysis') || "[]")

            if (prevAnalysis.length > 0) {
                const analyzedBefore = (element: any) => element.url === value
                
                let cantFetch = prevAnalysis.some(analyzedBefore)

                if (cantFetch) {
                    setUrlAnalyzedBefore(true)

                    if (document.getElementById(value) === null) {                        
                        prevAnalysis.forEach((analysis) => {                            
                            if (value === analysis.url) {                                                                
                                parentCallback(analysis.url)
                            }
                        })
                    }

                    prevAnalysis.forEach((analysis) => {
                        if (value === analysis.url) {
                            let result = document.getElementById(analysis.url)

                            result?.parentElement?.classList.add('result-already-here')

                            setTimeout(() =>  result?.parentElement?.classList.remove('result-already-here'), 3000)
                        }
                    })

                } else {                    
                    fetch('http://localhost:5000/', requestOptions)
                    .then(res => res.json())
                    .then(data => {
                        parentCallback('')
                    })
                }

            } else {
                fetch('http://localhost:5000/', requestOptions)
                .then(res => res.json())
                .then(data => {                                                                                
                    parentCallback('')
                })
            }

        } else {
            setInvalidUrl(true)           
        }     
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>
                Url to check
            </label>
            <div>
                <input type="text" value={value} name="name" onChange={(e) => handleOnChange(e) } />
                <button type="submit"> Launch Analysis </button>                
                { error ? <span className="error">{error}</span> : ''}

                { invalidUrl ? <span className="error">Cette URL n'est pas valide !</span> : ''}

                { urlAnalyzedBefore? <span className="already-analyzed">Cette URL à déjà été analisée !</span> : ''}
            </div>
        </form>
    )
}

export default Form
