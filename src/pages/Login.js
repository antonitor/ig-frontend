import Axios from "axios";
import { Formik } from "formik";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { UserContext } from "../context/UserContext";

const Login = (props) => {
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user]); //eslint-disable-line
  const API_URL = "http://localhost:1337/auth/local";
  return (
    <div>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string().email().required("Email required"),
          password: Yup.string()
            .required("Enter a password")
            .min(6, "Password must have at least 6 chars"),
        })}
        onSubmit={async (values) => {
          try {
            const response = await Axios.post(API_URL, {
              identifier: values.email,
              password: values.password,
            });
            console.log(response.data);
            setUser(response.data);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {({ values, handleChange, errors, touched, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && touched.email ? (
              <div className="inputError">{errors.email}</div>
            ) : null}
            <input
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
            />
            {errors.password && touched.password ? (
              <div className="inputError">{errors.password}</div>
            ) : null}
            <button type="submit">Login</button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
