import { FaThumbsUp } from "react-icons/fa";

export default function LikeButton({ secret, liked, numLikes, onSelect }) {
  return (
    <div className="like-button-container">
      <div
        key={secret}
        className={`like-button ${liked ? "liked" : ""}`}
        onClick={onSelect} // invoked when clicked
      >
        <FaThumbsUp />
        <span className="like-text">{liked ? "Liked" : "Like"}</span>
      </div>
      <p className="like-count">
        {numLikes} {numLikes === 1 ? "like" : "likes"}
      </p>
    </div>
  );
}
