import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [queue, setQueue] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [reqStatus, setReqStatus] = useState(false);
  const wsRef = useRef(null);
  const nextIdRef = useRef(1);

  useEffect(() => {
    nextIdRef.current = nextId;
  }, [nextId]);

  const addSong = (newSong) => {
    let newItem = { ...newSong, idx: nextIdRef.current, nowPlaying: false };
    setQueue((prevQueue) => [...prevQueue, newItem]);
    setNextId((prevId) => prevId + 1);
  }

  const nowPlaying = () => {
    setQueue((prevQueue) => {
      if(prevQueue.length === 0) return prevQueue;
      return prevQueue.map((song, index) => 
        index === 0 ? { ...song, nowPlaying: true } : song
      );
    });
  }

  const testAddSong = () => {
    addSong({
      title: "Test Song " + nextId,
      artist: "Test Artist",
      user: "@the13thgeek",
      avatar: null
    });
  }

  const removeFirstSong = () => {
    //console.log("removeFirstSong called");
    setQueue((prevQueue) => {
      if(prevQueue.length === 0) return prevQueue;
      //console.log("Removing song:", prevQueue[0]);
      return prevQueue.slice(1);
    });
  }

  useEffect(() => {
    const ws = new WebSocket("wss:///the13thgeek-nodejs.fly.dev");
    //const ws = new WebSocket("ws:///localhost:8080");

    // Events Listener
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch(data.type) {
        case "ADD_SONG":
          //console.log("ADD_SONG");
          //console.log(data.song);
          addSong(data.song);
          break;
        case "REMOVE_SONG":
          removeFirstSong();
          break;
        case "REQUEST_MODE_ON":
          //console.log("REQUEST_MODE_ON");
          setReqStatus(true);
          break;
        case "REQUEST_MODE_OFF":
          //console.log("REQUEST_MODE_OFF");
          setReqStatus(false);
          break;
        case "NOW_PLAYING":
          nowPlaying();
          break;
      }

    };

    return () => {
      // if (ws.readyState === 1) {
      //   ws.close();
      // }
      ws.close();
    };

  },[]);

  return (
    <>
    <div className="reqbox">
      <div className="req-status">
      { !reqStatus && ( <p className='msg-closed'><span>Requests are CLOSED</span></p> )}
      { (reqStatus && queue.length === 0) && ( <p className='msg-available'><span>🔽 Requests OPEN! See commands below 🔽</span></p> )}
      </div>
      <div className="labels">
        <p className="main-label">Requests<br />Queue</p>
        <p className="arrows">&gt;&gt;&gt;</p>
      </div>
      <div className="queue-box">
        <AnimatePresence initial={false}>
            {queue.map((song) => (
              <motion.div
                key={song.idx}
                initial={{ x: 100, opacity: 0, skewX: -15 }}
                animate={{ x: 0, opacity: 1, skewX: -15 }}
                exit={{ x: -100, opacity: 0, skewX: -15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                layout
                className={`song-item` + (song.nowPlaying ? ' now-playing' : '')}
              >
                <div className="contents">
                  <img className='avatar' src={song.avatar} width={43} height={43} />
                  <div className="song-info">
                    <p className="title">{ song.title.length <= 15 ? song.title : song.title.substr(0,15).trim() + "..." }</p>
                    <p className="artist">/ { song.artist.length <= 23 ? song.artist : song.artist.substr(0,23).trim() + "..." }</p>
                  </div>
                </div>

                
              </motion.div>
            ))}
          </AnimatePresence>
      </div>
    </div>
    { /* <button onClick={() => testAddSong()}>Test Add Song</button>
    <button onClick={() => removeFirstSong()}>Test Remove Song</button>
    <button onClick={() => nowPlaying()}>Test Now Playing</button> */ }
    </>
    // <div className='main-box'>
    //     <div className="req-status">
    //     { !reqStatus && ( <p className='msg-closed'><span>Requests are CLOSED</span></p> )}
    //     { (reqStatus && queue.length === 0) && ( <p className='msg-available'><span>🔽 Requests OPEN! See commands below 🔽</span></p> )}
    //     </div>
    //     <ul className="queue">
    //         <AnimatePresence>
    //             {queue.map((song, index) => (
    //                 <motion.li
    //                     key={index}
    //                     initial={ {opacity: 0, x: 100} }
    //                     animate={ {opacity: 1, x: 0} }
    //                     exit={ {opacity: 0, x: -100} }
    //                     transition={ {duration: 0.3}}
    //                     className='song-item'
    //                     ><b>{ song.title.length <= 15 ? song.title : song.title.substr(0,15).trim() + "..." }</b><br />
    //                     / { song.artist.length <= 23 ? song.artist : song.artist.substr(0,23).trim() + "..." }<br />
    //                     <small>{song.user}</small>
    //                 </motion.li>
    //             ))}
    //         </AnimatePresence>
    //     </ul>

    //     <div className="testbuttons">
    //         <button onClick={() => testAddSong()}>Test Add Song</button>
    //         <button onClick={() => removeFirstSong()}>Test Remove Song</button>
    //     </div> 
    // </div>
  )
}

export default App
