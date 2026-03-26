import React, { useState } from "react";
import "./Add.css";
import axios from "axios";
import toast from "react-hot-toast";

const Add = ({ url }) => {
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "India",
    type: "Veg",
    serve: "",
    image: "",
  });

  const onchangehandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onsubmitHandler = async (event) => {
    event.preventDefault();

    const jsonData = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      serve: data.serve,
      type: data.type,
      image: data.image,
    };

    try {
      const response = await axios.post(`${url}/api/food/add`, jsonData, {
        headers: { "Content-Type": "application/json" },
      });

      setData({
        name: "",
        description: "",
        price: "",
        category: "India",
        type: "Veg",
        serve: "",
        image: "",
      });

      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to add product");
      console.error(error);
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onsubmitHandler}>
        <h2 className="Heading">Add Food Item</h2>

        <div className="add-product-name flex-col">
          <p>Food Name</p>
          <input
            name="name"
            value={data.name}
            onChange={onchangehandler}
            type="text"
            placeholder="Enter food name"
            required
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Description</p>
          <textarea
            name="description"
            value={data.description}
            onChange={onchangehandler}
            rows="6"
            placeholder="Enter food description"
            required
          />
        </div>

        <div className="add-img-upload flex-col">
          <p>Image URL</p>
          <input
            type="url"
            name="image"
            value={data.image}
            onChange={onchangehandler}
            placeholder="Enter image URL"
            required
            className="urlinput"
          />
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Country / Cuisine</p>
            <select name="category" value={data.category} onChange={onchangehandler}>
              <option value="India">India</option>
              <option value="Italy">Italy</option>
              <option value="Japan">Japan</option>
              <option value="China">China</option>
              <option value="Mexico">Mexico</option>
              <option value="USA">USA</option>
              <option value="France">France</option>
              <option value="Egypt">Egypt</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Price</p>
            <input
              type="number"
              name="price"
              value={data.price}
              onChange={onchangehandler}
              placeholder="Enter price"
              required
            />
          </div>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Type</p>
            <select name="type" value={data.type} onChange={onchangehandler}>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Serve</p>
            <input
              type="text"
              name="serve"
              value={data.serve}
              onChange={onchangehandler}
              placeholder="e.g. 1 Plate"
              required
            />
          </div>
        </div>

        <button type="submit" className="add-button">
          Add Food
        </button>
      </form>
    </div>
  );
};

export default Add;
