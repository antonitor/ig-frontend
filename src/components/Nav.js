import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Nav = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="Nav">
      <NavLink to="/" exact>
        Home
      </NavLink>
      {user && <NavLink to="/create"> Create </NavLink>}
      {!user && (
        <>
          <NavLink to="/login"> Login </NavLink>
          <NavLink to="/signup"> Signup </NavLink>
        </>
      )}
    </div>
  );
};

export default Nav;
