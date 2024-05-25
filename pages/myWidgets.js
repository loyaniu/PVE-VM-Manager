import { DEVICE_WIDTH } from "../utils/config/device";

export const createTitleWidget = (text = "PVE VM Manager") => {
  return hmUI.createWidget(hmUI.widget.TEXT, {
    x: px(0),
    y: px(0),
    w: DEVICE_WIDTH,
    h: px(110),
    color: 0xaaddcc,
    text_size: px(36),
    bg_color: 0xabcdef,
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.CENTER_V,
    text_style: hmUI.text_style.NONE,
    text,
  });
};
