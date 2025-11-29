import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.publicapis.org/entries');
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching public APIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public APIs' },
      { status: 500 }
    );
  }
}
