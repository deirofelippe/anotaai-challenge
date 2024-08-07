export default {
  stages: [
    { duration: "20s", target: 2000 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95) < 2000"],
    http_req_failed: ["rate < 0.01"],
  },
};
