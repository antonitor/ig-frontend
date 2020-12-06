import Axios from "axios";
import React, { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";

export const LikesContext = createContext(null);

const LikesContextProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [likesGiven, setLikesGiven] = useState([]);
  const [likesReceived, setLikesReceived] = useState([]);

  const likesReloader = () => {
    if (user) {
      const loadLikesGiven = async () => {
        const response = await Axios.get(
          `http://localhost:1337/likes/given?user=${user.user.id}`,
          { headers: { Authorization: `bearer ${user.jwt}` } }
        );
        setLikesGiven(response.data);
      };
      loadLikesGiven();

      const loadLikesReceived = async () => {
        const response = await Axios.get(
          `http://localhost:1337/likes/received?post.author=${user.user.id}`,
          { headers: { Authorization: `bearer ${user.jwt}` } }
        );
        setLikesReceived(response.data);
      };
      loadLikesReceived();
    }
  };

  useEffect(() => {
    likesReloader();
  }, [user]); //eslint-disable-line

  return (
    <LikesContext.Provider value={{ likesGiven, likesReceived, likesReloader }}>
      {children}
    </LikesContext.Provider>
  );
};

export default LikesContextProvider;
