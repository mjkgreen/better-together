import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { userId, eventId, matchName, matchRole, matchCompany, reason, matchEmail } = await req.json();

        if (!userId || !eventId || !matchName) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        if (!matchEmail) {
            return new NextResponse('Match email address is required', { status: 400 });
        }

        // Get the user and event details
        const [userAttendee, event] = await Promise.all([
            prisma.eventAttendee.findUnique({
                where: { userId_eventId: { userId, eventId } },
                include: { user: true },
            }),
            prisma.event.findUnique({
                where: { id: eventId },
                include: { organizer: true },
            }),
        ]);

        if (!userAttendee || !event) {
            return new NextResponse('User or event not found', { status: 404 });
        }

        const userName = userAttendee.user.name || 'there';
        const userRole = userAttendee.user.role || '';
        const userCompany = userAttendee.user.company || '';

        // Generate the intro email using AI
        const systemPrompt = `You are an expert at writing professional networking emails. Your task is to craft a concise and compelling introductory email from one event attendee to another, proposing a meeting during the event (note that the event is in the future).

The email's tone should be:
- Professional and respectful.
- Enthusiastic but not overly familiar.
- Action-oriented and concise (maximum 3-4 sentences).

The email's structure must contain:
1. Hi [Match Name],
2. A brief, friendly opening that mentions the event context.
3. A clear statement on why they are reaching out, based on the provided reason.
4. A specific, low-commitment call to action (e.g., "a brief 15-minute chat," "connecting for coffee") during the event.
5. IMPORTANT: add the actual name of the person at the end of the email.
`;

        const prompt = `Write a short intro email from ${userName}${userRole ? ` (${userRole}${userCompany ? ` at ${userCompany}` : ''})` : ''} to ${matchName}${matchRole ? ` (${matchRole}${matchCompany ? ` at ${matchCompany}` : ''})` : ''} at the "${event.name}" event.

The reason they should connect is: ${reason}`;

        const { text } = await generateText({
            model: openai('gpt-4-turbo'),
            system: systemPrompt,
            prompt: prompt,
            maxTokens: 150,
        });

        // Create subject line
        const subject = `Meeting up at ${event.name}`;

        // Create mailto link
        const emailBody = encodeURIComponent(text.trim());
        const emailSubject = encodeURIComponent(subject);
        const mailtoLink = `mailto:${matchEmail}?subject=${emailSubject}&body=${emailBody}`;

        return NextResponse.json({
            subject,
            body: text.trim(),
            mailtoLink,
        });

    } catch (error: any) {
        console.error('Error generating intro:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to generate intro', details: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
} 