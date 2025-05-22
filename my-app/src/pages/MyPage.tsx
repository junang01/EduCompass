import React, { useEffect, useState } from "react";
import '../css/mypagestyle.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { gql, useMutation } from "@apollo/client";

const DELETE_USER_MUTATION = gql`
  mutation {
    deleteUser
  }
`;

const MyPage = () => {
  const [username, setUsername] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    id: "",
    name: "",
    email: "",
    school: "",
    grade: "",
    password: "**********"
  });

  const navigate = useNavigate();
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.name);
      setUserInfo({
        id: user.id?.toString() || "",
        name: user.name || "",
        email: user.email || "",
        school: user.school || "",
        grade: user.grade || "",
        password: "**********"
      });

      console.log(user); // 콘솔에서 school, grade 있는지 확인
    }
  }, []);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const confirmWithdraw = async () => {
    try {
      await deleteUser();
      localStorage.clear();
      alert("회원탈퇴가 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      alert("회원 탈퇴 중 문제가 발생했습니다.");
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="mypage-wrapper">
      <header>
        <nav>
        <h2>
            <Link to="/">
              Edu<br />Compass
            </Link>
          </h2>
          <ul>
            <li><Link to="/calendar">계획 캘린더</Link></li>
            <li><Link to="/planStart">AI 계획 생성</Link></li>
            <li><Link to="/status">학습 현황</Link></li>
            <li><Link to="/books">교재 추천</Link></li>
            <li><Link to="/mypage">마이페이지</Link></li>
          </ul>
          <div className="log">
            <div className="login">
              <Link to="/login">{username ? `${username}님` : "로그인"}</Link>
            </div>
            <div className="join">
              <Link to="/">logout</Link>
            </div>
          </div>
        </nav>
      </header>

        <div className="mypage_container">
          <div className="mypage_container_wrap">
            <div className="mypage-sidebar">
              <div className="menu-item-box">
                <button className="menu-item active">
                  회원정보 <span className="arrow">&gt;</span>
                </button>
                <button className="menu-item" onClick={() => navigate('/option')}>
                  환경설정 <span className="arrow">&gt;</span>
                </button>
              </div>
              <button className="logout">로그아웃</button>
            </div>

            <div className="content">
              <div className="info-box">
                <h2 style={{ fontSize: "18px" }}>회원정보</h2>
                <table>
                  <tbody>
                    <tr>
                      <td className="label">아이디</td>
                      <td>
                        <input type="text" value={userInfo.email} disabled={!isEditing} />
                      </td>
                    </tr>
                    <tr>
                      <td className="label">비밀번호</td>
                      <td>
                        <input type="password" value={userInfo.password} disabled />
                      </td>
                    </tr>
                    <tr>
                      <td className="label">이름</td>
                      <td>
                        <input type="text" value={userInfo.name} disabled={!isEditing} />
                      </td>
                    </tr>
                    <tr>
                      <td className="label">학교</td>
                      <td>
                        <input type="text" value={userInfo.school} disabled={!isEditing} />
                      </td>
                    </tr>
                    <tr>
                      <td className="label">학년</td>
                      <td>
                        <input type="text" value={userInfo.grade} disabled={!isEditing} />
                      </td>
                    </tr>
                    <tr className="empty-row">
                      <td colSpan={2}></td>
                    </tr>
                    <tr>
                      <td className="label">부모님 이메일</td>
                      <td>
                        <input type="email" value={userInfo.email} disabled={!isEditing} />
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "none" }}>
                      <td colSpan={2} style={{ textAlign: "left", paddingTop: 10, borderBottom: "none" }}>
                        <a href="#" className="withdraw-link" onClick={() => setShowModal(true)}>
                          회원탈퇴
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="button-container">
                  <button className="edit-btn" onClick={toggleEdit}>
                    {isEditing ? "저장" : "수정"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div id="withdraw-modal" className="delete-modal" style={{ display: "flex" }}>
            <div className="modal-content">
              <p>정말 탈퇴하시겠습니까?</p>
              <div className="modal-buttons">
                <button onClick={confirmWithdraw}>확인</button>
                <button onClick={() => setShowModal(false)}>취소</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyPage;
