import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ProfileAndSettings from '../components/auth/ProfileAndSettings';
import Calendar from '../components/calendar/Calendar';
import Checkout from '../components/e-commerce/Checkout';
import Customers from '../components/e-commerce/Customers';
import OrderDetails from '../components/e-commerce/OrderDetails';
import Orders from '../components/e-commerce/Orders';
import ProductDetails from '../components/e-commerce/ProductDetails';
import Products from '../components/e-commerce/Products';
import ShoppingCart from '../components/e-commerce/ShoppingCart';
import Compose from '../components/email/Compose';
import EmailDetail from '../components/email/EmailDetail';
import Inbox from '../components/email/Inbox';
import InboxProvider from '../components/email/inbox/InboxProvider';
import Files from '../components/file/Files';
import Activity from '../components/history/Activity'; //JONGYOON
import Kanban from '../components/kanban/Kanban';
import Notifications from '../components/page/Notifications';

const InboxRoutes = ({ match: { url } }) => (
  <InboxProvider>
    <Switch>
      <Route path={`${url}/email-detail`} exact component={EmailDetail} />
      <Route path={`${url}/inbox`} exact component={Inbox} />
      <Route path={`${url}/compose`} exact component={Compose} />

      {/*Redirect*/}
      <Redirect to="/errors/404" />
    </Switch>
  </InboxProvider>
);

const ProductRoutes = ({ match: { url } }) => (
  <Switch>
    <Route path={`${url}/products/list`} exact component={Products} />
    <Route path={`${url}/checkout`} exact component={Checkout} />
    <Route path={`${url}/product-details/:id`} exact component={ProductDetails} />
    <Route path={`${url}/product-details/`} exact component={ProductDetails} />
    <Route path={`${url}/shopping-cart`} exact component={ShoppingCart} />
    <Route path={`${url}/orders`} exact component={Orders} />
    <Route path={`${url}/order-details`} exact component={OrderDetails} />
    <Route path={`${url}/customers`} exact component={Customers} />

    {/*Redirect*/}
    <Redirect to="/errors/404" />
  </Switch>
);

