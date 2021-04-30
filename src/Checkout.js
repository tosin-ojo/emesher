import React from 'react'
import { Link } from 'react-router-dom'
import './Checkout.css'
import CheckoutProduct from './CheckoutProduct'
import { useStateValue } from './StateProvider'
import { getBasketTotal, getItemTotal } from './reducer'
import CurrencyFormat from 'react-currency-format'
import { useHistory } from 'react-router-dom'

function Checkout() {
    const [{ user, basket }, dispatch] = useStateValue()
    const history = useHistory()

    const handleContinueShopping = async() => {
        if(basket.length < 1) {
            return history.push('/')
        }

        if(!user) {
            return (
                dispatch({
                    type: 'SET_LASTURL',
                    lastUrl: window.location.pathname
                  }),

                history.push('/login')
                )
        }

        history.push('/payment')
    }
    
    return (
        <div className='checkout'>
            <div className="checkout__container" style={{ flex: '1' }}>
                <div className="checkout__avert">
                    <img src='https://img.freepik.com/free-photo/food-groceries-shopping-basket-kitchen-table-banner-background_8087-1861.jpg?size=626&ext=jpg' 
                      alt="" />
                </div>
                <div className="checkout__sections">
                    <div className="checkout__left">
                        <div className="checkout__body">
                            <div className="checkout__basket">
                                <div className="checkout__basketHead">
                                    <div className="checkout__basketTitle">Your agro-basket</div>
                                    {basket.length > 0 && <div className="checkout__basketSubTitle">
                                        <div>Price</div>
                                        <div>Quantity</div>
                                    </div>}
                                </div>
                                <div className="checkout__basketBody">
                                    <>
                                    {basket?.length === 0 ? <h4>Your basket is empty, continue shopping to add items. <Link to="/" style={{ color: '#3b8238' }}>Click here</Link> to continue shopping</h4> :
                                        basket.map((item, i) => (
                                            <CheckoutProduct 
                                                key={i}
                                                index={i}
                                                id={item.id}
                                                title={item.title}
                                                image={item.image}
                                                price={item.price}
                                                rating={item.rating}
                                                quantity={item.quantity}
                                                checkout
                                            />
                                        ))
                                    }
                                    </>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="checkout__right">
                        <div className="checkout__basketInfo">
                            <div className="checkout__basketInfoHead">
                                Basket Details
                            </div>
                            <div className="checkout__basketDetails">
                                <div className="checkout__basketTotal">
                                    <div>Total individual items</div>
                                    <div>{basket.length}</div>
                                </div>
                                <div className="checkout__basketTotal">
                                    <div>Total items</div>
                                    <div>{getItemTotal(basket)}</div>
                                </div>
                                <div className="checkout__basketTotal">
                                    <div>Total price</div>
                                    <div>
                                        <CurrencyFormat 
                                            renderText={(value) => (
                                                <strong>{value}</strong>
                                            )}
                                            decimalScale={2}
                                            value={getBasketTotal(basket).toFixed(2)}
                                            displayType={"text"}
                                            thousandSeparator={true}
                                            prefix={"₦"}
                                        />
                                    </div>
                                </div>
                                <div className="checkout__basketButton">
                                    <button onClick={handleContinueShopping}>Continue Shopping</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout
