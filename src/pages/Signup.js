import Axios from "axios";
import { Formik } from "formik";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { UserContext } from "../context/UserContext";

const Signup = (props) => {
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user]); //eslint-disable-line
  const API_URL = "http://localhost:1337/auth/local/register";
  return (
    <div>
      <h2>Signup</h2>
      <Formik
        initialValues={{ email: "", password: "", passwordConfirmation: "" }}
        validationSchema={Yup.object({
          email: Yup.string().email().required("Email required"),
          password: Yup.string()
            .required("Enter a password")
            .min(6, "Password must have at least 6 chars"),
          passwordConfirmation: Yup.string().oneOf(
            [Yup.ref("password"), null],
            "Passwords must match"
          ),
        })}
        onSubmit={async (values) => {
          try {
            const response = await Axios.post(API_URL, {
              username: values.email,
              email: values.email,
              password: values.password,
            });
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
            <input
              name="passwordConfirmation"
              type="password"
              value={values.passwordConfirmation}
              onChange={handleChange}
            />
            {errors.passwordConfirmation && touched.passwordConfirmation ? (
              <div className="inputError">{errors.passwordConfirmation}</div>
            ) : null}
            <button type="submit">Signup</button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;
