import moment from 'moment';

export const isIterableArray = array => Array.isArray(array) && !!array.length;

//===============================
// Breakpoints
//===============================
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1540
};

//===============================
// Store
// Store 관리 Store를 여기서는 localStorage 라고도 쓰는거 같음.
// getItemFromStore == KEY값 JSON 객체로 만들어 주는 함수 key값이 없으면 기본값으로 설정한다. 필자는 Java의 getter와 비슷한거 같다..
// setItemToStore == payload(화물 == JSX에서 보내준 값)를 key 값과 묶어서 저장한다.
// getStoreSpace == 뭐지 ?????
//    ※parseFloat()==함수는 문자열을 분석해 부동소수점 실수로 반환합니다
//    ※escape()==16진수로 반환합니다.
//    ※encodeURIComponent()==encodeURIComponent() 함수는 URI의 특정한 문자를 UTF-8로 인코딩해서 16진수 반환
//    ※toFixed()==Number 인스턴스의 소수 부분 자릿수를 전달받은 값으로 고정한 후, 그 값을 문자열로 반환합니다.
//===============================
export const getItemFromStore = (key, defaultValue, store = localStorage) =>
  JSON.parse(store.getItem(key)) || defaultValue;
export const setItemToStore = (key, payload, store = localStorage) => store.setItem(key, JSON.stringify(payload));
export const getStoreSpace = (store = localStorage) =>
  parseFloat((escape(encodeURIComponent(JSON.stringify(store))).length / (1024 * 1024)).toFixed(2));

//===============================
// Cookie
// getCookieValue == 쿠키 값 가져오기
// createCookie == 이름 값 쿠키만료시간 입력하고 쿠키 만들기
//===============================
export const getCookieValue = name => {
  const value = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)');
  return value ? value.pop() : null;
};

export const createCookie = (name, value, cookieExpireTime) => {
  const date = new Date();
  date.setTime(date.getTime() + cookieExpireTime);
  const expires = '; expires=' + date.toUTCString();
  document.cookie = name + '=' + value + expires + '; path=/';
};

//===============================
// Moment(날짜 객체 관련)
// getDuration == 기간 가져오기 함수 (Moment 객체 (날짜 객체)가 아니면 애러)
//             == // (December 8, 2021 - December 29, 2021) ==>> 이런 포맷으로 만들어줌
//===============================
export const getDuration = (startDate, endDate) => {
  if (!moment.isMoment(startDate)) throw new Error(`Start date must be a moment object, received ${typeof startDate}`);
  if (endDate && !moment.isMoment(endDate))
    throw new Error(`End date must be a moment object, received ${typeof startDate}`);

  return `${startDate.format('ll')} - ${endDate ? endDate.format('ll') : 'Present'} • ${startDate.from(
    endDate || moment(),
    true
  )}`;
};

//===============================
// 숫자 포멧 셋팅
// >=1.0e9  ==  GB ??
// >=1.0e6  ==  M 메가
// >=1.0e3  ==  K 킬로
// Math.abs() == 절대값 관리
//===============================
export const numberFormatter = (number, fixed = 2) => {
  // Nine Zeroes for Billions
  return Math.abs(Number(number)) >= 1.0e9
    ? (Math.abs(Number(number)) / 1.0e9).toFixed(fixed) + 'G'
    : // Six Zeroes for Millions
    Math.abs(Number(number)) >= 1.0e6
    ? (Math.abs(Number(number)) / 1.0e6).toFixed(fixed) + 'M'
    : // Three Zeroes for Thousands
    Math.abs(Number(number)) >= 1.0e3
    ? (Math.abs(Number(number)) / 1.0e3).toFixed(fixed) + 'K'
    : Math.abs(Number(number)).toFixed(fixed);
};

//===============================
// Colors HEX( #000000 이렇게 생긴거 ) 값 RGB (rgb 255,255,255 이렇게) 로 바꾸기
// 맨 앞의 "#" 기호를 삭제하기
// rgb로 각각 분리해서 배열에 담기
//===============================
export const hexToRgb = hexValue => {
  let hex;
  hexValue.indexOf('#') === 0 ? (hex = hexValue.substring(1)) : (hex = hexValue);
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)
  );
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};

export const rgbColor = (color = colors[0]) => `rgb(${hexToRgb(color)})`;
export const rgbaColor = (color = colors[0], alpha = 0.5) => `rgba(${hexToRgb(color)},${alpha})`;

export const colors = [
  '#2c7be5',
  '#00d97e',
  '#e63757',
  '#39afd1',
  '#fd7e14',
  '#02a8b5',
  '#727cf5',
  '#6b5eae',
  '#ff679b',
  '#f6c343'
];

