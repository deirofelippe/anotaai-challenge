export default {
  stages: [
    { duration: "10s", target: 300 },
    { duration: "30s", target: 300 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95) < 2000"],
    http_req_failed: ["rate < 0.01"],
  },
};
