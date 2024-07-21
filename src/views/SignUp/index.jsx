import React, { useState } from "react";
import { auth, db } from "../../firebase";
import { useHistory, Link } from "react-router-dom";
import { Form, Input, Button, Divider } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "./styles.scss";

export default function SignUp() {
  const history = useHistory();
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    password: "",
    error: null,
  });

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { fullName, email, password } = userDetails;

    return auth
      .doCreateUserWithEmailAndPassword(email, password, fullName)
      .then((authUser) => {
        db.doCreateUser(authUser.user.uid, fullName, email);
        history.push("/boards");
      })
      .catch((error) =>
        setUserDetails((prevState) => ({ ...prevState, error: error.message }))
      );
  };

  const handleOnChange = (event) => {
    event.preventDefault();
    setUserDetails((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user details in your database
      await db.doCreateUser(user.uid, user.displayName, user.email);

      // Redirect to boards page
      history.push("/boards");
    } catch (error) {
      setUserDetails((prevState) => ({ ...prevState, error: error.message }));
    }
  };

  return (
    <div className="sign-up-container">
      <Form>
        <h1>Sign up</h1>

        <Form.Item
          name="fullName"
          rules={[{ required: true, message: "Please input your full name!" }]}
        >
          <Input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            onChange={handleOnChange}
            prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email address!" }]}
        >
          <Input
            type="text"
            name="email"
            placeholder="Enter your email address"
            onChange={handleOnChange}
            prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            name="password"
            type="password"
            placeholder="Enter a password"
            onChange={handleOnChange}
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm your password!" }]}
        >
          <Input.Password
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            onChange={handleOnChange}
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" block onClick={handleOnSubmit}>
            Sign up
          </Button>
        </Form.Item>
        <Form.Item>
          <Divider>Or</Divider>
          <Button
            type="default"
            block
            onClick={handleGoogleSignUp}
            icon={<GoogleOutlined />}
          >
            Sign up with Google
          </Button>
        </Form.Item>
        {userDetails.error && (
          <div style={{ color: "red", fontSize: "0.75rem" }}>
            {userDetails.error}
          </div>
        )}
        <Form.Item style={{ textAlign: "center" }}>
          Already have an account? <Link to="/sign-in">Sign in</Link>
        </Form.Item>
      </Form>
    </div>
  );
}
