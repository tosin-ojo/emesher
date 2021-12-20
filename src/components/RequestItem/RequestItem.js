import moment from 'moment'
import React from 'react'
import CurrencyFormat from 'react-currency-format'
import './RequestItem.css'
import { useHistory } from 'react-router-dom'

function RequestItem({ request }) {
    const history = useHistory()
    
    return (
        <div className="requestItem" onClick={() => history.push(`/bid/${request.slug}`)}>
            <div className="requestItem__details">
                <div className="requestItem__detailsLeft">
                    <div className="requestItem__subject">
                        {request.title}
                        {request && <span>DD {moment().to(moment(request.deadline))}</span>}
                    </div>
                    <div className="requestItem__info">
                        {request.summary}
                    </div>
                </div>
                <div className="requestItem__detailsRight">
                    <div className="requestItem__price">
                    <CurrencyFormat 
                        renderText={(value) => (
                            value
                        )}
                        decimalScale={2}
                        value={request.minBudget}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"₦"}
                    /> -&nbsp;
                    <CurrencyFormat 
                        renderText={(value) => (
                            value
                        )}
                        decimalScale={2}
                        value={request.maxBudget}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"₦"}
                    />
                    </div>
                    <div className="requestItem__bid">
                        {request.bidNumber} {request.bidNumber > 1 ? 'bids' : 'bid'}
                    </div>
                </div>
            </div>
            <div className="requestItem__category">
                Category: <span>{request.category}</span>
            </div>
        </div>
    )
}

export default RequestItem
