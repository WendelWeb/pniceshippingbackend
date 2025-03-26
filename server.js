// // server.js
import express from 'express';
import cors from 'cors';
import { clerkClient } from '@clerk/clerk-sdk-node';
import * as dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.get('/api/users', async (req, res) => {
  try {
    let allUsers = [];
    let offset = 0;
    const limit = 100; // Maximum autorisé par Clerk
    let hasMore = true;

    while (hasMore) {
      const response = await clerkClient.users.getUserList({ limit, offset });
      allUsers = [...allUsers, ...response];

      // Vérifier s'il reste des utilisateurs à récupérer
      hasMore = response.length === limit;
      offset += limit;
    }

    res.json({ data: allUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// app.get('/api/users', async (req, res) => {
//   try {
//     const users = await clerkClient.users.getUserList();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
