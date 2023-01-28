import Redis from "ioredis";
const { REDIS_HOST, REDIS_PORT, REDIS_TTL, REDIS_TIMEOUT } = process.env;

//Create a Redis instance
const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  commandTimeout: REDIS_TIMEOUT,
});

redis.on("error", (err) => {
  console.error(err);
});

//Get Key data from Redis cache
export const getCache = async (key) => {
  try {
    const cacheData = await redis.get(key);
    return cacheData;
  } catch (err) {
    console.log(`getCache Error: ${err}`);
    return null;
  }
};

//Set Redis cache key with a given expiry
export const setCache = (key, data, ttl = REDIS_TTL) => {
  try {
    redis.set(key, JSON.stringify(data), "EX", ttl);
  } catch (err) {
    console.log(`setCache Error: ${err}`);
    return null;
  }
};

//Remove given Redis cache key
export const removeCache = (key) => {
  try {
    redis.del(key);
  } catch (err) {
    console.log(`removeCache Error: ${err}`);
    return null;
  }
};
