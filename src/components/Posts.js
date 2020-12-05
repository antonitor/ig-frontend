import React from "react";

const API_URL = "http://localhost:1337";

const imageFullUrl = (url) => `${API_URL}${url}`;

const Post = ({ post }) => {
  const url = post.image && post.image.url;
  const description = post.description;
  const likes = post.likes;
  return (
    <div className="Post">
      <img className="Post__Image" src={imageFullUrl(url)} alt="Post" />
      <p>{description}</p>
      <div>
        <span>Likes: {likes}</span>
      </div>
    </div>
  );
};

export default Post;
