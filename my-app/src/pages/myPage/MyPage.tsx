import React, { useEffect, useState } from "react";
import './myPage.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { gql, useMutation } from "@apollo/client";

const DELETE_USER_MUTATION = gql`
  mutation {
    deleteUser
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: Int!, $updateUserInput: UpdateUserInput!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      id
      name
      school
      grade
    }
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
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const actualUser = parsed.user || parsed; // 하위 호환

        setUsername(actualUser.name || "");
        setUserInfo({
          id: actualUser.id?.toString() || "",
          name: actualUser.name || "",
          email: actualUser.email || "",
          school: actualUser.school || "",
          grade: actualUser.grade || "",
          password: "**********"
        });

        console.log("✅ 불러온 사용자 정보:", actualUser);
      } catch (error) {
        console.error("❌ localStorage 파싱 실패:", error);
      }
    }
  }, []);

  const toggleEdit = () => {
    setIsEditing(true);
    console.log("✏️ 수정 모드 진입");
  };

  const handleSave = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const parsed = JSON.parse(userData);
      const id = parsed.user?.id;

      const { name, school, grade } = userInfo;

      const { data } = await updateUser({
        variables: {
          id: parseInt(id),
          updateUserInput: { name, school, grade },
        },
      });

          const updatedUser = {
            ...parsed,
            name: data.updateUser.name,
            school: data.updateUser.school,
            grade: data.updateUser.grade,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));

          alert("회원정보가 성공적으로 업데이트되었습니다.");
          setIsEditing(false);

          setUserInfo(prev => ({
            ...prev,
            name: data.updateUser.name,
            school: data.updateUser.school,
            grade: data.updateUser.grade,
          }));
    } catch (error) {
      console.error("회원정보 업데이트 실패:", error);
      alert("회원정보 수정 중 문제가 발생했습니다.");
    }
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

  const handleLogout = async () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      console.log("📦 유저 데이터:", JSON.parse(userData));
    } else {
      console.warn("⚠️ localStorage에 'user' 데이터 없음");
    }

    if (!userData) return;

    const { accessToken } = JSON.parse(userData);

    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          query: `
            mutation {
              logout
            }
          `,
        }),
      });

      const result = await response.json();

      if (result?.data?.logout) {
        localStorage.removeItem("user");
        navigate("/");
      } else {
        console.error("❌ 서버 로그아웃 실패", result);
      }
    } catch (error) {
      console.error("❌ 로그아웃 요청 중 오류 발생:", error);
    }
  };

  return (
    <>
      <div className="mypage-wrapper">
      <header>
        <nav>
          <h2>
            <Link to = "/main">
              Edu
              <br />
              Compass
            </Link>
          </h2>
          <ul>
            <li><Link to="/calendar">계획 캘린더</Link></li>
            <li><Link to="/planStart">AI 계획 생성</Link></li>
            <li><Link to="/status">학습 현황</Link></li>
            <li><Link to="/bookSurveyMain">교재 추천</Link></li>
            <li><Link to="/mypage">마이페이지</Link></li>
          </ul>
          <div className="log">
            <div className="login">
              <Link to="/mypage">{username ? `${username}님` : "로그인"}</Link>
            </div>
            <div className="join">
              <button className="logout-btn" onClick={handleLogout}>logout</button>
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
                <button className="menu-item" onClick={() => navigate('/myPage')}>
                  환경설정 <span className="arrow">&gt;</span>
                </button>
              </div>
              <button className="logout" onClick={handleLogout}>로그아웃</button>
            </div>

            <div className="content">
              <div className="info-box">
                <h2 style={{ fontSize: "18px" }}>회원정보</h2>
                <table>
                  <tbody>
                    <tr>
                      <td className="label">아이디</td>
                      <td>
                        <input type="text" value={userInfo.email} readOnly={!isEditing} />
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
                        <input
                          type="text"
                          value={userInfo.name}
                          readOnly={!isEditing}
                          onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="label">학교</td>
                      <td>
                        <input type="text" value={userInfo.school} onChange={e => setUserInfo({...userInfo, school: e.target.value})} disabled={!isEditing} />
                      </td>
                    </tr>
                    <tr>
                      <td className="label">학년</td>
                      <td>
                        <input type="text" value={userInfo.grade} onChange={e => setUserInfo({...userInfo, grade: e.target.value})} disabled={!isEditing} />
                      </td>
                    </tr>
                    <tr className="empty-row">
                      <td colSpan={2}></td>
                    </tr>
                    <tr>
                      <td className="label">부모님 이메일</td>
                      <td>
                        <input type="email" disabled={!isEditing} />
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
                  <button className="edit-btn" onClick={isEditing ? handleSave : toggleEdit}>
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
