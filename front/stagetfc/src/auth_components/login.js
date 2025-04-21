import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 🔐 1. Appel à l'API /api/token/
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password
      });

      const { access, refresh } = response.data;

      // 💾 2. Sauvegarder les tokens
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      // 👤 3. Appel à /api/me/ pour obtenir le type d'utilisateur
      const userInfo = await axios.get('http://localhost:8000/api/me/', {
        headers: {
          Authorization: `Bearer ${access}`
        }
      });

      const { type_of_user } = userInfo.data;
      localStorage.setItem('user_type', type_of_user)
      // 🚀 4. Redirection selon le type d'utilisateur
      if (type_of_user === 'admin') {
        navigate('/admin-dashboard');
      } else if (type_of_user === 'member') {
        navigate('/member-dashboard');
      } else {
        setError('Type d\'utilisateur inconnu');
      }
    } catch (err) {
      console.error(err);
      setError('Nom d’utilisateur ou mot de passe incorrect');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4">Connexion</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Nom d’utilisateur</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mot de passe</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
