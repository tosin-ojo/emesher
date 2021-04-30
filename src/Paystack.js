import React from 'react'
import './Paystack.css'
import { PaystackButton } from 'react-paystack'
import { useStateValue } from './StateProvider'
import { getBasketTotal } from './reducer'
import { useHistory } from 'react-router'

function Paystack() {
    const [{ user, basket, deliveryInfo }, dispatch] = useStateValue()
    const history = useHistory()
    const disable = !user || basket.length < 1 || deliveryInfo.address.length < 1 || deliveryInfo.number.length < 1
    const amount = (getBasketTotal(basket) * 100).toFixed(0)

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

    const config = {
        email: user?.email,
        amount,
        publicKey: "pk_test_d3add6e05bd47c610355c5f102e4d38b4cd675a8",
    }

    const handlePaystackSuccessAction = () => {
        displayMessage('success', 'Transaction successfull')
        history.replace('/')
    }

    const handlePaystackCloseAction = () => {
        displayMessage('warning', 'Transaction cancelled')
    }

    const componenetProps = {
        ...config,
        text: `Pay ₦${getBasketTotal(basket).toFixed(2)}`,
        onSuccess: (reference) => handlePaystackSuccessAction(reference),
        onClose: handlePaystackCloseAction,
    }

    return (
        <div 
          className="paystack" 
          style={{
              pointerEvents: disable ? 'none' : '',
              opacity: disable ? '0.6' : ''
            }}
        >
            <PaystackButton {...componenetProps} />
        </div>
    )
}

export default Paystack
