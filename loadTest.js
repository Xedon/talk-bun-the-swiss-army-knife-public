import http from "k6/http";

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: "constant-vus",
      vus: __ENV.VUS ? parseInt(__ENV.VUS) : 10000,
      duration: __ENV.DURATION ? __ENV.DURATION : "5m",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.02"], // http errors should be less than 2%
    http_req_duration: ["p(95)<2000"], // 95% requests should be below 2s
  },
};

export default function () {
  http.get(
    `http://${__ENV.HOSTNAME ? __ENV.HOSTNAME : "localhost"}:${
      __ENV.PORT ? __ENV.PORT : 3000
    }`
  );
}
