import React, { useEffect, useState } from "react";
import "./OrdersAdmin.css";

function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all orders for admin
  useEffect(() => {
    fetch("http://localhost:1337/api/orders/all")
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setOrders([]);
        setLoading(false);
      });
  }, []);

  // Update order status
  const handleStatusChange = async (id, newStatus) => {
    const res = await fetch(`http://localhost:1337/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setOrders(orders =>
        orders.map(order =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    }
  };

  // Decline order handler (delete order)
  const handleDecline = async (id) => {
    if (!window.confirm("Are you sure you want to decline and delete this order?")) return;
    await fetch(`http://localhost:1337/api/orders/${id}`, { method: "DELETE" });
    setOrders(orders => orders.filter(order => order._id !== id));
  };

  return (
    <div className="orders-admin-container">
      <h1>Customer Orders</h1>
      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div className="orders-admin-list">
          {orders.map((order) => (
            <div className="orders-admin-card" key={order._id}>
              <div>
                <strong>Name:</strong> {order.name}<br />
                <strong>Address:</strong> {order.address}<br />
                <strong>Date:</strong> {order.date || "-"}<br />
                <strong>Total:</strong> ₱{order.total ? order.total.toFixed(2) : "0.00"}
              </div>
              <div>
                <strong>Items:</strong>
                <ul>
                  {(order.items || []).map((item, i) => (
                    <li key={i}>
                      {item.name} × {item.qty} = ₱{(item.price * item.qty).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <select
                  value={order.status || "Pending"}
                  onChange={e => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button
                className="decline-btn"
                onClick={() => handleDecline(order._id)}
              >
                Decline Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersAdmin;