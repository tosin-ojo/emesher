import React from 'react'
import './Loading.css'


function Loading({ body }) {
    return (
        <div className="loading" style={{ height: body && '60vh' }}>
            Loading
        </div>
    )
}

export default Loading
