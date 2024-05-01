"use client"
import React, { useState, useEffect } from "react";
import "./page.css";
import Link from 'next/link';

const Home = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("table"); 
  const [isOpen, setisOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/demo/");
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/demo/${updateData._id}`,
        {
          method: "PUT", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData), 
        }
      );
      if (response.ok) {
        alert(JSON.stringify(response))
        console.log("Entry updated successfully");
        closeModal(); 
      } else {
        alert("successful")
        console.error("Failed to update entry");
      }
    } catch (error) {
      alert("successful")
      console.error("Error updating entry:", error);
    }
  };

  const handleDelete = async (_id) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/demo/${_id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log(`User with ID ${userId} deleted successfully`);
        setData(data.filter((item) => item.user_id !== userId));
      } else {
        console.error(`Failed to delete user with ID ${userId}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setisOpen(false);
  };

  return loading ? (
    <div>
      <h1>Loading...</h1>
    </div>
  ) : (
    <div>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Update Entry</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>movie:</label>
                <input
                  type="text"
                  name="movie"
                  value={updateData.movie}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>title:</label>
                <input
                  type="text"
                  name="title"
                  value={updateData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>genres:</label>
                <input
                  type="text"
                  name="genres"
                  value={updateData.genres}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>year:</label>
                <input
                  type="text"
                  name="year"
                  value={updateData.year}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Rating:</label>
                <input
                  type="number"
                  name="rating"
                  value={updateData.Rating}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>RottenTomato:</label>
                <input
                  type="text"
                  name="rotten_tomato"
                  value={updateData.RottenTomato}
                  onChange={handleChange}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <button
                  type="submit"
                  className="submit-button"
                  style={{ marginRight: 80 }}
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="submit-button"
                >
                  close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="table-container">
        <h2>Table Page</h2>
        <div className="table-actions">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {/* <Link to="/add">
            <button className="add-button">Add</button>
          </Link> */}
          <Link href="/addform">
          <button className="add-button">Add</button>
            </Link>;

          <button
            className="toggle-button"
            onClick={() => setViewMode(viewMode === "table" ? "card" : "table")}
          >
            {viewMode === "table"
              ? "Switch to Card View"
              : "Switch to Table View"}
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>movie</th>
                <th>title</th>
                <th>genres</th>
                <th>year</th>
                <th>Rating</th>
                <th>RottenTomato</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  {console.log(item,index)}
                  <td>{item.movie}</td>
                  <td>{item.title}</td>
                  <td>{item.genres}</td>
                  <td>{item.year}</td>
                  <td>{item.Rating}</td>
                  <td>{item.RottenTomato}</td>
                  <td>
                    <button
                      className="update-button"
                      onClick={() => {
                        setisOpen(true);
                        setUpdateData(item);
                      }}
                    >
                      Update
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card-view-container">
          {filteredData.map((item, index) => (
            <div className="card" key={index}>
              <div className="card-content">
                <h3>{item.movie}</h3>
                <p>title: {item.title}</p>
                <p>genres: {item.genres}</p>
                <div className="card-actions">
                  <button
                    className="update-button"
                    onClick={() => {
                      setisOpen(true);
                      setUpdateData(item);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(item.user_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;