import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { country } = body;

    const response = await axios
      .get(
        `https://api.henrikdev.xyz/valorant/v1/website/${country || "en-us"}`
      )
      .then((res) => res.data)
      .then((data) => data.data);

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" });
  }
}
