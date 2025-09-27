import React, { useState } from "react";
import "../css/loginstyle.css";
import { Link, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        name
        grade
        school
      }
    }
  }
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useMutation(LOGIN_MUTATION);

  const handleLogin = async () => {
    try {
      const { data } = await login({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
  
      localStorage.setItem("user", JSON.stringify({
        accessToken: data.login.accessToken,
        refreshToken: data.login.refreshToken,
        user: data.login.user,
      }));
  
      navigate("/main");
    } catch (error: any) {
      alert("로그인 실패: " + error.message);
      console.error("로그인 오류", error);
    }
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
          <form onSubmit={(e) => e.preventDefault()}>
            <ul>
              <li>
                <label htmlFor="usermail"></label>
                <input
                  type="email"
                  id="usermail"
                  placeholder="이메일"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </li>
              <li>
                <label htmlFor="pwd"></label>
                <input
                  type="password"
                  id="logpwd"
                  placeholder="비밀번호"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </li>
            </ul>
            <input type="checkbox" id="autolog" value="no" />
            <label htmlFor="autolog" className="autolog">
              자동 로그인
            </label>
            <div className="findJoinDiv">
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
