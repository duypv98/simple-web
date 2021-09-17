import { message } from 'antd';
import { AES } from 'crypto-js';
import { useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './style.css';

/**
 * 
 * @param {import('react').PropsWithoutRef<{ callback: (err: number) => void; user?: any }>} props 
 */
const RegisterForm = (props) => {
  const { callback } = props;
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const history = useHistory();

  useEffect(() => {
    if (props.user) {
      history.replace('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.user])

  const register = () => {
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (!email || !password || !name) return;
    fetch(`${process.env.REACT_APP_ENDPOINT}/auth/register`, {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password: AES.encrypt(password, process.env.REACT_APP_ENCODE_PWD_KEY).toString()
      }),
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then((rspBody) => {
        if (!rspBody.success) {
          callback(rspBody.data)
        }
        if (rspBody.success) {
          history.push('/');
        }
      })
      .catch((e) => {
        console.error((e));
        message.error("Error");
        return;
      })
  }

  return (
    <div id="main-register">
      <main className="form-signin">
        <form onSubmit={(e) => {
          e.preventDefault();
        }} autoComplete="off">
          <h1 className="h3 mb-3 fw-normal">Register</h1>

          <div className="form-floating">
            <input type="text" name="username" className="form-control" id="floatingInput" placeholder="John Cena" ref={nameRef} required />
            <label htmlFor="floatingInput">User Name</label>
          </div>
          <div className="form-floating">
            <input type="email" name="email" className="form-control" id="floatingInput" placeholder="name@example.com" ref={emailRef} required />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input type="password" name="new-password" className="form-control" id="floatingPassword" placeholder="Password" ref={passwordRef} required autoComplete="new-password"/>
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="mb-3 mt-3">
            <Link to="/">
              Login Now
            </Link>
          </div>

          <button className="w-100 btn btn-lg btn-primary" type="submit" onClick={register}>Register</button>
          <p className="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
        </form>
      </main>
    </div>
  )
}

export default RegisterForm;
