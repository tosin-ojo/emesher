import React, { useState } from "react";
import "./Paystack.css";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import { PaystackButton } from "react-paystack";
import { db } from "../../utils/firebase";
import { useStateValue } from "../../StateProvider";
import { getBasketTotal } from "../../reducer";

function Paystack() {
  const [{ user, basket, deliveryInfo }, dispatch] = useStateValue();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const disable =
    !user ||
    loading ||
    basket.length < 1 ||
    deliveryInfo.address.length < 1 ||
    deliveryInfo.number.length < 1;
  const amount = (getBasketTotal(basket) * 100).toFixed(0);

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

  const config = {
    email: user.email,
    amount,
    publicKey: "pk_test_d3add6e05bd47c610355c5f102e4d38b4cd675a8",
  };

  const handlePaystackSuccessAction = async (result) => {
    const ordersRef = db
      .collection("users")
      .doc(user?.user_id)
      .collection("orders")
      .doc();
    const statsRefOrders = db
      .collection("users")
      .doc(user.user_id)
      .collection("transactions")
      .doc("--STATS--");
    const statsRefBasket = db
      .collection("users")
      .doc(user.user_id)
      .collection("indicators")
      .doc("alerts");
    const increment = firebase.firestore.FieldValue.increment(1);
    const decrement = firebase.firestore.FieldValue.increment(-basket.length);
    const batch = db.batch();
    try {
      setLoading(true);
      await batch.set(ordersRef, {
        status: "pending",
        address: deliveryInfo.address,
        amount: getBasketTotal(basket),
        createdAt: parseInt(Date.now()),
        phoneNumber: deliveryInfo.number,
        reference: result.reference,
        email: user.email,
        basket,
      });
      await batch.set(statsRefOrders, { pending: increment }, { merge: true });
      await batch.set(statsRefBasket, { basket: decrement }, { merge: true });
      await batch.commit();

      await basket.map((item) =>
        db
          .collection("users")
          .doc(user.uid)
          .collection("basket")
          .doc(item.id)
          .delete()
      );
      await dispatch({
        type: "EMPTY_BASKET",
      });

      history.replace("/profile");
      displayMessage(
        "success",
        "Transaction successful, your order is placed."
      );
    } catch (error) {
      displayMessage("error", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackCloseAction = () => {
    displayMessage("warning", "Transaction cancelled");
  };

  const componenetProps = {
    ...config,
    text: "Pay Now",
    onSuccess: (reference) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };

  return (
    <div
      className="paystack"
      style={{
        pointerEvents: disable ? "none" : "",
        opacity: disable ? "0.6" : "",
      }}
    >
      <PaystackButton {...componenetProps} />
    </div>
  );
}

export default Paystack;