const DashboardRoutes = () => (
  <Switch>
    {/* <Route path="/feed" exact component={Feed} /> */}
    {/*Pages*/}
    {/* <Route path="/pages/activity" exact component={Activity} />
    <Route path="/pages/associations" exact component={Associations} />
    <Route path="/pages/billing" exact component={Billing} />
    <Route path="/pages/customer-details" exact component={CustomerDetails} />
    <Route path="/pages/event-detail" exact component={EventDetail} />
    <Route path="/pages/event-create" exact component={EventCreate} />
    <Route path="/pages/events" exact component={Events} />
    <Route path="/pages/faq" exact component={Faq} />
    <Route path="/pages/invoice" exact component={Invoice} />
    <Route path="/pages/invite-people" exact component={InvitePeople} />
    
    <Route path="/pages/people" exact component={People} />
    <Route path="/pages/pricing" exact component={Pricing} />
    <Route path="/pages/pricing-alt" exact component={PricingAlt} />
    <Route path="/pages/profile" exact component={Profile} />
    <Route path="/pages/settings" exact component={Settings} />
    <Route path="/pages/starter" exact component={Starter} /> */}
    <Route path="/pages/notifications" exact component={Notifications} />
    {/*chat*/}
    {/* <Route path="/chat" exact component={Chat} /> */}

    {/*calendar*/}
    {/* 행운 */}
    <Route path="/pages/calendar" exact component={Calendar} />

    {/*kanban*/}
    {/* 진석 */}
    <Route path="/pages/kanban" exact component={Kanban} />

    {/*E commerce*/}
    {/* <Route path="/e-commerce" component={ProductRoutes} /> */}

    {/* profile */}
    {/* 승현 */}
    <Route path="/pages/auth/ProfileAndSettings" exact component={ProfileAndSettings} />

    {/*activity*/}
    {/* 종윤 */}
    <Route path="/pages/activity" exact component={Activity} />
    <Route path="/pages/files" exact component={Files} />
    {/*Email*/}
    {/* <Route path="/email" component={InboxRoutes} /> */}

    {/*widgets*/}
    {/* <Route path="/widgets" component={Widgets} /> */}

    {/*Documentation*/}
    {/* <Route path="/documentation" exact component={GettingStarted} /> */}

    {/*Changelog*/}
    {/* <Route path="/changelog" exact component={ChangeLog} /> */}

    {/*Components*/}
    {/* <Route path="/components/alerts" exact component={Alerts} />
    <Route path="/components/autocomplete" exact component={AutocompleteExample} />
    <Route path="/components/accordions" exact component={FalconAccordions} />
    <Route path="/components/avatar" exact component={Avatar} />
    <Route path="/components/badges" exact component={Badges} />
    <Route path="/components/backgrounds" exact component={Backgrounds} />
    <Route path="/components/breadcrumb" exact component={Breadcrumbs} />
    <Route path="/components/buttons" exact component={Buttons} />
    <Route path="/components/cards" exact component={Cards} />
    <Route path="/components/cookie-notice" exact component={CookieNotice} />
    <Route path="/components/collapses" exact component={Collapses} />
    <Route path="/components/dropdowns" exact component={Dropdowns} />
    <Route path="/components/forms" exact component={Forms} />
    <Route path="/components/listgroups" exact component={ListGroups} />
    <Route path="/components/modals" exact component={Modals} />
    <Route path="/components/navs" exact component={Navs} />
    <Route path="/components/navbars" exact component={Navbars} />
    <Route path="/components/navbar-top" exact component={NavBarTop} />
    <Route path="/components/combo" exact component={Combo} />
    <Route path="/components/navbar-vertical" exact component={VerticalNavbar} />
    <Route path="/components/Sidepanel" exact component={Sidepanel} />
    <Route path="/components/pageheaders" exact component={PageHeaders} />
    <Route path="/components/paginations" exact component={Paginations} />
    <Route path="/components/popovers" exact component={Popovers} />
    <Route path="/components/progress" exact component={ProgressBar} />
    <Route path="/components/tab" exact component={Tabs} />
    <Route path="/components/tables" exact component={Tables} />
    <Route path="/components/tooltips" exact component={Tooltips} />
    <Route path="/components/spinners" exact component={Spinners} />
    <Route path="/components/carousel" exact component={Carousel} /> */}

    {/*Utilities*/}
    {/* <Route path="/utilities/borders" exact component={Borders} />
    <Route path="/utilities/clearfix" exact component={Clearfix} />
    <Route path="/utilities/closeIcon" exact component={CloseIcon} />
    <Route path="/utilities/colors" exact component={Colors} />
    <Route path="/utilities/display" exact component={Display} />
    <Route path="/utilities/embed" exact component={Embed} />
    <Route path="/utilities/figures" exact component={Figures} />
    <Route path="/utilities/flex" exact component={Flex} />
    <Route path="/utilities/grid" exact component={Grid} />
    <Route path="/utilities/sizing" exact component={Sizing} />
    <Route path="/utilities/spacing" exact component={Spacing} />
    <Route path="/utilities/stretchedLink" exact component={StretchedLink} />
    <Route path="/utilities/typography" exact component={Typography} />
    <Route path="/utilities/verticalAlign" exact component={VerticalAlign} />
    <Route path="/utilities/visibility" exact component={Visibility} /> */}

    {/*Plugins*/}
    {/* <Route path="/plugins/calendar-example" exact component={CalendarExample} />
    <Route path="/plugins/bulk-select" exact component={BulkSelect} />
    <Route path="/plugins/typed" exact component={Typed} />
    <Route path="/plugins/image-lightbox" exact component={ImageLightbox} />
    <Route path="/plugins/lottie" exact component={Lottie} />
    <Route path="/plugins/google-map" exact component={GoogleMapExample} />
    <Route path="/plugins/wysiwyg" exact component={QuillEditorExample} />
    <Route path="/plugins/chart" exact component={Chart} />
    <Route path="/plugins/countup" exact component={CountUpExample} />
    <Route path="/plugins/datetime" exact component={DatetimeExample} />
    <Route path="/plugins/font-awesome" exact component={FontAwesome} />
    <Route path="/plugins/echarts" exact component={Echarts} />
    <Route path="/plugins/toastify" exact component={Toastify} />
    <Route path="/plugins/select" exact component={Select} />
    <Route path="/plugins/slick-carousel" exact component={SlickCarousel} />
    <Route path="/plugins/scroll-bar" exact component={Scrollbar} />
    <Route path="/plugins/progressbar" exact component={ProgressBarJs} />
    <Route path="/plugins/plyr" exact component={Plyr} />
    <Route path="/plugins/react-hook-form" exact component={ReactHookFrom} />
    <Route path="/plugins/leaflet-map" exact component={Leaflet} />
    <Route path="/plugins/echart-map" exact component={EchartMap} />
    <Route path="/plugins/dropzone" exact component={Dropzone} />
    <Route path="/plugins/code-highlight" exact component={CodeHighlightDoc} />
    <Route path="/plugins/emoji-mart" exact component={EmojiMart} />
    <Route path="/plugins/react-bootstrap-table2" exact component={ReactBootstrapTable2} />
    <Route path="/plugins/react-beautiful-dnd" exact component={ReactBeautifulDnD} /> */}

    {/*Redirect*/}
    <Redirect to="/errors/404" />
  </Switch>
);

export default DashboardRoutes;
