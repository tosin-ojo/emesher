import { ArrowLeft, ArrowRight, Star } from '@material-ui/icons'
import React, { useState } from 'react'
import CurrencyFormat from 'react-currency-format'
import './CheckoutProduct.css'
import { useStateValue } from './StateProvider'

function CheckoutProduct({ id, image, title, price, rating, quantity }) {
    const [, dispatch] = useStateValue()
    const [removing, setRemoving] = useState(false)

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

    const handleRemoveFromBasket = async() => {
        setRemoving(true)
        dispatch({
            type: 'REMOVE_FROM_BASKET',
            id
        })
        displayMessage('Produce removed from basket')
        setRemoving(false)
    }

    const handleQuantityIncrease = () => {
        dispatch({
            type: 'ADD_BASKET_QUANTITY',
            id,
            quantity: quantity + 1
        })
    }

    const handleQuantityDecrease = () => {
        if(quantity < 2) {
            return false
        }
        dispatch({
            type: 'ADD_BASKET_QUANTITY',
            id,
            quantity: quantity - 1
        })
    }
    
    return (
        <div className="checkoutProduct">
            <div className="checkoutProduct__body">
                <img className="checkoutProduct__image" src={image} alt="" />
                <div className="checkoutProduct__info">
                    <p className="checkoutProduct__title">{title}</p>
                    <div className="checkoutProduct__rightSmall">
                        <div className="checkoutProduct__priceSmall">
                            <CurrencyFormat 
                                renderText={(value) => (
                                    <span>{value}</span>
                                )}
                                decimalScale={2}
                                value={price.toFixed(2)}
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"₦"}
                            />                    
                        </div>
                        <div className="checkoutProduct__quantity">
                            <span>Quantity:</span> <ArrowLeft onClick={handleQuantityDecrease} /> <span>{quantity}</span> <ArrowRight onClick={handleQuantityIncrease} />
                        </div>
                    </div>
                    <div className="checkoutProduct__rating">
                        <p 
                        style={{
                            color: rating >= 0.5 ? 'rgb(0, 172, 0)' : ''
                            }}
                        className="checkoutProduct__star"
                        >
                            <Star fontSize="small"/>
                        </p>
                        <p 
                        style={{
                            color: rating >= 1.5 ? 'rgb(0, 172, 0)' : ''
                            }}
                        className="checkoutProduct__star"
                        >
                            <Star fontSize="small"/>
                        </p>
                        <p 
                        style={{
                            color: rating >= 2.5 ? 'rgb(0, 172, 0)' : ''
                            }}
                        className="checkoutProduct__star"
                        >
                            <Star fontSize="small"/>
                        </p>
                        <p 
                        style={{
                            color: rating >= 3.5 ? 'rgb(0, 172, 0)' : ''
                            }}
                        className="checkoutProduct__star"
                        >
                            <Star fontSize="small"/>
                        </p>
                        <p 
                        style={{
                            color: rating >= 4.5 ? 'rgb(0, 172, 0)' : ''
                            }}
                        className="checkoutProduct__star"
                        >
                            <Star fontSize="small"/>
                        </p>
                    </div>
                    <button 
                      onClick={handleRemoveFromBasket}
                      disabled={removing}
                    >
                        Remove from Basket
                        <div 
                            style={{display: removing ? 'flex' : ''}}
                            className="checkoutProduct__spinner"
                        ></div>
                    </button>
                </div>
            </div>
            <div className="checkoutProduct__right">
                <div className="checkoutProduct__price">
                    <CurrencyFormat 
                        renderText={(value) => (
                            <span>{value}</span>
                        )}
                        decimalScale={2}
                        value={price.toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"₦"}
                    />                    
                </div>
                <div className="checkoutProduct__quantity">
                    <ArrowLeft onClick={handleQuantityDecrease} /> <span>{quantity}</span> <ArrowRight onClick={handleQuantityIncrease} />
                </div>
            </div>
        </div>
    )
}

export default CheckoutProduct
