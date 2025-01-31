import { NextResponse } from 'next/server';

// Add this line to enable runtime
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read the file as ArrayBuffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to base64
    const base64 = buffer.toString('base64');
    const mimeType = file.type;
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Prepare the form data for Cloudinary
    const params = new FormData();
    params.append('file', dataUrl);
    params.append('upload_preset', 'autoparts_preset');
    params.append('folder', 'autoparts');

    // Upload to Cloudinary
    console.log('Uploading to Cloudinary...');
    const cloudinaryResponse = await fetch(
      'https://api.cloudinary.com/v1_1/dsivz1t7t/image/upload',
      {
        method: 'POST',
        body: params,
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text();
      console.error('Cloudinary Error:', errorText);
      throw new Error('Upload failed');
    }

    const cloudinaryData = await cloudinaryResponse.json();
    console.log('Upload successful:', cloudinaryData);

    return NextResponse.json({
      success: true,
      url: cloudinaryData.secure_url
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

// Configure the API route to handle larger files
export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '10mb',
  },
}; 