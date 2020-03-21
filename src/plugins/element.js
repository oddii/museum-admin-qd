import Vue from 'vue'
import {
  Button,
  Input,
  Form,
  FormItem,
  Menu,
  Submenu,
  MenuItem,
  Container,
  Header,
  Aside,
  Main,
  MenuItemGroup,
  Table,
  TableColumn,
  Card,
  Tag,
  Switch,
  Select,
  Option,
  Col,
  Row,
  Pagination,
  DatePicker,
  Carousel,
  CarouselItem,
  Dialog,
  Message,
  Breadcrumb,
  BreadcrumbItem,
  Tooltip,
  Avatar,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Collapse,
  CollapseItem,
  MessageBox
} from 'element-ui'

import Timeline from '../plugins/timeline/index.js'
import TimelineItem from '../plugins/timeline-item/index.js'

Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(MenuItemGroup)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Card)
Vue.use(Tag)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(Col)
Vue.use(Row)
Vue.use(Pagination)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(DatePicker)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Dialog)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Tooltip)
Vue.use(Avatar)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Collapse)
Vue.use(CollapseItem)
