import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
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
import './Admin.css';

function UserAdmin() {
  const [userRows, setUserRows] = useState([]);
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [isEditUser, setIsEditUser] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [newUser, setNewUser] = useState({
    id: '',
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:1337/api/users");
    const data = await res.json();
    setUserRows(data);
  };

  const handleOpenAddUserModal = () => {
    setIsEditUser(false);
    setNewUser({
      id: '',
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
    });
    setOpenAddUserModal(true);
  };

  const handleCloseAddUserModal = () => {
    setOpenAddUserModal(false);
    setIsEditUser(false);
    setEditUserId(null);
    setNewUser({
      id: '',
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
    });
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUser = async () => {
    const payload = { ...newUser };
    await fetch("http://localhost:1337/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    handleCloseAddUserModal();
    fetchUsers();
  };

  const handleEditUser = (id) => {
    const user = userRows.find((row) => row.id === id);
    if (user) {
      setIsEditUser(true);
      setEditUserId(id);
      setNewUser({ ...user });
      setOpenAddUserModal(true);
    }
  };

  const handleUpdateUser = async () => {
    const payload = { ...newUser };
    await fetch(`http://localhost:1337/api/users/${editUserId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    handleCloseAddUserModal();
    fetchUsers();
  };

  const handleDeleteUser = async (id) => {
    await fetch(`http://localhost:1337/api/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  return (
    <div>
      <div className="admin-header" id="users">
        <h2 className="admin-title">USERS</h2>
        <button className="admin-add-btn" onClick={handleOpenAddUserModal}>
          <AddCircleRoundedIcon style={{ marginRight: 4 }} />
          ADD USER
        </button>
      </div>
      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userRows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.firstname}</td>
                <td>{row.lastname}</td>
                <td>{row.username}</td>
                <td>{row.email}</td>
                <td>{row.password}</td>
                <td>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditUser(row.id)}
                    aria-label="edit"
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteUser(row.id)}
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
      {/* Add/Edit User Modal */}
      <Dialog open={openAddUserModal} onClose={handleCloseAddUserModal} maxWidth="xs" fullWidth>
        <DialogTitle>{isEditUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="ID"
              name="id"
              value={newUser.id}
              onChange={handleNewUserChange}
              fullWidth
              size="small"
              margin="dense"
            />
            <TextField
              label="First Name"
              name="firstname"
              value={newUser.firstname}
              onChange={handleNewUserChange}
              fullWidth
              size="small"
              margin="dense"
            />
            <TextField
              label="Last Name"
              name="lastname"
              value={newUser.lastname}
              onChange={handleNewUserChange}
              fullWidth
              size="small"
              margin="dense"
            />
            <TextField
              label="Username"
              name="username"
              value={newUser.username}
              onChange={handleNewUserChange}
              fullWidth
              size="small"
              margin="dense"
            />
            <TextField
              label="Email"
              name="email"
              value={newUser.email}
              onChange={handleNewUserChange}
              fullWidth
              size="small"
              margin="dense"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={newUser.password}
              onChange={handleNewUserChange}
              fullWidth
              size="small"
              margin="dense"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddUserModal}>Cancel</Button>
          <Button
            onClick={isEditUser ? handleUpdateUser : handleAddUser}
            variant="contained"
            color="primary"
          >
            {isEditUser ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UserAdmin;