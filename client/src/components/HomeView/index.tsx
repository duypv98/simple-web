import { Button } from 'antd';
import { PropsWithoutRef } from "react";
import './style.css';

const HomeView = (props: PropsWithoutRef<{ user: { userName: string, userId: string }; logoutCallback: () => void }>) => {
  const logout = () => {
    fetch(`${process.env.REACT_APP_ENDPOINT}/auth/logout`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include'
    })
    props.logoutCallback();
  }

  const { user: { userId, userName } } = props;
  return (
    <div id="main-home-view" className="container">
      <div className="content">
        <div className="user-info">
          <div>ID: {userId}</div>
          <div>Name: {userName}</div>
        </div>
        <div>
          <Button type="primary" onClick={() => {
            logout();
          }}>Logout</Button>
        </div>
      </div>
    </div>
  )
}

export default HomeView;