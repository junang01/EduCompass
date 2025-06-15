import React, { useEffect, useState } from "react";
import "../css/joinstyle.css";
import { Link, useNavigate } from "react-router-dom";
import { openSchoolSearchModal } from "../ts/schoolSearch";
import { joinValidation, validateJoinForm } from "../ts/joinValidation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { gql, useMutation, useLazyQuery } from "@apollo/client";

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(createUserInput: $input) {
      id
      name
    }
  }
`;

const SEND_AUTH_EMAIL = gql`
  mutation SendAuthEmail($email: String!) {
    sendAuthEmail(email: $email)
  }
`;

const CHECK_TOKEN = gql`
  mutation CheckToken($inputToken: String!, $email: String!) {
    checkToken(inputToken: $inputToken, email: $email)
  }
`;

const CHECK_EMAIL_DUPLICATE = gql`
  query CheckEmailDuplicate($email: String!) {
    checkEmailDuplicate(email: $email)
  }
`;


const JoinPage = () => {
  const navigate = useNavigate();
  const [createUser] = useMutation(CREATE_USER);
  const [sendAuthEmail] = useMutation(SEND_AUTH_EMAIL);
  const [checkToken] = useMutation(CHECK_TOKEN);
  const [checkEmail] = useLazyQuery(CHECK_EMAIL_DUPLICATE);


  const [emailToken, setEmailToken] = useState("");
  const [pemailToken, setPemailToken] = useState("");

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPEmailVerified, setIsPEmailVerified] = useState(false);

  useEffect(() => {
    joinValidation();
  }, []);

  const handleSendEmail = async (target: "user" | "parent") => {
    const emailInput = document.getElementById(target === "user" ? "umail" : "pemail") as HTMLInputElement;
    const email = emailInput.value;
    if (!email) return alert("이메일을 입력해주세요.");
    try {
      await sendAuthEmail({ variables: { email } });
      alert(`${target === "user" ? "회원" : "부모님"} 이메일로 인증번호가 발송되었습니다.`);
    } catch {
      alert("이메일 발송에 실패했습니다.");
    }
  };

  const handleVerifyToken = async (target: "user" | "parent") => {    const email = (document.getElementById(target === "user" ? "umail" : "pemail") as HTMLInputElement).value;
    const token = target === "user" ? emailToken : pemailToken;

    if (!email || !token) return alert("이메일과 인증번호를 입력해주세요.");
    try {
      const { data } = await checkToken({ variables: { inputToken: token, email } });
      if (data?.checkToken.includes("완료")) {
        alert(`${target === "user" ? "회원" : "부모님"} 이메일 인증 완료`);
        target === "user" ? setIsEmailVerified(true) : setIsPEmailVerified(true);
      } else {
        alert("인증 실패: " + data?.checkToken);
      }
    } catch {
      alert("인증 확인 중 오류 발생");
    }
  };

  const handleCheckEmailDuplicate = async () => {
    const email = (document.getElementById("umail") as HTMLInputElement).value;
    if (!email) return alert("이메일을 입력해주세요.");
  
    try {
      const { data } = await checkEmail({ variables: { email } });
      if (data?.checkEmailDuplicate) {
        alert("이미 사용 중인 이메일입니다.");
      } else {
        alert("사용 가능한 이메일입니다!");
      }
    } catch (error) {
      alert("이메일 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async () => {
    const isValid = validateJoinForm();
    const pemail = (document.getElementById("pemail") as HTMLInputElement).value.trim();

    if (!isValid) return;
    if (!isEmailVerified) {
      alert("회원 이메일 인증을 완료해주세요.");
      return;
    }
    if (pemail && !isPEmailVerified) {
      alert("부모님 이메일을 입력하셨다면 인증도 완료해야 합니다.");
      return;
    }

    const userData = {
      name: (document.getElementById("uname") as HTMLInputElement).value,
      email: (document.getElementById("umail") as HTMLInputElement).value,
      password: (document.getElementById("pwd") as HTMLInputElement).value,
      school: (document.getElementById("school") as HTMLInputElement).value,
      grade: (document.getElementById("grade") as HTMLSelectElement).value,
      line: (document.getElementById("line") as HTMLSelectElement).value,
      receiverEmail: pemail || null,
    };

    try {
      const { data } = await createUser({ variables: { input: userData } });
      if (data?.createUser) {
        // 회원가입 성공 시 사용자 정보를 localStorage에 저장
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/joinComplete");
      }
    } catch (error) {
      alert("회원가입 실패: 다시 시도해주세요.");
    }
  };

  return (
    <>
      <div className="container">
        <div className="join_container">
          <div className="join_left">
            <Link to="/"><img src="../img/compass.png" alt="" /></Link>
            <h1>Edu Compass</h1>
            <h4 className="joinEx">회원가입하고 Edu Compass의<br />다양한 기능을 이용해보세요!</h4>
          </div>

          <div className="join_right">
            <form onSubmit={(e) => e.preventDefault()}>
              <h4 id="essentialText" className="text">필수 입력사항</h4>
              <ul>
                <li>
                  <input type="text" id="uname" placeholder="이름" required autoFocus />
                  <small className="error-message"></small>
                </li>
                <li>
                  <div className="emailBox">
                    <input type="email" id="umail" placeholder="이메일" required />
                    <button type="button" className="emailCheck" onClick={() => handleSendEmail("user")}>인증하기</button>
                  </div>
                  <small className="error-message"></small>
                  <input
                    type="text" placeholder="인증번호 입력" value={emailToken}
                    onChange={(e) => setEmailToken(e.target.value)}
                    style={{ width: "200px", borderRadius: "7px", padding: "5px", marginBottom: "10px", border: "2px solid #9a9a9a" }}
                  />
                  <button type="button" onClick={() => handleVerifyToken("user")}
                    style={{ marginLeft: "10px", padding: "6px 15px", backgroundColor: "lightgray", borderRadius: "5px" }}>
                    확인
                  </button>
                </li>
                <li><input type="password" id="pwd" placeholder="비밀번호" required /><small className="error-message"></small></li>
                <li><input type="password" id="pwdcheck" placeholder="비밀번호 확인" required /><small className="error-message"></small></li>
                <li>
                  <div className="schoolBox">
                    <input type="search" id="school" placeholder="학교" required readOnly />
                    <button type="button" id="openSchoolModal" onClick={openSchoolSearchModal}>
                      <FontAwesomeIcon icon={faSearch} size="lg" />
                    </button>
                  </div>
                  <small className="error-message"></small>
                </li>
                <li>
                  <div className="selectBox">
                    <div className="select-item">
                      <select id="grade" defaultValue="0">
                        <option value="0" disabled>학년</option>
                        <option value="1">1학년</option>
                        <option value="2">2학년</option>
                        <option value="3">3학년</option>
                      </select>
                      <small className="error-message-gl" id="grade-error"></small>
                    </div>
                    <div className="select-item">
                      <select id="line" defaultValue="0">
                        <option value="0" disabled>계열</option>
                        <option value="liberal">문과</option>
                        <option value="science">이과</option>
                      </select>
                      <small className="error-message-gl" id="line-error"></small>
                    </div>
                  </div>
                </li>
              </ul>

              <h4 id="choiceText" className="text">선택 입력사항</h4>
              <ul className="choice">
                <li>
                  <div className="pemailBox">
                    <input type="email" id="pemail" placeholder="부모님 이메일" />
                    <button type="button" className="pemailCheck" onClick={() => handleSendEmail("parent")}>인증하기</button>
                  </div>
                  <input
                    type="text" placeholder="인증번호 입력" value={pemailToken}
                    onChange={(e) => setPemailToken(e.target.value)}
                    style={{ width: "200px", borderRadius: "7px", padding: "5px", marginTop: "5px", border: "2px solid #9a9a9a" }}
                  />
                  <button type="button" onClick={() => handleVerifyToken("parent")}
                    style={{ marginLeft: "10px", padding: "6px 15px", backgroundColor: "lightgray", borderRadius: "5px" }}>
                    확인
                  </button>
                </li>
              </ul>

              <div className="submitbox">
                <button type="button" id="submitButton" onClick={handleSubmit}>회원가입</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="overlay" id="overlay"></div>
      <div className="modal" id="modal">
        <div className="modal-header">
          <h2>학교 검색</h2>
          <span className="close" id="closeModal">&times;</span>
        </div>
        <div className="modal-body">
          <input type="text" id="schoolSearch" placeholder="학교 이름 입력" />
          <button id="search">검색</button>
          <div id="results"></div>
        </div>
      </div>
    </>
  );
};

export default JoinPage;
