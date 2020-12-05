import React, { useContext, useState } from "react";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Create = () => {
  const { user } = useContext(UserContext);
  const [error, setError] = useState("");
  const history = useHistory();
  const API_URL = "http://localhost:1337";
  return (
    <div className="Create">
      {error && <p style={{ color: "red" }}>error</p>}
      <h2>Create post</h2>
      <Formik
        initialValues={{
          description: "",
          image: null,
        }}
        validationSchema={Yup.object({
          description: Yup.string().required("You must add a description"),
          image: Yup.mixed().required(),
        })}
        onSubmit={async (values) => {
          if (!user) {
            console.log("NOT LOGGED IN");
            return;
          }
          const formData = new FormData();
          formData.append(
            "data",
            JSON.stringify({ description: values.description, likes: 0 })
          );
          formData.append("files.image", values.image);
          try {
            const response = await axios.post(`${API_URL}/posts`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `bearer ${user.jwt}`,
              },
            });
            console.log("CREATED: ", response.data);
            history.push("/");
          } catch (error) {
            console.log(error.response.data.message);
            setError(error);
          }
        }}
      >
        {({
          values,
          handleChange,
          errors,
          touched,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <input
              placeholder="description"
              name="description"
              type="text"
              value={values.description}
              onChange={handleChange}
            />
            {errors.description && touched.description ? (
              <div className="inputError">{errors.description}</div>
            ) : null}
            <input
              placeholder="add an image"
              name="image"
              type="file"
              onChange={(event) => {
                setFieldValue("image", event.currentTarget.files[0]);
              }}
            />
            {errors.imgae && touched.imgae ? (
              <div className="inputError">{errors.imgae}</div>
            ) : null}
            <button type="submit">Create</button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Create;
