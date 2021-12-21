import React, { useEffect, useState } from "react";
import "./Profile.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useStateValue } from "../../StateProvider";
import firebase from "firebase";
import { db, storage } from "../../utils/firebase";
import ProductDetails from "../../components/ProductDetails/ProductDetails";
import RequestItem from "../../components/RequestItem/RequestItem";
import { IconButton } from "@material-ui/core";
import moment from "moment";
import Loading from "../../components/Loading/Loading";
import {
  Cancel,
  DashboardOutlined,
  Delete,
  DescriptionOutlined,
  EmailOutlined,
  EventNoteOutlined,
  GradeOutlined,
  GroupOutlined,
  LocalShippingOutlined,
  ReceiptOutlined,
} from "@material-ui/icons";
import Product from "../../components/Product/Product";
import Logo from "../../images/emesher.png";
import Forms from "../../components/Forms/Forms";

function Profile() {
  const [{ user }] = useStateValue();
  const [nav, setNav] = useState("gallery");
  const [displayImage, setDisplayImage] = useState(false);
  const [profile, setProfile] = useState({});
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [product, setProduct] = useState([]);
  const [request, setRequest] = useState([]);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [totalProduct, setTotalProduct] = useState(0);
  const [index, setIndex] = useState(0);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [currentProductDetails, setCurrentProductDetails] = useState({});
  const [windowWidth, setWindowWidth] = useState(0);
  const userProfile = firebase.auth().currentUser;
  const [showImage, setShowImage] = useState("");
  const [imageType, setImageType] = useState("");
  const [showForm, setShowForm] = useState(false);
  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
  };

  const displayProductDetails = (value) => {
    setShowProductDetails(value);
  };

  const currentDetails = (index) => {
    setIndex(index);
  };

  const closeProductDetails = (value) => {
    setShowProductDetails(value);
  };

  const handleDeletePicture = async () => {
    const profileRef = db
      .collection("users")
      .doc(user.user_id)
      .collection("profile")
      .doc("info");
    if (user.email === profile.email) {
      if (imageType === "banner") {
        if (profile.bannerName === "") {
          return false;
        }
        storage.ref("profile").child(profile.bannerName).delete();
        profileRef.set(
          {
            bannerName: "",
            bannerUrl: null,
          },
          { merge: true }
        );
        setDisplayImage(false);
      }
      if (imageType === "profile") {
        if (profile.imageName === "") {
          return false;
        }
        storage.ref("profile").child(profile.imageName).delete();
        profileRef.set(
          {
            imageName: "",
            imageUrl: "",
          },
          { merge: true }
        );
        setDisplayImage(false);
        await userProfile.updateProfile({
          photoURL: "",
        });
        userProfile.reload();
      }
    } else {
      return false;
    }
  };

  const closeForm = (value) => {
    setShowForm(value);
  };

  const activeNavStyle = {
    color: "rgb(0, 172, 0)",
    borderBottom: "solid 3px rgb(0, 172, 0)",
  };

  useEffect(() => {
    setCurrentProductDetails(product[index]);
  }, [index, product]);

  useEffect(() => {
    if (!user) {
      return setProfile({});
    }

    const profileRef = db
      .collection("users")
      .doc(user.user_id)
      .collection("profile")
      .doc("info");
    const cleanUpGetProfile = profileRef.onSnapshot((snapshot) => {
      if (snapshot.exists) {
        setProfile(snapshot.data());
        setFetchingProfile(false);
      } else {
        setProfile(false);
        setFetchingProfile(false);
      }
    });

    return () => {
      cleanUpGetProfile();
    };
  }, [user]);

  useEffect(() => {
    if (!user) {
      return setProduct([]);
    }
    const cleanUpSnapshotProductStat = db
      .collection("users")
      .doc(user.user_id)
      .collection("userInfo")
      .doc("info")
      .onSnapshot((doc) => {
        if (doc.exists) {
          setTotalProduct(doc.data().itemsCount);
        } else {
          setTotalProduct(0);
        }
      });

    const productRefEffect = db
      .collection("items")
      .where("email", "==", user.email);
    const cleanUpGetProduct = productRefEffect
      .orderBy("createdAt", "desc")
      .limit(10)
      .onSnapshot((snapshot) => {
        setProduct(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
        setFetchingProduct(false);
      });

    const requestEffect = db
      .collection("requests")
      .where("email", "==", user.email);
    const cleanUpGetRequest = requestEffect
      .orderBy("createdAt", "desc")
      .limit(10)
      .onSnapshot((snapshot) => {
        setRequest(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
        setFetchingProduct(false);
      });

    return () => {
      cleanUpGetProduct();
      cleanUpSnapshotProductStat();
      cleanUpGetRequest();
    };
  }, [user]);

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  return (
    <div className="profile">
      <Sidebar className="sidebar" />
      <div
        className="profile__container"
        style={{
          flex: "1",
          height: showProductDetails ? "calc(100vh - 60px)" : "",
          overflow: showProductDetails ? "hidden" : "",
        }}
      >
        {fetchingProfile ? (
          <Loading />
        ) : profile === false ? (
          <section className="fetch__empty">
            <img src={Logo} alt="" />
            <div>
              <h2>User not found</h2>
              <span>This may be due to internet disconnection</span>
            </div>
          </section>
        ) : (
          <>
            <section className="profile__left">
              <div className="profile__767v">
                <div className="profile__left__top">
                  <div className="profile__avatar">
                    <img
                      src={
                        profile.imageUrl ||
                        "https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Blank_button.svg/1200px-Blank_button.svg.png"
                      }
                      onClick={() => {
                        setImageType("profile");
                        setShowImage(profile.imageUrl);
                        setDisplayImage(true);
                      }}
                      style={{
                        pointerEvents: profile.imageName === "" ? "none" : "",
                      }}
                      alt=""
                    />
                  </div>
                  <div className="profile__details__ctn">
                    <div className="profile__name">
                      <span>{profile.name}</span>
                      <span>@tosin</span>
                    </div>
                    <div className="profile__buttons">
                      <button onClick={() => setShowForm(true)}>
                        Edit profile
                      </button>
                      <button style={{ visibility: "hidden" }}>
                        <EmailOutlined style={{ fontSize: "16px" }} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="profile__bio">{profile.bio}</div>
                <div className="profile__left__info">
                  <div>
                    {profile.address !== "" && (
                      <div className="profile__address">
                        <LocalShippingOutlined fontSize="small" />
                        <span>{profile.address}</span>
                      </div>
                    )}
                    <div className="profile__joined">
                      <EventNoteOutlined fontSize="small" />
                      <span>
                        Joined{" "}
                        {moment(user.metadata.creationTime).format(
                          "MMMM Do YYYY"
                        )}
                      </span>
                    </div>
                    <div className="profile__rating">
                      <GradeOutlined fontSize="small" />
                      <span>4.7(193)</span>
                    </div>
                  </div>
                  <div className="profile__left__details">
                    <div>
                      <GroupOutlined fontSize="small" />{" "}
                      <span>{0} Subscribers</span>
                    </div>
                    <div>
                      <DashboardOutlined fontSize="small" />{" "}
                      <span>
                        {totalProduct} Gallery content
                        {totalProduct > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div>
                      <DescriptionOutlined fontSize="small" />{" "}
                      <span>5 Articles</span>
                    </div>
                    <div>
                      <ReceiptOutlined fontSize="small" />{" "}
                      <span>30 Completed transactions</span>
                    </div>
                  </div>
                </div>
                <div className="profile__top__bottom">
                  <div>SERVICES</div>
                  <ul className="profile__services">
                    {!profile.services
                      ? ""
                      : profile.services.map((service, i) => (
                          <li key={i}>
                            <span>{service}</span>
                          </li>
                        ))}
                  </ul>
                </div>
              </div>
              <div className="profile__navs">
                <nav
                  onClick={() => setNav("gallery")}
                  style={nav === "gallery" ? activeNavStyle : {}}
                >
                  Gallery
                </nav>
                <nav
                  onClick={() => setNav("about")}
                  style={nav === "about" ? activeNavStyle : {}}
                >
                  About
                </nav>
                <nav
                  onClick={() => setNav("request")}
                  style={nav === "request" ? activeNavStyle : {}}
                >
                  Request
                </nav>
              </div>
              <div className="profile__bottom">
                {nav === "gallery" && (
                  <>
                    {fetchingProduct ? (
                      <Loading />
                    ) : (
                      <>
                        {product.length < 1 ? (
                          <h4 className="profile__empty">
                            No content to display
                          </h4>
                        ) : (
                          product.map((item, i) => (
                            <Product
                              key={item.id}
                              item={item}
                              index={i}
                              showDetails={displayProductDetails}
                              currentDetails={currentDetails}
                              profile
                            />
                          ))
                        )}
                      </>
                    )}
                  </>
                )}
                {nav === "request" && (
                  <>
                    {fetchingProduct ? (
                      <Loading />
                    ) : (
                      <>
                        {request.length < 1 ? (
                          <h4 className="profile__empty">
                            No content to display
                          </h4>
                        ) : (
                          request.map((req, i) => (
                            <RequestItem
                              key={req.id}
                              id={req.id}
                              request={req.data}
                            />
                          ))
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </section>
            <section
              className="profile__right profile__767h"
              style={{
                top: showProductDetails ? "0" : "",
              }}
            >
              <div className="profile__avatar">
                <img
                  src={
                    profile.imageUrl ||
                    "https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Blank_button.svg/1200px-Blank_button.svg.png"
                  }
                  onClick={() => {
                    setImageType("profile");
                    setShowImage(profile.imageUrl);
                    setDisplayImage(true);
                  }}
                  style={{
                    pointerEvents: profile.imageName === "" ? "none" : "",
                  }}
                  alt=""
                />
              </div>
              <div className="profile__name">
                <span>{profile.name}</span>
                <span>@tosin</span>
              </div>
              <div className="profile__bio">{profile.bio}</div>
              <div className="profile__buttons">
                <button onClick={() => setShowForm(true)}>Edit profile</button>
                <button style={{ visibility: "hidden" }}>
                  <EmailOutlined style={{ fontSize: "16px" }} />
                </button>
              </div>
              <div className="profile__info">
                <div>DETAILS</div>
                {profile.address !== "" && (
                  <div className="profile__address">
                    <LocalShippingOutlined fontSize="small" />
                    <span>{profile.address}</span>
                  </div>
                )}
                <div className="profile__joined">
                  <EventNoteOutlined fontSize="small" />
                  <span>
                    Joined{" "}
                    {moment(user.metadata.creationTime).format("MMMM Do YYYY")}
                  </span>
                </div>
                <div className="profile__rating">
                  <GradeOutlined fontSize="small" />
                  <span>4.7(193)</span>
                </div>
              </div>
              <div className="profile__detail">
                <div>INFORMATION</div>
                <div>
                  <div>
                    <GroupOutlined fontSize="small" />{" "}
                    <span>{0} Subscribers</span>
                  </div>
                  <div>
                    <DashboardOutlined fontSize="small" />{" "}
                    <span>
                      {totalProduct} Gallery content
                      {totalProduct > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div>
                    <DescriptionOutlined fontSize="small" />{" "}
                    <span>5 Articles</span>
                  </div>
                  <div>
                    <ReceiptOutlined fontSize="small" />{" "}
                    <span>30 Completed transactions</span>
                  </div>
                </div>
              </div>
              <div className="profile__detail">
                <div>SERVICES</div>
                <ul className="profile__services">
                  {!profile.services
                    ? ""
                    : profile.services.map((service, i) => (
                        <li key={i}>
                          <span>{service}</span>
                        </li>
                      ))}
                </ul>
              </div>
            </section>
          </>
        )}
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
            {user.email === profile.email && (
              <div className="imageDelete">
                <Delete
                  className="deleteIcon"
                  style={{ fontSize: windowWidth < 808 ? "20px" : "32px" }}
                  onClick={handleDeletePicture}
                />
              </div>
            )}
            <img src={showImage} alt="" />
          </div>
        </div>
      )}

      {showProductDetails && (
        <ProductDetails
          showProductDetails={showProductDetails}
          productDisplay={closeProductDetails}
          item={[currentProductDetails]}
          activeProduct={currentDetails}
          productLength={product.length}
          productIndex={index}
        />
      )}

      {showForm && (
        <Forms
          profile={[profile]}
          showForm={showForm}
          closeForm={closeForm}
          type="editProfile"
        />
      )}
    </div>
  );
}

export default Profile;
