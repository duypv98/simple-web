import { message } from 'antd';
import { AES } from 'crypto-js';
import { PropsWithoutRef, useRef } from 'react';
import './style.css';
import { Link } from 'react-router-dom';

const LoginForm = (props: PropsWithoutRef<{ callback: (err: number, user: any) => void }>) => {
  const { callback } = props;
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const login = () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    if (!email || !password) return;
    fetch(`${process.env.REACT_APP_ENDPOINT}/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password: AES.encrypt(password, process.env.REACT_APP_ENCODE_PWD_KEY!).toString()
      }),
      headers: { "Content-Type": "application/json" },
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((rspBody) => {
        callback(!rspBody.success ? rspBody.data : null, rspBody.data);
      })
      .catch((e) => {
        console.error((e));
        message.error("Error");
      })
  }

  return (
    <div id="main-signin">
      <main className="form-signin">
        <form onSubmit={(e) => {
          e.preventDefault();
          login();
        }}>
          <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

          <div className="form-floating">
            <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" ref={emailRef} required />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input type="password" className="form-control" id="floatingPassword" placeholder="Password" ref={passwordRef} required />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="mb-3 mt-3">
            <Link to="/register">
              Register
            </Link>
          </div>

          <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
          <p className="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
        </form>
      </main>
    </div>
  )
}

export default LoginForm;
