import { DOMAIN, TOKEN } from "./env";

const VMControlAPI = {
  reboot: {
    method: "POST",
    path: "/api2/json/nodes/myh2o/qemu/{vmid}/status/reboot",
  },
  start: {
    method: "POST",
    path: "/api2/json/nodes/myh2o/qemu/{vmid}/status/start",
  },
  stop: {
    method: "POST",
    path: "/api2/json/nodes/myh2o/qemu/{vmid}/status/stop",
  },
  shutdown: {
    method: "POST",
    path: "/api2/json/nodes/myh2o/qemu/{vmid}/status/shutdown",
  },
};

/*
 * API: {
 *   method: string,
 *   path: string,
 *   fields: string[],
 *   format_field: (any) => any,
 *   sort: string,
 * }
 */
export const API = {
  vms: {
    method: "GET",
    path: "/api2/json/nodes/myh2o/qemu/",
    fields: ["name", "status", "vmid", "uptime"],
    format_uptime: uptime => (uptime / 3600).toFixed(2),
    sort: "uptime",
  },
  ...VMControlAPI,
};

const request_ = async (path, method, body = null) => {
  url = `${DOMAIN}${path}`;
  console.log(`request: ${url}`);

  const options = {
    method,
    headers: {
      Authorization: `PVEAPIToken=${TOKEN}`,
    },
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  let rsp;

  try {
    rsp = await fetch(url, options);

    if (!rsp.ok) {
      throw new Error(`request failed: ${rsp.status}`);
    }
  } catch (error) {
    return { error: error.message };
  }

  const rst = await rsp.json();

  // const rst = typeof rsp.body === "string" ? JSON.parse(rsp.body) : rsp.body;
  return rst;
};

export const request = async (API, vmid = null) => {
  let { method, path, fields = {}, sort = null } = API;
  if (vmid != null) {
    path = path.replace("{vmid}", vmid);
  }
  const rst = await request_(path, method);

  if (rst.data) {
    if (typeof rst.data !== "object") {
      return rst.data;
    }
    const data = rst.data.map(item => {
      const data = {};
      fields.forEach(field => {
        if (`format_${field}` in API) {
          data[field] = API[`format_${field}`](item[field]);
        } else {
          data[field] = item[field];
        }
      });
      return data;
    });

    sort != null && data.sort((a, b) => a[sort] - b[sort]);
    return data;
  }

  return rst;
};

// (async () => {
//   const data = await request(API.vms);
//   console.log(data);
// })();
