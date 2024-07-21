import { useEffect, useState } from "react";
import { firebase } from "../../firebase/";
import { Input, Form, Button, Avatar, Typography, Space } from "antd";
import { doPasswordUpdate } from "../../firebase/auth";
import { useHistory } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import "./styles.scss";

const { Title, Paragraph } = Typography;

export default function Account() {
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const [error, setError] = useState(null);

  const history = useHistory();

  useEffect(() => {
    firebase.auth.onAuthStateChanged((authUser) => {
      authUser ? setUser(authUser) : setUser(null);
    });
  }, []);

  const handleOnSubmit = (event) => {
    event.preventDefault();

    if (password === passwordTwo) {
      return doPasswordUpdate(password)
        .then(() => {
          setPassword("");
          setPasswordTwo("");
          setError(null);
          alert("Password was changed successfully");
          history.push("/boards");
        })
        .catch((err) => setError(err.message));
    } else {
      setError("Passwords do not match");
    }
  };

  return (
    <div className="account-container">
      <div className="account-details">
        <Space align="center">
          <Avatar size={64} icon={<UserOutlined />} />
          <div>
            <Title level={3}>User Profile</Title>
            <Paragraph>{user && user.email}</Paragraph>
            <Paragraph>Want to reset your password?</Paragraph>
          </div>
        </Space>
      </div>
      <Form className="account-form" onFinish={handleOnSubmit}>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your new password!" }]}
        >
          <Input.Password
            name="password"
            type="password"
            value={password}
            placeholder="Enter a new password"
            onChange={(e) => setPassword(e.target.value)}
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm your new password!" }]}
        >
          <Input.Password
            name="confirmPassword"
            type="password"
            value={passwordTwo}
            placeholder="Confirm new password"
            onChange={(e) => setPasswordTwo(e.target.value)}
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block htmlType="submit">
            Reset your password
          </Button>
        </Form.Item>
        {error && (
          <div className="error-message">{error}</div>
        )}
      </Form>
    </div>
  );
}
