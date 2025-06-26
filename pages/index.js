import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setResults([]);
    try {
      const res = await fetch(`/api/search?name=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.rows);
      }
    } catch (err) {
      setError('Something went wrong...');
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen p-4 bg-poke-blue font-mono">
      <div className="relative w-full max-w-5xl bg-poke-red text-white rounded-lg shadow-2xl p-8 mt-8">
          {/* Pokédex indicator lights */}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="w-6 h-6 bg-white rounded-full border-2 border-gray-300"></div>
            <div className="w-4 h-4 bg-red-200 rounded-full border-2 border-gray-300"></div>
            <div className="w-4 h-4 bg-yellow-300 rounded-full border-2 border-gray-300"></div>
            <div className="w-4 h-4 bg-green-300 rounded-full border-2 border-gray-300"></div>
          </div>

          {/* Inner "screen" */}
          <div className="bg-white text-black rounded-lg p-6 mt-8 shadow-inner">
        <h1 className="text-5xl font-bold mb-2 text-center text-poke-yellow" style={{ WebkitTextStroke: '2px #3B4CCA' }}>
          Team Rocket's Pokédex
        </h1>
        <p className="mb-8 text-center text-gray-600 max-w-2xl mx-auto">
          Professor Oak's prototype Pokédex has been stolen! Team Rocket's security is weak. Your mission: find the secret flag Professor Oak hid inside the database to prove you can bypass their system.
        </p>

        <form onSubmit={handleSearch} className="flex justify-center gap-2 mb-8">
          <input
            className="border-2 border-gray-400 rounded px-4 py-2 w-full max-w-md focus:border-poke-yellow focus:ring-poke-yellow"
            placeholder="Enter Pokémon name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-poke-red hover:bg-red-700 text-white font-bold px-6 py-2 rounded border-b-4 border-red-800 hover:border-red-900 active:border-b-0"
          >
            Search
          </button>
        </form>

        {error && <p className="text-poke-red text-center font-bold mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {results.map((row) => (
            <div key={row.id} className="bg-gray-100 border-4 border-gray-300 rounded-lg p-4 flex flex-col items-center text-center shadow-inner hover:shadow-lg transition-shadow duration-200">
              <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center border-2 border-gray-400 mb-4">
                <Image 
                  src={row.image_url} 
                  alt={row.name} 
                  width={96} 
                  height={96} 
                  className="object-contain w-full h-full"
                  style={{ imageRendering: 'pixelated' }} 
                />
              </div>
              <h2 className="text-2xl font-bold mt-2 capitalize text-poke-blue">{row.name}</h2>
              <div className="w-full mt-2 min-h-[4rem] max-h-32 overflow-y-auto px-2">
                <p className="text-md break-words">{row.description}</p>
              </div>
            </div>
          ))}
        </div>
          </div>
        </div>
      </main>
  );
}
