import React, { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import './Confirmation.css'
import { useStateValue } from './StateProvider'
import Order from './Order'

function Confirmation() {
    const [{basket}, dispatch] = useStateValue()
    const history = useHistory()

    const emptyBasketEffect = useCallback(() => {
        if(basket.length < 1) {
            history.replace('/checkout')
            
            dispatch({
                type: 'EMPTY_BASKET'
            })
        }
    }, [basket, history, dispatch])

    useEffect(() => {
        emptyBasketEffect()
    }, [emptyBasketEffect])

    return (
        <div className="confirmation">
            <div className="confirmation__container" style={{ flex: '1' }}>
                <Order confirmation/>
            </div>
        </div>
    )
}

export default Confirmation
