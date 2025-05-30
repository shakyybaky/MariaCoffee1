import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ProductAdmin from './ProductAdmin';
import UserAdmin from './UserAdmin';
import OrdersAdmin from './OrdersAdmin';
import './Admin.css';

const sidebarItems = [
  {
    key: 'products',
    label: 'MANAGE PRODUCTS',
    icon: <Inventory2Icon />,
    type: 'section',
  },
  {
    key: 'orders',
    label: 'MANAGE ORDERS',
    icon: <ShoppingCartIcon />,
    type: 'section',
  },
  {
    key: 'menu',
    label: 'MENU',
    icon: <MenuBookIcon />,
    type: 'link',
    to: '/menu',
  },
];

function Admin() {
  const [activeSection, setActiveSection] = useState('products');
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Do you really want to logout?')) {
      navigate('/');
    }
  };

  const renderSection = () => {
    if (activeSection === 'products') return <ProductAdmin />;
    if (activeSection === 'users') return <UserAdmin />;
    if (activeSection === 'orders') return <OrdersAdmin />;
    return null;
  };

  return (
    <div className="admin-container">
      <Box className="admin-sidebar">
        <div className="sidebar-logo">
          <img src="/src/img/mainlogo.png" alt="Logo" />
        </div>
        <ul className="sidebar-menu">
          {sidebarItems.map((item) =>
            item.type === 'section' ? (
              <li key={item.key}>
                <button
                  className={`sidebar-btn${activeSection === item.key ? ' active' : ''}`}
                  onClick={() => setActiveSection(item.key)}
                >
                  {item.icon} {item.label}
                </button>
              </li>
            ) : (
              <li className="menu-butt" key={item.key}>
                <Link to={item.to} className="sidebar-link">
                  {item.icon} {item.label}
                </Link>
              </li>
            )
          )}
          <li>
            <button
              className="logout-button"
              onClick={handleLogout}
            >
              <LogoutIcon /> LOGOUT
            </button>
          </li>
        </ul>
      </Box>
      <div className="admin-main-content">{renderSection()}</div>
    </div>
  );
}

export default Admin;