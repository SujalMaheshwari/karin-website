import app from "../server/app.js";
import { connectDB } from "../server/db.js";

let ready = null;

export default async function handler(req, res) {
  if (!ready) {
    ready = connectDB();
  }

  await ready;
  return app(req, res);
}
