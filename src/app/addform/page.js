"use client"
import React, { useState } from 'react';
import './AddForm.css'

// movie,title,genres,year,Rating,RottenTomato
const AddForm = () => {
  const [formData, setFormData] = useState({
    movie: '',
    title: '',
    genres: '',
    year: '',
    Rating: '',
    RottenTomato: ''
  });
  const [error,seterror]= useState(false)

  const handleChange = (e) => {
    seterror(false)
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(formData.movie == ''){
        seterror(true)
        return 
      }
      if(formData.title == ''){
        seterror(true)
        return 
      }
      if(formData.genres == ''){
        seterror(true)
        return 
      }
      if(formData.year == ''){
        seterror(true)
        return 
      }
      if(formData.Rating == ''){
        seterror(true)
        return 
      }
      if(formData.RottenTomato == ''){
        seterror(true)
        return 
      }
      const response = await fetch('http://localhost:8000/demo/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        console.log('Entry added successfully');
        window.location.href = '/'; 
      } else {
        console.error('Failed to add entry');
      }
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };
  return (
    <div className="add-entry-form-container">
      <h2>Add Entry</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Movie:</label>
          <input type="number" name="movie" value={formData.movie} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label> Genres:</label>
          <input type="text" name="genres" value={formData.genres} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Year:</label>
          <input type="number" name="year" value={formData.year} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Rating:</label>
          <input type="number" name="Rating" value={formData.Rating} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Rotten Tomato:</label>
          <input type="number" name="RottenTomato" value={formData.RottenTomato} onChange={handleChange} />
        </div>
        {
          error &&
        <div className="form-group">
          <label style={{color:'red'}}>please enter all the feilds </label>
        </div>
        }

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
    
  );
};

export default AddForm;