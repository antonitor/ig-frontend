import Axios from "axios";
import { Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import * as Yup from "yup";
import Post from "../components/Posts";
import { UserContext } from "../context/UserContext";
import { LikesContext } from "../context/LikesContext";

const SinglePost = () => {
  const { user } = useContext(UserContext);
  const { likesGiven, likesReloader } = useContext(LikesContext);
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const params = useParams();
  const history = useHistory();
  const POST_URL = `http://localhost:1337/posts/${params.id}`;

  const isPostAlreadyLiked = (() => {
    console.log(likesGiven);
    return (
      likesGiven &&
      likesGiven.find((like) => like.post && like.post.id == params.id) //eslint-disable-line
    );
  })();

  console.log("IS POST ALREADY LIKED, ", isPostAlreadyLiked);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await Axios.get(POST_URL);
        setPost(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (!edit) {
      fetchPost();
      likesReloader();
    }
  }, [edit]); //eslint-disable-line

  const handleDelete = async () => {
    //SHOULD DELETE LIKES RECEIVED ASWELL IN CONTROLLER
    try {
      if (!user) {
        console.log("NOT LOGGED IN");
        return;
      }
      await Axios.delete(POST_URL, {
        headers: { Authorization: `bearer ${user.jwt}` },
      });
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    try {
      await Axios.post(
        "http://localhost:1337/likes",
        {
          post: parseInt(params.id),
        },
        {
          headers: { Authorization: `bearer ${user.jwt}` },
        }
      );
    } catch (error) {
      console.log("ERROR LIKE, ", error.response.data.message);
    } finally {
      setEdit(true);
      setEdit(false); //REFRESSH XDDD
    }
  };

  const handleRemoveLike = async () => {
    try {
      await Axios.delete(`http://localhost:1337/likes/${params.id}`, {
        headers: { Authorization: `bearer ${user.jwt}` },
      });
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
                  {!isPostAlreadyLiked && (
                    <button onClick={handleLike}>Like</button>
                  )}
                  {isPostAlreadyLiked && (
                    <button onClick={handleRemoveLike}>Remove Like</button>
                  )}
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
