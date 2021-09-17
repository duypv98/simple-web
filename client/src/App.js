import { LoadingOutlined } from '@ant-design/icons';
import { message, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import HomeView from './components/HomeView';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {

  /**
   * @type {[{user_id: number; user_name: string}, import('react').Dispatch<import('react').SetStateAction<{ user_id: number; user_name: string }>>]}
   */
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://api.local-ijd.test/users/me', {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((rspBody) => {
        if (rspBody.success) {
          setUser(rspBody.data);
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      })
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/register">
          <RegisterForm user={user} callback={(err) => {
            if (err) {
              message.error("Error", err);
            }
            message.info("Success, login now");
          }} />
        </Route>
        <Route path="/">
          <Spin spinning={isLoading} indicator={<LoadingOutlined />}>
            {isLoading
              ? <></>
              : <>
                {user
                  ? <HomeView user={user} logoutCallback={() => setUser(null)} />
                  : <LoginForm callback={(err, user) => {
                    if (!err) {
                      setUser(user);
                    } else {
                      message.error("Error");
                    }
                  }} />
                }
              </>
            }
          </Spin>
        </Route>
      </Switch>

    </Router>
  );
}

export default App;
