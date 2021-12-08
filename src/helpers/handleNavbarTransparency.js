const windowHeight = window.innerHeight;
//===============================
// 네비게이션 바 투명도 설정
//===============================
export default () => {
  const scrollTop = window.scrollY;
  let alpha = (scrollTop / windowHeight) * 2;
  alpha >= 1 && (alpha = 1);
  document.getElementsByClassName('navbar-theme')[0].style.backgroundColor = `rgba(11, 23, 39, ${alpha})`;
};
