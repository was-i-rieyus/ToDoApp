import { NextRequest, NextResponse } from "next/server";

export async function GET(request){
  return new NextResponse("Hello, World!", {
    status: 200,
  });
}
