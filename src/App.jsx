import { useState, useEffect, useRef, useMemo, useCallback } from "react";

import "./App.css";

import Photo from "./components/Photo";

const clientID = `?client_id=${process.env.REACT_APP_KEY}`;
const baseUrl = "https://api.unsplash.com/photos/";
const searchUrl = "https://api.unsplash.com/search/photos/";

function App() {
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const allImageIdsRef = useRef([]);
  const lastImageRef = useCallback(
    (node, sub) => {
      if (!loading && node) {
        setPage((page) => page + 1);
        sub.disconnect();
      }
    },
    [loading]
  );

  const fetchPhotos = useCallback(
    async function () {
      let url;

      url = `${baseUrl}${clientID}&page=${page}`;

      try {
        setLoading(true);

        const res = await fetch(url);
        const data = await res.json();

        setPhotos((prevState) => {
          return [...new Set([...prevState, ...data])];
        });
      } catch (error) {
        console.error("Something went wrong!");
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [page]
  );

  useEffect(() => {
    fetchPhotos();
  }, [page, fetchPhotos]);

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Submit");
  }

  allImageIdsRef.current = useMemo(() => {
    return [...new Set(photos.map((photo) => photo.id))];
  }, [photos]);

  const newPhotos = useMemo(() => {
    return photos.filter((photo) => {
      if (allImageIdsRef.current.includes(photo.id)) {
        allImageIdsRef.current = allImageIdsRef.current.filter(
          (item) => item !== photo.id
        );
        return true;
      }
      return false;
    });
  }, [photos]);

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="text" />
        <button type="submit">Search</button>
      </form>
      <hr />
      <div className="photos">
        {newPhotos.map((photo, index) => {
          if (newPhotos.length - 1 === index) {
            return <Photo ref={lastImageRef} key={photo.id} {...photo} />;
          }
          return <Photo key={photo.id} {...photo} />;
        })}
      </div>

      {loading && <h3>Loading...</h3>}
    </div>
  );
}

export default App;
