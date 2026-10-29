import { NextResponse } from "next/server";
import { readStore, writeStore } from "@/lib/serverStore";

function sanitize(str, maxLen = 300) {
  if (typeof str !== "string") return "";
  return str.replace(/[<>]/g, "").trim().slice(0, maxLen);
}

export async function GET() {
  const store = readStore();
  return NextResponse.json({
    success: true,
    enquiries: store.enquiries || [],
  });
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (body.isPreview) {
      return NextResponse.json(
        {
          success: false,
          error: "Preview Mode active: Enquiries are not saved during admin preview.",
        },
        { status: 400 }
      );
    }

    const store = readStore();
    const minQty = store.studioSettings?.minQuantity || 1;

    const category = sanitize(body.category || "Aluminium Name Plate", 100);
    const specs = body.specifications || {};
    const thickness = sanitize(specs.thickness || "0.7 mm", 40);
    const holes = sanitize(specs.holes || "2 mm", 40);
    const side = sanitize(specs.side || "Single Side", 40);
    const colour = sanitize(specs.colour || "Single Colour", 40);
    const quantity = parseInt(specs.quantity, 10) || 1;

    const cust = body.customer || {};
    const customerName = sanitize(cust.name || "Customer", 120);
    const phone = sanitize(cust.phone, 30);
    const address = sanitize(cust.address, 400);

    if (quantity < minQty) {
      return NextResponse.json(
        { success: false, error: `Quantity must be at least ${minQty}.` },
        { status: 400 }
      );
    }
    if (!customerName) {
      return NextResponse.json(
        { success: false, error: "Please enter your Name." },
        { status: 400 }
      );
    }
    const cleanDigits = phone.replace(/\D/g, "");
    if (cleanDigits.length < 7) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid Contact Number." },
        { status: 400 }
      );
    }
    if (!address) {
      return NextResponse.json(
        { success: false, error: "Please enter your Address Details." },
        { status: 400 }
      );
    }

    let designFile = null;
    if (body.designFile && body.designFile.fileName) {
      const maxBytes = (store.studioSettings?.maxFileSizeMB || 10) * 1024 * 1024;
      const size = Number(body.designFile.fileSize) || 0;
      if (size > maxBytes) {
        return NextResponse.json(
          {
            success: false,
            error: `Uploaded file exceeds maximum size of ${
              store.studioSettings?.maxFileSizeMB || 10
            } MB.`,
          },
          { status: 400 }
        );
      }
      designFile = {
        fileName: sanitize(body.designFile.fileName, 180),
        fileType: sanitize(body.designFile.fileType, 80),
        fileSize: size,
        previewUrl:
          typeof body.designFile.previewUrl === "string" &&
          body.designFile.previewUrl.length < 2_500_000
            ? body.designFile.previewUrl
            : null,
        uploadedAt: new Date().toISOString(),
      };
    }

    const referenceId = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = new Date().toISOString().split("T")[0];

    const newEnquiry = {
      id: referenceId,
      client: customerName,
      customerName,
      phone,
      email: "—",
      address,
      city: address,
      date: dateStr,
      createdAt: new Date().toISOString(),
      source: "Upload Design Form",
      category,
      material: category,
      size: `Thickness: ${thickness} | Holes: ${holes}`,
      lighting: colour,
      mounting: `Double Side: ${side} | Holes: ${holes}`,
      specifications: {
        thickness,
        holes,
        side,
        quantity,
        colour,
      },
      designFile,
      textLayers: designFile
        ? [{ line: `Design File: ${designFile.fileName}`, font: "Uploaded" }]
        : [{ line: category, font: "Standard" }],
      quantity,
      status: "New Inquiry",
      notes: `Product: ${category} | Thickness: ${thickness} | Holes: ${holes} | Double Side: ${side} | Colour: ${colour} | Qty: ${quantity} | Address: ${address}`,
    };

    store.enquiries = [newEnquiry, ...(store.enquiries || [])];
    writeStore(store);

    return NextResponse.json(
      {
        success: true,
        referenceId,
        enquiry: newEnquiry,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/enquiries error:", err);
    return NextResponse.json(
      { success: false, error: "Server error while submitting form." },
      { status: 500 }
    );
  }
}
