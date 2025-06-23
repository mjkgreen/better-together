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
        const systemPrompt = `You are writing a brief, friendly intro email for someone who wants to connect with another attendee at an event. The email should be:
    - Very short (2-3 sentences max)
    - Warm and professional
    - Mention why they should connect
    - Include a specific call to action (like "coffee chat" or "quick call")
    - Be personable but not overly casual
    
    Do NOT include email formatting like subject lines, "Dear" or "Sincerely" - just the body text.`;

        const prompt = `Write a short intro email from ${userName}${userRole ? ` (${userRole}${userCompany ? ` at ${userCompany}` : ''})` : ''} to ${matchName}${matchRole ? ` (${matchRole}${matchCompany ? ` at ${matchCompany}` : ''})` : ''} at the "${event.name}" event. 

    Context for why they should connect: ${reason}

    The email should be friendly and suggest a specific way to connect (coffee, call, etc.).`;

        const { text } = await generateText({
            model: openai('gpt-4-turbo'),
            system: systemPrompt,
            prompt: prompt,
            maxTokens: 150,
        });

        // Create subject line
        const subject = `Great meeting you at ${event.name}!`;

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