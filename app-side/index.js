import { MessageBuilder } from "../shared/message";
import { API, request } from "./utils";
const messageBuilder = new MessageBuilder();
const cache = {
  vms: [],
};

async function fetchVMData(ctx) {
  // if (cache.vms.length > 0) {
  //   return ctx.response({
  //     data: cache.vms,
  //   });
  // }
  cache.vms = await request(API.vms);
  ctx.response({
    data: cache.vms,
  });
}

async function controlVM(ctx, vmid, action) {
  console.log("controlVM", vmid, action);
  ctx.response({
    data: await request(API[action], vmid),
  });
}

AppSideService({
  onInit() {
    messageBuilder.listen(() => {});

    messageBuilder.on("request", ctx => {
      const jsonRpc = messageBuilder.buf2Json(ctx.request.payload);
      if (jsonRpc.method === "CONTROL_VM") {
        const { vmid, action } = jsonRpc.params;
        return controlVM(ctx, vmid, action);
      } else if (jsonRpc.method === "GET_VM_DATA") {
        return fetchVMData(ctx);
      }
    });
  },

  onRun() {},

  onDestroy() {},
});
