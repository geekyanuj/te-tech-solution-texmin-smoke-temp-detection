// export const APP_ENV = "prod";
export const APP_ENV = "dev";

export const MQTT = {
  prod: {
    host: "mqtt5",
    port: "1883",
    username: "Anuj",
    password: "Anuj@123",
  },
  dev: {
    host: "127.0.0.1",
    port: "1884",
    username: "Anuj",
    password: "Anuj@123",
  },
};

export const MONGODB = {
  prod: { uri: "mongodb://admin:Admin%407998@mongodb:27017" },
  // dev: { uri: "mongodb://admin:Admin%407998@127.0.0.1:27017" }
  dev:  { uri: "mongodb://127.0.0.1:27017/smoke-temp-db" }
};
