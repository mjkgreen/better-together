import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email } = body;

        if (!name || !email) {
            return NextResponse.json({ error: 'Missing name or email' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            // If user exists, we can just return it.
            // Or, you might want to return an error if emails must be unique for new sign-ups.
            // For this MVP, we'll just return the existing user to allow them to create events.
            return NextResponse.json(existingUser, { status: 200 });
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                role: 'organizer', // Assign the role of organizer
            },
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error('Error creating organizer:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 