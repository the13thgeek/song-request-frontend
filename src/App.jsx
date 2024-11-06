import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [queue, setQueue] = useState([
    {
        "title": "Xanadu",
        "artist": "The Olivia Project",
        "username": "the13thgeek"
    },
    {
        "title": "Let Them Move",
        "artist": "N.M.R.",
        "username": "the13thgeek"
    }
  ]);

  const addSong = (newSong) => {
    setQueue([...queue, newSong]);
  }

  const testAddSong = () => {
    setQueue([...queue, { "title": "NEW", "artist": "NEW", "username": "@the13thgeek" }]);
  }

  const removeFirstSong = () => {
    setQueue((prevQueue) => prevQueue.slice(1));
  }

  return (
    <div>
        <ul className="queue">
            <AnimatePresence>
                {queue.map((song, index) => (
                    <motion.li
                        key={index}
                        initial={ {opacity: 0, x: 100} }
                        animate={ {opacity: 1, x: 0} }
                        exit={ {opacity: 0, x: -100} }
                        transition={ {duration: 0.3}}
                        className='song-item'
                        ><b>{song.title}</b><br />
                        {song.artist}<br />
                        <small>{song.username}</small>
                    </motion.li>
                ))}
            </AnimatePresence>
        </ul>

        {/* <div className="testbuttons">
            <button onClick={() => testAddSong()}>Test Add Song</button>
            <button onClick={() => removeFirstSong()}>Test Remove Song</button>
        </div> */}
    </div>
  )
}

export default App
