import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import MovieDetailPage from "./components/MovieDetailPage";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("Batman"); //default movie search "Batman"

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?s=${searchQuery}&apikey=fd9aab08`
        );
        const data = await response.json();
        if (data.Search) {
          setMovies(data.Search);
        }
      } catch (error) {
        console.log("Error fetching movie data", error);
      }
    }
    fetchMovies();
  }, [searchQuery]);

  return (
    <Router>
      <div className="App">
        <h1>Movie Review App</h1>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
                <MovieList movies={movies} />
              </>
            }
          />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
