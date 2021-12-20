import {
  Cancel,
  DoubleArrow,
  ExpandMore,
  GradeOutlined,
  PaymentOutlined,
  PinDropOutlined,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { IconButton } from "@material-ui/core";
import "./Product.css";
import { useHistory } from "react-router";
import { useStateValue } from "../../StateProvider";

function Product({ item, showDetails, currentDetails, index, profile }) {
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();
  const [activePicture, setActivePicture] = useState(0);
  const [displayImage, setDisplayImage] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [imgPlaceholder, setImgPlaceholder] = useState(true);
  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
  };

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

  const handleMakeOrder = async () => {
    if (!user) {
      return displayMessage("error", "Login to make orders");
    }

    if (user.email === item.data.email) {
      return displayMessage("error", "You can not order");
    }

    const quantity = prompt("Enter a quantity needed:", 1);

    await dispatch({
      type: "EMPTY_BASKET",
    });

    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: item.id,
        unit: item.data.unit,
        title: item.data.title,
        price: item.data.price,
        email: item.data.email,
        slug: item.data.slug,
        imageUrl: item.data.imageUrl,
        rating: item.data.rating,
        quantity: parseInt(quantity),
      },
    });

    history.push("/payment");
  };

  const handleNextPicture = () => {
    if (activePicture >= item.data.imageUrl.length - 1) {
      return false;
    }

    setActivePicture(activePicture + 1);
  };

  const handlePreviousPicture = () => {
    if (activePicture <= 0) {
      return false;
    }

    setActivePicture(activePicture - 1);
  };

  const handleClick = () => {
    if (profile) {
      currentDetails(index);
      showDetails(true);
    } else {
      history.push(`/product/${item.data.slug}`);
    }
  };

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  return (
    <>
      <div className="product">
        <div className="product__top">
          <div>
            <div className="product__profileImage">
              <img src={item.data.profileImage} alt="" loading="lazy" />
            </div>
            <div>
              <div className="product__userName">
                <span>{item.data.name}</span>
                <span>@tosin</span>
              </div>
            </div>
          </div>
          <div className="product__more" onClick={handleClick}>
            <ExpandMore />
          </div>
        </div>
        <div className="product__bottom">
          <div className="product__left">
            <div className="product__actionsCtn">
              <div className="product__actions">
                <div
                  className="product__action"
                  title="Order"
                  onClick={handleMakeOrder}
                >
                  <div>
                    <PaymentOutlined fontSize="small" />
                  </div>
                  <span>{item.data.orders}</span>
                </div>
                <div className="product__action" title="Pin">
                  <div>
                    <PinDropOutlined fontSize="small" />
                  </div>
                  <span>{item.data.pinned}</span>
                </div>
                <div className="product__action" title="Rating">
                  <div>
                    <GradeOutlined fontSize="small" />
                  </div>
                  <span>{item.data.rating}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="product__right">
            <div className="product__image">
              <div>
                <img
                  onClick={() => setDisplayImage(true)}
                  src={item.data.imageUrl[activePicture]}
                  onLoad={() => setImgPlaceholder(false)}
                  loading="lazy"
                  alt=""
                />
              </div>

              {imgPlaceholder && (
                <div className="product__imgPlaceholder"></div>
              )}

              <div
                style={{
                  visibility:
                    item.data.imageUrl.length > 1 ? "visible" : "hidden",
                }}
              >
                <KeyboardArrowLeft
                  onClick={handlePreviousPicture}
                  style={{ fontSize: windowWidth < 390 ? "24px" : "30px" }}
                  className="product__imageIcon"
                />

                <KeyboardArrowRight
                  onClick={handleNextPicture}
                  style={{ fontSize: windowWidth < 390 ? "24px" : "30px" }}
                  className="product__imageIcon"
                />
              </div>
            </div>
            <div className="product__details">
              <div className="product__title" onClick={handleClick}>
                {item.data.title}
              </div>
              <div className="product__brief" onClick={handleClick}>
                {item.data.details}
              </div>
              <div className="product__price">
                <CurrencyFormat
                  renderText={(value) => (
                    <>
                      {value} per {item.data.unit}
                    </>
                  )}
                  decimalScale={2}
                  value={item.data.price}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₦"}
                />
                {item.data.negotiable === true && <button>Negotiate</button>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {displayImage && (
        <div className="fullImage">
          <div className="imageCancel">
            <IconButton onClick={() => setDisplayImage(false)}>
              <Cancel
                style={{
                  color: "white",
                  fontSize: windowWidth < 808 ? "20px" : "32px",
                }}
              />
            </IconButton>
          </div>
          <div className="imageComponents">
            <img src={item.data.imageUrl[activePicture]} alt="" />
            <div
              style={{
                visibility:
                  item.data.imageUrl.length > 1 ? "visible" : "hidden",
              }}
              className="imageNavBig"
            >
              <DoubleArrow
                className="doubleArrowIcon"
                onClick={handlePreviousPicture}
                style={{
                  WebkitTransform: "scaleX(-1)",
                  transform: "scaleX(-1)",
                  fontSize: "30px",
                }}
              />
              <DoubleArrow
                className="doubleArrowIcon"
                onClick={handleNextPicture}
                style={{
                  fontSize: "30px",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Product;
