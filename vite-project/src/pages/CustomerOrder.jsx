import React, { useEffect, useState } from "react";
import Navbar from "./navbar.jsx";
import "./CustomerOrder.css";

function CustomerOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      setFetchError("You must be logged in to view your orders.");
      setLoading(false);
      return;
    }
    // Use the correct endpoint for username
    fetch(`http://localhost:1337/api/orders/user/${encodeURIComponent(username)}`)
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setOrders([]);
        setFetchError("Failed to fetch orders.");
        setLoading(false);
      });
  }, []);

  // Cancel order handler
  const handleCancelOrder = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    await fetch(`http://localhost:1337/api/orders/${id}`, { method: "DELETE" });
    setOrders(orders => orders.filter(order => order._id !== id));
  };

  return (
    <div>
      <Navbar />
      <div className="customer-order-container">
        <h1 className="customer-order-title">ORDER LIST</h1>
        {loading ? (
          <div className="customer-order-empty">Loading...</div>
        ) : fetchError ? (
          <div className="customer-order-empty" style={{ color: "red" }}>{fetchError}</div>
        ) : orders.length === 0 ? (
          <div className="customer-order-empty">No orders yet.</div>
        ) : (
          <div className="customer-order-list-row">
            {orders.map((order) => (
              <div className="customer-order-card" key={order._id}>
                <div className="customer-order-details">
                  <div>
                    <strong>Name:</strong> {order.name}<br />
                    <strong>Address:</strong> {order.address}
                  </div>
                  <div>
                    <strong>Items:</strong>
                    <ul>
                      {(order.items || []).map((item, i) => (
                        <li key={i}>
                          {item.name} &times; {item.qty} = ₱{(item.price * item.qty).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="customer-order-total">
                    Total: ₱{order.total ? order.total.toFixed(2) : "0.00"}
                  </div>
                  <div className="customer-order-date">
                    Placed: {order.date || "-"}
                  </div>
                  <div className="customer-order-status">
                    <strong>Status:</strong> {order.status || "Pending"}
                  </div>
                </div>
                {(!order.status || order.status === "Pending") && (
                  <button
                    className="customer-order-cancel-btn"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerOrder;