import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'


const xFstrzDetail = {
    "p" : "requête/réponse proxifiée",
    "w,p" : "optimisation en cours",
    "f,p" : "front/forward, proxy",
    "Z,p" : "page non optimisable (ne sera jamais optimisée, 404, 301, 302, POST, etc ...). La raison est donnée par un autre flag",
    "m" : "method (HEAD, PROPFIND, OPTIONS, PUT, DELETE, etc)",
    "ecc" : "exclusion via la config client",
    "eec" : "exclusion via la config du moteur",
    "stc" : "status code de l'origine différent de 200",
    "ab" : "exclusion par un test A/B",
    "zc" : "contenu vide",
    "h" : "contenu qui n'est pas du HTML (JSON envoyé avec un content type text/html par exemple)",
    "o" : "optimisée",
    "!o" : "non optimisée",
    "c" : "cachée",
    "!c" : "non cachée",
    "o,c" : "optimisée, cachée",
    "w,c" : "réponse en cours d'optimisation mais servie cachée",
    "dc,o" : "optimisée, cache dynamique (fonctionnement interne du moteur)",
    "sc" : "la page est cachée via le SmartCache (Cache + Ajax)",
    "clc" : "la page est cachée via le Cookie Less Cache",
    "pl" : "des liens de preload ont été insérés",
    "ed" : "moteur désactivé",
    "v" : "objet virtuel (résultat d'une concaténation ou d'un outlining)",
    "vf" : "objet virtuel reconstitué",
    "t" : "timeout, l'optimisation a pris trop de temps, la page renvoyée n'est pas optimisée",
    "tb" : "too big, la ressource est trop lourde pour être optimisée",
    "e" : "error, l'optimisation a échoué, la page renvoyée n'est pas optimisée",
    "b" : "blocked, l'adresse IP est bloquée",
    "uc" : "User Canceled, la requête a été annulée par l'utilisateur",
    "cbo" : "Circuit Breaker Open, l'objet n'est pas optimisé suite à l'indisponibilité temporaire d'un composant du moteur",
    "ccb" : "Cache CallBack, l'objet est servi par le proxy depuis le cache (cas d'un objet qui n'a pas encore été inclus dans un test A/B)",
    "of" : "Overflow, indique que le système de débordement est en place. Les flags suivants précisent le résultat."
}

let url;

const app = express()

app.use(
    cors({
        origin: "*"
    })
)

app.use(express.json())

app.post('/', (req, res) => {
    res.json({requestBody: req.body})
    url = req.body.value

})

app.get('/', (req, res) => {
    fetch(url)
    .then(response => {
      if (response.ok) {
                let apiResponse = {
                    plugged: false,
                    statusCode: null,
                    fstrzFlags: [],
                    cloudfrontStatus: '',
                    cloudfrontPOP: '',
                }
                            
                response.headers.forEach((data, key) => {
                    if (key === 'server') {
                        if (data === 'fasterize') {
                            apiResponse.plugged = true                        
                        }
                    }
    
                    if (key === 'x-fstrz') {
                        apiResponse.fstrzFlags = data.split(',')
                    }
    
                    if (key === 'x-cache') {
                        apiResponse.cloudfrontStatus = data
                    }
    
                    if (key === 'x-amz-cf-pop') {
                        apiResponse.cloudfrontPOP = data
                    }
                })    

                let arrayFlag = []
    
                Object.keys(xFstrzDetail).forEach((key) => {                    
                    apiResponse.fstrzFlags.forEach((flag) => {
                        if (key === flag) {
                            arrayFlag.push(xFstrzDetail[key])
                        }
                    })                    
                })

                apiResponse.fstrzFlags = arrayFlag                
                apiResponse.statusCode = response.status
                apiResponse.cloudfrontStatus = apiResponse.cloudfrontStatus.toLocaleUpperCase().split(' ')[0]
    
                fetch('https://www.cloudping.cloud/cloudfront-edge-locations.json')
                .then(response => response.json())
                .then(data => {
                    let cloudLocation = data.nodes
    
                    apiResponse.cloudfrontPOP = apiResponse.cloudfrontPOP.substr(0, 3)
    
                    Object.keys(cloudLocation).forEach((dataLocation) => {                    
                        if (dataLocation === apiResponse.cloudfrontPOP) {
                            apiResponse.cloudfrontPOP = cloudLocation[dataLocation].country
                        }
                    })

                    res.json({apiResponse, url})
                })            
      } else {
        throw response.status;
      }
    }).
    catch(status => {
        res.json({apiResponse: `error ${status}`})
    });
    
})

app.listen(5000, () => {
    console.log('Listening to port 5000');
})



