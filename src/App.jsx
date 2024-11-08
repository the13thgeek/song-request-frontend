import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [queue, setQueue] = useState([]);

  const addSong = (newSong) => {
    setQueue((prevQueue) => [...prevQueue, newSong]);
  }

  const testAddSong = () => {
    setQueue([...queue, { "title": "NEW", "artist": "NEW", "user": "@the13thgeek" }]);
  }

  const removeFirstSong = () => {
    setQueue((prevQueue) => prevQueue.slice(1));
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:1300");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "ADD_SONG") {
        console.log("ADD_SONG =============");
        console.log(data.song);
        addSong(data.song);
      } else if(data.type === "REMOVE_SONG") {
        removeFirstSong();
      }
    };

    return () => {
      ws.close();
  };

  },[]);

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
                        ><b>{ song.title.length <= 15 ? song.title : song.title.substr(0,15).trim() + "..." }</b><br />
                        / { song.artist.length <= 23 ? song.artist : song.artist.substr(0,23).trim() + "..." }<br />
                        <small>{song.user}</small>
                    </motion.li>
                ))}
            </AnimatePresence>
        </ul>

        <div className="testbuttons">
            <button onClick={() => testAddSong()}>Test Add Song</button>
            <button onClick={() => removeFirstSong()}>Test Remove Song</button>
        </div>
    </div>
  )
}

export default App
