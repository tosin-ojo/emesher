import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Add,
  Cancel,
  CheckCircle,
  Delete,
  DoubleArrow,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  NavigateBefore,
  NavigateNext,
  Remove,
  ReportOutlined,
  Star,
} from "@material-ui/icons";
import "./ProductDetails.css";
import firebase from "firebase";
import { IconButton } from "@material-ui/core";
import { useStateValue } from "../../StateProvider";
import CurrencyFormat from "react-currency-format";
import { db, storage } from "../../utils/firebase";
import Forms from "../Forms/Forms";
import Sidebar from "../Sidebar/Sidebar";
import { useHistory } from "react-router";
import Loading from "../Loading/Loading";

function ProductDetails({
  showProductDetails,
  productDisplay,
  item,
  activeProduct,
  productLength,
  productIndex,
  product,
}) {
  const [{ user, sidebar }, dispatch] = useStateValue();
  const history = useHistory();
  const [quantity, setQuantity] = useState(1);
  const [displayStatus, setDisplayStatus] = useState("information");
  const [displayImage, setDisplayImage] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(false);
  const [imageFileName, setImageFileName] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [deletingImage, setDeletingImage] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(false);
  const [activePicture, setActivePicture] = useState(0);
  const slug = useRef(window.location.pathname);
  const [itemInfo, setItemInfo] = useState([]);
  const [windowWidth, setWindowWidth] = useState(0);
  const [fetching, setFetching] = useState(true);
  const rating = 4.3;
  const imageDate = useRef(Date.now());
  const imageName = `${imageFile?.lastModified}${imageDate.current}${imageFile?.name}`;
  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
  };

  const displayMessage = useCallback(
    (severity, message) => {
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
    },
    [dispatch]
  );

  const handleInputFileReset = () => {
    setImageFileName("");
    setImageFile("");
  };

  const handleNextPicture = () => {
    if (activePicture >= itemInfo[0].data.imageUrl.length - 1) {
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

  const handleNextProduct = () => {
    if (productIndex >= productLength - 1) {
      return false;
    }
    setActivePicture(0);
    activeProduct(productIndex + 1);
  };

  const handlePreviousProduct = () => {
    if (productIndex <= 0) {
      return false;
    }
    setActivePicture(0);
    activeProduct(productIndex - 1);
  };

  const handleAddPicture = () => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (itemInfo[0].data.imageUrl.length > 2) {
      return displayMessage("error", "Maximum image uploaded");
    }

    if (!allowedExtensions.exec(imageFileName)) {
      return displayMessage("error", "Invalid file type!");
    }

    if (itemInfo[0].data.email !== user.email) {
      return displayMessage("error", "You can not add image");
    }

    handleInputFileReset();
    setDisplayProgress(true);

    const uploadImage = storage.ref(`products/${imageName}`).put(imageFile);
    uploadImage.on(
      "state_change",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        displayMessage("error", "An error occured");
        console.log(error);
      },
      () => {
        storage
          .ref("products")
          .child(imageName)
          .getDownloadURL()
          .then(async (url) => {
            const updateImage = db.collection("items").doc(itemInfo[0].id);
            await updateImage.update({
              imageUrl: firebase.firestore.FieldValue.arrayUnion(url),
              imageName: firebase.firestore.FieldValue.arrayUnion(imageName),
            });
            setDisplayProgress(false);
            displayMessage("success", "Image uploaded");
          });
      }
    );
  };

  const handleDeletePicture = async () => {
    setDeletingImage(true);
    if (itemInfo[0].data.imageUrl.length < 2) {
      return (
        displayMessage("error", "You can not delete all the images"),
        setDeletingImage(false)
      );
    }

    if (itemInfo[0].data.email !== user.email) {
      return (
        displayMessage("error", "You can not delete image"),
        setDeletingImage(false)
      );
    }

    try {
      const updateImage = db.collection("items").doc(itemInfo[0].id);
      storage
        .ref("products")
        .child(itemInfo[0].data.imageName[activePicture])
        .delete();
      updateImage.update({
        imageUrl: firebase.firestore.FieldValue.arrayRemove(
          itemInfo[0].data.imageUrl[activePicture]
        ),
        imageName: firebase.firestore.FieldValue.arrayRemove(
          itemInfo[0].data.imageName[activePicture]
        ),
      });
      setActivePicture(0);
      setDisplayImage(false);
      setDeletingImage(false);
      displayMessage("success", "Image deleted");
    } catch (error) {
      displayMessage("error", "Error occured");
      console.log(error);
      setDeletingImage(false);
    }
  };

  const handleDeleteProduct = async () => {
    setDeletingProduct(true);
    if (itemInfo[0].data.email !== user.email) {
      return (
        displayMessage("error", "You can not delete item"),
        setDeletingProduct(false)
      );
    }

    const publicProductRef = db.collection("items").doc(itemInfo[0].id);
    const publicStatsRef = db.collection("counter").doc("items");
    const statsRef = db
      .collection("users")
      .doc(user.user_id)
      .collection("userInfo")
      .doc("info");
    const decrement = firebase.firestore.FieldValue.increment(-1);
    const batch = db.batch();

    try {
      await itemInfo[0].data.imageName.map((image) =>
        storage.ref("products").child(image).delete()
      );
      batch.delete(publicProductRef);
      batch.set(statsRef, { itemsCount: decrement }, { merge: true });
      batch.set(publicStatsRef, { itemsCount: decrement }, { merge: true });
      batch.commit();
      displayMessage("success", "Item deleted successfully");
      setActivePicture(0);
      productDisplay(false);
    } catch (error) {
      console.log(error);
      displayMessage("error", "Error occurred!");
    } finally {
      setDeletingProduct(false);
    }
  };

  const handleGoBack = () => {
    if (product) {
      history.push("/");
    } else {
      productDisplay(false);
      setActivePicture(0);
    }
  };

  const closeForm = (value) => {
    setShowEditForm(value);
  };

  const handleMakeOrder = async () => {
    if (!user) {
      return displayMessage("error", "Login to make orders");
    }

    if (user.email === itemInfo[0].data.email) {
      return displayMessage("error", "You can not order");
    }

    await dispatch({
      type: "EMPTY_BASKET",
    });

    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: itemInfo[0].id,
        unit: itemInfo[0].data.unit,
        title: itemInfo[0].data.title,
        price: itemInfo[0].data.price,
        email: itemInfo[0].data.email,
        slug: itemInfo[0].data.slug,
        imageUrl: itemInfo[0].data.imageUrl,
        rating: itemInfo[0].data.rating,
        quantity: parseInt(quantity),
      },
    });

    history.push("/payment");
  };

  const handleInfoNav = async () => {
    await setDisplayStatus("information");
    document.getElementById("product_details_area").innerHTML =
      itemInfo[0].data.additionalInfo;
  };

  useEffect(() => {
    if (!fetching) {
      document.getElementById("product_details_area").innerHTML =
        itemInfo[0].data.additionalInfo || "...";
    }
  }, [itemInfo, product, fetching]);

  useEffect(() => {
    if (product) {
      db.collection("items")
        .where("slug", "==", slug.current.split("/")[2])
        .get()
        .then((snapshot) => {
          if (snapshot.size < 1) {
            setFetching(false);
            return console.log("No item");
          }

          setItemInfo(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
          setFetching(false);
        });
    } else {
      setItemInfo(item);
      setFetching(false);
    }
  }, [product, item]);

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  const activeNavStyle = {
    color: "rgb(0, 172, 0)",
    borderBottom: "solid 3px rgb(0, 172, 0)",
  };

  return (
    <>
      {product && <Sidebar />}
      {fetching ? (
        <Loading />
      ) : (
        <>
          <div
            className="productDetails"
            style={{
              right: showProductDetails || product ? "0" : "",
              width: !sidebar && windowWidth > 1023 ? "calc(100vw - 50px)" : "",
              pointerEvents: deletingProduct ? "none" : "",
            }}
          >
            <section className="productDetails__top">
              <div className="productDetails__topNav productDetails__navSmall">
                <div
                  className="productDetails__topNavLeft"
                  onClick={handleGoBack}
                >
                  {product && <NavigateBefore fontSize="small" />}{" "}
                  <span>Back to Profile Page</span>{" "}
                  {!product && <NavigateNext fontSize="small" />}
                </div>
                {!product && (
                  <div className="productDetails__topNavRight">
                    <KeyboardArrowLeft
                      fontSize="small"
                      className="productDetails__topNavIconRight"
                      onClick={handlePreviousProduct}
                    />
                    <KeyboardArrowRight
                      fontSize="small"
                      className="productDetails__topNavIconLeft"
                      onClick={handleNextProduct}
                    />
                  </div>
                )}
              </div>
              <div className="productDetails__categoryHead">
                Home / {itemInfo[0].data.category} /{" "}
                <span>{itemInfo[0].data.title}</span>
              </div>
              <div className="productDetails__topInfo">
                <div className="productDetails__topLeft">
                  <div className="productDetails__topImage">
                    <div>
                      <div
                        style={{
                          visibility:
                            itemInfo[0].data.imageUrl.length > 1
                              ? "visible"
                              : "hidden",
                        }}
                        className="productDetails__imageNav"
                      >
                        <KeyboardArrowLeft
                          style={{ fontSize: "32px" }}
                          className="productDetails__keyboardArrowLeft"
                          onClick={handlePreviousPicture}
                        />
                        <KeyboardArrowRight
                          style={{ fontSize: "32px" }}
                          className="productDetails__keyboardArrowRight"
                          onClick={handleNextPicture}
                        />
                      </div>
                      <img
                        className="productDetails__imageMain"
                        src={itemInfo[0].data.imageUrl[activePicture]}
                        alt=""
                        onClick={() => setDisplayImage(true)}
                      />
                    </div>
                    <div className="productDetails__topGallary">
                      {itemInfo[0].data.imageUrl.map((image, i) => (
                        <img
                          key={i}
                          src={image}
                          alt=""
                          style={{ cursor: "pointer" }}
                          onClick={() => setActivePicture(i)}
                        />
                      ))}
                      {user && itemInfo[0].data.email === user.email && itemInfo[0].data.imageUrl.length < 3 && (
                        <div>
                          <label
                            style={{
                              cursor: "pointer",
                              pointerEvents: displayProgress ? "none" : "",
                            }}
                          >
                            <input
                              type="file"
                              style={{ display: "none", visibility: "none" }}
                              onChange={(e) => {
                                setImageFileName(e.target.value);
                                setImageFile(e.target.files[0]);
                              }}
                            />
                            <Add
                              style={{
                                fontSize: windowWidth < 466 ? "40px" : "70px",
                              }}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    {imageFile !== "" && itemInfo[0].data.email === user.email && (
                      <div className="productDetails__submitImage">
                        <CheckCircle
                          style={{
                            color: "rgb(0, 172, 0)",
                            fontSize: windowWidth < 808 ? "20px" : "32px",
                            marginRight: "10px",
                          }}
                          onClick={handleAddPicture}
                        />
                        <Cancel
                          style={{
                            color: "crimson",
                            fontSize: windowWidth < 808 ? "20px" : "32px",
                            marginRight: "10px",
                          }}
                          onClick={handleInputFileReset}
                        />
                        <span
                          style={{
                            width: "200px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {imageFileName.replace(/^.*\\/, "")}
                        </span>
                      </div>
                    )}
                    {displayProgress &&
                      itemInfo[0].data.email === user.email && (
                        <progress
                          className="productDetails__uploadProgress"
                          value={uploadProgress}
                          max="100"
                        ></progress>
                      )}
                  </div>
                </div>
                <div className="productDetails__topRight">
                  <div className="productDetails__topNav productDetails__navLarge">
                    <div
                      className="productDetails__topNavLeft"
                      onClick={handleGoBack}
                    >
                      {product && <NavigateBefore fontSize="small" />}{" "}
                      <span>Back to Profile Page</span>{" "}
                      {!product && <NavigateNext fontSize="small" />}
                    </div>
                    {!product && (
                      <div className="productDetails__topNavRight">
                        <KeyboardArrowLeft
                          fontSize="small"
                          className="productDetails__topNavIconRight"
                          onClick={handlePreviousProduct}
                        />
                        <KeyboardArrowRight
                          fontSize="small"
                          className="productDetails__topNavIconLeft"
                          onClick={handleNextProduct}
                        />
                      </div>
                    )}
                  </div>
                  <h2 className="productDetails__topTitle">
                    {itemInfo[0].data.title}
                  </h2>
                  <div className="productDetails__topRating">
                    <span>
                      {itemInfo[0].data.rating.toFixed(1)}(
                      {itemInfo[0].data.ratingCount})
                    </span>
                    <div className="productDetails__topStar">
                      <p
                        style={{
                          color:
                            itemInfo[0].data.rating >= 0.5
                              ? "rgb(0, 172, 0)"
                              : "",
                        }}
                        className="productDetails__star"
                      >
                        <Star fontSize="small" />
                      </p>
                      <p
                        style={{
                          color:
                            itemInfo[0].data.rating >= 1.5
                              ? "rgb(0, 172, 0)"
                              : "",
                        }}
                        className="productDetails__star"
                      >
                        <Star fontSize="small" />
                      </p>
                      <p
                        style={{
                          color:
                            itemInfo[0].data.rating >= 2.5
                              ? "rgb(0, 172, 0)"
                              : "",
                        }}
                        className="productDetails__star"
                      >
                        <Star fontSize="small" />
                      </p>
                      <p
                        style={{
                          color:
                            itemInfo[0].data.rating >= 3.5
                              ? "rgb(0, 172, 0)"
                              : "",
                        }}
                        className="productDetails__star"
                      >
                        <Star fontSize="small" />
                      </p>
                      <p
                        style={{
                          color:
                            itemInfo[0].data.rating >= 4.5
                              ? "rgb(0, 172, 0)"
                              : "",
                        }}
                        className="productDetails__star"
                      >
                        <Star fontSize="small" />
                      </p>
                    </div>
                  </div>
                  <h3 className="productDetails__topPrice">
                    <CurrencyFormat
                      renderText={(value) => (
                        <>
                          {value} / {itemInfo[0].data.unit}
                        </>
                      )}
                      decimalScale={2}
                      value={itemInfo[0].data.price}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"₦"}
                    />
                  </h3>
                  <div className="productDetails__topDetails">
                    {itemInfo[0].data.details}
                  </div>
                  <div className="productDetails__topDetails">
                    <h4 className="productDetails__topDeliveryHeader">
                      Delivery Information
                    </h4>
                    <div className="productDetails__topDelivery">
                      {itemInfo[0].data.deliveryInfo}
                    </div>
                  </div>
                  {user && itemInfo[0].data.email !== user.email && (
                    <div className="productDetails__actions">
                      <div>
                        <input
                          value={quantity < 1 ? 1 : quantity}
                          type="number"
                          onKeyDown={(evt) =>
                            ["e", "E", "+", "-"].includes(evt.key) &&
                            evt.preventDefault()
                          }
                          onChange={(e) => setQuantity(e.target.value)}
                        />
                        <div>
                          <button>
                            <Add
                              style={{ fontSize: "14px" }}
                              onClick={() =>
                                setQuantity(parseInt(quantity) + 1)
                              }
                            />
                          </button>
                          <button>
                            <Remove
                              style={{ fontSize: "14px" }}
                              onClick={() => {
                                if (parseInt(quantity) > 1)
                                  setQuantity(parseInt(quantity) - 1);
                              }}
                            />
                          </button>
                        </div>
                      </div>
                      <button style={{ backgroundColor: "darkorange" }}>
                        Negotiate
                      </button>
                      <button
                        style={{ backgroundColor: "rgba(0, 172, 0)" }}
                        onClick={handleMakeOrder}
                      >
                        Order
                      </button>
                      <button style={{ backgroundColor: "yellowgreen" }}>
                        Pin
                      </button>
                      <ReportOutlined
                        fontSize="large"
                        style={{ color: "crimson" }}
                      />
                    </div>
                  )}
                  {user && itemInfo[0].data.email === user.email && (
                    <div className="productDetails__actions">
                      <button
                        onClick={() => setShowEditForm(true)}
                        style={{
                          backgroundColor: "darkorange",
                          padding: "0 20px",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDeleteProduct}
                        style={{
                          opacity: deletingProduct ? "0.6" : "",
                          backgroundColor: "crimson",
                          padding: "0 20px",
                        }}
                      >
                        Delete
                        <span
                          style={{ display: deletingProduct ? "flex" : "" }}
                          className="productDetails__spinner"
                        ></span>
                      </button>
                    </div>
                  )}
                  <div className="productDetails__category">
                    <div>
                      <span>Item</span>: {itemInfo[0].data.item}
                    </div>
                    <div>
                      <span>Negotiable</span>:{" "}
                      {itemInfo[0].data.negotiable ? "YES" : "NO"}
                    </div>
                    <div>
                      <span>From</span>:{" "}
                      <span style={{ color: "rgb(0, 172, 0)" }}>emesher</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="productDetails__bottom">
              <div className="productDetails__bottomNav">
                <nav
                  style={displayStatus === "information" ? activeNavStyle : {}}
                  onClick={handleInfoNav}
                >
                  {windowWidth < 321 ? "Information" : "Additional Information"}
                </nav>
                <nav
                  style={displayStatus === "reviews" ? activeNavStyle : {}}
                  onClick={() => setDisplayStatus("reviews")}
                >
                  Review(1)
                </nav>
              </div>
              {displayStatus === "information" && (
                <article
                  id="product_details_area"
                  className="productDetails__bottomInfo"
                ></article>
              )}
              {displayStatus === "reviews" && (
                <div className="productDetails__bottomReview">
                  <div className="productDetails__topRating">
                    <div className="productDetails__topStar">
                      <p
                        style={{
                          color: rating >= 0.5 ? "rgb(0, 172, 0)" : "",
                        }}
                        className="productDetails__star"
                      >
                        <Star fontSize="small" />
                      </p>
                      <p
                        style={{
                          color: rating >= 1.5 ? "rgb(0, 172, 0)" : "",
                        }}
                        className="productDetails__star"
                      >
                        <Star fontSize="small" />
                      </p>
                      <p
                        style={{
                          color: rating >= 2.5 ? "rgb(0, 172, 0)" : "",
                        }}
                        className="productDetails__star"
                      >
                        <Star fontSize="small" />
                      </p>
                      <p
                        style={{
                          color: rating >= 3.5 ? "rgb(0, 172, 0)" : "",
                        }}
                        className="productDetails__star"
                      >
                        <Star fontSize="small" />
                      </p>
                      <p
                        style={{
                          color: rating >= 4.5 ? "rgb(0, 172, 0)" : "",
                        }}
                        className="productDetails__star"
                      >
                        <Star fontSize="small" />
                      </p>
                    </div>
                  </div>
                  <div className="productDetails__reviewNote">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout. The point of using Lorem Ipsum is that it has a
                    more-or-less normal distribution of letters, as opposed to
                    using 'Content here, content here', making it look like
                    readable English.
                  </div>
                  <div className="productDetails__reviewName">~ Ojo Tosin</div>
                </div>
              )}
            </section>
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
                {itemInfo[0].data.imageUrl.length > 1 && (
                  <div className="imageDelete">
                    <Delete
                      className="deleteIcon"
                      style={{ fontSize: windowWidth < 808 ? "20px" : "32px" }}
                      onClick={handleDeletePicture}
                    />
                  </div>
                )}
                <img src={itemInfo[0].data.imageUrl[activePicture]} alt="" />
                <span
                  style={{ visibility: deletingImage ? "visible" : "" }}
                  className="imageSpinner"
                ></span>
                <div
                  style={{
                    visibility:
                      itemInfo[0].data.imageUrl.length > 1
                        ? "visible"
                        : "hidden",
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

          {itemInfo[0]?.data.email === user?.email && (
            <Forms
              productEdit={itemInfo[0].data}
              productId={itemInfo[0].id}
              showForm={showEditForm}
              closeForm={closeForm}
              type="editProduct"
            />
          )}
        </>
      )}
    </>
  );
}

export default ProductDetails;
