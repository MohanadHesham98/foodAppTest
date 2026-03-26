import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Ohana Means Family</h1>

      <p className="explore-menu-text">
        Ohana is more than just a restaurant — it’s a place where family and friends gather to create memories. Every dish we serve is crafted with love, to remind you of home, the laughter shared over the dinner table, and the warmth of being with your loved ones.  
    We believe that food has the power to bring people closer, to celebrate moments, big or small, and to turn ordinary days into unforgettable experiences.  
    At Ohana, every bite tells a story, every flavor sparks a memory, and every meal is a chance to connect. Whether you’re here for a special occasion or just to enjoy a comforting meal, we welcome you as part of our family, because to us, Ohana truly means family.
      </p>

      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
              className="explore-menu-list-item"
            >
              <img
                className={category === item.menu_name ? "active" : ""}
                src={item.menu_image}
                alt={item.menu_name}
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>

      <hr />
    </div>
  );
};

export default ExploreMenu;
