import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Forms.css";
import firebase from "firebase";
import {
  AddAPhoto,
  ArrowForward,
  FormatAlignCenter,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatIndentDecrease,
  FormatIndentIncrease,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatUnderlined,
  InsertLink,
  LinkOff,
  Redo,
  Undo,
} from "@material-ui/icons";
import { useStateValue } from "../../StateProvider";
import { db, storage } from "../../utils/firebase";
import sanitizeHtml from "sanitize-html";

function Forms({ productEdit, productId, showForm, closeForm, type, profile }) {
  const [{ user }, dispatch] = useStateValue();
  const [stockTitle, setStockTitle] = useState("");
  const [item, setItem] = useState("");
  const [stockDetails, setStockDetails] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState("");
  const [stockPrice, setStockPrice] = useState(0);
  const [unit, setUnit] = useState("");
  const [negotiable, setNegotiable] = useState(true);
  const [category, setCategory] = useState("none");
  const [image, setImage] = useState("");
  const [imageNameFile, setImageNameFile] = useState("");
  const [title, setTitle] = useState("");
  const [itemCategory, setItemCategory] = useState("none");
  const [details, setDetails] = useState("");
  const [summary, setSummary] = useState("");
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [profilePreviewImg, setProfilePreviewImg] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profileNumber, setProfileNumber] = useState("");
  const [service1, setService1] = useState("");
  const [service2, setService2] = useState("");
  const [service3, setService3] = useState("");
  const [service4, setService4] = useState("");
  const [service5, setService5] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const deliveryKeywords = deliveryInfo
    .replace(/[^\w ]+/g, "")
    .toLowerCase()
    .split(" ");
  const stockKeywords = item
    .replace(/[^\w ]+/g, "")
    .toLowerCase()
    .split(" ");
  const keywordsStock = stockTitle
    .replace(/[^\w ]+/g, "")
    .toLowerCase()
    .split(" ")
    .concat(deliveryKeywords, stockKeywords, "");
  const keywordsRequest = title
    .replace(/[^\w ]+/g, "")
    .toLowerCase()
    .split(" ")
    .concat("");
  const timestamp = firebase.firestore.FieldValue.serverTimestamp;
  const slugRequest = title
    .concat(" ", Date.now())
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
  const slugProduct = stockTitle
    .concat(" ", Date.now())
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
  const imageDate = useRef(Date.now());
  const imageName = `${image.lastModified}${imageDate.current}${image.name}`;
  const profileImageName = `${profileImage.lastModified}${imageDate.current}${profileImage.name}`;
  const disable =
    title.length < 1 ||
    details.length < 1 ||
    minBudget < 1 ||
    maxBudget < 1 ||
    deadline.length < 1 ||
    summary.length < 1 ||
    itemCategory === "none" ||
    submitting;
  const disableProduct =
    stockTitle.length < 1 ||
    stockDetails.length < 1 ||
    item.length < 1 ||
    deliveryInfo.length < 1 ||
    stockPrice < 1 ||
    unit.length < 1 ||
    category === "none" ||
    publishing ||
    additionalInfo.length < 1;
  const editableArea = useRef();
  const userProfile = firebase.auth().currentUser;
  const services = [service1, service2, service3, service4, service5].filter(
    String
  );
  const [windowWidth, setWindowWidth] = useState(0);
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

  const onStockSubmit = async () => {
    if (type === "editProduct") {
      const updateProduct = db.collection("items").doc(productId);
      try {
        updateProduct.update({
          category,
          keywords: keywordsStock,
          slug: slugProduct,
          item,
          deliveryInfo,
          name: user.displayName,
          additionalInfo,
          negotiable,
          price: parseInt(stockPrice),
          details: stockDetails,
          title: stockTitle,
          unit,
          profileImage: user.photoURL,
        });
        displayMessage("success", "Item published successfully");
      } catch (error) {
        console.log(error);
        displayMessage("error", "Error occurred!");
      } finally {
        closeForm(false);
        setPublishing(false);
        setStockTitle("");
        setItem("");
        setStockDetails("");
        setDeliveryInfo("");
        setStockPrice(0);
        setUnit("");
        setNegotiable(true);
        setCategory("none");
        setAdditionalInfo("");
      }
    } else {
      const uploadImage = storage.ref(`products/${imageName}`).put(image);
      uploadImage.on(
        "state_changed",
        (snapshot) => {},
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
              const publicProductRef = db.collection("items").doc();
              const publicStatsRef = db.collection("counter").doc("items");
              const statsRef = db
                .collection("users")
                .doc(user.user_id)
                .collection("userInfo")
                .doc("info");
              const increment = firebase.firestore.FieldValue.increment(1);
              const batch = db.batch();

              try {
                batch.set(publicProductRef, {
                  category,
                  keywords: keywordsStock,
                  slug: slugProduct,
                  item,
                  deliveryInfo,
                  name: user.displayName,
                  additionalInfo,
                  negotiable,
                  price: parseInt(stockPrice),
                  details: stockDetails,
                  title: stockTitle,
                  unit,
                  profileImage: user.photoURL,
                  email: user.email,
                  createdAt: timestamp(),
                  imageUrl: [url],
                  imageName: [imageName],
                  orders: 0,
                  pinned: 0,
                  rating: 0,
                  ratingCount: 0,
                });
                batch.set(statsRef, { itemsCount: increment }, { merge: true });
                batch.set(
                  publicStatsRef,
                  { itemsCount: increment },
                  { merge: true }
                );
                batch.commit();
                displayMessage("success", "Item published successfully");
              } catch (error) {
                console.log(error);
                displayMessage("error", "Error occurred!");
              } finally {
                closeForm(false);
                setPublishing(false);
                setStockTitle("");
                setItem("");
                setStockDetails("");
                setDeliveryInfo("");
                setStockPrice(0);
                setUnit("");
                setNegotiable(true);
                setCategory("none");
                setImage("");
                setImageNameFile("");
                setAdditionalInfo("");
              }
            });
        }
      );
    }
  };

  const handleStockSubmit = (e) => {
    e.preventDefault();
    setPublishing(true);

    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(imageNameFile) && type === "product") {
      return (
        displayMessage("error", "Invalid file type!"), setPublishing(false)
      );
    }

    if (!user && type === "editProduct") {
      return (
        displayMessage("error", "Login to edit item!"), setPublishing(false)
      );
    }

    if (!user && type !== "editProduct") {
      return (
        displayMessage("error", "Login to publish item!"), setPublishing(false)
      );
    }

    if (disableProduct && image.length < 1 && type !== "editProduct") {
      return (
        displayMessage("error", "Fill in all the fields correctly!"),
        setPublishing(false)
      );
    }

    if (disableProduct && type === "editProduct") {
      return (
        displayMessage("error", "Fill in all the fields correctly!"),
        setPublishing(false)
      );
    }

    onStockSubmit();
  };

  const onRequestSubmit = async () => {
    const publicRequestsRef = db.collection("requests").doc();
    const publicStatsRef = db.collection("counter").doc("requests");
    const statsRef = db
      .collection("users")
      .doc(user.user_id)
      .collection("transactions")
      .doc("--STATS--");
    const increaseCount = firebase.firestore.FieldValue.increment(1);
    const batch = db.batch();
    try {
      batch.set(publicRequestsRef.collection("--INFO--").doc("info"), {
        completedTrans: 0,
        rating: 0,
        reviewCount: 0,
        bidNumber: 0,
        bidAmount: 0,
        joined: user.metadata.creationTime,
        numberVerified: false,
        emailVerified: user.emailVerified,
        details,
      });
      batch.set(publicRequestsRef, {
        slug: slugRequest,
        summary,
        deadline: Date.parse(deadline),
        category: itemCategory,
        keywords: keywordsRequest,
        bidNumber: 0,
        minBudget: parseInt(minBudget),
        maxBudget: parseInt(maxBudget),
        title,
        createdAt: timestamp(),
        email: user.email,
      });
      batch.set(statsRef, { requestsCount: increaseCount }, { merge: true });
      batch.set(
        publicStatsRef,
        { requestsCount: increaseCount },
        { merge: true }
      );
      batch.commit();
      displayMessage("success", "Request published successfully");
    } catch (error) {
      console.log(error);
      displayMessage("error", "Error occurred!");
    } finally {
      setSubmitting(false);
      closeForm(false);
      setTitle("");
      setDetails("");
      setMinBudget(0);
      setMaxBudget(0);
      setDeadline("");
    }
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (!user) {
      return (
        displayMessage("error", "Login to make request!"), setSubmitting(false)
      );
    }
    if (disable) {
      return (
        displayMessage("error", "Fill in all the fields!"), setSubmitting(false)
      );
    }
    if (new Date(deadline).getTime() < new Date().getTime()) {
      return (
        displayMessage("error", "Please set a future date!"),
        setSubmitting(false)
      );
    }
    if (Number(minBudget) > Number(maxBudget)) {
      return (
        displayMessage("error", "Max. Budget is lower than Min. Budget!"),
        setSubmitting(false)
      );
    }

    onRequestSubmit();
  };

  const handleAddLink = () => {
    const selection = document.getSelection();
    const link = prompt("Enter a URL:", "http://");

    if (link === null) {
      return false;
    }
    if (link.length < 1) {
      return displayMessage("error", "Enter a valid URL");
    }
    if (link !== null) {
      document.execCommand("createLink", true, link);
      selection.anchorNode.parentElement.target = "_blank";
    }
  };

  const handleImageProfile = (e) => {
    const preview = document.getElementById("file_image");
    const file = document.getElementById("file_image_input").files[0];
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        preview.src = reader.result;
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
    setProfileImage(e.target.files[0]);
  };

  const onProfileEdit = async () => {
    const profileRef = db
      .collection("users")
      .doc(user.user_id)
      .collection("profile")
      .doc("info");
    const updateData = async () => {
      try {
        profileRef.set(
          {
            name: profileName,
            bio: profileBio,
            address: profileAddress,
            number: profileNumber,
            email: user.email,
            services,
          },
          { merge: true }
        );
        await userProfile.updateProfile({
          displayName: profileName,
          phoneNumber: profileNumber,
        });
        userProfile.reload();
        displayMessage("success", "Profile edited successfully");
      } catch (error) {
        console.log(error);
        displayMessage("error", "Error occurred!");
      } finally {
        closeForm(false);
        setSaving(false);
        setProfileBio("");
        setProfileAddress("");
        setProfileName("");
        setProfileNumber("");
        setService1("");
        setService2("");
        setService3("");
        setService4("");
        setService5("");
        setProfileImage("");
      }
    };
    if (profileImage !== "") {
      if (profile[0].imageName && profileImage !== "") {
        storage.ref("profile").child(profile[0].imageName).delete();
      }
      const uploadImage = storage
        .ref(`profile/${profileImageName}`)
        .put(profileImage);
      uploadImage.on(
        "state_changed",
        (snapshot) => {},
        (e) => {
          displayMessage("error", "An error occured!");
          console.log(e);
        },
        () => {
          storage
            .ref("profile")
            .child(profileImageName)
            .getDownloadURL()
            .then(async (url) => {
              profileRef.set(
                {
                  imageName: profileImageName,
                  imageUrl: url,
                },
                { merge: true }
              );
              await userProfile.updateProfile({
                photoURL: url,
              });
              userProfile.reload();
            });
        }
      );
      updateData();
    } else {
      updateData();
    }
  };

  const handleProfileEdit = (e) => {
    e.preventDefault();
    setSaving(true);
    if (!user) {
      setSaving(false);
      return displayMessage("error", "You can not edit");
    }

    if (saving) {
      return false;
    }
    if (
      profileName.length < 1 ||
      profileNumber.length < 1 ||
      profileAddress.length < 1 ||
      profileBio.length < 1
    ) {
      return (
        displayMessage(
          "error",
          "Fill all the neccessary fields and atleast a service"
        ),
        setSaving(false)
      );
    }
    if (
      service5.length < 1 &&
      service4.length < 1 &&
      service3.length < 1 &&
      service2.length < 1 &&
      service1.length < 1
    ) {
      return (
        displayMessage(
          "error",
          "Fill all the neccessary fields and atleast a service"
        ),
        setSaving(false)
      );
    }
    onProfileEdit();
  };

  useEffect(() => {
    if (type === "editProfile" && profile && showForm) {
      setProfilePreviewImg(
        profile[0].imageUrl ||
          "https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Blank_button.svg/1200px-Blank_button.svg.png"
      );
      setProfileAddress(profile[0].address);
      setProfileBio(profile[0].bio);
      setProfileName(profile[0].name);
      setProfileNumber(profile[0].number);
      if (profile[0].services) {
        if (profile[0].services.length > 0) {
          setService1(profile[0].services[0]);
        }
        if (profile[0].services.length > 1) {
          setService2(profile[0].services[1]);
        }
        if (profile[0].services.length > 2) {
          setService3(profile[0].services[2]);
        }
        if (profile[0].services.length > 3) {
          setService4(profile[0].services[3]);
        }
        if (profile[0].services.length > 4) {
          setService5(profile[0].services[4]);
        }
      }
    }
  }, [profile, showForm, type]);

  useEffect(() => {
    if (type === "editProduct") {
      setNegotiable(true);
      document.getElementById("edit_product_textarea").innerHTML = "";
    }

    if (type === "editProduct" && productEdit && showForm) {
      setStockTitle(productEdit.title);
      setItem(productEdit.item);
      setStockDetails(productEdit.details);
      setDeliveryInfo(productEdit.deliveryInfo);
      setAdditionalInfo(productEdit.additionalInfo);
      setStockPrice(productEdit.price);
      setUnit(productEdit.unit);
      setNegotiable(productEdit.negotiable);
      setCategory(productEdit.category);
      document.getElementById("edit_product_textarea").innerHTML +=
        productEdit.additionalInfo;
    }
  }, [type, productEdit, showForm]);

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  return (
    <>
      {showForm && (
        <div className="forms__overlay" onClick={() => closeForm(false)}></div>
      )}
      <div
        className="forms__container"
        style={{
          right:
            showForm && windowWidth > 960
              ? "calc((100vw - 857px) / 2)"
              : showForm && windowWidth > 800
              ? "calc((100vw - 654px) / 2)"
              : showForm && windowWidth < 801
              ? "0"
              : "",
          display: showForm ? "block" : "",
        }}
      >
        {type === "requests" &&
          type !== "editProfile" &&
          type !== "product" &&
          type !== "editProduct" && (
            <section className="forms">
              <header className="forms__head">
                <div
                  className="forms__arrowContainer"
                  onClick={() => closeForm(false)}
                >
                  <ArrowForward fontSize="small" />
                </div>
                <h2>Make Your Request</h2>
                <p>Fill in all the fields to publish your request</p>
              </header>
              <form>
                <div className="forms__title">
                  <label>Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="forms__information">
                  <label>Details</label>
                  <div className="forms__textCmd">
                    <div>
                      <span>
                        <FormatBold
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("bold")}
                        />
                      </span>
                      <span>
                        <FormatItalic
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("italic")}
                        />
                      </span>
                      <span>
                        <FormatUnderlined
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("underline")}
                        />
                      </span>
                      <span>
                        <FormatAlignLeft
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("justifyLeft")}
                        />
                      </span>
                      <span>
                        <FormatAlignCenter
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("justifyCenter")}
                        />
                      </span>
                      <span>
                        <FormatAlignRight
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("justifyRight")}
                        />
                      </span>
                      <span>
                        <FormatListBulleted
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() =>
                            document.execCommand("insertUnorderedList")
                          }
                        />
                      </span>
                    </div>
                    <div>
                      <span>
                        <FormatListNumbered
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() =>
                            document.execCommand("insertOrderedList")
                          }
                        />
                      </span>
                      <span>
                        <FormatIndentDecrease
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("outdent")}
                        />
                      </span>
                      <span>
                        <FormatIndentIncrease
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("indent")}
                        />
                      </span>
                      <span>
                        <InsertLink
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={handleAddLink}
                        />
                      </span>
                      <span>
                        <LinkOff
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("unlink")}
                        />
                      </span>
                      <span>
                        <Undo
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("undo")}
                        />
                      </span>
                      <span>
                        <Redo
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("redo")}
                        />
                      </span>
                    </div>
                  </div>
                  <div
                    ref={editableArea}
                    className="forms__editable"
                    aria-multiline="true"
                    contentEditable="true"
                    spellCheck="false"
                    onInput={(e) =>
                      setDetails(
                        sanitizeHtml(e.target.innerHTML, {
                          allowedAttributes: {
                            div: ["style"],
                            blockquote: ["style"],
                            a: ["href"],
                          },
                          allowedStyles: {
                            "*": {
                              "text-align": [/^left$/, /^right$/, /^center$/],
                              margin: [/^0\s+0\s+0\s+40px$/],
                              border: [/^none$/],
                              padding: [/^\d+(?:px|em|%)$/],
                            },
                          },
                        })
                      )
                    }
                  ></div>
                </div>
                <div className="forms__details">
                  <label>Summary</label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  />
                </div>
                <div className="forms__price">
                  <div>
                    <label>Min. Budget</label>
                    <div>
                      <input
                        type="number"
                        value={minBudget === 0 ? "" : minBudget}
                        placeholder="0"
                        onChange={(e) => setMinBudget(e.target.value)}
                      />
                      <span className="forms__currency">NGN</span>
                    </div>
                  </div>
                  <div>
                    <label>Max. Budget</label>
                    <div>
                      <input
                        type="number"
                        value={maxBudget === 0 ? "" : maxBudget}
                        placeholder="0"
                        onChange={(e) => setMaxBudget(e.target.value)}
                      />
                      <span className="forms__currency">NGN</span>
                    </div>
                  </div>
                </div>
                <div className="forms__select">
                  <label>Category</label>
                  <select
                    className="forms__selectInput"
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                  >
                    <option value="none">Select Category</option>
                    <option value="commodity">Commodity</option>
                    <option value="service">Service</option>
                  </select>
                </div>
                <div className="forms__bottom">
                  <div className="forms__deadline">
                    <label>Bidding Deadline</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </div>
                  <div className="forms__button">
                    <button
                      disabled={disable}
                      style={{ opacity: disable ? 0.6 : "" }}
                      onClick={handleRequestSubmit}
                    >
                      {submitting ? "Submitting" : "Submit"}

                      <span
                        style={{ display: submitting ? "flex" : "" }}
                        className="forms__spinner"
                      ></span>
                    </button>
                  </div>
                </div>
              </form>
            </section>
          )}

        {(type === "product" || type === "editProduct") &&
          type !== "editProfile" &&
          type !== "requests" && (
            <section className="forms">
              <header className="forms__head">
                <div
                  className="forms__arrowContainer"
                  onClick={() => closeForm(false)}
                >
                  <ArrowForward fontSize="small" />
                </div>
                <h2>Add to Stock</h2>
                <p>Fill in all the fields to publish your item</p>
              </header>
              <form>
                <div className="forms__title">
                  <label>Title</label>
                  <input
                    type="text"
                    value={stockTitle}
                    onChange={(e) => setStockTitle(e.target.value)}
                  />
                </div>
                <div className="forms__title">
                  <label>Item</label>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                  />
                </div>
                <div className="forms__details">
                  <label>Details</label>
                  <textarea
                    value={stockDetails}
                    onChange={(e) => setStockDetails(e.target.value)}
                  />
                </div>
                <div className="forms__location">
                  <label>Delivery Information</label>
                  <textarea
                    value={deliveryInfo}
                    onChange={(e) => setDeliveryInfo(e.target.value)}
                  />
                </div>
                <div className="forms__information">
                  <label>Additional Information</label>
                  <div className="forms__textCmd">
                    <div>
                      <span>
                        <FormatBold
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("bold")}
                        />
                      </span>
                      <span>
                        <FormatItalic
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("italic")}
                        />
                      </span>
                      <span>
                        <FormatUnderlined
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("underline")}
                        />
                      </span>
                      <span>
                        <FormatAlignLeft
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("justifyLeft")}
                        />
                      </span>
                      <span>
                        <FormatAlignCenter
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("justifyCenter")}
                        />
                      </span>
                      <span>
                        <FormatAlignRight
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("justifyRight")}
                        />
                      </span>
                      <span>
                        <FormatListBulleted
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() =>
                            document.execCommand("insertUnorderedList")
                          }
                        />
                      </span>
                    </div>
                    <div>
                      <span>
                        <FormatListNumbered
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() =>
                            document.execCommand("insertOrderedList")
                          }
                        />
                      </span>
                      <span>
                        <FormatIndentDecrease
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("outdent")}
                        />
                      </span>
                      <span>
                        <FormatIndentIncrease
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("indent")}
                        />
                      </span>
                      <span>
                        <InsertLink
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={handleAddLink}
                        />
                      </span>
                      <span>
                        <LinkOff
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("unlink")}
                        />
                      </span>
                      <span>
                        <Undo
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("undo")}
                        />
                      </span>
                      <span>
                        <Redo
                          style={{
                            fontSize: windowWidth < 466 ? "15px" : "20px",
                          }}
                          onClick={() => document.execCommand("redo")}
                        />
                      </span>
                    </div>
                  </div>
                  <div
                    ref={editableArea}
                    className="forms__editable"
                    id="edit_product_textarea"
                    aria-multiline="true"
                    contentEditable="true"
                    spellCheck="false"
                    onInput={(e) =>
                      setAdditionalInfo(
                        sanitizeHtml(e.target.innerHTML, {
                          allowedAttributes: {
                            div: ["style"],
                            blockquote: ["style"],
                            a: ["href"],
                          },
                          allowedStyles: {
                            "*": {
                              "text-align": [/^left$/, /^right$/, /^center$/],
                              margin: [/^0\s+0\s+0\s+40px$/],
                              border: [/^none$/],
                              padding: [/^\d+(?:px|em|%)$/],
                            },
                          },
                        })
                      )
                    }
                  ></div>
                </div>
                <div className="forms__price forms__inputPreInput">
                  <div>
                    <label>Price</label>
                    <div>
                      <input
                        type="number"
                        value={stockPrice === 0 ? "" : stockPrice}
                        placeholder="0"
                        onChange={(e) => setStockPrice(e.target.value)}
                      />
                      <span className="forms__currency">NGN</span>
                    </div>
                  </div>
                  <div>
                    <label>Unit</label>
                    <div>
                      <span className="forms__inputPreText">per</span>
                      <input
                        type="text"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label>Negotiable?</label>
                    <ul className="tg-list">
                      <li className="tg-list-item">
                        <input
                          className="tgl tgl-skewed"
                          id="cb3"
                          type="checkbox"
                          checked={negotiable}
                          onChange={(e) => setNegotiable(e.target.checked)}
                        />
                        <label
                          className="tgl-btn"
                          data-tg-off="No"
                          data-tg-on="Yes"
                          htmlFor="cb3"
                        ></label>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="forms__bottom">
                  <div className="forms__select">
                    <label>Category</label>
                    <select
                      className="forms__selectInput"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="none">Select Category</option>
                      <option value="foodstuff">Food Stuff</option>
                      <option value="seed">Seeds</option>
                      <option value="animal">Animal Protein</option>
                      <option value="crop">Crop</option>
                    </select>
                  </div>
                  {type === "product" && (
                    <div className="forms__file">
                      <label>Select Image</label>
                      <div>
                        <label
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="file"
                            style={{ display: "none", visibility: "none" }}
                            onChange={(e) => {
                              setImage(e.target.files[0]);
                              setImageNameFile(e.target.value);
                            }}
                          />
                          <div className="forms__fileBtn">
                            <span>
                              {imageNameFile === ""
                                ? "Select File"
                                : imageNameFile
                                    .replace(/^.*\\/, "")
                                    .concat(" (selected)")}
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                  <div className="forms__button" style={{ height: "45px" }}>
                    <button
                      disabled={disableProduct}
                      style={{ opacity: disableProduct ? 0.5 : "" }}
                      onClick={handleStockSubmit}
                    >
                      {publishing ? "Submitting" : "Submit"}

                      <div
                        style={{ display: publishing ? "flex" : "" }}
                        className="forms__spinner"
                      ></div>
                    </button>
                  </div>
                </div>
              </form>
            </section>
          )}

        {type === "editProfile" &&
          type !== "requests" &&
          type !== "product" &&
          type !== "editProduct" && (
            <section className="forms">
              <header className="forms__head">
                <div
                  className="forms__arrowContainer"
                  onClick={() => closeForm(false)}
                >
                  <ArrowForward fontSize="small" />
                </div>
                <h2>Edit Profile</h2>
                <p>Fill in all the fields</p>
              </header>
              <form>
                <div className="form__profileTop">
                  <div className="forms__profileImage">
                    <label>
                      <input
                        type="file"
                        id="file_image_input"
                        style={{ display: "none", visibility: "none" }}
                        onChange={handleImageProfile}
                      />
                      <img id="file_image" src={profilePreviewImg} alt="" />
                      <div className="forms__addPhoto">
                        <AddAPhoto style={{ fontSize: "32px" }} />
                      </div>
                    </label>
                  </div>
                </div>
                <div className="form__profileBottom">
                  <div className="forms__profilePersonal">
                    <div>
                      <label>Store Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                      />
                      <span className="forms__inputBorder"></span>
                    </div>
                    <div>
                      <label>Bio</label>
                      <input
                        type="text"
                        value={profileBio}
                        onChange={(e) => setProfileBio(e.target.value)}
                      />
                      <span className="forms__inputBorder"></span>
                    </div>
                  </div>
                  <div>
                    <label>Address</label>
                    <input
                      type="text"
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                    />
                    <span className="forms__inputBorder"></span>
                  </div>
                  <div>
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={profileNumber}
                      onChange={(e) => setProfileNumber(e.target.value)}
                    />
                    <span className="forms__inputBorder"></span>
                  </div>
                  <div>
                    <label>Services</label>
                    <ol>
                      <li>
                        <input
                          className="form__listInput"
                          type="text"
                          value={service1}
                          onChange={(e) => setService1(e.target.value)}
                        />
                        <span className="forms__inputBorder"></span>
                      </li>
                      <li>
                        <input
                          className="form__listInput"
                          type="text"
                          value={service2}
                          onChange={(e) => setService2(e.target.value)}
                        />
                        <span className="forms__inputBorder"></span>
                      </li>
                      <li>
                        <input
                          className="form__listInput"
                          type="text"
                          value={service3}
                          onChange={(e) => setService3(e.target.value)}
                        />
                        <span className="forms__inputBorder"></span>
                      </li>
                      <li>
                        <input
                          className="form__listInput"
                          type="text"
                          value={service4}
                          onChange={(e) => setService4(e.target.value)}
                        />
                        <span className="forms__inputBorder"></span>
                      </li>
                      <li>
                        <input
                          className="form__listInput"
                          type="text"
                          value={service5}
                          onChange={(e) => setService5(e.target.value)}
                        />
                        <span className="forms__inputBorder"></span>
                      </li>
                    </ol>
                  </div>
                  <div className="forms__button" style={{ height: "40px" }}>
                    <button
                      style={{ width: "auto", padding: "0 25px" }}
                      onClick={handleProfileEdit}
                      disabled={saving}
                    >
                      {saving ? "Saving" : "Save"}

                      <span
                        style={{ display: saving ? "flex" : "" }}
                        className="forms__spinner"
                      ></span>
                    </button>
                  </div>
                </div>
              </form>
            </section>
          )}
      </div>
    </>
  );
}

export default Forms;
