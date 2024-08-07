export default {
  stages: [
    { duration: "5s", target: 100 },
    { duration: "5s", target: 100 },
    { duration: "7s", target: 300 },
    { duration: "7s", target: 300 },
    { duration: "5s", target: 500 },
    { duration: "10s", target: 500 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95) < 2000"],
    http_req_failed: ["rate < 0.01"],
  },
};
