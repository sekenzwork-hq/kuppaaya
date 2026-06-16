import { NextRequest, NextResponse } from "next/server";
import { getLocalDb, saveLocalDb } from "@/lib/services/local-db";

export async function GET(request: NextRequest) {
  const table = request.nextUrl.searchParams.get("table");
  if (!table) {
    return NextResponse.json({ error: "Table parameter is required" }, { status: 400 });
  }

  const db = getLocalDb();
  const rows = db[table as keyof typeof db] || [];
  
  const sortedRows = [...rows].sort((a, b) => {
    if (a.created_at && b.created_at) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0;
  });

  return NextResponse.json({ data: sortedRows, error: null });
}

export async function POST(request: NextRequest) {
  const table = request.nextUrl.searchParams.get("table");
  if (!table) {
    return NextResponse.json({ error: "Table parameter is required" }, { status: 400 });
  }

  const payload = await request.json();
  const db = getLocalDb();
  const rows = db[table as keyof typeof db];

  if (!rows) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const newRow = {
    id: payload.id || Math.random().toString(36).substring(2, 9),
    ...payload,
    created_at: new Date().toISOString()
  };

  if (table === "products") {
    db.product_images.push({
      id: `img-${newRow.id}`,
      product_id: newRow.id,
      image_url: payload.image_url || "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1100&q=82",
      sort_order: 0
    });
  }

  rows.push(newRow);
  saveLocalDb(db);

  return NextResponse.json({ data: newRow, error: null });
}

export async function PUT(request: NextRequest) {
  const table = request.nextUrl.searchParams.get("table");
  if (!table) {
    return NextResponse.json({ error: "Table parameter is required" }, { status: 400 });
  }

  const payload = await request.json();
  const db = getLocalDb();
  let rows = db[table as keyof typeof db];

  if (!rows) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const { id } = payload;
  if (!id) {
    return NextResponse.json({ error: "ID is required for updates" }, { status: 400 });
  }

  let found = false;
  db[table as keyof typeof db] = rows.map((row: any) => {
    if (String(row.id) === String(id)) {
      found = true;
      return { ...row, ...payload };
    }
    return row;
  });

  if (!found) {
    return NextResponse.json({ error: "Row not found" }, { status: 404 });
  }

  saveLocalDb(db);
  return NextResponse.json({ data: payload, error: null });
}

export async function DELETE(request: NextRequest) {
  const table = request.nextUrl.searchParams.get("table");
  const id = request.nextUrl.searchParams.get("id");

  if (!table || !id) {
    return NextResponse.json({ error: "Table and ID parameters are required" }, { status: 400 });
  }

  const db = getLocalDb();
  const rows = db[table as keyof typeof db];

  if (!rows) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  db[table as keyof typeof db] = rows.filter((row: any) => String(row.id) !== String(id));
  saveLocalDb(db);

  return NextResponse.json({ data: { id }, error: null });
}
