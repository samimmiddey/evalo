import ky from "ky";

export const api = ky.create({
   prefix: "api",
   headers: {
      "Content-Type": "application/json",
   },
   timeout: 10000,
   retry: {
      limit: 3,
      methods: ["get", "post", "put", "patch", "delete"],
   }
});