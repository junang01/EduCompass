const navigate = useNavigate(); // React Router의 경우

const handleLogout = async () => {
  localStorage.removeItem('token');
  await client.clearStore();
  navigate('/login'); // 로그인 페이지로 리디렉션
};
