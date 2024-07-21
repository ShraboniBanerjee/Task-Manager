import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { Menu, Dropdown, Button, Space, Badge, Tooltip } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined
} from "@ant-design/icons";
import "./styles.scss";

export default function Nav() {
  const menu = (
    <Menu>
      <Menu.Item>
        <Link to="/account">
          <UserOutlined />
          Account
        </Link>
      </Menu.Item>
      <Menu.Item onClick={auth.doSignOut}>
        <LogoutOutlined />
        Sign out
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <nav className="nav">
        <div className="nav__home">
          <Link to="/boards">
            <Button
              size="large"
              icon={
                <HomeOutlined
                  style={{
                    color: "rgba(60, 64, 82, 0.8)",
                    fontSize: "1.25rem",
                  }}
                />
              }
            />
          </Link>
        </div>

        <div className="nav__notification">
          <Tooltip title="Your tasks are in progress. Complete them soon!">
            <Badge count={1} style={{ backgroundColor: "#52c41a" }}>
              <Button
                size="large"
                icon={
                  <BellOutlined
                    style={{
                      color: "rgba(60, 64, 82, 0.8)",
                      fontSize: "1.25rem",
                    }}
                  />
                }
              />
            </Badge>
          </Tooltip>
        </div>
        
        <div className="nav__settings">
          <Space direction="vertical">
            <Space wrap>
              <Dropdown
                overlay={menu}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Button
                  size="large"
                  style={{ paddingTop: "6px" }}
                  icon={
                    <SettingOutlined
                      style={{
                        color: "rgba(60, 64, 82, 0.8)",
                        fontSize: "1.25rem",
                      }}
                    />
                  }
                />
              </Dropdown>
            </Space>
          </Space>
        </div>
     
      </nav>
    </>
  );
}
