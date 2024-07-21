import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Form, Input, Button, Divider } from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import "./styles.scss";

export default function SignIn() {
  const history = useHistory();
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
    error: null,
  });

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = userDetails;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      history.push("/boards");
    } catch (error) {
      setUserDetails((prevState) => ({ ...prevState, error: error.message }));
    }
  };

  const handleOnChange = (event) => {
    setUserDetails((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(); // Ensure this is the same `auth` instance used elsewhere

    try {
      await signInWithPopup(auth, provider);
      history.push("/boards");
    } catch (error) {
      setUserDetails((prevState) => ({ ...prevState, error: error.message }));
    }
  };

  return (
    <div className="sign-in-container">
      <Form>
        <h1>Sign in</h1>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email address!" }]}
        >
          <Input
            type="email"
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
            placeholder="Enter your password"
            onChange={handleOnChange}
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block onClick={handleOnSubmit}>
            Sign in
          </Button>
          <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>
        </Form.Item>
        <Form.Item>
          <Divider>Or</Divider>
          <Button
            type="default"
            block
            onClick={handleGoogleSignIn}
            icon={<GoogleOutlined />}
          >
            Sign in with Google
          </Button>
        </Form.Item>
        {userDetails.error && (
          <div style={{ color: "red", fontSize: "0.75rem" }}>
            {userDetails.error}
          </div>
        )}
        <Form.Item style={{ textAlign: "center" }}>
          <div>
            Don't have an account? <Link to="/sign-up">Sign up</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
