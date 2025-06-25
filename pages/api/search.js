import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Use in-memory database for simplicity
let db;

async function getDb() {
  if (!db) {
    db = await open({
      filename: ':memory:', // Use in-memory database
      driver: sqlite3.Database,
    });
    
    try {
      // Create table
      await db.exec(`
        CREATE TABLE IF NOT EXISTS pokemon (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          description TEXT,
          image_url TEXT
        );
      `);
      
      // Seed initial data
      await seed(db);
    } catch (err) {
      console.error('Database initialization error:', err);
      throw err;
    }
  }
  return db;
}

export default async function handler(req, res) {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: 'Name parameter is required' });
  }

  try {
    const db = await getDb();
    
    // First check if they're trying to directly search for the flag
    if (name.toLowerCase().trim() === 'flag') {
      return res.status(404).json({ error: 'No Pokémon found.' });
    }
    
    // DANGER: vulnerable query (intentional for CTF)
    const query = `SELECT * FROM pokemon WHERE name = '${name}'`;
    
    try {
      const rows = await db.all(query);
      
      // Filter out the flag from direct searches (but not from SQL injection results)
      const filteredRows = rows.filter(row => 
        row.name !== 'flag' || !name.includes(row.name)
      );
      
      if (filteredRows.length === 0) {
        return res.status(404).json({ error: 'No Pokémon found.' });
      }
      
      return res.status(200).json({ rows: filteredRows });
    } catch (queryErr) {
      // If there's a query error, return a generic error message
      console.error('Query error:', queryErr);
      return res.status(200).json({ 
        error: 'Error executing query',
        // Uncomment for debugging:
        // details: queryErr.message 
      });
    }
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function seed(db) {
  const count = await db.get('SELECT COUNT(*) as c FROM pokemon');
  if (count.c > 0) return; // already seeded

  const pokemonData = [
    // Kanto Starters
    { name: 'bulbasaur', description: 'A Grass/Poison type seed Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
    { name: 'ivysaur', description: 'The evolved form of Bulbasaur.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png' },
    { name: 'venusaur', description: 'The final evolution of Bulbasaur.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png' },
    { name: 'charmander', description: 'A Fire type Lizard Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' },
    { name: 'charmeleon', description: 'The evolved form of Charmander.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png' },
    { name: 'charizard', description: 'The final evolution of Charmander.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png' },
    { name: 'squirtle', description: 'A Water type Tiny Turtle Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png' },
    { name: 'wartortle', description: 'The evolved form of Squirtle.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png' },
    { name: 'blastoise', description: 'The final evolution of Squirtle.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png' },
    
    // Popular Kanto Pokémon
    { name: 'pikachu', description: 'An Electric-type Pokémon known for its yellow fur.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' },
    { name: 'raichu', description: 'The evolved form of Pikachu.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png' },
    { name: 'jigglypuff', description: 'A Fairy/Normal type Balloon Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png' },
    { name: 'meowth', description: 'A Normal type Scratch Cat Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png' },
    { name: 'psyduck', description: 'A Water type Duck Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png' },
    { name: 'machop', description: 'A Fighting type Superpower Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png' },
    { name: 'geodude', description: 'A Rock/Ground type Rock Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png' },
    { name: 'slowpoke', description: 'A Water/Psychic type Dopey Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/79.png' },
    { name: 'magnemite', description: 'An Electric/Steel type Magnet Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/81.png' },
    { name: 'gastly', description: 'A Ghost/Poison type Gas Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png' },
    
    // Some Johto Pokémon
    { name: 'chikorita', description: 'A Grass type Leaf Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/152.png' },
    { name: 'cyndaquil', description: 'A Fire type Fire Mouse Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/155.png' },
    { name: 'totodile', description: 'A Water type Big Jaw Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/158.png' },
    { name: 'pichu', description: 'An Electric type Tiny Mouse Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/172.png' },
    
    // Some Legendary/Mythical
    { name: 'mewtwo', description: 'A Psychic type Genetic Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png' },
    { name: 'mew', description: 'A Psychic type New Species Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png' },
    { name: 'lugia', description: 'A Psychic/Flying type Diving Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png' },
    { name: 'ho-oh', description: 'A Fire/Flying type Rainbow Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/250.png' },
    
    // Some fan favorites
    { name: 'eevee', description: 'A Normal type Evolution Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png' },
    { name: 'snorlax', description: 'A Normal type Sleeping Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png' },
    { name: 'dragonite', description: 'A Dragon/Flying type Dragon Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png' },
    { name: 'magikarp', description: 'A Water type Fish Pokémon that evolves into Gyarados.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png' },
    { name: 'gyarados', description: 'A Water/Flying type Atrocious Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png' },
    
    // More Pokémon
    { name: 'vulpix', description: 'A Fire type Fox Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/37.png' },
    { name: 'ninetales', description: 'A Fire type Fox Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/38.png' },
    { name: 'growlithe', description: 'A Fire type Puppy Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/58.png' },
    { name: 'arcanine', description: 'A Fire type Legendary Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png' },
    { name: 'abra', description: 'A Psychic type Psi Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/63.png' },
    { name: 'kadabra', description: 'A Psychic type Psi Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/64.png' },
    { name: 'alakazam', description: 'A Psychic type Psi Pokémon.', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png' },
    
    // Red herrings (fake flags)
    { name: 'rocket_flag', description: 'You thought it was that easy? Nice try! Check this out: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvd1YvSryfI0CUG8H6qOM_rhmIDL45TTeaAA&s', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/109.png' },
    { name: 'missingno', description: 'Glitched Pokémon. Nothing to see here... or is there? https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvd1YvSryfI0CUG8H6qOM_rhmIDL45TTeaAA&s', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png' },
    { name: 'giovanni_secret', description: 'The boss is very careful. His secret is here: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvd1YvSryfI0CUG8H6qOM_rhmIDL45TTeaAA&s', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png' },
    { name: 'admin_pass', description: 'Password stored in a secure location: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvd1YvSryfI0CUG8H6qOM_rhmIDL45TTeaAA&s', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/81.png' },
    { name: 'secret_backup', description: 'All important data is backed up at: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvd1YvSryfI0CUG8H6qOM_rhmIDL45TTeaAA&s', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/137.png' },
    { name: 'team_rocket', description: 'Team Rocket blasts off at the speed of light! Surrender now or prepare to fight! https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvd1YvSryfI0CUG8H6qOM_rhmIDL45TTeaAA&s', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/109.png' },
    { name: 'jessie_james', description: 'Prepare for trouble! And make it double! https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvd1YvSryfI0CUG8H6qOM_rhmIDL45TTeaAA&s', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png' },
    { name: 'hidden_treasure', description: 'X marks the spot! Find your treasure here: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvd1YvSryfI0CUG8H6qOM_rhmIDL45TTeaAA&s', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png' },
    { name: 'secret_entrance', description: 'The entrance to the secret base is at: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvd1YvSryfI0CUG8H6qOM_rhmIDL45TTeaAA&s', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png' },
    { name: 'confidential', description: 'For your eyes only: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvd1YvSryfI0CUG8H6qOM_rhmIDL45TTeaAA&s', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png' },
    { name: 'top_secret', description: 'TOP SECRET - DO NOT SHARE: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvd1YvSryfI0CUG8H6qOM_rhmIDL45TTeaAA&s', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png' },
    { name: 'classified', description: 'CLASSIFIED INFORMATION: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvd1YvSryfI0CUG8H6qOM_rhmIDL45TTeaAA&s', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/79.png' },
    
    // The actual flag (hidden via SQLi)
    { name: 'flag', description: 'CTF{gotta_catch_all_the_queries}', image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png' },
  ];

  // Insert all Pokémon in a transaction for better performance
  await db.exec('BEGIN TRANSACTION');
  const stmt = await db.prepare('INSERT INTO pokemon (name, description, image_url) VALUES (?, ?, ?)');
  
  for (const p of pokemonData) {
    await stmt.run(p.name, p.description, p.image_url);
  }
  
  await stmt.finalize();
  await db.exec('COMMIT');
}
