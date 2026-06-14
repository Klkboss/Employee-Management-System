import React, { useState, useEffect, useMemo } from "react"; // Sidebar and Navbar components
import { Container, Row, Col, Modal, Form, Button, Alert, Table, Spinner, } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown, FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight, } from "react-icons/fa";
import axios from "axios";
import Sidebar from "../../components/Sidebar";// Sidebar and Navbar components
import TopNavbar from "../../components/TopNavbar";

function Dashboard({ onLogout }) {
   //  Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Employee data
  const [employees, setEmployees] = useState([]);
  const [originalEmployees, setOriginalEmployees] = useState([]);
  // Form input data
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    salary: "",
    department: "",
  });
  //  For editing and deleting employees
  const [editEmployee, setEditEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  //  Error and loading states
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
    //  Search and sort
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
    //  Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
//  Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);
  //  Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
   // 🔍 Search filtering logic
  useEffect(() => {
    if (searchTerm.trim().length < 5) {
      setEmployees(originalEmployees);
    } else {
      const filtered = originalEmployees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setEmployees(filtered);
    }
  }, [searchTerm, originalEmployees]);
//  Memoized sorting of employees
  const sortedEmployees = useMemo(() => {
    if (!sortConfig.key) return employees;
    const sorted = [...employees];
    sorted.sort((a, b) => {
      if (sortConfig.key === "salary") {
        return sortConfig.direction === "ascending"
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      }
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [employees, sortConfig]);

  
  const totalPages = Math.ceil(sortedEmployees.length / rowsPerPage);
  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Amazon-style fixed, right-aligned, always-bottom pagination bar
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    let prevWasEllipsis = false;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pageNumbers.push(i);
        prevWasEllipsis = false;
      } else if (!prevWasEllipsis) {
        pageNumbers.push("...");
        prevWasEllipsis = true;
      }
    }
    return (
      <div className="amazon-pagination">
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(1)}>
                <FaAngleDoubleLeft />
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <FaAngleLeft />
              </button>
            </li>
            {pageNumbers.map((num, idx) =>
              num === "..." ? (
                <li key={`ellipsis-${idx}`} className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              ) : (
                <li
                  key={num}
                  className={`page-item ${currentPage === num ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(num)}
                  >
                    {num}
                  </button>
                </li>
              )
            )}
            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""
                }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                <FaAngleRight />
              </button>
            </li>
            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""
                }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(totalPages)}
              >
                <FaAngleDoubleRight />
              </button>
            </li>
          </ul>
        </nav>
        {/* <div className="amazon-pagination-info">
          Page {currentPage} of {totalPages} | Showing{" "}
          {paginatedEmployees.length} of {sortedEmployees.length} employees
        </div> */}
      </div>
    );
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "ascending" ? <FaSortUp /> : <FaSortDown />;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => { 
    setShowAddModal(false);
    setError("");
    setFormData({ name: "", position: "", salary: "", department: "" });
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setEditEmployee(null);
    setError("");
  };

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };
  //  Add Employee
  const handleAddEmployee = async () => {  //  Add Employee
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setError("No authentication token found");
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/employees`,
        { ...formData, salary: parseFloat(formData.salary) },
        {
          headers: {
            Authorization: `JWT ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status !== 200) {
        setError(response.data?.error || "Failed to add employee");
      } else {
        const newEmployee = {
          id: response.data.id,
          name: formData.name,
          position: formData.position,
          salary: parseFloat(formData.salary),
          department: formData.department,
        };
        setEmployees((prev) => [newEmployee, ...prev]);
        setOriginalEmployees((prev) => [newEmployee, ...prev]);
        setFormData({ name: "", position: "", salary: "", department: "" });
        setShowAddModal(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {  //  Edit modal trigger
    setEditEmployee({ ...employee });
    setShowEditModal(true);
  };

  const handleUpdateEmployee = async () => {//  Update employee
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setError("No authentication token found");
        return;
      }
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/api/employees/${editEmployee.id}`,
        {
          name: editEmployee.name,
          position: editEmployee.position,
          salary: editEmployee.salary,
          department: editEmployee.department,
        },
        {
          headers: {
            Authorization: `JWT ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status !== 200) {
        setError(response.data?.error || "Failed to update employee");
      } else {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === editEmployee.id ? { ...editEmployee } : emp
          )
        );
        setOriginalEmployees((prev) =>
          prev.map((emp) =>
            emp.id === editEmployee.id ? { ...editEmployee } : emp
          )
        );
        setShowEditModal(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {//  Delete employee
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setError("No authentication token found");
        return;
      }
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/employees/${id}`,
        { headers: { Authorization: `JWT ${token}` } }
      );
      if (response.status !== 200) {
        setError(response.data?.error || "Failed to delete employee");
      } else {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        setOriginalEmployees((prev) => prev.filter((emp) => emp.id !== id));
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        setOriginalEmployees((prev) => prev.filter((emp) => emp.id !== id));
        setError("Employee not found. It may have already been deleted.");
      } else {
        setError(err.response?.data?.error || "Failed to delete employee");
      }
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const fetchEmployees = async () => { // 📡 Fetch employees from API
    try {
      setTableLoading(true);
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setError("No authentication token found");
        return;
      }
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/employees`,
        { headers: { Authorization: `JWT ${token}` } }
      );
      const reversedEmployees = response.data.employees.reverse();
      setEmployees(reversedEmployees);
      setOriginalEmployees(reversedEmployees);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch employees");
    } finally {
      setTableLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <TopNavbar onLogout={onLogout} />
        <Container fluid className="p-4" style={{ paddingBottom: "90px" }}>
          <Row>
            <Col>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Employee List</h4>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                  <FaPlus className="me-2" />
                  Add Employee
                </Button>
              </div>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Control
                type="text"
                placeholder="Search by name, position, or department"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3"
              />
              {tableLoading ? (
                <div className="text-center p-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th
                          onClick={() => requestSort("id")}
                          style={{ cursor: "pointer" }}
                        >
                          ID <span className="ms-1">{getSortIcon("id")}</span>
                        </th>
                        <th
                          onClick={() => requestSort("name")}
                          style={{ cursor: "pointer" }}
                        >
                          Name{" "}
                          <span className="ms-1">{getSortIcon("name")}</span>
                        </th>
                        <th
                          onClick={() => requestSort("position")}
                          style={{ cursor: "pointer" }}
                        >
                          Position{" "}
                          <span className="ms-1">
                            {getSortIcon("position")}
                          </span>
                        </th>
                        <th
                          onClick={() => requestSort("salary")}
                          style={{ cursor: "pointer" }}
                        >
                          Salary{" "}
                          <span className="ms-1">{getSortIcon("salary")}</span>
                        </th>
                        <th
                          onClick={() => requestSort("department")}
                          style={{ cursor: "pointer" }}
                        >
                          Department{" "}
                          <span className="ms-1">
                            {getSortIcon("department")}
                          </span>
                        </th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedEmployees.length > 0 ? (
                        paginatedEmployees.map((employee) => (
                          <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            <td>{employee.position}</td>
                            <td>${employee.salary?.toLocaleString()}</td>
                            <td>{employee.department}</td>
                            <td>
                              <Button
                                variant="success"
                                size="sm"
                                className="me-2"
                                onClick={() => handleEdit(employee)}
                                title="Update"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  setEmployeeToDelete(employee);
                                  setShowDeleteModal(true);
                                }}
                                title="Delete"
                              >
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No employees found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </>
              )}
            </Col>
          </Row>
        </Container>
        {renderPagination()}
      </div>
      <Modal show={showAddModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter employee name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Position</Form.Label>
            <Form.Control
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              placeholder="Enter position"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Salary</Form.Label>
            <Form.Control
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
              placeholder="Enter salary"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Control
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              placeholder="Enter department"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddEmployee}
            disabled={loading}
          >
            {loading ? "Adding..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleEditClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={editEmployee?.name || ""}
              onChange={(e) =>
                setEditEmployee({ ...editEmployee, name: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Position</Form.Label>
            <Form.Control
              type="text"
              name="position"
              value={editEmployee?.position || ""}
              onChange={(e) =>
                setEditEmployee({ ...editEmployee, position: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Salary</Form.Label>
            <Form.Control
              type="number"
              name="salary"
              value={editEmployee?.salary || ""}
              onChange={(e) =>
                setEditEmployee({ ...editEmployee, salary: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Control
              type="text"
              name="department"
              value={editEmployee?.department || ""}
              onChange={(e) =>
                setEditEmployee({ ...editEmployee, department: e.target.value })
              }
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateEmployee}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleDeleteClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {employeeToDelete && (
            <p>
              Do you want to delete employee{" "}
              <strong>{employeeToDelete.name}</strong>?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(employeeToDelete.id)}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Dashboard;
