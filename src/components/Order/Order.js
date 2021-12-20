import React, { useEffect, useState } from "react";
import moment from "moment";
import { ArrowLeft, ArrowRight, Star } from "@material-ui/icons";
import Fetching from "../../components/Fetching/Fetching";
import CurrencyFormat from "react-currency-format";
import { db } from "../../utils/firebase";
import "./Order.css";
import { useStateValue } from "../../StateProvider";
import { getBasketTotal } from "../../reducer";
import Paystack from "../../Gateways/Paystack/Paystack";

function Order({ confirmation, profile }) {
  const [{ user, basket, deliveryInfo, sidebar }] = useStateValue();
  const [fetching, setFetching] = useState(true);
  const [fetchingPage, setFetchingPage] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [statusDisplay, setStatusDisplay] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const current = orders[0];
  const bask = confirmation ? basket : current.data.basket;
  const [windowWidth, setWindowWidth] = useState(0);
  const profileOrders =
    profile && sidebar && windowWidth > 1023 && windowWidth < 1201;
  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
  };

  const handleOrdersPage = (snapshot, number) => {
    setFetchingPage(false);
    if (!(snapshot.size > 0)) {
      return false;
    }
    setOrders(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }))
    );
    setCurrentPage(currentPage + number);
  };

  const handlePrev = () => {
    setFetchingPage(true);
    const ordersRef = db
      .collection("users")
      .doc(user.uid)
      .collection("orders")
      .where("status", "==", "pending");
    return ordersRef
      .orderBy("createdAt", "desc")
      .endBefore(orders[0].data.createdAt)
      .limitToLast(1)
      .onSnapshot((snapshot) => {
        handleOrdersPage(snapshot, -1);
      });
  };

  const handleNext = () => {
    setFetchingPage(true);
    const ordersRef = db
      .collection("users")
      .doc(user.uid)
      .collection("orders")
      .where("status", "==", "pending");
    return ordersRef
      .orderBy("createdAt", "desc")
      .startAfter(orders[orders.length - 1].data.createdAt)
      .limit(1)
      .onSnapshot((snapshot) => {
        handleOrdersPage(snapshot, 1);
      });
  };

  useEffect(() => {
    if (confirmation) {
      setFetching(false);
      return setOrders([basket]);
    }

    if (!user) {
      setFetching(false);
      return setOrders([]);
    }

    const cleanUpSnapshotCount = db
      .collection("users")
      .doc(user.uid)
      .collection("transactions")
      .doc("--STATS--")
      .onSnapshot((doc) => {
        setOrdersCount(doc.data().pending);
      });

    const ordersRefEffect = db
      .collection("users")
      .doc(user.uid)
      .collection("orders")
      .where("status", "==", "pending");
    const cleanUpGetOrders = ordersRefEffect
      .orderBy("createdAt", "desc")
      .limit(1)
      .onSnapshot((snapshot) => {
        if (snapshot.size > 0) {
          setOrders(
            snapshot.docs.map((doc) => ({
              data: doc.data(),
            }))
          );
          setFetching(false);
          setCurrentPage(1);
        } else {
          setOrders([]);
          setFetching(false);
        }
      });

    return () => {
      cleanUpGetOrders();
      cleanUpSnapshotCount();
    };
  }, [confirmation, basket, user, statusDisplay]);

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  const profileStyle = {
    toggle: {
      margin: "0 10px",
      marginBottom: "10px",
    },
    header: {
      fontSize: "16px",
    },
    orderTop: {
      fontSize: "14px",
    },
    orders: {
      padding: "10px",
    },
    ordersTop: {
      flexDirection: "column",
      width: "85%",
      border: "none",
    },
    orderIdPayment: {
      borderTop: "solid 1px #ccc",
      borderBottom: "solid 1px #ccc",
      borderLeft: "none",
      borderRight: "none",
    },
    list: {
      width: "95%",
      fontSize: "14px",
    },
  };

  return (
    <div className="order">
      <div className="order__head">
        <h2 style={profileOrders ? profileStyle.header : {}}>Order</h2>
        {current && ordersCount !== 0 && (
          <>
            {!confirmation && (
              <>
                <span className="order__nav">
                  <ArrowLeft onClick={handlePrev} className="order__icon" />
                </span>

                <span className="order__index">
                  {currentPage} / {ordersCount}
                </span>

                <span className="order__nav">
                  <ArrowRight onClick={handleNext} className="order__icon" />
                </span>

                <span
                  className="order__headLoading"
                  style={{ display: fetchingPage ? "flex" : "" }}
                ></span>
              </>
            )}
          </>
        )}
      </div>
      {!confirmation && (
        <div
          style={profileOrders ? profileStyle.toggle : {}}
          className="order__toggle"
        >
          <div
            style={profileOrders ? profileStyle.orderTop : {}}
            className="order__top"
          >
            <div
              style={{
                borderBottom:
                  statusDisplay === "delivered_orders"
                    ? "solid 5px rgb(0, 172, 0)"
                    : "",
                marginRight: profileOrders ? "10px" : "",
              }}
              onClick={() => {
                setOrdersCount(0);
                setFetching(true);
                setStatusDisplay("delivered_orders");
              }}
            >
              {windowWidth < 535 ? "Delivered" : "Delivered Orders"}
            </div>

            <div
              style={{
                borderBottom:
                  statusDisplay === "pending_orders"
                    ? "solid 5px rgb(0, 172, 0)"
                    : "",
                marginRight: profileOrders ? "10px" : "",
              }}
              onClick={() => {
                setOrdersCount(0);
                setFetching(true);
                setStatusDisplay("pending_orders");
              }}
            >
              {windowWidth < 535 ? "Pending" : "Pending Orders"}
            </div>

            <div
              style={{
                borderBottom:
                  statusDisplay === "cancelled_orders"
                    ? "solid 5px rgb(0, 172, 0)"
                    : "",
                marginRight: profileOrders ? "10px" : "",
              }}
              onClick={() => {
                setOrdersCount(0);
                setFetching(true);
                setStatusDisplay("cancelled_orders");
              }}
            >
              {windowWidth < 535 ? "Cancelled" : "Cancelled Orders"}
            </div>
          </div>
        </div>
      )}
      {fetching ? (
        <div className="order__fetching">
          <Fetching />
        </div>
      ) : !current ? (
        <div className="order__info">
          There is currently no order in this category
        </div>
      ) : (
        <div
          style={profileOrders ? profileStyle.orders : {}}
          className="order__orders"
        >
          <div
            style={profileOrders ? profileStyle.ordersTop : {}}
            className="order__ordersTop"
          >
            <div
              style={profileOrders ? profileStyle.orderIdPayment : {}}
              className="order__id"
            >
              <div className="order__no">
                {!confirmation && <div>Order No: {current.data.reference}</div>}
                {confirmation && <div>Order Details</div>}
              </div>

              <div className="order__length">
                {!confirmation ? current.data.basket.length : basket.length}{" "}
                {!confirmation
                  ? current.data.basket.length > 1
                    ? "items"
                    : "item"
                  : basket.length > 1
                  ? "items"
                  : "item"}
              </div>

              <div className="order__date">
                {!confirmation ? "Ordered" : "Order"} on{" "}
                <i>
                  {!confirmation
                    ? moment(current.data.createdAt).format("DD-MM-YYYY")
                    : moment(Date.now()).format("DD-MM-YYYY")}
                </i>
              </div>

              <div className="order__address">
                <i>
                  To{" "}
                  {!confirmation ? current.data.address : deliveryInfo.address}
                </i>
              </div>

              <div className="order__phone">
                By{" "}
                <i>
                  {!confirmation
                    ? current.data.phoneNumber
                    : deliveryInfo.number}
                </i>
              </div>
            </div>

            <div
              style={profileOrders ? profileStyle.orderIdPayment : {}}
              className="order__payment"
            >
              <div className="order__paymentTitle">Payment Method</div>

              <div className="order__paymentMtd">
                Paystack Modern Online Payment
              </div>

              <div className="order__paymentDate">
                {!confirmation ? "Paid" : "Payment"} on{" "}
                <i>
                  {!confirmation
                    ? moment(current.data.createdAt).format("DD-MM-YYYY")
                    : moment(Date.now()).format("DD-MM-YYYY")}
                </i>
              </div>

              <div className="order__amount">
                <CurrencyFormat
                  renderText={(value) => (
                    <p className="order__total">
                      Total:{" "}
                      <strong>
                        <i>{value}</i>
                      </strong>
                    </p>
                  )}
                  decimalScale={2}
                  value={
                    confirmation ? getBasketTotal(basket) : current.data.amount
                  }
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₦"}
                />
              </div>

              <div className="order__email">
                From <i>{!confirmation ? current.data.email : user.email}</i>
              </div>
            </div>
          </div>
          <div className="order__items">
            <div className="order__itemsHeader">
              {!confirmation
                ? current.data.basket.length > 1
                  ? "ITEMS"
                  : "ITEM"
                : basket.length > 1
                ? "ITEMS"
                : "ITEM"}{" "}
              IN YOUR ORDER
            </div>
            <div
              style={profileOrders ? profileStyle.list : {}}
              className="order__list"
            >
              {bask.map((item, i) => (
                <div className="order__itemsContainer order__fadeIn" key={i}>
                  <div className="order__itemsImage">
                    <img src={item.imageUrl} alt="" />
                  </div>
                  <div className="order__itemsInfo">
                    <div className="order__itemsTitle">{item.title}</div>
                    <div className="order__itemsPrice">
                      <CurrencyFormat
                        renderText={(value) => (
                          <div style={{ fontWeight: "600" }}>
                            {value}{" "}
                            <span style={{ fontWeight: "500" }}>
                              <small>per {item.unit}</small>
                            </span>
                          </div>
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
                          color: item.rating >= 0.5 ? "rgb(0, 172, 0)" : "",
                        }}
                        className="order__star"
                      >
                        <Star fontSize="small" />
                      </p>
                      <p
                        style={{
                          color: item.rating >= 1.5 ? "rgb(0, 172, 0)" : "",
                        }}
                        className="order__star"
                      >
                        <Star fontSize="small" />
                      </p>
                      <p
                        style={{
                          color: item.rating >= 2.5 ? "rgb(0, 172, 0)" : "",
                        }}
                        className="order__star"
                      >
                        <Star fontSize="small" />
                      </p>
                      <p
                        style={{
                          color: item.rating >= 3.5 ? "rgb(0, 172, 0)" : "",
                        }}
                        className="order__star"
                      >
                        <Star fontSize="small" />
                      </p>
                      <p
                        style={{
                          color: item.rating >= 4.5 ? "rgb(0, 172, 0)" : "",
                        }}
                        className="order__star"
                      >
                        <Star fontSize="small" />
                      </p>
                    </div>
                    {!confirmation && (
                      <div className="orders__deliveryStatus">
                        {item.status === "pending" && (
                          <div style={{ backgroundColor: "darkorange" }}>
                            {orders[0].data.status}
                          </div>
                        )}
                        {item.status === "delivered" && (
                          <div style={{ backgroundColor: "rgb(0, 172, 0)" }}>
                            {orders[0].data.status}
                          </div>
                        )}
                        {item.status === "cancelled" && (
                          <div style={{ backgroundColor: "red" }}>
                            {orders[0].data.status}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {confirmation && <Paystack />}
        </div>
      )}
    </div>
  );
}

export default Order;
