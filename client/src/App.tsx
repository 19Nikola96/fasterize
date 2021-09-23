import React, { useEffect, useState } from 'react';
import Form from './Components/Form';
import H2 from './Components/H2';
import Header from './Components/Header';
import ResultList from './Components/ResultList';
import Side from './Components/Side';
import './App.css';
import './Components/Style/Animation.css'

function App() {

  const [displayResult, setDisplayResult] = useState<string []>([])
  const [error, setError] = useState<boolean | string>(false)
  const [urlToStoredResult, setUrlToStoredResult] = useState<string>('')
  const [docHeight, setDocHeight] = useState<number>(0)

  useEffect(() => {
    let body = document.body,
    html = document.documentElement;

    let height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
  
    setDocHeight(height);                   
  }, [])


  const callbackForm = (storedUrl: string) => {    
    setUrlToStoredResult(storedUrl)    
    setDisplayResult([...displayResult, 'thing'])        

    let body = document.body,
    html = document.documentElement;

    let height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

    if (height > docHeight) {
      let side = document.getElementById('side')
        side!.style.height = 'auto'      
    }
  }

  const displayError = (bool: boolean, errorStatus: string) => {    
    if (errorStatus.substr(0, 5) === 'error') {
      setError(errorStatus)
    } else {
      setError(bool)
    }
  }
  
  return (
    <div className="app">    
      <Side />
      <main>
        <Header />
        <div className="container"> 
          <H2 title="Header Debugger" />   
          <Form parentCallback={callbackForm} error={error} displayError={displayError}/>
          <H2 title="History" /> 
          { displayResult.length !== 0
              ? <ResultList displayResult={displayResult} displayError={displayError} urlToStoredResult={urlToStoredResult} /> : ''
          }        
        </div>
      </main>      
    </div>
  );
}

export default App;
