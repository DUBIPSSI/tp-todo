require('dotenv').config();
const express = require('express');
const db = require('./db');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/todos', (req, res) => {
  db.query('SELECT * FROM todo', (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des todos:', error);
      return res.status(500).send('Erreur serveur');
    }
    res.json(results);
  });
});

app.post('/todos', (req, res) => {
  const { description, categorie} = req.body;

  db.query('INSERT INTO todo (description, categorie) VALUES (?, ?)', [description, categorie], (error, results) => {
    if (error) {
      console.error("Erreur lors de l'ajout de la todo:", error);
      return res.status(500).send("Erreur lors de l'enregistrement de la todo");
    }

    res.status(201).send({ id: results.insertId,  description, categorie });
  });
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM todo WHERE id = ?', [id], (error, results) => {
      if (error) {
          console.error('Erreur lors de la suppression de la todo:', error);
          return res.status(500).send('Erreur serveur');
      }
      if (results.affectedRows === 0) {
          return res.status(404).send('Todo non trouvée');
      }

      res.status(200).send('Todo supprimée avec succès');
  });
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors({
  origin: 'http://localhost:5173'
}));
