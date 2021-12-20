import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Confirmation.css";
import { useStateValue } from "../../StateProvider";
import Sidebar from "../../components/Sidebar/Sidebar";
import Order from "../../components/Order/Order";

function Confirmation() {
  const [{ user, basket, loaded }, dispatch] = useStateValue();
  const history = useHistory();

  const emptyBasketEffect = useCallback(() => {
    if (loaded) {
      if (!user || basket.length < 1) {
        history.replace("/checkout");

        dispatch({
          type: "EMPTY_BASKET",
        });
      }
    }
  }, [user, basket, loaded, history, dispatch]);

  useEffect(() => {
    emptyBasketEffect();
  }, [emptyBasketEffect]);

  return (
    <div className="confirmation">
      <Sidebar className="sidebar" />
      <div className="confirmation__container" style={{ flex: "1" }}>
        <Order confirmation />
      </div>
    </div>
  );
}

export default Confirmation;
