import Axios from "axios";
import { Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import * as Yup from "yup";
import Post from "../components/Posts";
import { UserContext } from "../context/UserContext";

const SinglePost = () => {
  const { user } = useContext(UserContext);
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const params = useParams();
  const history = useHistory();
  const POST_URL = `http://localhost:1337/posts/${params.id}`;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await Axios.get(POST_URL);
        console.log("USE EFFECT", response.data);
        setPost(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (!edit) {
      fetchPost();
    }
  }, [edit]);

  const handleDelete = async () => {
    try {
      if (!user) {
        console.log("NOT LOGGED IN");
        return;
      }
      const response = await Axios.delete(POST_URL, {
        headers: { Authorization: `bearer ${user.jwt}` },
      });
      console.log(response.data);
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await Axios.post(
        "http://localhost:1337/likes",
        {
          post: parseInt(params.id),
        },
        {
          headers: { Authorization: `bearer ${user.jwt}` },
        }
      );
      console.log("LIKE RESPONSE: ", response);
    } catch (error) {
      console.log("ERROR LIKE, ", error.response.data.message);
    } finally {
      setEdit(true);
      setEdit(false); //REFRESSH XDDD
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && (
        <>
          {post.id ? (
            <>
              <Post post={post} />
              {user && (
                <>
                  <button onClick={handleLike}>Like</button>
                </>
              )}

              {user && (
                <>
                  <button onClick={handleDelete}>Delete this post</button>
                  <button onClick={() => setEdit(true)}>Edit this post</button>
                  {edit && (
                    <EditForm url={POST_URL} setEdit={setEdit} user={user} />
                  )}
                </>
              )}
            </>
          ) : (
            <p>404 - Not found</p>
          )}
        </>
      )}
    </div>
  );
};

const EditForm = ({ url, setEdit, user }) => {
  return (
    <Formik
      initialValues={{ description: "" }}
      validationSchema={Yup.object({
        description: Yup.string().required("You must add a description"),
      })}
      onSubmit={async (values) => {
        if (!user) {
          console.log("NOT LOGGED IN");
          return;
        }
        try {
          await Axios.put(
            url,
            {
              description: values.description,
            },
            { headers: { Authorization: `bearer ${user.jwt}` } }
          );
          setEdit(false);
        } catch (error) {
          console.log(error);
        }
      }}
    >
      {({ values, handleChange, errors, touched, handleSubmit }) => (
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
          <button type="submit">Update</button>
        </form>
      )}
    </Formik>
  );
};

export default SinglePost;
