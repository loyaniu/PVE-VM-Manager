import { DEVICE_WIDTH } from "../utils/config/device";
import { createTitleWidget } from "./myWidgets";

const logger = DeviceRuntimeCore.HmLogger.getLogger("PVE_VM_Manager");
const { messageBuilder } = getApp()._options.globalData;

Page({
  state: {
    vmData: {},
  },
  onInit(param) {
    const paramsObj = JSON.parse(param);
    this.state.vmData = paramsObj;
    logger.info("onInit", paramsObj);
  },
  build() {
    createTitleWidget(`${this.state.vmData.name} Control`);
    this.createVMWidget();
  },
  controlVM(action, callback) {
    messageBuilder
      .request({
        method: "CONTROL_VM",
        params: {
          vmid: this.state.vmData.vmid,
          action,
        },
      })
      .then(data => {
        logger.info("controlVM", data);
        callback(data);
      });
  },
  createVMWidget() {
    const w = 300;
    const h = 300;
    let demo;
    if (this.state.vmData.status === "running") {
      demo = [{ name: "stop" }, { name: "shutdown" }, { name: "reboot" }];
    } else {
      demo = [{ name: "start" }];
    }
    hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
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
          item_bg_radius: px(40),
          text_view_count: 1,
          item_height: px(80),
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
          ],
        },
      ],
      item_config_count: 1,
      data_array: demo,
      data_count: demo.length,
      item_click_func: (_, index) => {
        const dialog = hmUI.createDialog({
          title: `Are you sure to ${demo[index].name} ${this.state.vmData.name}?`,
          auto_hide: false,
          click_linster: ({ type }) => {
            dialog.show(false);
            if (type === 1) {
              logger.info("click ok");
              this.controlVM(demo[index].name, data => {
                hmUI.showToast({
                  text: `Data: ${data}`,
                });
                setTimeout(() => {
                  hmApp.goBack();
                }, 3000);
              });
            } else {
              logger.info("click cancel");
              hmApp.goBack();
            }
          },
        });

        dialog.show(true);
      },
    });
  },
});
