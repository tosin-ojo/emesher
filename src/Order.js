import React from 'react'
import moment from 'moment'
import { Star } from '@material-ui/icons'
import CurrencyFormat from 'react-currency-format'
import './Order.css'
import { useStateValue } from './StateProvider'
import { getBasketTotal } from './reducer'
import Paystack from './Paystack'

function Order({ confirmation }) {
    const [{ user, basket, deliveryInfo }] = useStateValue()

    return (
        <div className="order">
            <div className="order__head">
            <h2>Order</h2>
            </div>
    
            <div className="order__orders">
                <div className="order__ordersTop">
                    <div className="order__id">
                        <div className="order__no">
                            {confirmation && <div>Order Details</div>}
                        </div>
                        
                        <div className="order__length">
                            {basket.length} {basket.length > 1 ? 'items' : 'item'}
                        </div>
                        
                        <div className="order__date">
                            Order on <i>{moment(Date.now()).format('DD-MM-YYYY')}</i>
                        </div>

                        <div className="order__address">
                            <i>To {deliveryInfo.address}</i>
                        </div>

                        <div className="order__phone">
                            By <i>{deliveryInfo.number}</i>
                        </div>
                    </div>
                    
                    <div className="order__payment">
                        <div className="order__paymentTitle">
                            Payment Method
                        </div>

                        <div className="order__paymentMtd">
                            Paystack Modern Online Payment
                        </div>
                        
                        <div className="order__paymentDate">
                            Payment on <i>{moment(Date.now()).format('DD-MM-YYYY')}</i>
                        </div>

                        <div className="order__amount">
                            <CurrencyFormat 
                                renderText={(value) => (
                                    <p className="order__total">Total: <strong><i>{value}</i></strong></p>
                                )}
                                decimalScale={2}
                                value={getBasketTotal(basket)}
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"₦"}
                            />
                        </div>

                        <div className="order__email">
                            From <i>{user?.email}</i>
                        </div>
                    </div>
                </div>
                <div className="order__items">
                    <div className="order__itemsHeader">{basket.length > 1 ? 'ITEMS' : 'ITEM'} IN YOUR ORDER</div>
                    <div className="order__list">
                        {basket.map((item, i) => (
                            <div className="order__itemsContainer order__fadeIn" key={i}>
                                <div className="order__itemsImage">
                                    <img src={item.image} alt="" />
                                </div>
                                <div className="order__itemsInfo">
                                    <div className="order__itemsTitle">
                                        {item.title}
                                    </div>
                                    <div className="order__itemsPrice">
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
                                    <div className="order__itemsQuatity">
                                        Quantity: {item.quantity}
                                    </div>
                                    <div className="order__itemsRating">
                                        <p 
                                        style={{
                                            color: item.rating >= 0.5 ? 'rgb(0, 172, 0)' : ''
                                            }}
                                        className="order__star"
                                        >
                                            <Star fontSize="small"/>
                                        </p>
                                        <p 
                                        style={{
                                            color: item.rating >= 1.5 ? 'rgb(0, 172, 0)' : ''
                                            }}
                                        className="order__star"
                                        >
                                            <Star fontSize="small"/>
                                        </p>
                                        <p 
                                        style={{
                                            color: item.rating >= 2.5 ? 'rgb(0, 172, 0)' : ''
                                            }}
                                        className="order__star"
                                        >
                                            <Star fontSize="small"/>
                                        </p>
                                        <p 
                                        style={{
                                            color: item.rating >= 3.5 ? 'rgb(0, 172, 0)' : ''
                                            }}
                                        className="order__star"
                                        >
                                            <Star fontSize="small"/>
                                        </p>
                                        <p 
                                        style={{
                                            color: item.rating >= 4.5 ? 'rgb(0, 172, 0)' : ''
                                            }}
                                        className="order__star"
                                        >
                                            <Star fontSize="small"/>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Paystack />
              </div>
        </div>
    )
}

export default Order
