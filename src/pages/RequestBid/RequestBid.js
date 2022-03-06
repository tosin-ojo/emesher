import React, { useEffect, useRef, useState } from "react";
import {
  BeenhereOutlined,
  Delete,
  EmailOutlined,
  EventNoteOutlined,
  GradeOutlined,
  MoneyOutlined,
  PersonOutlined,
  PhoneOutlined,
  ReceiptOutlined,
  ReportOutlined,
  Timer,
} from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import Bids from "../../components/Bids/Bids";
import firebase from "firebase";
import "./RequestBid.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { db } from "../../utils/firebase";
import { useHistory } from "react-router-dom";
import CurrencyFormat from "react-currency-format";
import moment from "moment";
import { useStateValue } from "../../StateProvider";
import Logo from "../../images/emesher.png";

function RequestBid() {
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();
  const [fetching, setFetching] = useState(true);
  const [request, setRequest] = useState([]);
  const [proposal, setProposal] = useState([]);
  const [requestInfo, setRequestInfo] = useState([]);
  const [activeNav, setActiveNav] = useState("details");
  const [bids, setBids] = useState([]);
  const [bid, setBid] = useState(0);
  const [editBid, setEditBid] = useState([]);
  const [checkingBid, setCheckingBid] = useState(true);
  const [bidding, setBidding] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [removing, setRemoving] = useState(false);
  const disable =
    proposal.length < 1 ||
    bid < 1 ||
    user.emailVerified === false ||
    !user ||
    bidding ||
    checkingBid;
  const slug = useRef(window.location.pathname);
  const bidStatus = new Date(request[0]?.data.deadline) < new Date();

  const displayMessage = (severity, message) => {
    dispatch({
      type: "ADD_FLASH_MESSAGE",
      message: {
        severity,
        message,
        duration: 5000,
      },
    });

    dispatch({
      type: "SHOW_FLASH_MESSAGE",
      showFlash: true,
    });
  };

  const handleRemoveRequest = async () => {
    setRemoving(true);
    if (!user) {
      return false;
    }

    if (request[0].data.email !== user.email) {
      return displayMessage("error", "You can not delete!");
    }

    const publicRequestsRef = db.collection("requests").doc(request[0].id);
    const publicStatsRef = db.collection("counter").doc("requests");
    const statsRef = db
      .collection("users")
      .doc(user.user_id)
      .collection("transactions")
      .doc("--STATS--");
    const decreaseCount = firebase.firestore.FieldValue.increment(-1);
    const batch = db.batch();

    try {
      await batch.delete(publicRequestsRef);
      await batch.set(
        statsRef,
        { requestsCount: decreaseCount },
        { merge: true }
      );
      await batch.set(
        publicStatsRef,
        { requestsCount: decreaseCount },
        { merge: true }
      );
      await batch.commit();
      history.push("/profile");
      displayMessage("success", "Request removed successfully");
    } catch (error) {
      displayMessage("error", "Error occured");
      console.log(error);
    } finally {
      setRemoving(false);
    }
  };

  const onSubmitBid = async () => {
    const bidRef = db.collection("bids").doc();
    const bidRequestStatRef = db
      .collection("requests")
      .doc(request[0].id)
      .collection("--INFO--")
      .doc("info");
    const bidNumberUpdate = db.collection("requests").doc(request[0].id);
    const increaseBidCount = firebase.firestore.FieldValue.increment(1);
    const increaseRatingCount = firebase.firestore.FieldValue.increment(4.5);
    const increaseAmountCount = firebase.firestore.FieldValue.increment(bid);
    const batch = db.batch();
    if (editBid.length > 0) {
      try {
        await db
          .collection("bids")
          .doc(editBid[0].id)
          .update({
            bid: parseInt(bid),
            proposal,
          });
        displayMessage("success", "Bid successfully edited");
      } catch (error) {
        console.log(error);
        displayMessage("error", "Error occurred!");
      } finally {
        setBidding(false);
      }
    } else {
      try {
        await batch.set(bidRef, {
          email: user.email,
          slug: request[0].data.slug,
          created: parseInt(Date.now()),
          rating: 0,
          reviewCount: 0,
          completedTrans: 0,
          totalTrans: 0,
          imageUrl: user.photoURL,
          displayName: user.displayName,
          username: "emesher",
          bid: parseInt(bid),
          proposal,
        });
        await batch.set(
          bidNumberUpdate,
          { bidNumber: increaseBidCount },
          { merge: true }
        );
        await batch.set(
          bidRequestStatRef,
          {
            bidNumber: increaseBidCount,
            Rating: increaseRatingCount,
            bidAmount: increaseAmountCount,
          },
          { merge: true }
        );
        await batch.commit();
        displayMessage("success", "Bid successfully made");
      } catch (error) {
        console.log(error);
        displayMessage("error", "Error occurred!");
      } finally {
        setBidding(false);
      }
    }
  };

  const handleOnSubmitBid = () => {
    setBidding(true);
    if (bidding || checkingBid) {
      return false;
    }
    if (!user) {
      return displayMessage("error", "Please login before bidding");
    }
    if (user.emailVerified === false) {
      return displayMessage("error", "Please verify your email before bidding");
    }
    if (proposal.length < 1) {
      return displayMessage("error", "Proposal field is empty");
    }
    if (bid < request[0].data.minBudget || bid > request[0].data.maxBudget) {
      return displayMessage(
        "error",
        "Bid should be within the range stated by client"
      );
    }
    if (request[0].data.email === user.email) {
      return displayMessage("error", "You can not bid for your request");
    }

    onSubmitBid();
  };

  useEffect(() => {
    if (!user) {
      setSeverity("error");
      setMessage("Please login before bidding");
    } else if (user.emailVerified === false) {
      setSeverity("error");
      setMessage("Please verify your email before bidding");
    } else {
      setSeverity("success");
      setMessage("Please input your proposal and bid");
    }

    if (user) {
      db.collection("bids")
        .where("slug", "==", slug.current.split("/")[2])
        .where("email", "==", user.email)
        .get()
        .then((snapshot) => {
          if (snapshot.size < 1) {
            setCheckingBid(false);
            return setEditBid([]);
          }

          setEditBid(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
          setCheckingBid(false);
        });
    }

    db.collection("bids")
      .where("slug", "==", slug.current.split("/")[2])
      .get()
      .then((snapshot) => {
        if (snapshot.size < 1) {
          return setBids([]);
        }

        setBids(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

    db.collection("requests")
      .where("slug", "==", slug.current.split("/")[2])
      .get()
      .then((snapshot) => {
        if (snapshot.size < 1) {
          setFetching(false);
          return setRequest([]);
        }
        snapshot.docs[0].ref
          .collection("--INFO--")
          .onSnapshot((querySnapshot) => {
            setRequestInfo(
              querySnapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              }))
            );
          });

        setRequest(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
        setFetching(false);
      });
  }, [user]);

  useEffect(() => {
    if (editBid.length > 0) {
      setProposal(editBid[0].data.proposal);
      setBid(editBid[0].data.bid);
    }
  }, [editBid]);

  useEffect(() => {
    if (request.length > 0 && !fetching && activeNav === "details") {
      document.getElementById("requestBid_bodyContent_details").innerHTML =
        requestInfo[0]?.data.details || "...";
    }
  }, [requestInfo, fetching, activeNav, request]);

  const activeNavStyle = {
    color: "white",
    borderBottom: "3px solid white",
  };

  return (
    <div className="requestBid">
      <Sidebar className="sidebar" />
      <div className="requestBid__container" style={{ flex: "1" }}>
        {fetching ? (
          <main className="requestBid__loading">
            <section className="requestBid__loadingLeft">
              <div className="requestBid__loadingLeftTop">
                <div className="requestBid__loadingLeftTopHeader">
                  <div className="requestBid__loadingLeftTopcontent"></div>
                  <div className="requestBid__loadingLeftTopcontent"></div>
                </div>
                <div className="requestBid__loadingLeftTopBody"></div>
                <div
                  style={{ width: "45%" }}
                  className="requestBid__loadingLeftTopBody"
                ></div>
                <div className="requestBid__loadingLeftTopFoot">
                  <div className="requestBid__loadingLeftTopFootTop"></div>
                  <div className="requestBid__loadingLeftTopFootBottom"></div>
                </div>
              </div>
              <div className="requestBid__loadingLeftBottom">
                <div className="requestBid__loadingLeftBottomHeader">
                  <div className="requestBid__loadingLeftBottomcontent"></div>
                </div>
                <div className="requestBid__loadingLeftBottomMessage"></div>
                <div className="requestBid__loadingLeftBottomProposal">
                  <div className="requestBid__loadingProposalLabel"></div>
                  <div className="requestBid__loadingProposalText"></div>
                </div>
                <div className="requestBid__loadingLeftBottomFoot">
                  <div className="requestBid__loadingBid"></div>
                  <div className="requestBid__loadingButton"></div>
                </div>
              </div>
            </section>
            <section className="requestBid__loadingRight">
              <div className="requestBid__loadingRightHeader">
                <div className="requestBid__loadingRightHeaderContent"></div>
              </div>
              <div className="requestBid__loadingRightBody">
                <div className="requestBid__loadingRightBodyContent">
                  <div></div>
                  <div></div>
                </div>
                <div className="requestBid__loadingRightBodyContent">
                  <div></div>
                  <div></div>
                </div>
                <div className="requestBid__loadingRightBodyContent">
                  <div></div>
                  <div></div>
                </div>
                <div className="requestBid__loadingRightBodyContent">
                  <div></div>
                  <div></div>
                </div>
              </div>
              <div className="requestBid__loadingRightFoot">
                <div
                  style={{ marginBottom: "20px" }}
                  className="requestBid__loadingRightHeaderContent"
                ></div>
                <div className="requestBid__loadingRightBodyContent">
                  <div></div>
                  <div></div>
                </div>
                <div className="requestBid__loadingRightBodyContent">
                  <div></div>
                  <div></div>
                </div>
              </div>
            </section>
          </main>
        ) : request.length < 1 ? (
          <section className="fetch__empty">
            <img src={Logo} alt="" />
            <div>
              <h2>Request not found</h2>
              <span>This may be due to internet disconnection</span>
            </div>
          </section>
        ) : (
          <>
            <section className="requestBid__header">
              <div className="requestBid__headerTop">
                <div className="requestBid__title">{request[0].data.title}</div>
                <div className="requestBid__status">
                  {fetching ? "status" : bidStatus ? "closed" : "open"}
                </div>
              </div>
              <div
                className="requestBid__headerNav"
                style={{ pointerEvents: fetching ? "none" : "" }}
              >
                <nav
                  className="requestBid__detailsNav"
                  onClick={() => setActiveNav("details")}
                  style={activeNav === "details" ? activeNavStyle : {}}
                >
                  Details
                </nav>
                <nav
                  className="requestBid__proposalsNav"
                  onClick={() => setActiveNav("proposals")}
                  style={activeNav === "proposals" ? activeNavStyle : {}}
                >
                  Proposals
                </nav>
              </div>
            </section>

            {request[0].data.email !== user?.email && activeNav === "details" && (
              <main className="requestBid__sections">
                <section className="requestBid__bodyContainer">
                  <section className="requestBid__body">
                    <div className="requestBid__bodyTop">
                      <h3 className="requestBid__bodyTopLeft">
                        Request Information
                      </h3>
                      <div className="requestBid__bodyTopRight">
                        <div className="requestBid__bodyPrice">
                          <CurrencyFormat
                            renderText={(value) => value}
                            decimalScale={2}
                            value={request[0].data.minBudget}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"₦"}
                          />
                          &nbsp;-&nbsp;
                          <CurrencyFormat
                            renderText={(value) => value}
                            decimalScale={2}
                            value={request[0].data.maxBudget}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"₦"}
                          />
                        </div>
                        <div className="requestBid__bodyTime">
                          <span>
                            <Timer style={{ lineHeight: "2" }} />
                          </span>
                          <time>
                            Delivery{" "}
                            {moment().to(moment(request[0].data.deadline))}
                          </time>
                        </div>
                      </div>
                    </div>
                    <article className="requestBid__bodyContent">
                      <h3 className="requestBid__bodyContentHeader">Summary</h3>
                      <div>{request[0].data.summary}</div>
                      <h3 className="requestBid__bodyContentHeader">Details</h3>
                      <div id="requestBid_bodyContent_details"></div>
                    </article>
                    <div className="requestBid__bodyProduct">
                      <h3 className="requestBid__bodyProductHeader">
                        Category
                      </h3>
                      <div className="requestBid__bodyProductProducts">
                        <span>{request[0].data.category}</span>
                      </div>
                    </div>
                  </section>
                  <section className="requestBid__bid">
                    <div className="requestBid__bidTop">
                      <h3 className="requestBid__bidTopLeft">Make your Bid</h3>
                    </div>
                    <div className="requestBid__bidContent">
                      <Alert severity={severity}>
                        <div className="requestBid__alert">{message}</div>
                      </Alert>
                      <div className="requestBid__textArea">
                        <label>Your proposal for this request</label>
                        <textarea
                          placeholder="..."
                          value={proposal}
                          onChange={(e) => setProposal(e.target.value)}
                        />
                      </div>
                      <div className="requestBid__bidBottom">
                        <div className="requestBid__BidInput">
                          <label>Input bid</label>
                          <div className="requestBid__input">
                            <input
                              type="number"
                              value={bid === 0 ? "" : bid}
                              placeholder="0"
                              onChange={(e) => setBid(e.target.value)}
                              required
                            />
                            <div>NGN</div>
                          </div>
                        </div>
                        <div className="requestBid__button">
                          <button
                            style={{ opacity: disable ? "0.6" : "" }}
                            disabled={disable}
                            onClick={handleOnSubmitBid}
                          >
                            {bidding
                              ? "Submitting"
                              : editBid.length > 0
                              ? "Edit Bid"
                              : "Bid"}

                            <div
                              style={{ display: bidding ? "flex" : "" }}
                              className="requestBid__spinner"
                            ></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                </section>
                <section className="requestBid__details">
                  <div className="requestNid__clientInfoBox">
                    <div className="requestBid__detailsTop">
                      <h3 className="requestBid__detailsTopLeft">
                        About the Client
                      </h3>
                    </div>
                    <div className="requestBid__detailsClient">
                      <div>
                        <ReceiptOutlined />
                        <span>
                          {requestInfo[0]?.data.completedTrans} completed
                          transaction
                          {requestInfo[0]?.data.completedTrans > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div>
                        <GradeOutlined />
                        <span>
                          <span>{requestInfo[0]?.data.rating?.toFixed(1)}</span>{" "}
                          ({requestInfo[0]?.data.reviewCount} reviews)
                        </span>
                      </div>
                      <div>
                        <EventNoteOutlined />
                        <span>
                          Member since{" "}
                          {moment(requestInfo[0]?.data.joined).format(
                            "MMMM Do YYYY"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="requestBid__clientVerifications">
                      <div>Client Verification</div>
                      <div
                        style={{
                          color:
                            requestInfo[0]?.data.emailVerified === true
                              ? "rgb(0, 172, 0)"
                              : "",
                        }}
                      >
                        <EmailOutlined
                          style={{
                            color:
                              requestInfo[0]?.data.emailVerified === true
                                ? "rgb(0, 172, 0)"
                                : "",
                          }}
                        />
                        <span
                          title={
                            requestInfo[0]?.data.emailVerified === true
                              ? "Verified"
                              : "Not verified"
                          }
                        >
                          Email address verified
                        </span>
                      </div>
                      <div>
                        <PhoneOutlined />
                        <span>Phone number verified</span>
                      </div>
                    </div>
                  </div>
                  <div className="requestBid__reportBtn">
                    <button>
                      <ReportOutlined style={{ fontSize: "20px" }} />
                      <span>Report Request</span>
                    </button>
                  </div>
                </section>
              </main>
            )}
            {request[0].data.email !== user?.email &&
              activeNav === "proposals" && (
                <div className="requestBid__bidsCtn">
                  <div className="requestBid__bids">
                    {bids.map((bid) => (
                      <div key={bid.id}>
                        <Bids bid={bid} />
                      </div>
                    ))}
                  </div>
                  <section className="requestBid__bidsDetails">
                    <h3 className="requestBid__bidsDetailsHeader">
                      Proposal Details
                    </h3>
                    <div className="requestBid__bidDetailsBody">
                      <div>
                        <BeenhereOutlined fontSize="small" />
                        <span>
                          {bids.length} bid{bids.length > 1 ? "s" : ""}{" "}
                          submitted
                        </span>
                      </div>
                      <div>
                        <GradeOutlined fontSize="small" />
                        <span>
                          <span>{requestInfo[0]?.data.rating?.toFixed(1)}</span>{" "}
                          ({requestInfo[0]?.data.reviewCount} reviews)
                        </span>
                      </div>
                      <div>
                        <MoneyOutlined fontSize="small" />
                        <span>
                          <CurrencyFormat
                            renderText={(value) => value}
                            decimalScale={2}
                            value={bids
                              .map((bid) => bid.data.bid)
                              .reduce((acc, value) => acc + value, 0)}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"₦"}
                          />{" "}
                          (Average)
                        </span>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            {request[0].data.email === user?.email && activeNav === "details" && (
              <main className="requestBid__sections">
                <section className="requestBid__bodyContainer">
                  <section className="requestBid__body">
                    <div className="requestBid__bodyTop">
                      <h3 className="requestBid__bodyTopLeft">
                        Request Information
                      </h3>
                      <div className="requestBid__bodyTopRight">
                        <div className="requestBid__bodyPrice">
                          <CurrencyFormat
                            renderText={(value) => value}
                            decimalScale={2}
                            value={request[0].data.minBudget}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"₦"}
                          />
                          &nbsp;-&nbsp;
                          <CurrencyFormat
                            renderText={(value) => value}
                            decimalScale={2}
                            value={request[0].data.maxBudget}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"₦"}
                          />
                        </div>
                        <div className="requestBid__bodyTime">
                          <span>
                            <Timer style={{ lineHeight: "2" }} />
                          </span>
                          <time>
                            Deadline{" "}
                            {moment().to(moment(request[0].data.deadline))}
                          </time>
                        </div>
                      </div>
                    </div>
                    <article className="requestBid__bodyContent">
                      <h3 className="requestBid__bodyContentHeader">Summary</h3>
                      <div>{request[0].data.summary}</div>
                      <h3 className="requestBid__bodyContentHeader">Details</h3>
                      <div id="requestBid_bodyContent_details"></div>
                    </article>
                    <div className="requestBid__bodyProduct">
                      <h3 className="requestBid__bodyProductHeader">
                        Category
                      </h3>
                      <div className="requestBid__bodyProductProducts">
                        <span>{request[0].data.category}</span>
                      </div>
                    </div>
                  </section>
                </section>
                <section className="requestBid__details">
                  <div className="requestNid__clientInfoBox">
                    <div className="requestBid__detailsTop">
                      <h3 className="requestBid__detailsTopLeft">
                        Request Details
                      </h3>
                    </div>
                    <div className="requestBid__detailsClient">
                      <div>
                        <PersonOutlined />
                        <span className="requestBid__profile">Emesher</span>
                      </div>
                      <div>
                        <BeenhereOutlined />
                        <span>20 bids made</span>
                      </div>
                      <div>
                        <EventNoteOutlined />
                        <span>
                          Created on{" "}
                          {moment(request[0].data.createdAt.seconds).format(
                            "MMMM Do YYYY"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="requestBid__clientVerifications">
                      <h3>Client Verification</h3>
                      <div
                        style={{
                          color:
                            requestInfo[0]?.data.emailVerified === true
                              ? "rgb(0, 172, 0)"
                              : "",
                        }}
                      >
                        <EmailOutlined
                          style={{
                            color:
                              requestInfo[0]?.data.emailVerified === true
                                ? "rgb(0, 172, 0)"
                                : "",
                          }}
                        />
                        <span
                          title={
                            requestInfo[0]?.data.emailVerified === true
                              ? "Verified"
                              : "Not verified"
                          }
                        >
                          Email address verified
                        </span>
                      </div>
                      <div>
                        <PhoneOutlined />
                        <span>Phone number verified</span>
                      </div>
                    </div>
                  </div>
                  <div className="requestBid__reportBtn bidDeleteBtn">
                    <button
                      className="requestBid__deleteBtn"
                      onClick={handleRemoveRequest}
                    >
                      <span>
                        <Delete style={{ fontSize: "20px" }} />
                      </span>
                      <span>
                        Delete Request
                        <span
                          style={{ display: removing ? "flex" : "" }}
                          className="requestBid__spinner"
                        ></span>
                      </span>
                    </button>
                  </div>
                </section>
              </main>
            )}
            {request[0].data.email === user?.email &&
              activeNav === "proposals" && (
                <div className="requestBid__bidsCtn">
                  <div className="requestBid__bids">
                    <Bids />
                    <Bids />
                    <Bids />
                    <Bids />
                    <Bids />
                  </div>
                  <section className="requestBid__bidsDetails">
                    <h3 className="requestBid__bidsDetailsHeader">
                      Proposal Details
                    </h3>
                    <div className="requestBid__bidDetailsBody">
                      <div>
                        <BeenhereOutlined fontSize="small" />
                        <span>
                          {bids.length} bid{bids.length > 1 ? "s" : ""}{" "}
                          submitted
                        </span>
                      </div>
                      <div>
                        <GradeOutlined fontSize="small" />
                        <span>
                          <span>{requestInfo[0]?.data.rating?.toFixed(1)}</span>{" "}
                          ({requestInfo[0]?.data.reviewCount} reviews)
                        </span>
                      </div>
                      <div>
                        <MoneyOutlined fontSize="small" />
                        <span>
                          <CurrencyFormat
                            renderText={(value) => value}
                            decimalScale={2}
                            value={bids
                              .map((bid) => bid.data.bid)
                              .reduce((acc, value) => acc + value, 0)}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"₦"}
                          />{" "}
                          (Average)
                        </span>
                      </div>
                    </div>
                  </section>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}

export default RequestBid;
