import { createClient } from "redis";

// Create Redis client
const redis = createClient({
  url: "redis://localhost:6379",
});

await redis.connect();
export default redis;
