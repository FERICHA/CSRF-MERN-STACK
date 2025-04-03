import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './module.style.css';

const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [csrfToken, setCsrfToken] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  // Récupérer le token CSRF au chargement du composant
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        // Avec credentials pour inclure les cookies
        const response = await axios.get('http://localhost:5000/csrf-token', {
          withCredentials: true
        });
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        setError('Erreur lors de la récupération du token CSRF');
        console.error(err);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse('');

    try {
      const result = await axios.post('http://localhost:5000/submit', formData, {
        headers: {
          'XSRF-TOKEN': csrfToken,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      setResponse(result.data);
    } catch (err) {
      setError('Erreur lors de l\'envoi du formulaire');
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nom:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <input type="hidden" name="_csrf" value={csrfToken} />

        <button type="submit" className="submit-btn">
          Envoyer
        </button>
      </form>

      {response && <div className="response success">{response}</div>}
      {error && <div className="response error">{error}</div>}
    </div>
  );
};

export default FormComponent;