import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const tasks = await db.collection("tasks").find({}).toArray();
    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch tasks" }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await request.json();
    const result = await db.collection("tasks").insertOne(data);
    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to add task" }), { status: 500 });
  }
}
