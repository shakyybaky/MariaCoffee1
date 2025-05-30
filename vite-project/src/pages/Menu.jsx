import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Add this import
import './Menu.css';
import Navbar from "./navbar.jsx";
import Footer from "./Footer.jsx";
import './Footer.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlashOnIcon from '@mui/icons-material/FlashOn';

const typeIcons = [
  { type: "Drinks", icon: "/src/img/icons/coffee.png", label: "Drinks" },
  { type: "Waffles", icon: "/src/img/icons/waffle.png", label: "Waffles" },
  { type: "PicaPica", icon: "/src/img/icons/nachos.png", label: "PicaPica" },
  { type: "SandwichBurger", icon: "/src/img/icons/burger.png", label: "SandwichBurger" },
  { type: "Pasta", icon: "/src/img/icons/dish.png", label: "Pasta" },
  { type: "Wings", icon: "/src/img/icons/fried-chicken.png", label: "Wings" },
  { type: "Ricebowls", icon: "/src/img/icons/ricebowl.png", label: "Ricebowls" },
];

function Menu() {
  const [products, setProducts] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [cart, setCart] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const navigate = useNavigate(); // <-- Add this

  useEffect(() => {
    fetch("http://localhost:1337/api/products")
      .then(res => res.json())
      .then(data => {
        const withImg = data.map(p => ({
          ...p,
          img: p.imageUrl ? `http://localhost:1337${p.imageUrl}` : "",
        }));
        setProducts(withImg);
      });
  }, []);

  // Filter products by type and availability
  const filteredProducts = products
    .filter(product => product.available)
    .filter(product => !selectedType || product.type === selectedType);

  // Add to cart handler
  const handleAddToCart = (product) => {
    setCart(prev => {
      const found = prev.find(item => item.id === product.id);
      if (found) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setShowCartModal(true);
  };

  // Remove from cart handler
  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Change quantity handler
  const handleChangeQty = (id, delta) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
        )
        .filter(item => item.qty > 0)
    );
  };

  // Buy Now handler
  const handleBuyNow = (product) => {
    setShowCheckoutModal(true);
    setCart([{ ...product, qty: 1 }]);
    setShowCartModal(false);
  };

  // Cart total
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Place order handler (used for both Cart and Buy Now)
  const handlePlaceOrder = async () => {
  const username = localStorage.getItem("username");
  if (!username) {
    alert("You must be logged in to place an order.");
    return;
  }
  const orderPayload = {
    name: customerName,
    address: customerAddress,
    items: cart,
    total: cartTotal,
    date: new Date().toLocaleString(),
    username // include username for backend filtering
  };
  try {
    const res = await fetch("http://localhost:1337/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.errors ? data.errors.join("\n") : data.error || "Order failed.");
      return;
    }
    setShowCheckoutModal(false);
    setCart([]);
    setCustomerName("");
    setCustomerAddress("");
    navigate("/customer-order");
  } catch (err) {
    alert("Failed to place order.");
  }
};

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar onCartClick={() => setShowCartModal(true)} cartCount={cart.length} />
      <div style={{ flex: 0 }}>
        <div className="menu-header-row">
          <div className="menu-title">MENU</div>
          <div className="menu-icons">
            {typeIcons.map(icon => (
              <button
                key={icon.type}
                className={`menu-icon-circle${selectedType === icon.type ? " selected" : ""}`}
                onClick={() => setSelectedType(icon.type)}
                title={icon.label}
                type="button"
              >
                <img src={icon.icon} alt={icon.label} />
              </button>
            ))}
            <button
              className={`menu-icon-circle${selectedType === "" ? " selected" : ""}`}
              onClick={() => setSelectedType("")}
              title="Show All"
              type="button"
            >
              <span style={{ fontWeight: "bold", fontSize: 18, color: "#DED4CC" }}>All</span>
            </button>
          </div>
        </div>

        <div className="product-list">
          {filteredProducts.map((product, idx) => (
            <div
              className="product-card"
              key={idx}
              style={{ position: "relative", cursor: "pointer" }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {product.img && (
                <img src={product.img} alt={product.name} />
              )}
              <div className="product-info">
                <span className="product-name">{product.name}</span>
                <span className="product-price">
                  ₱{Number(product.price).toFixed(2)}
                </span>
              </div>
              <div className="product-description">
                {product.description}
              </div>
              <div style={{
                position: "absolute",
                top: 12,
                right: 12,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                zIndex: 2
              }}>
                <button
                  className="add-cart-btn"
                  style={{
                    background: "#DED4CC",
                    border: "none",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: hoveredIdx === idx ? 1 : 0,
                    transition: "opacity 0.2s",
                    cursor: "pointer",
                  }}
                  onClick={() => handleAddToCart(product)}
                  title="Add to cart"
                >
                  <ShoppingCartIcon style={{ color: "#433628" }} />
                </button>
                <button
                  className="buy-now-btn"
                  style={{
                    background: "#433628",
                    border: "none",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: hoveredIdx === idx ? 1 : 0,
                    transition: "opacity 0.2s",
                    cursor: "pointer",
                  }}
                  onClick={() => handleBuyNow(product)}
                  title="Buy Now"
                >
                  <FlashOnIcon style={{ color: "#DED4CC" }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Cart Modal */}
      {showCartModal && (
        <div className="cart-modal-overlay" onClick={() => setShowCartModal(false)}>
          <div
            className="cart-modal"
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 32,
              minWidth: 350,
              maxWidth: 400,
              boxShadow: "0 8px 32px rgba(67,54,40,0.25)",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              zIndex: 1001
            }}
          >
            <h2 style={{ color: "#433628", marginBottom: 18 }}>Cart</h2>
            {cart.length === 0 ? (
              <div style={{ color: "#433628" }}>Your cart is empty.</div>
            ) : (
              <div>
                {cart.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 18
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "bold", color: "#433628" }}>{item.name}</div>
                      <div style={{ fontSize: 14, color: "#433628" }}>
                        ₱{Number(item.price).toFixed(2)} x {item.qty}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button
                        style={{
                          background: "#DED4CC",
                          border: "none",
                          borderRadius: "50%",
                          width: 44,
                          height: 36,
                          fontWeight: "bold",
                          color: "#433628",
                          cursor: "pointer",
                          fontSize: 22,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        onClick={() => handleChangeQty(item.id, -1)}
                      >
                        <span style={{
                          width: "100%",
                          textAlign: "center",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>-</span>
                      </button>
                      <span style={{
                        minWidth: 24,
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: 18
                      }}>{item.qty}</span>
                      <button
                        style={{
                          background: "#DED4CC",
                          border: "none",
                          borderRadius: "50%",
                          width: 44,
                          height: 36,
                          fontWeight: "bold",
                          color: "#433628",
                          cursor: "pointer",
                          fontSize: 22,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        onClick={() => handleChangeQty(item.id, 1)}
                      >
                        <span style={{
                          width: "100%",
                          textAlign: "center",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>+</span>
                      </button>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: "#b00",
                          fontWeight: "bold",
                          marginLeft: 8,
                          cursor: "pointer",
                          fontSize: 26
                        }}
                        onClick={() => handleRemoveFromCart(item.id)}
                        title="Remove"
                      >✕</button>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #DED4CC", margin: "18px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#433628" }}>
                  <span>Total:</span>
                  <span>₱{cartTotal.toFixed(2)}</span>
                </div>
                <button
                  style={{
                    marginTop: 18,
                    width: "100%",
                    background: "#433628",
                    color: "#DED4CC",
                    border: "none",
                    borderRadius: 8,
                    padding: "12px 0",
                    fontWeight: "bold",
                    fontSize: 18,
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    setShowCartModal(false);
                    setShowCheckoutModal(true);
                  }}
                >
                  Checkout
                </button>
              </div>
            )}
            <button
              style={{
                position: "absolute",
                top: 10,
                right: 18,
                background: "none",
                border: "none",
                fontSize: 22,
                color: "#433628",
                cursor: "pointer"
              }}
              onClick={() => setShowCartModal(false)}
              title="Close"
            >✕</button>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="cart-modal-overlay" onClick={() => setShowCheckoutModal(false)}>
          <div
            className="checkout-modal"
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 32,
              minWidth: 350,
              maxWidth: 400,
              boxShadow: "0 8px 32px rgba(67,54,40,0.25)",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              zIndex: 1100
            }}
          >
            <h2 style={{ color: "#433628", marginBottom: 18 }}>Checkout</h2>
            <div style={{ marginBottom: 18 }}>
              <strong>Order Summary:</strong>
              <ul style={{ paddingLeft: 18, marginTop: 10 }}>
                {cart.map(item => (
                  <li key={item.id} style={{ marginBottom: 6 }}>
                    {item.name} &times; {item.qty} = ₱{(item.price * item.qty).toFixed(2)}
                  </li>
                ))}
              </ul>
              <div style={{ fontWeight: "bold", marginTop: 10 }}>
                Total: ₱{cartTotal.toFixed(2)}
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label>
                Name:<br />
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #DED4CC" }}
                />
              </label>
              <br /><br />
              <label>
                Address:<br />
                <textarea
                  value={customerAddress}
                  onChange={e => setCustomerAddress(e.target.value)}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #DED4CC" }}
                />
              </label>
            </div>
            <button
              style={{
                width: "100%",
                background: "#433628",
                color: "#DED4CC",
                border: "none",
                borderRadius: 8,
                padding: "12px 0",
                fontWeight: "bold",
                fontSize: 18,
                cursor: "pointer"
              }}
              onClick={handlePlaceOrder}
              disabled={!customerName || !customerAddress || cart.length === 0}
            >
              Place Order
            </button>
            <button
              style={{
                position: "absolute",
                top: 10,
                right: 18,
                background: "none",
                border: "none",
                fontSize: 22,
                color: "#433628",
                cursor: "pointer"
              }}
              onClick={() => setShowCheckoutModal(false)}
              title="Close"
            >✕</button>
          </div>
        </div>
      )}

      <Footer />
      {/* Modal overlay style */}
      <style>{`
        .cart-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(67,54,40,0.25);
          z-index: 1000;
        }
        .buy-now-btn:hover {
          background: #ffb300 !important;
        }
      `}</style>
    </div>
  );
}

export default Menu;