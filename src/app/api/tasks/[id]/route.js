import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Updated PUT method
export async function PUT(request, { params }) {
  try {
    // Await params
    const { id } = await params; // Await params to access id

    const client = await clientPromise;
    const db = client.db();
    const data = await request.json();

    const result = await db.collection("tasks").updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update task" }), { status: 500 });
  }
}

// Updated DELETE method
export async function DELETE(request, { params }) {
  try {
    // Await params
    const { id } = await params; // Await params to access id

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("tasks").deleteOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete task" }), { status: 500 });
  }
}
