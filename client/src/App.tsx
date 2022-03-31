import { LoadingOutlined } from '@ant-design/icons';
import { message, Spin } from 'antd';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import HomeView from './components/HomeView';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { useAppDispatch, useAppSelector } from "./hooks";
import { fetchMe, logoutAction, setUserAction } from "./redux/slices/user.slice";

function App() {
  // const [user, setUser] = useState<{
  //   userId: string;
  //   userName: string
  // } | null>(null);
  // const [isLoading, setLoading] = useState(true);
  const { user, userLoading: isLoading } = useAppSelector((state) => state.userState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMe());
    // fetchInterceptors({ url: '/users/me', baseUrl: process.env.REACT_APP_ENDPOINT! })
    //   .then((rspBody) => {
    //     if (rspBody.success) {
    //       setUser(rspBody.data);
    //     }
    //   })
    //   .catch((e) => {
    //     console.error(e);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   })
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
                    ? <HomeView user={user} logoutCallback={() => dispatch(logoutAction())} />
                    : <LoginForm callback={(err, user) => {
                      if (!err) {
                        dispatch(setUserAction(user));
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
