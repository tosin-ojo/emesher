import React, { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import "./Home.css";
import Loading from "../../components/Loading/Loading";
import Product from "../../components/Product/Product";
import Sidebar from "../../components/Sidebar/Sidebar";
import Logo from "../../images/emesher.png";
import { Tune } from "@material-ui/icons";

function Home() {
  const [product, setProduct] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [orderBy, setOrderBy] = useState("newest");
  const [filterSelect, setFilterSelect] = useState("createdAt");
  const [orderSelect, setOrderSelect] = useState("desc");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [delivery, setDelivery] = useState("all");
  const [filterPrice, setFilterPrice] = useState(false);
  const [filterRating, setFilterRating] = useState(false);
  const [filterOrder, setFilterOrder] = useState(false);
  const [displayOverlay, setDisplayOverlay] = useState(false);
  const [price, setPrice] = useState(Number.MAX_VALUE);
  const [order, setOrder] = useState(Number.MAX_VALUE);
  const [displayFilter, setDisplayFilter] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (filterPrice || filterOrder) {
      setOrderSelect("desc");
      return setFilterSelect("rating");
    }
    if (filterRating) {
      setOrderSelect("desc");
      return setFilterSelect("orders");
    }
    if (orderBy === "newest") {
      setOrderSelect("desc");
      return setFilterSelect("createdAt");
    }
    if (orderBy === "highestPrice") {
      setOrderSelect("desc");
      return setFilterSelect("price");
    }
    if (orderBy === "lowestPrice") {
      setOrderSelect("asc");
      return setFilterSelect("price");
    }
    if (orderBy === "highestRating") {
      setOrderSelect("desc");
      return setFilterSelect("rating");
    }
    if (orderBy === "lowestRating") {
      setOrderSelect("asc");
      return setFilterSelect("rating");
    }
    if (orderBy === "highestOrder") {
      setOrderSelect("desc");
      return setFilterSelect("orders");
    }
    if (orderBy === "lowestOrder") {
      setOrderSelect("asc");
      return setFilterSelect("orders");
    }
  }, [filterPrice, product, filterOrder, filterRating, orderBy]);

  useEffect(() => {
    const filter = (field, sign, value) => {
      const productRefEffect = db
        .collection("items")
        .where(
          "keywords",
          "array-contains-any",
          keyword.toLowerCase().split(" ")
        )
        .where(field, sign, value)
        .orderBy(field);
      return productRefEffect
        .orderBy(filterSelect, orderSelect)
        .limit(20)
        .get()
        .then((snapshot) => {
          if (snapshot.size < 1) {
            setProduct([]);
            setFetching(false);
          }

          setProduct(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
          setFetching(false);
        });
    };

    if (filterPrice) {
      return filter("price", "<=", price);
    }
    if (filterRating) {
      return filter("rating", ">=", rating);
    }
    if (filterOrder) {
      return filter("orders", "<=", order);
    }

    setProduct([]);

    const productRefEffect = db
      .collection("items")
      .where(
        "keywords",
        "array-contains-any",
        keyword.toLowerCase().split(" ")
      );
    const cleanUpGetProduct = productRefEffect
      .orderBy(filterSelect, orderSelect)
      .limit(10)
      .onSnapshot((snapshot) => {
        if (snapshot.size < 1) {
          setFetching(false);
          return setProduct([]);
        }

        setProduct(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
        setFetching(false);
      });

    return () => {
      cleanUpGetProduct();
    };
  }, [
    keyword,
    filterSelect,
    orderSelect,
    filterOrder,
    filterPrice,
    filterRating,
    order,
    rating,
    price,
  ]);

  return (
    <>
      {displayOverlay && (
        <div
          className="home__overlay"
          onClick={() => {
            setDisplayOverlay(false);
            setDisplayFilter(false);
          }}
        ></div>
      )}
      <div className="home">
        <div
          className="home__filterIcon"
          onClick={() => {
            setDisplayOverlay(true);
            setDisplayFilter(true);
          }}
        >
          <Tune />
        </div>
        <Sidebar home />
        <div className="home__container" style={{ flex: "1" }}>
          {fetching ? (
            <Loading />
          ) : (
            <>
              <div className="home__left">
                {product.length < 1 ? (
                  <section className="fetch__empty">
                    <img src={Logo} alt="" />
                    <div>
                      <h2>Posts not found</h2>
                      <span>This may be due to internet disconnection</span>
                    </div>
                  </section>
                ) : (
                  product.map((item) => <Product key={item.id} item={item} />)
                )}
              </div>
              <div
                className="home__right"
                style={{ right: displayFilter ? "0" : "" }}
              >
                <div
                  className="home__right__back"
                  onClick={() => {
                    setDisplayOverlay(false);
                    setDisplayFilter(false);
                  }}
                >
                  Back
                </div>
                <form>
                  <h4>Search by keyword:</h4>
                  <input
                    className="home__search"
                    type="text"
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                    }}
                    placeholder="Search keyword"
                  />
                </form>

                <form>
                  <h4>Sort by delivery reach:</h4>
                  <select
                    onChange={(e) => {
                      setDelivery(e.target.value);
                    }}
                    defaultValue={delivery}
                    className="requestAll__select"
                  >
                    <option value="all">All locations</option>
                    <option value="ekiti">Ekiti</option>
                    <option value="lagos">Lagos</option>
                    <option value="ogun">Ogun</option>
                    <option value="ondo">Ondo</option>
                    <option value="osun">Osun</option>
                    <option value="oyo">Oyo</option>
                  </select>
                </form>

                <form>
                  <h4>Sort by category:</h4>
                  <select
                    onChange={(e) => {
                      setCategory(e.target.value);
                    }}
                    defaultValue={category}
                    className="requestAll__select"
                  >
                    <option value="all">All categories</option>
                    <option value="fashion">Fashion</option>
                    <option value="gadgets">Gadgets</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="accessories">Accessories</option>
                    <option value="laptopss">Laptops</option>
                    <option value="phones">Phones</option>
                  </select>
                </form>

                <form
                  style={{
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h4
                    style={{
                      marginBottom: "10px",
                      color: "rgb(0, 172, 0",
                      fontWeight: "500",
                      fontSize: "15px",
                    }}
                  >
                    Order by:
                  </h4>
                  <select
                    onChange={(e) => {
                      setFilterPrice(false);
                      setFilterRating(false);
                      setFilterOrder(false);
                      setOrderBy(e.target.value);
                    }}
                    defaultValue={orderBy}
                    className="home__order__select"
                  >
                    <option value="newest">Newest first</option>
                    <option value="highestPrice">Highest price first</option>
                    <option value="lowestPrice">Lowest price first</option>
                    <option value="highestRating">Highest rating first</option>
                    <option value="lowestRating">Lowest rating first</option>
                    <option value="highestOrder">Highest order first</option>
                    <option value="lowestOrder">Lowest order first</option>
                  </select>
                </form>

                <form>
                  <h4>Filter for:</h4>
                  <p>Check the field to filter</p>
                  <div>
                    <label>
                      <input
                        checked={filterPrice}
                        onChange={(e) => {
                          setFilterPrice(e.target.checked);
                          setFilterRating(false);
                          setFilterOrder(false);
                        }}
                        type="checkbox"
                      />
                      Price lesser than
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={price === Number.MAX_VALUE ? "" : price}
                      onChange={(e) => {
                        e.target.value === ""
                          ? setPrice(Number.MAX_VALUE)
                          : setPrice(parseInt(e.target.value));
                      }}
                      disabled={!filterPrice}
                    />
                  </div>
                  <div>
                    <label>
                      <input
                        checked={filterOrder}
                        onChange={(e) => {
                          setFilterOrder(e.target.checked);
                          setFilterRating(false);
                          setFilterPrice(false);
                        }}
                        type="checkbox"
                      />
                      Orders lesser than
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={order === Number.MAX_VALUE ? "" : order}
                      onChange={(e) => {
                        e.target.value === ""
                          ? setOrder(Number.MAX_VALUE)
                          : setOrder(parseInt(e.target.value));
                      }}
                      disabled={!filterOrder}
                    />
                  </div>
                  <div>
                    <label>
                      <input
                        checked={filterRating}
                        onChange={(e) => {
                          setFilterRating(e.target.checked);
                          setFilterPrice(false);
                          setFilterOrder(false);
                        }}
                        type="checkbox"
                      />
                      Rating higher than
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={rating === 0 ? "" : rating}
                      onChange={(e) => {
                        e.target.value === ""
                          ? setRating(0)
                          : setRating(parseInt(e.target.value));
                      }}
                      disabled={!filterRating}
                    />
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
