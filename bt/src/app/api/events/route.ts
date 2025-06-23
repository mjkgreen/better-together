import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            name,
            date,
            eventDetails,
            logoUrl,
            bannerUrl,
            socialLinks,
            organizerId
        } = body;

        if (!name || !date || !organizerId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const event = await prisma.event.create({
            data: {
                name,
                date: new Date(date),
                eventDetails,
                logoUrl,
                bannerUrl,
                socialLinks,
                organizer: {
                    connect: {
                        id: organizerId,
                    },
                },
            },
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 