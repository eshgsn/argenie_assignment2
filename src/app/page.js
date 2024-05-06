"use client"
import React, { useState, useEffect } from "react";
import "./page.css";
import Link from 'next/link';

class Home extends React.Component {
  constructor(props) {
    super(props);
    let viewMode = "table";
    if (props.searchParams) {
      const { view } = props.searchParams
      viewMode = view;
    }

    this.state = {
      data: [],
      searchTerm: "",
      loading: false,
      viewMode,
      isOpen: false,
      updateData: {
        movie: '',
        title: '',
        genres: '',
        year: '',
        Rating: '',
        RottenTomato: ''
      },
      start: 0
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      this.setState({ loading: true });
      let page = this.state.start;
      if(this.state.start == 0) {
        page = 10;
      }
      const response = await fetch(`http://localhost:8000/demo/?page=${page}&per_page=10`);
      const jsonData = await response.json();
      this.setState({ data: jsonData });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleUpdate = async () => {
    try {
      let _id = this.state.updateData._id;
      const response = await fetch(
        `http://localhost:8000/demo/${_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.state.updateData),
        }
      );
      if (response.ok) {
        console.log("Entry updated successfully");
        this.closeModal();
      } else {
        console.error("Failed to update entry");
      }
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  handleDelete = async (_id) => {
    try {
      this.setState({ loading: true });
      const response = await fetch(`http://localhost:8000/demo/${_id}`, {
        method: "DELETE",
      });
      global.location.href = `/?view=${this.state.viewMode}`;
      if (response.ok) {
        console.log(`User with ID ${_id} deleted successfully`);
        this.setState({ data: data.filter((item) => item._id !== _id) });
      } else {
        console.error(`Failed to delete user with ID ${userId}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      global.location.href = `/?view=${this.state.viewMode}`;
    } finally {
      this.setState({ loading: false });
      global.location.href = `/?view=${this.state.viewMode}`;
    }
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      updateData: {
        ...prevState.updateData,
        [name]: value
      }
    }));
  };

  closeModal = () => {
    this.setState({ isOpen: false });
  };





  render() {
    const {
      data,
      searchTerm,
      loading,
      viewMode,
      isOpen,
      updateData,
    } = this.state;
    const filteredData = data.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );


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
              <form onSubmit={this.handleUpdate}>
                <div className="form-group">
                  <label>movie:</label>
                  <input
                    type="text"
                    name="movie"
                    value={updateData.movie}
                    onChange={this.handleChange}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>title:</label>
                  <input
                    type="text"
                    name="title"
                    value={updateData.title}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>genres:</label>
                  <input
                    type="text"
                    name="genres"
                    value={updateData.genres}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>year:</label>
                  <input
                    type="text"
                    name="year"
                    value={updateData.year}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Rating:</label>
                  <input
                    type="number"
                    name="rating"
                    value={updateData.Rating}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>RottenTomato:</label>
                  <input
                    type="text"
                    name="rotten_tomato"
                    value={updateData.RottenTomato}
                    onChange={this.handleChange}
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
                    onClick={this.closeModal}
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
              onChange={this.handleSearchChange}
            />
            {/* <Link to="/add">
            <button className="add-button">Add</button>
          </Link> */}
            <Link href="/addform">
              <button className="add-button">Add</button>
            </Link>

            <button
              className="toggle-button"
              onClick={() => this.setState({ viewMode: viewMode === "table" ? "card" : "table" })}
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
                          this.setState({ isOpen: true });
                          this.setState({ updateData: item });
                        }}
                      >
                        Update
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => this.handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', textAlign: 'end'}}>
              <button onClick={()=> {
                if(this.state.start > 1) {
                this.setState({ start: this.state.start - 10 })
                this.fetchData();
                }
              }} style={{backgroundColor: "#ddd", padding: 5}}>{"<"}</button>
              <label>{this.state.start} - {this.state.start+ 10}</label>
              <button onClick={()=> {
                this.setState({ start: this.state.start + 10 })
                this.fetchData()
              }} style={{backgroundColor: "#ddd", padding: 5}}>{">"}</button>
            </div>
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
                        this.setState({ updateData: item });
                        this.setState({ isOpen: true });
                      }}
                    >
                      Update
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => this.handleDelete(item._id)}
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
  }
};

export default Home;