# CSRF-MERN-STACK

Ce projet implémente une protection contre les attaques CSRF (Cross-Site Request Forgery) dans une application MERN (MongoDB, Express, React, Node.js).

## 📌 Prérequis
Assurez-vous d'avoir installé les éléments suivants :
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## 📂 Installation
Clonez le dépôt et installez les dépendances.

```sh
# Cloner le projet
git clone https://github.com/FERICHA/CSRF-MERN-STACK.git
cd CSRF-MERN-STACK

# Installer les dépendances du backend
cd backend
npm install

# Installer les dépendances du frontend
cd ../frontend
npm install
```

## 🚀 Lancement du projet
Démarrez le backend et le frontend.

```sh
# Démarrer le backend
cd backend
npm start

# Démarrer le frontend
cd ../frontend
npm start
```

## 🔒 Protection CSRF avec Express
Le backend utilise `csurf` pour protéger contre les attaques CSRF.

### 📌 Installation du middleware
```sh
npm install csurf cookie-parser cors express
```

### 📌 Configuration dans Express (`backend/index.js`)
```js
const express = require('express');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true 
}));

const csrfProtection = csrf({cookie: true})
const parser = bodyParser.urlencoded({extended:false})
app.use(cookieParser());
app.get('/csrf-token', csrfProtection,function(req,res){
    res.json({csrfToken: req.csrfToken()});
})
app.post('/submit',csrfProtection ,function(req,res){
    res.send('les donnees sont bien traite');
})
app.listen(5000,()=>{
    console.log('serveur démarré ');
 
})
```

## 🔄 Intégration du token CSRF dans React
Dans le frontend, nous récupérons le token CSRF avant d'envoyer une requête sécurisée.

### 📌 Installation d'Axios
```sh
npm install axios
```

### 📌 Récupération du token dans React (`frontend/src/components/FormComponent.jsx`)
```jsx
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
```

Ajoutez `fetchCsrfToken()` avant toute requête POST pour éviter les erreurs CSRF.

## ✅ Tests
1. Vérifiez que votre backend envoie bien un cookie CSRF.
2. Assurez-vous que les requêtes POST échouent sans le token.
3. Intégrez `fetchCsrfToken()` pour sécuriser les requêtes.


![Capture d’écran 2025-04-02 173502](https://github.com/user-attachments/assets/ad1bc444-7fbe-4a46-a511-8e41284a7aca)



## 📜 Licence
Ce projet est sous licence MIT.

---
✉️ Pour toute question, contactez-moi sur [GitHub](https://github.com/FERICHA). 🚀

