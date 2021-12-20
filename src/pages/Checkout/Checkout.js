import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Checkout.css";
import CheckoutProduct from "../../components/CheckoutProduct/CheckoutProduct";
import Fetching from "../../components/Fetching/Fetching";
import { db } from "../../utils/firebase";
import Sidebar from "../../components/Sidebar/Sidebar";
import ad from "../../images/checkout_ad.jpg";
import { useStateValue } from "../../StateProvider";
import { getBasketTotal } from "../../reducer";
import CurrencyFormat from "react-currency-format";
import { useHistory } from "react-router-dom";

function Checkout() {
  const [{ user, basket, sidebar }, dispatch] = useStateValue();
  const history = useHistory();
  const [fetching, setFetching] = useState(true);
  const [userBasket, setUserBasket] = useState([]);
  const bask = user ? userBasket : basket;
  const itemTotal = bask?.reduce(
    (amount, item) =>
      Number(user ? item.data.quantity : item.quantity) + amount,
    0
  );
  const userTotal = userBasket?.reduce(
    (amount, item) => Number(item.data.price * item.data.quantity) + amount,
    0
  );
  const [windowWidth, setWindowWidth] = useState(0);
  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
  };

  const displayMessage = useCallback(
    (severity, message, duration) => {
      dispatch({
        type: "ADD_FLASH_MESSAGE",
        message: {
          severity,
          message,
          duration,
        },
      });

      dispatch({
        type: "SHOW_FLASH_MESSAGE",
        showFlash: true,
      });
    },
    [dispatch]
  );

  const handleContinueShopping = async () => {
    if (!user) {
      return (
        dispatch({
          type: "SET_LASTURL",
          lastUrl: window.location.pathname,
        }),
        history.push("/login")
      );
    }

    await dispatch({
      type: "EMPTY_BASKET",
    });

    await userBasket.map((item) =>
      dispatch({
        type: "ADD_TO_BASKET",
        item: {
          status: "pending",
          id: item.id,
          unit: item.data.unit,
          title: item.data.title,
          price: item.data.price,
          email: item.data.email,
          slug: item.data.slug,
          imageUrl: item.data.imageUrl,
          quantity: item.data.quantity,
          rating: item.data.rating,
        },
      })
    );

    history.push("/payment");
  };

  useEffect(() => {
    if (!user) {
      return setUserBasket([]);
    }

    const cleanUpGetBasket = db
      .collection("users")
      .doc(user.uid)
      .collection("basket")
      .orderBy("createdAt", "desc")
      .onSnapshot(
        (snapshot) => {
          setUserBasket(
            snapshot?.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
          setFetching(false);
        },
        (err) => {
          displayMessage("error", err, 8000);
          setFetching(false);
        }
      );

    return () => cleanUpGetBasket();
  }, [user, fetching, displayMessage]);

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  return (
    <div className="checkout">
      <Sidebar className="sidebar" />
      <div className="checkout__container" style={{ flex: "1" }}>
        <div className="checkout__avert">
          <img src={ad} alt="" />
        </div>
        <div
          className="checkout__sections"
          style={{
            flexDirection:
              windowWidth < 1201 && windowWidth > 1023 && sidebar
                ? "column"
                : "",
          }}
        >
          <div className="checkout__left">
            <div className="checkout__body">
              <div className="checkout__basket">
                <div className="checkout__basketHead">
                  <div className="checkout__basketTitle">Your agro-basket</div>
                  {!fetching && bask.length > 0 && (
                    <div className="checkout__basketSubTitle">
                      <div>Price</div>
                      <div>Quantity</div>
                    </div>
                  )}
                </div>
                <div className="checkout__basketBody">
                  {fetching && user ? (
                    <div className="checkout__fetching">
                      <Fetching />
                    </div>
                  ) : (
                    <>
                      {bask?.length === 0 ? (
                        <h4>
                          Your basket is empty, continue shopping to add items.{" "}
                          <Link to="/" style={{ color: "#3b8238" }}>
                            Click here
                          </Link>{" "}
                          to continue shopping
                        </h4>
                      ) : (
                        bask.map((item, i) => (
                          <CheckoutProduct
                            key={i}
                            id={item.id}
                            title={user ? item.data.title : item.title}
                            image={user ? item.data.imageUrl : item.imageUrl}
                            price={user ? item.data.price : item.price}
                            rating={user ? item.data.rating : item.rating}
                            quantity={user ? item.data.quantity : item.quantity}
                            unit={user ? item.data.unit : item.unit}
                            checkout
                          />
                        ))
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="checkout__right">
            <div
              className="checkout__basketInfo"
              style={{
                marginLeft:
                  sidebar && windowWidth < 1201 && windowWidth > 1023
                    ? "0"
                    : "",
                marginTop:
                  sidebar && windowWidth < 1201 && windowWidth > 1023
                    ? "5px"
                    : "",
              }}
            >
              <div className="checkout__basketInfoHead">Basket Details</div>
              <div className="checkout__basketDetails">
                <div className="checkout__basketTotal">
                  <div>Total individual items</div>
                  <div>{bask.length}</div>
                </div>
                <div className="checkout__basketTotal">
                  <div>Total items</div>
                  <div>{itemTotal}</div>
                </div>
                <div className="checkout__basketTotal">
                  <div>Total price</div>
                  <div>
                    <CurrencyFormat
                      renderText={(value) => <strong>{value}</strong>}
                      decimalScale={2}
                      value={user ? userTotal.toFixed(2) : getBasketTotal(bask)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"₦"}
                    />
                  </div>
                </div>
                <div className="checkout__basketButton">
                  <button onClick={handleContinueShopping}>
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
