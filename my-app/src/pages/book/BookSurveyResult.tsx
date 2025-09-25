import React, { useEffect, useState } from "react";
import './bookSurveyResult.css';
import { Link, useLocation } from "react-router-dom";

interface Book {
  id: number;
  title: string;
  description: string;
  subTitle: string;
  price: string;
  imageUrl: string;
  starred: boolean;
}

const dummyBooks: Book[] = [
  { id: 1, title: '내신전략', description: '내신전략 고등 수학 (2024)', subTitle: '고1, 고2, 고3', price: '15,000', imageUrl: '/images/math1.png', starred: false },
  { id: 2, title: '마플시너지', description: '마플시너지 고등 수학Ⅰ (2025)', subTitle: '고1, 고2, 고3', price: '19,800', imageUrl: '/images/math2.png', starred: false },
  { id: 3, title: '수능특강 필수유형', description: '수능특강 필수유형 고등 수학 (2025)', subTitle: '고1, 고2, 고3', price: '15,000', imageUrl: '/images/math3.png', starred: false },
  { id: 4, title: '수능특강', description: 'EBS 수능특강 수학 (2025)', subTitle: '고1, 고2, 고3', price: '19,800', imageUrl: '/images/math4.png', starred: false }
];

const BookSurveyResultPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const location = useLocation();
  const { recommendations = [] } = location.state || {}; // 📌 BookSurvey2.tsx에서 넘긴 값
  const [books, setBooks] = useState<Book[]>([]);
  
    useEffect(() => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          console.log("🧾 parsed.user.name 확인:", parsed.user?.name);
          setUsername(parsed.user?.name || ""); // ✅ 핵심 수정
        } catch (error) {
          console.error("❌ localStorage 파싱 실패:", error);
        }
      }

      setBooks(dummyBooks);
    }, []);

  useEffect(() => {
    if (recommendations.length > 0) {
      const mapped = recommendations.map((rec: any) => ({
        id: rec.book.id,
        title: rec.book.title,
        description: rec.book.description || '',
        subTitle: rec.book.subTitle || '',
        price: rec.book.price || '0',
        imageUrl: rec.book.imageUrl || 'https://via.placeholder.com/150',
        starred: rec.isFavorite || false
      }));
      setBooks(mapped);
    }
  }, [recommendations]);

  const toggleStar = (bookId: number) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === bookId ? { ...book, starred: !book.starred } : book
      )
    );
  };

  const sortedBooks = [...books].sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0));

  return (
    <>
      <header>
        <nav>
          <h2>
            <Link to="/main">Edu<br />Compass</Link>
          </h2>
          <ul>
            <li><Link to="/calendar">계획 캘린더</Link></li>
            <li><Link to="/planStart">AI 계획 생성</Link></li>
            <li><Link to="/status">학습 현황</Link></li>
            <li><Link to="/bookSurveyMain" className="active">교재 추천</Link></li>
            <li><Link to="/mypage">마이페이지</Link></li>
          </ul>
          <div className="log">
            <div className="login"><Link to="/login">{username ? `${username}님` : "로그인"}</Link></div>
            <div className="join"><Link to="/">logout</Link></div>
          </div>
        </nav>
      </header>

      <div className="sidebar">
        <div className="sidebar-title">교재 추천</div>
        <ul className="sidebar-menu">
          <li><Link to="/textbook">교재 추천 받기</Link></li>
          <li className="active"><Link to="/bookSurveyResult">교재 추천 목록</Link></li>
          <hr />
        </ul>
      </div>

      <div className="bookresult-main_container_center">
        <h2 className="category-title">교재 추천 결과 &gt;</h2>
        <div className="book-grid">
          {sortedBooks.map(book => (
            <div className="book-card" key={book.id}>
              <div className={`star ${book.starred ? 'active' : ''}`} onClick={() => toggleStar(book.id)}>
                {book.starred ? '★' : '☆'}
              </div>
              <img src={book.imageUrl} alt={book.title} className="book-image-horizontal" />
              <div className="book-info">
                <h3>{book.title}</h3>
                <p>{book.subTitle}</p>
                <p>{book.price}원</p>
              </div>
              <button className="info-button">정보 보기 🔍</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BookSurveyResultPage;
