import React from 'react'
import '../Components/Style/H2.css'

type Props = {
    title: string
}

const H2: React.FC<Props> = ({ title }) => {
    return (
        <div className="h2-box">
            <span className="cyan-box"></span>
            <h2>{title}</h2>
        </div>
    )
}

export default H2
