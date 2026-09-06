// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token || token !== process.env.REVALIDATE_TOKEN) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  revalidatePath('/');

  return NextResponse.json({ revalidated: true });
}
