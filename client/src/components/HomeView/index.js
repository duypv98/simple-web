import { Button } from 'antd';
import './style.css';

/**
 * 
 * @param {import('react').PropsWithoutRef<{ user: { user_name: string, user_id: number }; logoutCallback: () => void }>} props 
 */
const HomeView = (props) => {
  const logout = () => {
    fetch(`${process.env.REACT_APP_ENDPOINT}/auth/logout`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include'
    })
    props.logoutCallback();
  }

  const { user: { user_id, user_name } } = props;
  return (
    <div id="main-home-view" className="container">
      <div className="content">
        <div className="user-info">
          <div>ID: {user_id}</div>
          <div>Name: {user_name}</div>
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