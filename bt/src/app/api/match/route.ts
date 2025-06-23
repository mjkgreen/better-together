import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const matchSchema = z.object({
    matches: z.array(z.object({
        name: z.string(),
        role: z.string().optional(),
        company: z.string().optional(),
        reason: z.string().describe('A concise explanation of why this is a good match.'),
        matchScore: z.number().min(0).max(100).describe('A score from 0-100 indicating the match quality.'),
    })).min(1).max(5).describe('An array of the top 1 to 5 best people to meet.'),
});

export async function POST(req: NextRequest) {
    try {
        const { userId, eventId } = await req.json();

        if (!userId || !eventId) {
            return new NextResponse('Missing userId or eventId', { status: 400 });
        }

        // 1. Fetch the user's profile
        const userAttendee = await prisma.eventAttendee.findUnique({
            where: { userId_eventId: { userId, eventId } },
            include: { user: true },
        });

        if (!userAttendee) {
            return new NextResponse('User is not registered for this event.', { status: 404 });
        }

        // 2. Fetch all other attendees for the event
        const otherAttendees = await prisma.eventAttendee.findMany({
            where: {
                eventId: eventId,
                NOT: { userId: userId },
            },
            include: { user: true },
        });

        if (otherAttendees.length === 0) {
            return NextResponse.json({ matches: [] });
        }

        // 3. Construct the prompt for the AI
        const systemPrompt = `
      You are an expert networking assistant. Your task is to help a user find the most relevant people to connect with at an event.
      Analyze the user's profile and compare it against a list of other event attendees.
      Based on their goals, priorities, keywords, roles, and companies, identify the top 3-5 most valuable connections.
      For each match, provide a brief, compelling reason why they should meet.
      Return the output as a structured JSON object.
    `;

        const userProfileForPrompt = {
            name: userAttendee.user.name,
            role: userAttendee.user.role,
            company: userAttendee.user.company,
            goals: userAttendee.goals,
            priority: userAttendee.priority,
            keywords: userAttendee.keywords,
        };

        const attendeesForPrompt = otherAttendees.map(a => ({
            name: a.user.name,
            role: a.user.role,
            company: a.user.company,
            goals: a.goals,
            keywords: a.keywords,
        }));


        const { object } = await generateObject({
            model: openai('gpt-4-turbo'),
            schema: matchSchema,
            system: systemPrompt,
            prompt: `Here is my profile: ${JSON.stringify(userProfileForPrompt)}. Here are the other attendees: ${JSON.stringify(attendeesForPrompt)}. Please find the best matches for me.`
        });

        // Enhance the matches with email addresses and user IDs
        const enhancedMatches = object.matches.map(match => {
            const attendee = otherAttendees.find(a => a.user.name === match.name);
            return {
                ...match,
                email: attendee?.user.email || '',
                userId: attendee?.user.id || '',
            };
        });

        return NextResponse.json({ matches: enhancedMatches });

    } catch (error) {
        console.error('Error in match agent:', error);

        let errorMessage = 'An unknown error occurred.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return new NextResponse(JSON.stringify({ error: 'Failed to generate matches.', details: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
} 