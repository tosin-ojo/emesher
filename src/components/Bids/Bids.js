import {
  AssignmentTurnedIn,
  RateReview,
  Stars,
  VerifiedUser,
} from "@material-ui/icons";
import React from "react";
import CurrencyFormat from "react-currency-format";
import moment from "moment";
import "./Bids.css";

function Bids({ profile, bid }) {
  return (
    <div className="bids">
      <main className="bids__body">
        <section className="bids__head">
          <div className="bids__images">
            <img src={bid.data.imageUrl} alt="" />
          </div>
          <div className="bids__headRight">
            <div className="bids__headTop">
              <div>
                <div className="bids__bidderStatus">
                  <div className="bids__bidder">{bid.data.displayName}</div>
                  <div className="bids__badges">
                    <VerifiedUser
                      style={{ fontSize: "14px", color: "rgb(0, 172, 0)" }}
                    />
                  </div>
                </div>
                <div className="bids__profile">@{bid.data.username}</div>
              </div>
              <time className="bids__time">
                {moment().to(moment(bid.data.created))}
              </time>
            </div>
            <div className="bids__headBottom">
              <div>
                <Stars style={{ fontSize: "16px", color: "purple" }} />
                <div> 4.9</div>
              </div>
              <div>
                <RateReview style={{ fontSize: "16px", color: "darkorange" }} />
                <div> 500</div>
              </div>
              <div>
                <AssignmentTurnedIn
                  style={{ fontSize: "16px", color: "darkgreen" }}
                />
                <div> 18|90%</div>
              </div>
            </div>
          </div>
        </section>
        <article className="bids__bidderInfo">{bid.data.proposal}</article>
        <time className="bids__time bids__hide">
          {moment().to(moment(bid.data.created))}
        </time>
        <section className="bids__bodyBottom">
          <div className="bids__bidPrice">
            Bid:
            <CurrencyFormat
              renderText={(value) => value}
              decimalScale={2}
              value={bid.data.bid}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"₦"}
            />
          </div>
          {profile && (
            <div className="bids__button">
              <button>Respond</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Bids;
