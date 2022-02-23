import React, { useState, useEffect } from "react";
import ItemDetailContainer from "../ItemDetailContainer/ItemDetailContainer";
import Loading from "../Loading/Loading";
import { getFirestore } from "../../firebase";
import { Link } from "react-router-dom";

import "./ItemList.scss";

const ItemList = ({ onAdd }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const db = getFirestore();
    const itemCollection = db.collection("items");

    itemCollection
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size === 0) {
          console.log("No results!");
        }
        setProducts(
          querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          })
        );
      })
      .catch((error) => {
        console.log("Error searching items", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="list-container" id="list-container">
      {loading ? (
        <Loading text="Cargando productos..." />
      ) : (
        <div className="list-container__details">
          <div className="list-container__details-categories">
            <h2>Categorías</h2>
            <Link to="/categories/futbol">Brochas</Link>
            <Link to="/categories/natacion">Labiales</Link>
            <Link to="/categories/basket">Perfumes</Link>
          </div>
          <div className="list-container__details-title">
            <h3>Productos</h3>
          </div>
          <div className="list-container__list">
            {products.map((product) => {
              return (
                <ItemDetailContainer
                  key={product.id}
                  product={product}
                  onAdd={onAdd}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemList;
