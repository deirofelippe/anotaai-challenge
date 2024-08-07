export default {
  stages: [
    { duration: "5m", target: 200 },
    { duration: "1h", target: 200 },
    { duration: "5m", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95) < 2000"],
    http_req_failed: ["rate < 0.01"],
  },
};
