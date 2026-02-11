import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { JwtTokenExpired } from "hono/utils/jwt/types";
import { userService } from "../services/users-service.js";
import { UNAUTHORIZED } from "http-status-codes";
import env from "../env.js";

const api = new Hono();


api.post("/login", async (c) => {
  const loginResult = await userService.login(c.req);
  if (!loginResult.ok) {
    return c.json(loginResult, UNAUTHORIZED);
  }
  const { _id, email, role } = loginResult.data;
  const payload = {
    sub: _id,
    email,
    role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, 
  };
  const token = await sign(payload, env.JWT_SECRET, "HS256");

  const { password: _, ...userWithoutPassword } = loginResult.data;
  return c.json({ 
    ...userWithoutPassword, 
    token 
  });
});


api.get("/me", async (c) => {
  const headers = c.req.header("Authorization");
  const extractedToken = headers?.split(" ").at(1);
  if (!extractedToken) {
    return c.json({ msg: "No token provided" }, UNAUTHORIZED);
  }
  try {
    const decodedPayload = await verify(extractedToken, env.JWT_SECRET, "HS256");
    return c.json({ email: decodedPayload.email, sub: decodedPayload.sub });
  }
  catch (error) {
    if (error instanceof JwtTokenExpired) {
      console.error("Expired token");
    }
    return c.json({ msg: "Invalid token" }, UNAUTHORIZED);
  }
});
export default api;
