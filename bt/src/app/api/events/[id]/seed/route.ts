import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const eventId = params.id;

        // Check if event exists
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Check if demo attendees already exist for this event
        const existingAttendees = await prisma.eventAttendee.findMany({
            where: { eventId },
            include: { user: true },
        });

        // Check if any of our demo users are already attendees
        const demoEmails = ["liam.smith@example.com", "olivia.jones@example.com", "noah.garcia@example.com"];
        const hasDemo = existingAttendees.some(attendee =>
            demoEmails.includes(attendee.user.email)
        );

        if (hasDemo) {
            return NextResponse.json({
                message: 'Demo attendees already exist for this event',
                count: existingAttendees.length
            });
        }

        // Create seed users if they don't exist
        const firstNames = ["Liam", "Olivia", "Noah", "Emma", "Oliver", "Ava", "Elijah", "Charlotte", "William", "Sophia", "James", "Amelia", "Benjamin", "Isabella", "Lucas", "Mia", "Henry", "Evelyn", "Alexander", "Harper"];
        const lastNames = ["Smith", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson"];
        const roles = ["Data Scientist", "Bioinformatician", "Machine Learning Engineer", "Research Scientist", "Lab Director", "Sales Executive", "Marketing Manager", "Founder", "CTO", "CPO", "Medical Doctor", "Clinical Researcher", "Regulatory Affairs Specialist", "Computational Biologist", "Venture Analyst"];
        const companies = ["SynthoGen", "QuantumLeap Bio", "GeneWeavers", "BioTelligence", "AI-Cure", "Data-Driven Diagnostics", "NanoBio", "Precision Med", "Helix AI", "Vitality Labs", "CureConnect", "Genomica", "NeuroLink", "CardioAI", "Onco-Solutions"];
        const cities = ["San Diego", "Cambridge", "Raleigh", "Zurich", "London", "Toronto", "Seattle", "Austin", "Berlin", "Singapore"];

        const attendeeGoals = [
            "Exploring new collaborations in drug discovery.",
            "Seeking investment for a seed-stage startup focused on genomics.",
            "Hiring experienced Machine Learning Engineers for my team.",
            "Looking for a new role as a Research Scientist in the personalized medicine space.",
            "Networking with other professionals working on computational chemistry.",
            "Trying to understand the market landscape for AI applications in clinical trials.",
            "Presenting my research on AI ethics in biotech and looking for feedback.",
            "Finding commercial partners for our new diagnostic tool.",
            "I want to learn about the latest trends in proteomics.",
            "Looking to mentor young entrepreneurs in the HealthTech space.",
            "Discussing patient data privacy challenges in AI.",
            "Validating a new biomarker for cancer detection.",
            "Understanding the regulatory hurdles for AI medical devices.",
            "I am a biologist trying to incorporate more computational tools into my work.",
            "Scouting for early-stage biotech companies for our venture fund.",
            "Looking for a co-founder for a new startup idea in neuro-symbolic AI for medicine.",
            "My goal is to transition from academia to an industry role.",
            "I build machine learning models for protein structure prediction.",
            "Seeking to license our university's new patent on a drug delivery system.",
            "Running a lab focused on synthetic biology and automation."
        ];

        const attendeeKeywords = [
            "Drug Discovery, Collaboration",
            "Genomics, Investment",
            "Hiring, ML",
            "Job Seeker, Personalized Medicine",
            "Networking, Computational Chemistry",
            "Market Research, Clinical Trials",
            "AI Ethics, Research",
            "Commercialization, Partnership",
            "Proteomics, Trends",
            "Mentorship, HealthTech",
            "Data Privacy, AI",
            "Biomarker, Cancer",
            "Regulatory, FDA",
            "Biology, Computation",
            "Venture Capital, Scouting",
            "Co-founder, Startup",
            "Career Change, Academia",
            "Protein Structure, ML",
            "Licensing, Patent",
            "Synthetic Biology, Automation"
        ];

        const createdUsers = [];

        // Create users
        for (let i = 0; i < 20; i++) {
            const firstName = firstNames[i];
            const lastName = lastNames[i];

            const userData = {
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
                name: `${firstName} ${lastName}`,
                role: roles[i % roles.length],
                company: companies[i % companies.length],
                city: cities[i % cities.length],
                linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
            };

            try {
                // Check if user already exists
                let user = await prisma.user.findUnique({
                    where: { email: userData.email },
                });

                if (!user) {
                    user = await prisma.user.create({ data: userData });
                    console.log(`Created new user: ${user.name}`);
                } else {
                    console.log(`Found existing user: ${user.name}`);
                }

                createdUsers.push(user);
            } catch (error) {
                console.error(`Failed to create/find user ${userData.name}:`, error);
                // Skip this user and continue
            }
        }

        // Create event attendees
        const attendeesData = [];
        for (let i = 0; i < 20; i++) {
            attendeesData.push({
                userId: createdUsers[i].id,
                eventId: eventId,
                goals: attendeeGoals[i],
                priority: ['High', 'Medium', 'Low'][i % 3],
                keywords: attendeeKeywords[i],
            });
        }

        // Create all attendees
        let createdCount = 0;
        for (const attendeeData of attendeesData) {
            try {
                await prisma.eventAttendee.create({ data: attendeeData });
                createdCount++;
            } catch (error) {
                console.error(`Failed to create attendee for user ${attendeeData.userId}:`, error);
                // Continue with the next attendee instead of failing completely
            }
        }

        return NextResponse.json({
            message: `Successfully seeded ${createdCount} attendees`,
            count: createdCount,
            totalAttempted: attendeesData.length
        });

    } catch (error) {
        console.error('Error seeding attendees:', error);
        return NextResponse.json(
            { error: 'Failed to seed attendees' },
            { status: 500 }
        );
    }
} 