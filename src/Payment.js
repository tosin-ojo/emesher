import React, { useCallback, useEffect, useState } from 'react'
import CurrencyFormat from 'react-currency-format'
import './Payment.css'
import { getBasketTotal } from './reducer'
import { useStateValue } from './StateProvider'
import { useHistory } from 'react-router-dom'
import { Star } from '@material-ui/icons'

function Payment() {
    const [{ user, basket }, dispatch] = useStateValue()
    const [address, setAddress] = useState('')
    const [number, setNumber] = useState('')
    const history = useHistory()
    const itemTotal = basket.reduce((amount, item) => Number(item.quantity) + amount, 0)
    const disable = !user || basket.length < 1 || address.length < 1 || number.length < 1
        
    const handleClick = () => {
        dispatch({
            type: 'ADD_DELIVERY_INFO',
            deliveryInfo: {
                address,
                number
            }
        })

        history.push('/confirmation')
    }
    
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
        <div className='payment'>
            <div className="payment__container" style={{ flex: '1' }}>
                <h2>
                    Checkout {basket?.length} item{basket?.length > 1 ? 's' : ''}
                </h2>
                <div className="payment__section">
                    <div className='payment__title'>
                        <h3>Delivery Address</h3>
                    </div>
                    <div className="payment__address">
                        <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter your delivery address" autoFocus required />
                        <input type="text" value={number} onChange={e => setNumber(e.target.value)} placeholder="Enter your phone number" required />
                    </div>
                </div>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Review items</h3>
                    </div>
                    <div className="payment__items">
                        {basket.map((item, i) => (
                            <div className="payment__itemsContainer" key={i}>
                                 <div className="payment__itemsImage">
                                     <img src={item.image} alt="" />
                                 </div>
                                 <div className="payment__itemsInfo">
                                     <div className="payment__itemsTitle">
                                        {item.title}
                                     </div>
                                     <div className="payment__itemsPrice">
                                        <CurrencyFormat 
                                            renderText={(value) => (
                                                <span style={{ fontWeight: '600' }}>{value}</span>
                                            )}
                                            decimalScale={2}
                                            value={item.price.toFixed(2)}
                                            displayType={"text"}
                                            thousandSeparator={true}
                                            prefix={"₦"}
                                        />
                                     </div>
                                     <div className="payment__itemsQuatity">
                                         Quantity: {item.quantity}
                                     </div>
                                     <div className="payment__itemsRating">
                                         <p 
                                          style={{
                                            color: item.rating >= 0.5 ? 'rgb(0, 172, 0)' : ''
                                            }}
                                          className="payment__star"
                                        >
                                            <Star fontSize="small"/>
                                        </p>
                                        <p 
                                          style={{
                                            color: item.rating >= 1.5 ? 'rgb(0, 172, 0)' : ''
                                            }}
                                          className="payment__star"
                                        >
                                            <Star fontSize="small"/>
                                        </p>
                                        <p 
                                          style={{
                                            color: item.rating >= 2.5 ? 'rgb(0, 172, 0)' : ''
                                            }}
                                          className="payment__star"
                                        >
                                            <Star fontSize="small"/>
                                        </p>
                                        <p 
                                          style={{
                                            color: item.rating >= 3.5 ? 'rgb(0, 172, 0)' : ''
                                            }}
                                          className="payment__star"
                                        >
                                            <Star fontSize="small"/>
                                        </p>
                                        <p 
                                          style={{
                                            color: item.rating >= 4.5 ? 'rgb(0, 172, 0)' : ''
                                            }}
                                          className="payment__star"
                                        >
                                            <Star fontSize="small"/>
                                        </p>
                                     </div>
                                 </div>
                            </div>
                        ))}
                    </div>
                
                </div>
                
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Summary</h3>
                    </div>
                    <div className="payment__details">
                        <div className="payment__detailsContainer">
                            <div>Total individual items: {basket.length}</div>
                            <div>Total items: {itemTotal}</div>
                            <CurrencyFormat 
                                renderText={(value) => (
                                <>
                                    <p>
                                        <strong>Price: {value}</strong>
                                    </p>
                                </>
                                )}
                                decimalScale={2}
                                value={getBasketTotal(basket)}
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"₦"}
                            />
                            
                            <button 
                                style={{ opacity: disable && '0.5' }} 
                                onClick={handleClick}
                                disabled={disable}
                            >Proceed to payment</button>
                        </div>
                    </div>
                </div>
            </div>
        
        </div>
    )
}

export default Payment