import React, { useState } from 'react'
import CurrencyFormat from 'react-currency-format'
import './Product.css'
import { useStateValue } from './StateProvider'
import { Link, useHistory } from 'react-router-dom'

function Product({ id, title, image, price, rating, unit, product }) {
    const [, dispatch] = useStateValue()
    const history = useHistory()
    const [adding, setAdding] = useState(false)
    
    const displayMessage = (severity, message) => {
        dispatch({
            type: 'ADD_FLASH_MESSAGE',
            message: {
                severity,
                message,
                duration: 5000
            }
        })

        dispatch({
            type: 'SHOW_FLASH_MESSAGE',
            showFlash: true
        })
    }

    const addToBasket = async () => {
        setAdding(true)
        dispatch({
            type: 'ADD_TO_BASKET',
            item: {
                id,
                title: product.stockTitle,
                image: product.imageUrl,
                price: product.price,
                rating: 0,
                unit: product.unit,
                quantity: 1
            }
        })

        setAdding(false)
        displayMessage('success', 'Produce added to basket')
    }
    
    return (
        <div className='product'>
        
        </div>
    )
}

export default Product
