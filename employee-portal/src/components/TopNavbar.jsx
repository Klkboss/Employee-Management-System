import React, { useState } from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';

function TopNavbar({ onLogout }) {
  const [username] = useState('User'); // You can get this from JWT token

  return (
    <Navbar bg="white" className="border-bottom px-3">
      <Navbar.Brand className="ms-auto">
        <Dropdown align="end">
          <Dropdown.Toggle variant="outline-secondary" className="border-0">
            <FaUser className="me-2" />
            {username}
          </Dropdown.Toggle>
          
          <Dropdown.Menu>
            <Dropdown.ItemText>
              <strong>{username}</strong>
            </Dropdown.ItemText>
            <Dropdown.Divider />
            <Dropdown.Item onClick={onLogout}>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Brand>
    </Navbar>
  );
}

export default TopNavbar;
