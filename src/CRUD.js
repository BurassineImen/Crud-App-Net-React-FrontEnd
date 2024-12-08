import React, { useState, useEffect, Fragment } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa"; // Icon library

const CRUD = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isActive, setIsActive] = useState(0);

  const [editID, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editisActive, setEditIsActive] = useState(0);

  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get("http://localhost:5033/api/Employee")
      .then((result) => {
        setData(result.data);
        toast.success("Data Refreshed");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (id) => {
    handleShow();
    axios
      .get(`http://localhost:5033/api/Employee/${id}`)
      .then((result) => {
        setEditName(result.data.name);
        setEditAge(result.data.age);
        setEditIsActive(result.data.isActive);
        setEditId(id);
      })
      .catch((error) => {
        console.error("Failed to fetch employee data:", error);
        toast.error("Failed to fetch employee data. Please try again.");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this employee?")) {
      axios
        .delete(`http://localhost:5033/api/Employee/${id}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Employee has been deleted");
            getData();
          }
        })
        .catch((error) => {
          toast.error("Failed to delete employee");
          console.error(error);
        });
    }
  };

  const handleUpdate = () => {
    const url = `http://localhost:5033/api/Employee/${editID}`;
    const data = {
      id: editID,
      name: editName,
      age: editAge,
      isActive: editisActive,
    };

    axios
      .put(url, data)
      .then((result) => {
        if (result.status === 200) {
          handleClose();
          getData();
          clear();
          toast.success("Employee has been updated");
        }
      })
      .catch((error) => {
        console.error("Update failed:", error);
        toast.error("Failed to update employee. Please try again.");
      });
  };

  const handleSave = () => {
    const url = "http://localhost:5033/api/Employee";
    const data = {
      name: name,
      age: age,
      isActive: isActive,
    };

    axios
      .post(url, data)
      .then((result) => {
        getData();
        clear();
        toast.success("Employee has been added");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const clear = () => {
    setName("");
    setAge("");
    setIsActive(0);
    setEditName("");
    setEditAge("");
    setEditIsActive(0);
    setEditId("");
  };

  return (
    <Fragment>
      <ToastContainer />
      <Container className="mt-4">
        <h2 className="text-center mb-4">Employee Management</h2>
        <h3 className="text-center mb-4">
            My First Crud using 
            <span style={{ color: "#007bff", fontWeight: "bold" }}> React JS</span>, 
            <span style={{ color: "#6f42c1", fontWeight: "bold" }}> Bootstrap</span>, 
            <span style={{ color: "#28a745", fontWeight: "bold" }}> ASP.NET Core</span>, 
            <span style={{ color: "#ffc107", fontWeight: "bold" }}> SQL Server Management Studio</span>, and 
            <span style={{ color: "#17a2b8", fontWeight: "bold" }}> Swagger</span>.
            </h3>
            <Row className="align-items-center mb-3">
          <Col md={4}>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <input
              type="checkbox"
              checked={isActive === 1}
              onChange={(e) => setIsActive(e.target.checked ? 1 : 0)}
            />
            <label className="ms-2">isActive</label>
          </Col>
          <Col md={2}>
            <Button className="btn btn-success" onClick={handleSave}>
              <FaPlus /> Add
            </Button>
          </Col>
        </Row>

        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.isActive ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEdit(item.id)}
                    >
                      <FaEdit /> Edit
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrashAlt /> Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modify Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Enter Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Enter Age"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <input
                type="checkbox"
                checked={editisActive === 1}
                onChange={(e) =>
                  setEditIsActive(e.target.checked ? 1 : 0)
                }
              />
              <label className="ms-2">isActive</label>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default CRUD;
