import { AssignmentTurnedIn, RateReview, Stars, VerifiedUser } from '@material-ui/icons'
import React from 'react'
import './Bids.css'

function Bids({ profile }) {
    return (
        <div className="bids">
            <main className="bids__body">
                <section className="bids__head">
                    <div className="bids__images">
                        <img 
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTT3basWwcdU7w8aqChdR9HTRdNmbnL_Dm4w&usqp=CAU" 
                          alt="" 
                        />
                    </div>
                    <div className="bids__headRight">
                        <div className="bids__headTop">
                            <div>
                                <div className="bids__bidderStatus">
                                    <div className="bids__bidder">emesher Farms</div>
                                    <div className="bids__badges">
                                        <VerifiedUser 
                                        style={{fontSize:"14px", color:"rgb(0, 172, 0)"}} 
                                        />
                                    </div>
                                </div>
                                <div className="bids__profile">@emesher</div>
                            </div>
                            <time className="bids__time">2 minute ago</time>
                        </div>
                        <div className="bids__headBottom">
                            <div>
                                <Stars 
                                  style={{fontSize:"16px", color:"purple"}}
                                />
                                <div> 4.9</div>
                            </div>
                            <div>
                                <RateReview 
                                  style={{fontSize:"16px", color:"darkorange"}}
                                />
                                <div>  500</div>
                            </div>
                            <div>
                                <AssignmentTurnedIn 
                                  style={{fontSize:"16px", color:"darkgreen"}}
                                />
                                <div> 18|90%</div>
                            </div>
                        </div>
                    </div>
                </section>
                <article className="bids__bidderInfo">
                    My name is Tosin and I am very good in what i do, I am ready to supply you this product,
                    on time and in quality.
                </article>
                <time className="bids__time bids__hide">2 minute ago</time>
                <section className="bids__bodyBottom">
                    <div className="bids__bidPrice">
                        Bid: #50,000
                    </div>
                    {profile && <div className="bids__button">
                        <button>Respond</button>
                    </div>}
                </section>
            </main>
        </div>
    )
}

export default Bids
