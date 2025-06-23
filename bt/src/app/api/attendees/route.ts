import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            eventId,
            userId,
            goals,
            keywords,
            priority,
        } = body;

        if (!eventId || !userId || !goals) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if the user is already registered for this event
        const existingAttendee = await prisma.eventAttendee.findUnique({
            where: {
                userId_eventId: {
                    userId,
                    eventId,
                }
            }
        });

        if (existingAttendee) {
            return NextResponse.json({ error: 'User is already registered for this event' }, { status: 409 });
        }

        const attendee = await prisma.eventAttendee.create({
            data: {
                user: { connect: { id: userId } },
                event: { connect: { id: eventId } },
                goals,
                keywords,
                priority,
            },
        });

        return NextResponse.json(attendee, { status: 201 });
    } catch (error) {
        console.error('Error creating event attendee:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 