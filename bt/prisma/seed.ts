import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Clear existing data
    await prisma.eventAttendee.deleteMany({});
    // await prisma.contact.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.event.deleteMany({});
    console.log('Cleared previous data.');

    // Create an Event
    const event = await prisma.event.create({
        data: {
            name: 'AI in Biotech Summit',
            date: new Date('2025-10-22T09:00:00Z'),
            eventDetails: 'A summit for professionals in AI and Biotechnology to connect and innovate.',
        },
    });
    console.log(`Created event: ${event.name}`);

    // Create Users
    const usersData = [
        {
            email: 'alice@example.com',
            name: 'Alice Johnson',
            role: 'AI Researcher',
            company: 'FutureAI',
            city: 'San Francisco',
            linkedinUrl: 'https://linkedin.com/in/alicej',
        },
        {
            email: 'bob@example.com',
            name: 'Bob Williams',
            role: 'CEO',
            company: 'BioHealth Corp',
            city: 'Boston',
            linkedinUrl: 'https://linkedin.com/in/bobw',
        },
        {
            email: 'charlie@example.com',
            name: 'Charlie Brown',
            role: 'Investment Partner',
            company: 'VC Ventures',
            city: 'New York',
            linkedinUrl: 'https://linkedin.com/in/charlieb',
        },
        {
            email: 'diana@example.com',
            name: 'Diana Prince',
            role: 'PhD Student',
            company: 'State University',
            city: 'San Francisco',
            linkedinUrl: 'https://linkedin.com/in/dianap',
        },
        {
            email: 'eva@example.com',
            name: 'Eva Martinez',
            role: 'Product Manager',
            company: 'HealthTech Solutions',
            city: 'Boston',
            linkedinUrl: 'https://linkedin.com/in/evam',
        },
    ];

    // --- Start of generated data ---
    const firstNames = ["Liam", "Olivia", "Noah", "Emma", "Oliver", "Ava", "Elijah", "Charlotte", "William", "Sophia", "James", "Amelia", "Benjamin", "Isabella", "Lucas", "Mia", "Henry", "Evelyn", "Alexander", "Harper", "Michael", "Camila", "Daniel", "Gianna", "Matthew", "Abigail", "Jackson", "Luna", "Sebastian", "Ella"];
    const lastNames = ["Smith", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen"];
    const roles = ["Data Scientist", "Bioinformatician", "Machine Learning Engineer", "Research Scientist", "Lab Director", "Sales Executive", "Marketing Manager", "Founder", "CTO", "CPO", "Medical Doctor", "Clinical Researcher", "Regulatory Affairs Specialist", "Computational Biologist", "Venture Analyst"];
    const companies = ["SynthoGen", "QuantumLeap Bio", "GeneWeavers", "BioTelligence", "AI-Cure", "Data-Driven Diagnostics", "NanoBio", "Precision Med", "Helix AI", "Vitality Labs", "CureConnect", "Genomica", "NeuroLink", "CardioAI", "Onco-Solutions"];
    const cities = ["San Diego", "Cambridge", "Raleigh", "Zurich", "London", "Toronto", "Seattle", "Austin", "Berlin", "Singapore", "Paris", "Tokyo", "Sydney", "Vancouver", "Dublin"];

    for (let i = 0; i < 30; i++) {
        const firstName = firstNames[i];
        const lastName = lastNames[i];
        usersData.push({
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
            name: `${firstName} ${lastName}`,
            role: roles[i % roles.length],
            company: companies[i % companies.length],
            city: cities[i % cities.length],
            linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
        });
    }
    // --- End of generated data ---

    const createdUsers = [];
    for (const u of usersData) {
        const user = await prisma.user.create({ data: u });
        createdUsers.push(user);
        console.log(`Created user: ${user.name}`);
    }

    // Create Event Attendees
    const attendeesData = [
        {
            userId: createdUsers[0].id, // Alice
            eventId: event.id,
            goals: 'Looking for collaborators on a new generative model for protein folding.',
            priority: 'High',
            keywords: 'Generative AI, Protein Folding, Drug Discovery',
        },
        {
            userId: createdUsers[1].id, // Bob
            eventId: event.id,
            goals: 'Seeking to acquire innovative AI-driven biotech startups.',
            priority: 'High',
            keywords: 'M&A, Startups, AI in Medicine',
        },
        {
            userId: createdUsers[2].id, // Charlie
            eventId: event.id,
            goals: 'I want to find the next big thing in biotech to invest in. Specifically interested in longevity and genomics.',
            priority: 'Medium',
            keywords: 'Venture Capital, Genomics, Longevity, Seed Funding',
        },
        {
            userId: createdUsers[3].id, // Diana
            eventId: event.id,
            goals: 'I am looking for post-doc opportunities and want to learn about the commercial side of AI research.',
            priority: 'Low',
            keywords: 'Academia, Post-doc, Career Development, AI Research',
        },
        {
            userId: createdUsers[4].id, // Eva
            eventId: event.id,
            goals: 'I am hiring for my team and looking for talented AI researchers. Also interested in networking with other product leaders.',
            priority: 'High',
            keywords: 'Hiring, Product Management, HealthTech, AI applications',
        },
    ];

    // --- Start of generated data for attendees ---
    const attendeeGoals = [
        "Exploring new collaborations in drug discovery.", "Seeking investment for a seed-stage startup focused on genomics.", "Hiring experienced Machine Learning Engineers for my team.", "Looking for a new role as a Research Scientist in the personalized medicine space.", "Networking with other professionals working on computational chemistry.", "Trying to understand the market landscape for AI applications in clinical trials.", "Presenting my research on AI ethics in biotech and looking for feedback.", "Finding commercial partners for our new diagnostic tool.", "I want to learn about the latest trends in proteomics.", "Looking to mentor young entrepreneurs in the HealthTech space.", "Discussing patient data privacy challenges in AI.", "Validating a new biomarker for cancer detection.", "Understanding the regulatory hurdles for AI medical devices.", "I am a biologist trying to incorporate more computational tools into my work.", "Scouting for early-stage biotech companies for our venture fund.", "Looking for a co-founder for a new startup idea in neuro-symbolic AI for medicine.", "My goal is to transition from academia to an industry role.", "I build machine learning models for protein structure prediction.", "Seeking to license our university's new patent on a drug delivery system.", "Running a lab focused on synthetic biology and automation.", "I sell enterprise software to large pharmaceutical companies.", "Building a community for women in computational biology.", "Our startup is building a platform for decentralized clinical trials.", "As a CTO, I am evaluating new cloud and MLOps platforms.", "Defining the product roadmap for a new AI-powered diagnostic tool.", "Providing clinical expertise for a team of data scientists.", "I manage a portfolio of biotech investments.", "Ensuring our medical software complies with international regulations.", "Developing new algorithms for analyzing single-cell sequencing data.", "I analyze market trends to guide our fund's investment strategy."
    ];
    const attendeeKeywords = [
        "Drug Discovery, Collaboration", "Genomics, Investment", "Hiring, ML", "Job Seeker, Personalized Medicine", "Networking, Computational Chemistry", "Market Research, Clinical Trials", "AI Ethics, Research", "Commercialization, Partnership", "Proteomics, Trends", "Mentorship, HealthTech", "Data Privacy, AI", "Biomarker, Cancer", "Regulatory, FDA", "Biology, Computation", "Venture Capital, Scouting", "Co-founder, Startup", "Career Change, Academia", "Protein Structure, ML", "Licensing, Patent", "Synthetic Biology, Automation", "Sales, Enterprise Software", "Community, Women in STEM", "Decentralized Trials, Platform", "CTO, MLOps", "Product Management, Diagnostics", "Clinical, Medicine", "Investment, Portfolio Management", "Compliance, Regulatory", "Algorithms, Single-cell", "Market Analysis, Investment"
    ];

    for (let i = 0; i < 30; i++) {
        attendeesData.push({
            userId: createdUsers[i + 5].id, // Start from the 6th user (index 5)
            eventId: event.id,
            goals: attendeeGoals[i],
            priority: ['High', 'Medium', 'Low'][i % 3],
            keywords: attendeeKeywords[i],
        });
    }
    // --- End of generated data for attendees ---

    for (const a of attendeesData) {
        await prisma.eventAttendee.create({ data: a });
    }
    console.log('Created event attendees.');

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 