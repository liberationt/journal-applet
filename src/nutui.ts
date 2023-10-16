// import '@nutui/nutui-taro/dist/style.css'; 更改为以下方式引入
import '@nutui/nutui-taro/dist/styles/themes/default.scss'

import {
  Icon,
  Button,
  Popup,
  InputNumber,
  Price,
  OverLay,
  Layout,
  Row,
  Col,
  Tabs,
  TabPane,
  Input,
  Tag,
  Progress,
  Image,
  Picker,
  DatePicker,
  Radio,
  RadioGroup,
  CheckboxGroup,
  Checkbox,
  Sticky,
  Form,
  FormItem,
  Cell,
  CellGroup,
  Navbar,
  Swiper,
  SwiperItem,
  Popover,
  Dialog,
  TextArea,
  Rate,
  Cascader,
  Switch,
  Collapse,
  CollapseItem,
  CircleProgress,
} from '@nutui/nutui-taro'
import { App } from 'vue'
const setNutUi = (app: App) => {
  app
    .use(Layout)
    .use(Row)
    .use(Col)
    .use(Icon)
    .use(Button)
    .use(Popup)
    .use(InputNumber)
    .use(Price)
    .use(OverLay)
    .use(Tabs)
    .use(TabPane)
    .use(Input)
    .use(Tag)
    .use(Progress)
    .use(Image)
    .use(Picker)
    .use(DatePicker)
    .use(RadioGroup)
    .use(Radio)
    .use(CheckboxGroup)
    .use(Checkbox)
    .use(Sticky)
    .use(Form)
    .use(FormItem)
    .use(Cell)
    .use(CellGroup)
    .use(Navbar)
    .use(Swiper)
    .use(SwiperItem)
    .use(Popover)
    .use(Popup)
    .use(Dialog)
    .use(TextArea)
    .use(Rate)
    .use(Cascader)
    .use(Switch)
    .use(Collapse)
    .use(CollapseItem)
    .use(CircleProgress)
}
export default setNutUi
