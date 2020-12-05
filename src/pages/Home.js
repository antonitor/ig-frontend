import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "../components/Posts";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchiPost = async () => {
      const response = await axios.get("http://localhost:1337/posts");
      setPosts(response.data);
    };
    fetchiPost();
  }, []);

  return (
    <div className="App">
      {posts.map((p) => (
        <Link key={p.id} to={`/${p.id}`}>
          <Post post={p} />
        </Link>
      ))}
    </div>
  );
};

export default Home;
