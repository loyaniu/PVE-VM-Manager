import { createTitleWidget } from "./myWidgets";
import { DEVICE_WIDTH } from "../utils/config/device";

const logger = DeviceRuntimeCore.HmLogger.getLogger("PVE_VM_Manager");
const { messageBuilder } = getApp()._options.globalData;

Page({
  state: {
    text: "",
    scrollList: null,
    vmList: [],
  },
  build() {
    // [{"name":"iKuai","status":"running","vmid":1001,"uptime":223} ...]
    const titleWidget = createTitleWidget();
    this.fetchVMDataAndCreateWidget();
  },
  fetchVMDataAndCreateWidget() {
    messageBuilder.request({ method: "GET_VM_DATA" }).then(data => {
      logger.info("fetchVMData");
      this.state.vmList = data;
      if (data.error) {
        logger.error("fetchVMData", data.error);
        hmUI.showToast({
          text: `Something wrong, please try again later\n${data.error}`,
        });
        return;
      }
      this.createVMWidget();
    });
  },
  createVMWidget() {
    const w = 300;
    const h = 300;
    this.state.scrollList = hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
      x: DEVICE_WIDTH / 2 - px(w / 2),
      y: px(110),
      w: px(w),
      h: px(h),
      snap_to_center: true,
      item_space: px(20), // 间距
      item_config: [
        {
          type_id: 1,
          item_bg_color: 0x11acba,
          item_bg_radius: px(60),
          text_view_count: 3,
          item_height: px(120),
          text_view: [
            {
              x: 0,
              y: 0,
              w: px(w),
              h: px(80),
              key: "name",
              color: 0xffffff,
              text_size: px(30),
              action: true,
            },
            {
              x: 0,
              y: px(80),
              w: px(150),
              h: px(40),
              key: "status",
              color: 0xdddddd,
              text_size: px(20),
            },
            {
              x: px(150),
              y: px(80),
              w: px(150),
              h: px(40),
              key: "uptime",
              color: 0xdddddd,
              text_size: px(20),
            },
          ],
        },
      ],
      item_config_count: 1,
      data_array: this.state.vmList,
      data_count: this.state.vmList.length,
      item_click_func: (_, index) => {
        hmApp.gotoPage({
          file: "pages/control",
          param: JSON.stringify(this.state.vmList[index]),
        });
        logger.info("data click", this.state.vmList[index]);
      },
    });
  },
});
