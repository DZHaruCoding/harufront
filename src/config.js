export const version = '2.10.2';
export const navbarBreakPoint = 'xl'; // Vertical navbar breakpoint
export const topNavbarBreakpoint = 'lg';
export const settings = {
  isFluid: false,
  isRTL: false,
  isDark: false,
  isTopNav: true,
  isVertical: false,
  get isCombo() {
    return this.isVertical && this.isTopNav;
  },
  showBurgerMenu: false, // controls showing vertical nav on mobile
  currency: '$',
  isNavbarVerticalCollapsed: false,
  navbarStyle: 'transparent'
};

export const localIp = 'http://localhost:3000';
export const gcpIp = 'http://34.64.174.225:22';
export const API_URL = 'http://localhost:8080';
const API_HEADERS = {
  'Content-Type': 'application/json'
};
export default { version, navbarBreakPoint, topNavbarBreakpoint, settings };
