import { useState } from "react";

function ReviewForm({ movieId, onAddReview }) {
  const [reviewText, setReviewText] = useState("");

  // Function to handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    console.log("Submitting review:", reviewText);

    try {
      // Send a POST request to add a new review
      const response = await fetch(
        `http://localhost:8080/movies/${movieId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reviewText,
            movieId,
          }),
        }
      );

      if (response.ok) {
        const newReview = await response.json();
        onAddReview(newReview);
        setReviewText("");
      } else {
        console.error("Failed to add review", response.statusText);
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Write your review here..."
        rows="3"
        required
      />
      <button type="submit">Add Review</button>
    </form>
  );
}

export default ReviewForm;
