import React from 'react';
import { Nav } from 'react-bootstrap';
import { FaUsers, FaBuilding } from 'react-icons/fa';

function Sidebar() {
  return (
    <div className="sidebar bg-dark text-white" style={{ width: '250px', minHeight: '100vh' }}>
      <div className="p-3">
        <div className="text-center mb-4">
          <div className="logo bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
               style={{ width: '60px', height: '60px' }}>
            <FaBuilding size={24} />
          </div>
          <h5 className="mt-2">Employee Portal</h5>
        </div>
        
        <Nav className="flex-column">
          <Nav.Link href="#employees" className="text-white sidebar-link active">
            <FaUsers className="me-2" />
            Employees
          </Nav.Link>
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
