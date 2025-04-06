import React from "react";
import "../css/loginstyle.css";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/main");
  };

  return (
    <div className="container">
      <div className="log_container">
        {/* 컨테이너 배너 */}
        <div className="log_left">
          <Link to='/'>
            <img src="../img/compass.png" alt="" />
          </Link>
          <h1>Edu Compass</h1>
          <h4>
            로그인하고 나의 계획을
            <br />
            수행해보세요 !
          </h4>
        </div>

        {/* 로그인 입력 폼 */}
        <div className="log_right">
          <form>
            <ul>
              <li>
                <label htmlFor="usermail"></label>
                <input
                  type="email"
                  id="usermail"
                  placeholder="이메일"
                  required
                  autoFocus
                />
              </li>
              <li>
                <label htmlFor="pwd"></label>
                <input
                  type="password"
                  id="logpwd"
                  placeholder="비밀번호"
                  required
                />
              </li>
            </ul>
            <input type="checkbox" id="autolog" value="no" />
            <label htmlFor="autolog" className="autolog">
              자동 로그인
            </label>
            <div className="find">
              <div className="findemail">
                <a href="#">아이디 찾기</a>
              </div>
              <div className="findpw">
                <a href="#">비밀번호 찾기</a>
              </div>
            </div>
            <div className="gojoin">
            <Link to="/join">회원이 아니신가요? 회원가입 하러가기</Link>
            </div>
            <button type="button" className="loginBtn" onClick={handleLogin}>
              로그인하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
