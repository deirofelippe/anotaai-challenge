export default {
  stages: [
    { duration: "5s", target: 300 },
    { duration: "15s", target: 300 },
    { duration: "7s", target: 750 },
    { duration: "20s", target: 750 },
    { duration: "20s", target: 1550 },
    { duration: "120s", target: 1550 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95) < 2000"],
    http_req_failed: ["rate < 0.01"],
  },
};
