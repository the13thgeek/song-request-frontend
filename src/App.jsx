import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [queue, setQueue] = useState([]);
  const [reqStatus, setReqStatus] = useState(false);

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
    const ws = new WebSocket("wss:///the13thgeek-nodejs.fly.dev");
    //const ws = new WebSocket("ws:///localhost:8080");

    // Events Listener
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch(data.type) {
        case "ADD_SONG":
          console.log("ADD_SONG");
          //console.log(data.song);
          addSong(data.song);
          break;
        case "REMOVE_SONG":
          removeFirstSong();
          break;
        case "REQUEST_MODE_ON":
          setReqStatus(true);
          break;
        case "REQUEST_MODE_OFF":
          setReqStatus(false);
          break;
      }

    };

    return () => {
      ws.close();
  };

  },[]);

  return (
    <div className='main-box'>
        <div className="req-status">
        { !reqStatus && ( <p className='msg-closed'><span>Requests are CLOSED</span></p> )}
        { (reqStatus && queue.length === 0) && ( <p className='msg-available'><span>🔽 Requests OPEN! See commands below 🔽</span></p> )}
        </div>
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

        {/* <div className="testbuttons">
            <button onClick={() => testAddSong()}>Test Add Song</button>
            <button onClick={() => removeFirstSong()}>Test Remove Song</button>
        </div> */}
    </div>
  )
}

export default App
