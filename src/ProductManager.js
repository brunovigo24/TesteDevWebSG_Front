import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductManager.css';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    quantity: '',  // Adicionei o campo quantity
    supplierId: '',  // Mantemos o supplierId para gerenciar o select
    editing: false,
    id: null
  });

  // Fetch products and suppliers on component load
  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/suppliers'); // Ajuste a URL conforme necessário
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or update a product
  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name: form.name,
      price: form.price,
      quantity: form.quantity,
      supplier: {
        id: form.supplierId // Aqui estamos enviando o objeto supplier com o id
      }
    };

    if (form.editing) {
      // Update product
      try {
        await axios.put(`http://localhost:8080/products/${form.id}`, productData);
        fetchProducts(); // Refresh product list
        resetForm();
      } catch (error) {
        console.error("Error updating product:", error);
      }
    } else {
      // Create product
      try {
        await axios.post('http://localhost:8080/products', productData);
        fetchProducts(); // Refresh product list
        resetForm();
      } catch (error) {
        console.error("Error creating product:", error);
      }
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      quantity: product.quantity,  // Preenche o campo quantity
      supplierId: product.supplier.id,  // Preenche o supplierId
      editing: true,
      id: product.id
    });
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/products/${id}`);
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Reset form after submission
  const resetForm = () => {
    setForm({
      name: '',
      price: '',
      quantity: '',
      supplierId: '',
      editing: false,
      id: null
    });
  };

  return (
    <div>
      <h1>Gerenciador de produtos</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nome do produto"
          value={form.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Preço"
          value={form.price}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="quantity"  // Adicionando o campo quantity
          placeholder="Quantidade"
          value={form.quantity}
          onChange={handleInputChange}
          required
        />
        <select
          name="supplierId"
          value={form.supplierId}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecionar fornecedor</option>
          {suppliers.map(supplier => (
            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
          ))}
        </select>
        <button type="submit">{form.editing ? 'Update Product' : 'Criar produto'}</button>
      </form>

      <h2>Lista de produtos</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price} - Quantidade: {product.quantity}
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManager;
