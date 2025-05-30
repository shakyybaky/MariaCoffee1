import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './ProductAdmin.css';


const typeOptions = [
  { value: 'Waffles', label: 'Waffles' },
  { value: 'Drinks', label: 'Drinks' },
  { value: 'Pasta', label: 'Pasta' },
  { value: 'PicaPica', label: 'PicaPica' },
  { value: 'Ricebowls', label: 'Ricebowls' },
  { value: 'SandwichBurger', label: 'SandwichBurger' },
  { value: 'Wings', label: 'Wings' }
];

function ProductAdmin() {
  const [rows, setRows] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isEditProduct, setIsEditProduct] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    price: '',
    description: '',
    img: null,
    imgPreview: '',
    type: '',
    available: false,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:1337/api/products");
    const data = await res.json();
    setRows(data.map(p => ({
      ...p,
      img: p.imageUrl ? `http://localhost:1337${p.imageUrl}` : "",
    })));
  };

  const handleOpenAddModal = () => {
    setIsEditProduct(false);
    setNewProduct({
      id: '',
      name: '',
      price: '',
      description: '',
      img: null,
      imgPreview: '',
      type: '',
      available: false,
    });
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setIsEditProduct(false);
    setEditProductId(null);
    setNewProduct({
      id: '',
      name: '',
      price: '',
      description: '',
      img: null,
      imgPreview: '',
      type: '',
      available: false,
    });
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct((prev) => ({
        ...prev,
        img: file,
        imgPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleAddProduct = async () => {
    const formData = new FormData();
    formData.append("id", newProduct.id);
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("type", newProduct.type);
    formData.append("available", newProduct.available);
    if (newProduct.img) {
      formData.append("image", newProduct.img);
    }
    await fetch("http://localhost:1337/api/products", {
      method: "POST",
      body: formData,
    });
    handleCloseAddModal();
    fetchProducts();
  };

  const handleEditProduct = (id) => {
    const product = rows.find((row) => row.id === id);
    if (product) {
      setIsEditProduct(true);
      setEditProductId(id);
      setNewProduct({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        img: null,
        imgPreview: product.img,
        type: product.type,
        available: product.available,
      });
      setOpenAddModal(true);
    }
  };

  const handleUpdateProduct = async () => {
    const formData = new FormData();
    formData.append("id", newProduct.id);
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("type", newProduct.type);
    formData.append("available", newProduct.available);
    if (newProduct.img) {
      formData.append("image", newProduct.img);
    }
    await fetch(`http://localhost:1337/api/products/${editProductId}`, {
      method: "PUT",
      body: formData,
    });
    handleCloseAddModal();
    fetchProducts();
  };

  const handleDeleteProduct = async (id) => {
    await fetch(`http://localhost:1337/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div>
      <div className="admin-header" id="products">
        <h2 className="admin-title">PRODUCTS</h2>
        <button className="admin-add-btn" onClick={handleOpenAddModal}>
          <AddCircleRoundedIcon style={{ marginRight: 4 }} />
          ADD PRODUCT
        </button>
      </div>
      <Box sx={{ overflowX: 'auto', mb: 4, width: '100%' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Image</th>
              <th>Description</th>
              <th>Type</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.price}</td>
                <td>
                  {row.img && (
                    <img src={row.img} alt="product" className="admin-product-img" />
                  )}
                </td>
                <td>{row.description}</td>
                <td>
                  <Select
                    value={row.type}
                    sx={{ width: 120, fontSize: 14 }}
                    disabled
                  >
                    {typeOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                  </Select>
                </td>
                <td>
                  <Checkbox
                    checked={row.available}
                    sx={{ color: '#433628' }}
                    disabled
                  />
                </td>
                <td>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditProduct(row.id)}
                    aria-label="edit"
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteProduct(row.id)}
                    aria-label="delete"
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      {/* Add/Edit Product Modal */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="xs" fullWidth>
        <DialogTitle>{isEditProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <label style={{ fontWeight: 600, marginBottom: 4 }}>Image (for upload)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: 8 }}
            />
            {newProduct.imgPreview && (
              <img
                src={newProduct.imgPreview}
                alt="Preview"
                style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }}
              />
            )}
            <TextField
              label="ID"
              name="id"
              value={newProduct.id}
              onChange={handleNewProductChange}
              fullWidth
              size="small"
              margin="dense"
            />
            <TextField
              label="Name"
              name="name"
              value={newProduct.name}
              onChange={handleNewProductChange}
              fullWidth
              size="small"
              margin="dense"
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={newProduct.price}
              onChange={handleNewProductChange}
              fullWidth
              size="small"
              margin="dense"
            />
            <TextField
              label="Description"
              name="description"
              value={newProduct.description}
              onChange={handleNewProductChange}
              fullWidth
              multiline
              rows={2}
              size="small"
              margin="dense"
            />
            <Select
              value={newProduct.type}
              onChange={e => setNewProduct(prev => ({ ...prev, type: e.target.value }))}
              displayEmpty
              fullWidth
              size="small"
              sx={{ mt: 1 }}
            >
              <MenuItem value="" disabled>
                Select Type
              </MenuItem>
              {typeOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
            <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1 }}>
              <Checkbox
                checked={!!newProduct.available}
                onChange={e => setNewProduct(prev => ({ ...prev, available: e.target.checked }))}
                sx={{ color: '#433628' }}
              />
              <span>Available</span>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal}>Cancel</Button>
          <Button
            onClick={isEditProduct ? handleUpdateProduct : handleAddProduct}
            variant="contained"
            color="primary"
          >
            {isEditProduct ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ProductAdmin;