export const themeColors = {
  primary: '#2c7be5',
  secondary: '#748194',
  success: '#00d27a',
  info: '#27bcfd',
  warning: '#f5803e',
  danger: '#e63757',
  light: '#f9fafd',
  dark: '#0b1727'
};

export const grays = {
  white: '#fff',
  100: '#f9fafd',
  200: '#edf2f9',
  300: '#d8e2ef',
  400: '#b6c1d2',
  500: '#9da9bb',
  600: '#748194',
  700: '#5e6e82',
  800: '#4d5969',
  900: '#344050',
  1000: '#232e3c',
  1100: '#0b1727',
  black: '#000'
};

export const darkGrays = {
  white: '#fff',
  1100: '#f9fafd',
  1000: '#edf2f9',
  900: '#d8e2ef',
  800: '#b6c1d2',
  700: '#9da9bb',
  600: '#748194',
  500: '#5e6e82',
  400: '#4d5969',
  300: '#344050',
  200: '#232e3c',
  100: '#0b1727',
  black: '#000'
};

export const getGrays = isDark => (isDark ? darkGrays : grays);

export const rgbColors = colors.map(color => rgbColor(color));
export const rgbaColors = colors.map(color => rgbaColor(color));

//===============================
// Echarts
//===============================
export const getPosition = (pos, params, dom, rect, size) => ({
  top: pos[1] - size.contentSize[1] - 10,
  left: pos[0] - size.contentSize[0] / 2
});

//===============================
// E-Commerce
//===============================
export const calculateSale = (base, less = 0, fix = 2) => (base - base * (less / 100)).toFixed(fix);
export const getTotalPrice = (cart, baseItems) =>
  cart.reduce((accumulator, currentValue) => {
    const { id, quantity } = currentValue;
    const { price, sale } = baseItems.find(item => item.id === id);
    return accumulator + calculateSale(price, sale) * quantity;
  }, 0);

//===============================
// Helpers
// getPaginationArray == totalSize(=총 게시물 수)    sizePerPage (한 페이지의 게시물 수 )
//                    == noOfPages(=총 페이지들 수)
//===============================
export const getPaginationArray = (totalSize, sizePerPage) => {
  const noOfPages = Math.ceil(totalSize / sizePerPage);
  const array = [];
  let pageNo = 1;
  while (pageNo <= noOfPages) {
    array.push(pageNo);
    pageNo = pageNo + 1;
  }
  return array;
};

//===============================
// capitalize == 대문자 변환
// ※ .replace(/\-/g,'')  : -(마이너스) 제거
//===============================
export const capitalize = str => (str.charAt(0).toUpperCase() + str.slice(1)).replace(/-/g, ' ');

//===============================
// routesSlicer
// "라우터들"을 넣어서 뽑아낸다.
// 조건
// "라우터"가 자녀라우터(라우터 속의 라우터)라면
//       ▶ "라우터" 아이템의 자녀(속성) 이라면
//              ▶ 자녀라우터의 "속성" 들을 넣는다. ex) <Route path=":id" component={Bar}/> 여기서 "path=":id" component={Bar}""<<<< 이놈들이 item 이다.
//              ▶ 아니라면 그냥 그 아이템을 라우터에 넣는다.
// "라우터"가 자녀라우터가 아니면
//              ▶ 그냥 라우터컬렉션에 넣는다.
//===============================
export const routesSlicer = ({ routes, columns = 3, rows }) => {
  const routesCollection = [];
  routes.map(route => {
    if (route.children) {
      return route.children.map(item => {
        if (item.children) {
          return routesCollection.push(...item.children);
        }
        return routesCollection.push(item);
      });
    }
    return routesCollection.push(route);
  });

  // 총 라우터 크기 보여줘..
  const totalRoutes = routesCollection.length;

  // Rows(행?)계산
  const calculatedRows = rows || Math.ceil(totalRoutes / columns);

  // 이건 뭐지?
  const routesChunks = [];
  for (let i = 0; i < totalRoutes; i += calculatedRows) {
    routesChunks.push(routesCollection.slice(i, i + calculatedRows));
  }
  return routesChunks;
};

// 페이지 이름 불러오기
export const getPageName = pageName => {
  return window.location.pathname.split('/').slice(-1)[0] === pageName;
};
// 클립보드 복사하기
export const copyToClipBoard = textFieldRef => {
  const textField = textFieldRef.current;
  textField.focus();
  textField.select();
  document.execCommand('copy');
};
