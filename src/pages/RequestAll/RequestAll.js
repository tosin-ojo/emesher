import React, { useCallback, useEffect, useRef, useState } from "react";
import Fetching from "../../components/Fetching/Fetching";
import { db } from "../../utils/firebase";
import "./RequestAll.css";
import RequestItem from "../../components/RequestItem/RequestItem";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useStateValue } from "../../StateProvider";
import { ArrowRight, Tune } from "@material-ui/icons";

function RequestAll() {
  const [{ sidebar }] = useStateValue();
  const [requests, setRequests] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(Number.MAX_VALUE);
  const [bidMin, setBidMin] = useState(0);
  const [bidMax, setBidMax] = useState(Number.MAX_VALUE);
  const [deadlineMin, setDeadlineMin] = useState("1970-01-01");
  const [deadlineMax, setDeadlineMax] = useState("2170-01-01");
  const [filterBudget, setFilterBudget] = useState(false);
  const [filterBid, setFilterBid] = useState(false);
  const [filterDeadline, setFilterDeadline] = useState(false);
  const [displayFilter, setDisplayFilter] = useState(false);
  const [totalRequests, setTotalRequests] = useState();
  const [selectValue, setSelectValue] = useState("newest");
  const [filterSelect, setFilterSelect] = useState("createdAt");
  const [orderSelect, setOrderSelect] = useState("desc");
  const [displayOverlay, setDisplayOverlay] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);
  const [fetchingMore, setFetchingMore] = useState(false);
  let lastFilter = useRef(requests[requests.length - 1]?.data.createdAt);
  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    if (filterBudget || filterBid || filterDeadline) {
      return (
        setFilterSelect("createdAt"),
        setOrderSelect("desc"),
        (lastFilter.current = requests[requests.length - 1]?.data.createdAt)
      );
    }
    if (selectValue === "newest") {
      return (
        setFilterSelect("createdAt"),
        setOrderSelect("desc"),
        (lastFilter.current = requests[requests.length - 1]?.data.createdAt)
      );
    }
    if (selectValue === "highestBudget") {
      return (
        setFilterSelect("maxBudget"),
        setOrderSelect("desc"),
        (lastFilter.current = requests[requests.length - 1]?.data.maxBudget)
      );
    }
    if (selectValue === "lowestBudget") {
      return (
        setFilterSelect("maxBudget"),
        setOrderSelect("asc"),
        (lastFilter.current = requests[requests.length - 1]?.data.maxBudget)
      );
    }
    if (selectValue === "highestBid") {
      return (
        setFilterSelect("bidNumber"),
        setOrderSelect("desc"),
        (lastFilter.current = requests[requests.length - 1]?.data.bidNumber)
      );
    }
    if (selectValue === "lowestBid") {
      return (
        setFilterSelect("bidNumber"),
        setOrderSelect("asc"),
        (lastFilter.current = requests[requests.length - 1]?.data.bidNumber)
      );
    }
  }, [selectValue, requests, filterBudget, filterBid, filterDeadline]);

  const handleNextPage = useCallback(() => {
    setFetchingMore(true);
    const filter = (field, min, max) => {
      const filterRequestsEffect = db
        .collection("requests")
        .where(
          "keywords",
          "array-contains-any",
          keyword.toLowerCase().split(" ")
        )
        .where(field, ">=", min)
        .where(field, "<=", max)
        .orderBy(field);
      return filterRequestsEffect
        .orderBy(filterSelect, orderSelect)
        .startAfter(lastFilter.current)
        .limit(20)
        .get()
        .then((snapshot) => {
          if (snapshot.size < 1) {
            setFetchingMore(false);
            return false;
          }

          setRequests(
            requests.concat(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              }))
            )
          );

          setFetchingMore(false);
        });
    };

    if (filterBudget) {
      return filter("maxBudget", budgetMin, budgetMax);
    }
    if (filterBid) {
      return filter("bidNumber", bidMin, bidMax);
    }
    if (filterDeadline) {
      return filter(
        "deadline",
        Date.parse(deadlineMin),
        Date.parse(deadlineMax)
      );
    }

    const requestsRef = db
      .collection("requests")
      .where(
        "keywords",
        "array-contains-any",
        keyword.toLowerCase().split(" ")
      );
    requestsRef
      .orderBy(filterSelect, orderSelect)
      .startAfter(lastFilter.current)
      .limit(20)
      .get()
      .then((snapshot) => {
        if (snapshot.size < 1) {
          setFetchingMore(false);
          return false;
        }

        setRequests(
          requests.concat(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          )
        );

        setFetchingMore(false);
      });
  }, [
    requests,
    keyword,
    filterSelect,
    orderSelect,
    filterBid,
    filterBudget,
    filterDeadline,
    bidMax,
    bidMin,
    budgetMax,
    budgetMin,
    deadlineMax,
    deadlineMin,
  ]);

  const observer = useRef();
  const lastRequestRef = useCallback(
    (node) => {
      if (fetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          handleNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetching, handleNextPage]
  );

  useEffect(() => {
    const filter = (field, min, max) => {
      const filterRequestsEffect = db
        .collection("requests")
        .where(
          "keywords",
          "array-contains-any",
          keyword.toLowerCase().split(" ")
        )
        .where(field, ">=", min)
        .where(field, "<=", max)
        .orderBy(field);
      return filterRequestsEffect
        .orderBy(filterSelect, orderSelect)
        .limit(20)
        .get()
        .then((snapshot) => {
          if (snapshot.size < 1) {
            setRequests([]);
          }

          setRequests(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
          setFetching(false);
        });
    };

    db.collection("counter")
      .doc("requests")
      .get()
      .then((doc) => {
        if (doc.exists) {
          setTotalRequests(doc.data().requestsCount);
        }
      });

    if (filterBudget) {
      setFetching(true);
      return filter("maxBudget", budgetMin, budgetMax);
    }
    if (filterBid) {
      setFetching(true);
      return filter("bidNumber", bidMin, bidMax);
    }
    if (filterDeadline) {
      setFetching(true);
      return filter(
        "deadline",
        Date.parse(deadlineMin),
        Date.parse(deadlineMax)
      );
    }

    setRequests([]);

    const requestsRefEffect = db
      .collection("requests")
      .where(
        "keywords",
        "array-contains-any",
        keyword.toLowerCase().split(" ")
      );
    requestsRefEffect
      .orderBy(filterSelect, orderSelect)
      .limit(20)
      .get()
      .then((snapshot) => {
        if (snapshot.size < 1) {
          setRequests([]);
        }

        setRequests(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
        setFetching(false);
      });
  }, [
    keyword,
    filterSelect,
    orderSelect,
    filterBudget,
    filterBid,
    filterDeadline,
    bidMax,
    bidMin,
    budgetMax,
    budgetMin,
    deadlineMax,
    deadlineMin,
  ]);

  const handleReset = (e) => {
    e.preventDefault();
    setKeyword("");
    setBudgetMin(0);
    setBudgetMax(Number.MAX_VALUE);
    setBidMin(0);
    setBidMax(Number.MAX_VALUE);
    setDeadlineMin("1970-01-01");
    setDeadlineMax("2170-01-01");
    setFilterDeadline(false);
    setFilterBudget(false);
    setFilterBid(false);
  };

  useEffect(() => {
    if (displayFilter && windowWidth < 901) {
      return setDisplayOverlay(true);
    } else {
      return setTimeout(() => {
        setDisplayOverlay(false);
      }, 300);
    }
  }, [displayFilter, windowWidth]);

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  return (
    <>
      {displayOverlay && (
        <div
          className="requestAll__overlay"
          onClick={() => setDisplayFilter(false)}
        ></div>
      )}
      <div className="requestAll">
        <Sidebar className="sidebar" requests />
        <div className="requestAll__container" style={{ flex: "1" }}>
          <section className="requestAll__left">
            <div className="requestAll__top">
              <div className="requestAll__order">
                <select
                  className="requestAll__select"
                  defaultValue={selectValue}
                  onChange={(e) => {
                    setFetching(true);
                    setFilterBid(false);
                    setFilterBudget(false);
                    setFilterDeadline(false);
                    setSelectValue(e.target.value);
                  }}
                >
                  <option value="newest">Newest first</option>
                  <option value="highestBudget">Highest budget first</option>
                  <option value="lowestBudget">Lowest budget first</option>
                  <option value="highestBid">Highest bid first</option>
                  <option value="lowestBid">Lowest bid first</option>
                </select>

                {requests.length > 0 && (
                  <span className="requestAll__counts">
                    {totalRequests} request{totalRequests > 1 ? "s" : ""}{" "}
                    available
                  </span>
                )}
              </div>
              <div className="requestAll__filterIcon">
                <Tune onClick={() => setDisplayFilter(true)} />
              </div>
            </div>

            {
              <>
                {fetching ? (
                  <div className="requestAll__fetching">
                    <Fetching />
                  </div>
                ) : (
                  <>
                    {requests.length < 1 && !fetchingMore ? (
                      <h4 className="requestAll__empty">
                        There is currrently no request, check back later.
                      </h4>
                    ) : (
                      <>
                        {requests.map((request, index) => {
                          if (requests.length === index + 1) {
                            return (
                              <div key={request.id} ref={lastRequestRef}>
                                <RequestItem
                                  key={request.id}
                                  id={request.id}
                                  request={request.data}
                                />
                              </div>
                            );
                          } else {
                            return (
                              <RequestItem
                                key={request.id}
                                id={request.id}
                                request={request.data}
                              />
                            );
                          }
                        })}
                      </>
                    )}
                  </>
                )}
              </>
            }
            {fetchingMore && (
              <div className="requestAll__fetching">
                <Fetching />
              </div>
            )}
          </section>
          <section
            className="requestAll__right"
            style={{
              right: displayFilter || windowWidth > 900 ? "0" : "",
              width:
                sidebar && windowWidth > 1023 && windowWidth < 1190
                  ? "27.2vw"
                  : "",
            }}
          >
            <div
              className="requestAll__formBackArrow"
              onClick={() => setDisplayFilter(false)}
            >
              <span style={{ fontSize: "14px" }}>Back</span>
              <ArrowRight style={{ color: "rgb(0,172,0)", fontSize: "25px" }} />
            </div>
            <form className="requestAll__searchForm">
              <h4>Search by:</h4>
              <input
                type="text"
                value={keyword}
                placeholder="Search keyword"
                onChange={(e) => {
                  setFetching(true);
                  setFetchingMore(false);
                  setKeyword(e.target.value);
                }}
              />
            </form>
            <form className="requestAll__filterForm">
              <h4>Filter by:</h4>
              <p>Check the field to filter</p>
              <div>
                <label>
                  <input
                    type="checkbox"
                    style={{ marginRight: "5px" }}
                    checked={filterBudget}
                    onChange={(e) => {
                      setFilterBudget(e.target.checked);
                      setFilterBid(false);
                      setFilterDeadline(false);
                    }}
                  />
                  Budget
                </label>
                <div>
                  <input
                    type="number"
                    placeholder="min"
                    value={budgetMin === 0 ? "" : budgetMin}
                    onChange={(e) => {
                      e.target.value === ""
                        ? setBudgetMin(0)
                        : setBudgetMin(parseInt(e.target.value));
                    }}
                    disabled={!filterBudget}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    value={
                      budgetMax === Number.MAX_VALUE
                        ? ""
                        : budgetMax === 0
                        ? ""
                        : budgetMax
                    }
                    placeholder="max"
                    onChange={(e) => {
                      e.target.value === ""
                        ? setBudgetMax(Number.MAX_VALUE)
                        : setBudgetMax(parseInt(e.target.value));
                    }}
                    disabled={!filterBudget}
                  />
                </div>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    style={{ marginRight: "5px" }}
                    checked={filterBid}
                    onChange={(e) => {
                      setFilterBid(e.target.checked);
                      setFilterBudget(false);
                      setFilterDeadline(false);
                    }}
                  />
                  Bid
                </label>
                <div>
                  <input
                    type="number"
                    value={bidMin === 0 ? "" : bidMin}
                    placeholder="min"
                    onChange={(e) => {
                      e.target.value === ""
                        ? setBidMin(0)
                        : setBidMin(parseInt(e.target.value));
                    }}
                    disabled={!filterBid}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    value={
                      bidMax === Number.MAX_VALUE
                        ? ""
                        : bidMax === 0
                        ? ""
                        : bidMax
                    }
                    placeholder="max"
                    onChange={(e) => {
                      e.target.value === ""
                        ? setBidMax(Number.MAX_VALUE)
                        : setBidMax(parseInt(e.target.value));
                    }}
                    disabled={!filterBid}
                  />
                </div>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    style={{ marginRight: "5px" }}
                    checked={filterDeadline}
                    onChange={(e) => {
                      setFilterDeadline(e.target.checked);
                      setFilterBid(false);
                      setFilterBudget(false);
                    }}
                  />
                  Deadline
                </label>
                <div>
                  <input
                    type="date"
                    value={deadlineMin === "1970-01-01" ? "" : deadlineMin}
                    placeholder="min"
                    onChange={(e) => {
                      e.target.value === ""
                        ? setDeadlineMin("1970-01-01")
                        : setDeadlineMin(e.target.value);
                    }}
                    disabled={!filterDeadline}
                  />
                  <span>to</span>
                  <input
                    type="date"
                    value={deadlineMax === "2170-01-01" ? "" : deadlineMax}
                    placeholder="max"
                    onChange={(e) => {
                      e.target.value === ""
                        ? setDeadlineMax("2170-01-01")
                        : setDeadlineMax(e.target.value);
                    }}
                    disabled={!filterDeadline}
                  />
                </div>
              </div>
              <div className="requestAll__filterFormBtn">
                <button onClick={handleReset}>Reset</button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}

export default RequestAll;
