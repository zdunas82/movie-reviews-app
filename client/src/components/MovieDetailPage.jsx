import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ReviewForm from "./RevievForm";
import LikeButton from "./LikeButton";

function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Fetch movie details from the OMDB API
  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?i=${id}&apikey=fd9aab08`
        );
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    }

    fetchMovieDetails();
  }, [id]);

  // Fetch reviews for the movie from local server
  useEffect(() => {
    async function fetchMovieReviews() {
      try {
        const response = await fetch(
          `https://movie-reviews-app-server.onrender.com/movies/${id}/reviews`
        );
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          console.error("Error fetching reviews: ", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching movie reviews:", error);
      }
    }

    fetchMovieReviews();
  }, [id]);

  // Function to handle adding a new review to the list
  const handleAddReview = (newReview) => {
    setReviews((prevReviews) => [...prevReviews, newReview]);
  };

  // Render loading state
  if (!movie) {
    return <p>Loading movie details...</p>;
  }

  // Function to handle like toggle for each review
  const handleLikeToggle = (index) => {
    setReviews((prevReviews) => {
      return prevReviews.map((review, idx) => {
        if (idx === index) {
          return {
            ...review,
            liked: !review.liked,
            likes: review.liked ? review.likes - 1 : review.likes + 1,
          };
        }
        return review;
      });
    });
  };

  // Render movie details and reviews
  return (
    <div className="movie-detail-page">
      <h1>{movie.Title}</h1>
      <img src={movie.Poster} alt={movie.Title} />
      <p>
        <strong>Year:</strong> {movie.Year}
      </p>
      <p>
        <strong>Genre:</strong> {movie.Genre}
      </p>
      <p>
        <strong>Plot:</strong> {movie.Plot}
      </p>
      <div className="reviews-container">
        <h2 className="reviews-header">Reviews</h2>
        {reviews.length > 0 ? (
          <ul className="reviews-list">
            {reviews.map((reviewObj, index) => (
              <li key={reviewObj.id} className="review-item">
                <div className="review-details">
                  <div className="review-avatar">
                    {reviewObj.reviewer
                      ? reviewObj.reviewer.charAt(0).toUpperCase()
                      : "R"}
                  </div>
                  <div className="reviewer-info">
                    <p className="reviewer-name">
                      {reviewObj.reviewer || "Anonymous"}
                    </p>
                    <p className="review-date">
                      {new Date(reviewObj.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="review-content">
                  <p>{reviewObj.review}</p>
                </div>
                <div className="review-actions">
                  <LikeButton
                    secret={`review-${reviewObj.id}`}
                    liked={reviewObj.liked || false}
                    numLikes={reviewObj.likes || 0}
                    onSelect={() => handleLikeToggle(index)}
                  />
                  <a href="#" className="action-link">
                    COMMENT
                  </a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet. Be the first to add one!</p>
        )}
        <ReviewForm movieId={id} onAddReview={handleAddReview} />
      </div>
    </div>
  );
}

export default MovieDetailPage;
