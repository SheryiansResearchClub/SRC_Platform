const MentorDatabase = [
    {
        image: '/images/mentors/sarthak.webp',
        title: "Sarthak Sharma",
        info: "Frontend engineer crafting buttery-smooth experiences with Next.js & GSAP. Animation nerd building Awwwards-level web art."
    },
    {
        image: '/images/mentors/aayush.webp',
        title: "Aayush Chouhan",
        info: "Frontend wizard with a flair for 3D — blends Three.js magic with creative coding. A true jack of all digital trades."
    },
    {
        image: '/images/mentors/adarsh.webp',
        title: "Adarsh Gupta",
        info: "DSA enthusiast and Java powerhouse. Spring Boot ace with sharp financial instincts — a rare left-brain-right-brain blend."
    },
    {
        image: '/images/mentors/akarsh.webp',
        title: "Akarsh Vyas",
        info: "The AI-Machine Learning brainiac. From Python wizardry to aptitude puzzles — he sees patterns where others see chaos."
    },
    {
        image: '/images/mentors/ali.webp',
        title: "Ali Ansari",
        info: "Code generalist with depth. JAVA to JS, DBMS to OS, Android to Web3 — he’s built for versatility in a connected world."
    },
    {
        image: '/images/mentors/anurag.webp',
        title: "Anurag Sarkar",
        info: "Tech + hardware hybrid. From full stack code to DevOps pipelines to robotics — if it beeps, he’s built it."
    },
    {
        image: '/images/mentors/harsh.webp',
        title: "Harsh Sharma",
        info: "Creative full-stack dev with a visual edge. 3D shaders, C4D, and slick designs meet MERN power — he codes in style."
    },
    {
        image: '/images/mentors/patel.webp',
        title: "Harsh Patel",
        info: "Full-stack force with DevOps flow. From AWS to MERN and everything in between — your go-to tech backbone."
    },
    {
        image: '/images/mentors/ankur.webp',
        title: "Ankur Prajapati",
        info: "Backend brain with an AI twist — from vector DBs and RAG pipelines to full-stack MERN power. Ships smart systems with JS, TS & cloud finesse."
    }

];


const CarouselDatabase = [
    { title: "DevOps", image: "/images/textures/05.webp" },
    { title: "Cyber\nSecurity ", image: "/images/textures/04.webp" },
    { title: "AI / ML", image: "/images/textures/02.webp" },
    { title: ".Hacka\n⠀thon", image: "/images/textures/06.webp" },
    { title: "Robotics", image: "/images/textures/01.webp" },
    { title: "Block\n⠀Chain", image: "/images/textures/03.webp" },
];

const OpenRolesDatabase = [
  {
    title: 'Web Developer',
    positions: 3,
    responsibilities: [
      'Build responsive web interfaces with React/Next.js.',
      'Implement APIs, databases, and auth systems.',
      'Optimize performance and mobile responsiveness.',
      'Work with designers and backend teams.',
    ],
    opportunities: [
      'Ship real products used inside and outside SRC.',
      'Explore modern stacks like TanStack, GSAP, Tailwind.',
      'Contribute to open-source under the SRC banner.',
      'Get hands-on with real-world frontend + backend integration.',
    ],
    should_apply: [
      'You’ve built at least one complete frontend or full-stack app (e.g., portfolio, blog, to-do, e-commerce clone).',
      'You’ve connected APIs or built your own with Express, Firebase, or similar.',
      'You’ve explored routing, forms, or component-based architecture.',
      'You enjoy experimenting with UI and making things look/feel better.',
    ],
    should_not_apply: [
      'You’ve never finished a personal project.',
      'You rely only on tutorials and never tried solving things yourself.',
    ]
  },
  {
    title: 'AI / ML Engineer',
    positions: 3,
    responsibilities: [
      'Build AI tools using LLMs, OpenAI, Hugging Face, or LangChain.',
      'Explore prompt engineering, embeddings, and agents.',
      'Integrate AI models with other apps or services.',
      'Collaborate with product and dev teams.',
    ],
    opportunities: [
      'Build AI tools that solve real problems.',
      'Stay ahead in prompt workflows and open-source AI.',
      'Launch demos and contribute to club’s AI utility stack.',
      'Experiment with GPT, vision models, and more.',
    ],
    should_apply: [
      'You’ve built any AI-related project — even if it’s just with ChatGPT, Gradio, or basic ML notebooks.',
      'You’re genuinely curious about prompt engineering, embeddings, or LangChain.',
      'You’ve tried using APIs like OpenAI or played with datasets, models, etc.',
      'You want to build tools, not just write notebooks.',
    ],
    should_not_apply: [
      'You’ve never touched AI beyond watching videos.',
      'You only consume but never build or experiment.',
    ]
  },
  {
    title: 'Cybersecurity Lead',
    positions: 2,
    responsibilities: [
      'Conduct ethical hacking tests and CTFs.',
      'Create awareness around secure coding.',
      'Audit apps and open-source tools.',
      'Work with DevOps to patch vulnerabilities.',
    ],
    opportunities: [
      'Build a real ethical hacking portfolio.',
      'Host internal CTF nights and workshops.',
      'Represent SRC in security contests.',
      'Establish a club-wide security culture.',
    ],
    should_apply: [
      'You’ve explored hacking basics, done CTFs, or know what OWASP means.',
      'You’ve tried tools like Burp Suite, Nmap, or Kali Linux.',
      'You’ve attempted to break into apps (for fun or learning).',
      'You understand the mindset of an attacker.',
    ],
    should_not_apply: [
      'You don’t know the difference between frontend and backend vulnerabilities.',
      'You’re here just for the “hacker” tag.',
    ]
  },
  {
    title: 'DevOps Engineer',
    positions: 2,
    responsibilities: [
      'Manage CI/CD using GitHub Actions, Railway, Docker.',
      'Set up deployment pipelines and logs.',
      'Automate backend and infra flows.',
      'Collaborate with teams to ship clean and fast.',
    ],
    opportunities: [
      'Be the engine behind all live club products.',
      'Build infra systems, backups, and monitors.',
      'Learn automation and deployment at scale.',
      'Gain real-world infra experience from day one.',
    ],
    should_apply: [
      'You’ve deployed apps before (even on Vercel or Railway).',
      'You’ve used GitHub Actions, Docker, or explored automation.',
      'You enjoy systems work — making things fast, safe, and scalable.',
    ],
    should_not_apply: [
      'You’ve only worked locally and never pushed anything live.',
      'You dislike infrastructure and tooling.',
    ]
  },
  {
    title: 'Creative Technologist',
    positions: 2,
    responsibilities: [
      'Blend design + code to build interactive projects.',
      'Prototype with WebGL, shaders, AI art tools, or 3D frameworks.',
      'Collaborate with design and dev to build experimental work.',
      'Push SRC’s visual identity through projects.',
    ],
    opportunities: [
      'Lead futuristic, creative product demos.',
      'Experiment with emerging creative tech.',
      'Publish projects that combine art and logic.',
      'Get visibility in creative dev circles.',
    ],
    should_apply: [
      'You’ve made something cool: a shader, an AI art tool, a WebGL animation.',
      'You’ve used R3F, p5.js, Three.js, GSAP, or even Canva + code.',
      'You love building things that look different.',
    ],
    should_not_apply: [
      'You think “creative” only means visual design.',
      'You don’t enjoy design or motion at all.',
    ]
  },
  {
    title: 'Product Thinker',
    positions: 2,
    responsibilities: [
      'Decide what to build, why, and when.',
      'Work with teams to convert ideas into MVPs.',
      'Own user journeys and feedback loops.',
      'Help shape project priorities and success metrics.',
    ],
    opportunities: [
      'Think like a founder, not just a builder.',
      'Lead strategy for club’s tools and experiments.',
      'Influence drop themes and project lifecycles.',
      'Build a product-first mindset with real outputs.',
    ],
    should_apply: [
      'You’ve built something and realized the idea could’ve been better.',
      'You’re curious about users, market fit, and what’s useful.',
      'You think in workflows and problems, not just features.',
    ],
    should_not_apply: [
      'You only want to build, not think.',
      'You’ve never iterated or questioned a project idea.',
    ]
  },
  {
    title: 'UI/UX Designer',
    positions: 2,
    responsibilities: [
      'Design in Figma, Framer, or similar tools.',
      'Build scalable components and design systems.',
      'Collaborate with frontend engineers.',
      'Focus on accessibility and usability.',
    ],
    opportunities: [
      'Shape the look of every SRC product.',
      'Create dev-ready, responsive UI kits.',
      'Grow a visual design portfolio with real users.',
      'Influence design decisions across teams.',
    ],
    should_apply: [
      'You’ve used Figma to design a full app, not just screens.',
      'You understand spacing, hierarchy, and basic UX principles.',
      'You want your design to be real — not just pretty.',
    ],
    should_not_apply: [
      'You’ve never designed beyond a Dribbble shot.',
      'You don’t understand interaction or handoff.',
    ]
  },
  {
    title: 'Video Editor / Media Lead',
    positions: 2,
    responsibilities: [
      'Edit reels, motion graphics, and story-driven cuts.',
      'Use CapCut, Premiere, or any mobile tools.',
      'Collaborate with creative + content leads.',
      'Maintain a consistent, high-quality content vibe.',
    ],
    opportunities: [
      'Own SRC’s storytelling voice on video.',
      'Create high-impact reels and edits.',
      'Build a creator-level portfolio.',
      'Get traction on real posts with real engagement.',
    ],
    should_apply: [
      'You’ve edited reels, vlogs, or YouTube content.',
      'You know what a scroll-stopping hook looks like.',
      'You’ve posted something publicly before — even if it flopped.',
    ],
    should_not_apply: [
      'You’ve never opened a timeline.',
      'You’re not interested in video creativity.',
    ]
  },
  {
    title: 'Content & Social Strategist',
    positions: 2,
    responsibilities: [
      'Write punchy captions, CTAs, and hooks.',
      'Plan launch calendar and post ideas.',
      'Own the club’s tone and online voice.',
      'Collaborate with editors and designers.',
    ],
    opportunities: [
      'Write things thousands will read.',
      'Shape how SRC is seen and spoken about.',
      'Build skills in copywriting, brand voice, and social media growth.',
    ],
    should_apply: [
      'You’ve written posts, threads, memes, or anything public-facing.',
      'You understand how Gen Z reads and scrolls.',
      'You enjoy wordplay, smart humor, and punchy storytelling.',
    ],
    should_not_apply: [
      'You never write and don’t want to.',
      'You’re not plugged into modern internet tone.',
    ]
  },
  {
    title: 'Operations Lead',
    positions: 2,
    responsibilities: [
      'Manage team coordination, docs, and syncs.',
      'Maintain Notion, meetings, and backend systems.',
      'Ensure timelines and clarity across teams.',
      'Handle logistics and smooth functioning.',
    ],
    opportunities: [
      'Be the operational brain of the club.',
      'Coordinate teams like a product manager.',
      'Master Notion, systems, and club workflow tools.',
      'Enable creators to stay focused.',
    ],
    should_apply: [
      'You’ve managed a team, event, or project before.',
      'You love organizing chaos into structure.',
      'You want to support builders by enabling smooth execution.',
    ],
    should_not_apply: [
      'You don’t like managing people or timelines.',
      'You aren’t detail-oriented.',
    ]
  },
  {
    title: 'Vision & Strategy Lead',
    positions: 1,
    responsibilities: [
      'Set the larger direction and energy of the club.',
      'Decide seasonal themes, experiments, and focus.',
      'Inspire teams to build beyond the obvious.',
      'Spot future trends and steer the club accordingly.',
    ],
    opportunities: [
      'Shape the very soul of SRC.',
      'Lead Drop campaigns and long-term positioning.',
      'Think like a founder, act like a strategist.',
      'Turn chaos into clarity, and curiosity into innovation.',
    ],
    should_apply: [
      'You’re always asking: “What’s next?”',
      'You think beyond code and into culture.',
      'You’ve led teams or launched personal missions before.',
    ],
    should_not_apply: [
      'You just want to follow.',
      'You aren’t ready to challenge the norm.',
    ]
  },
];


const AssetsDatabase = {
    images: [
        "/images/holder.png",
        "/images/textures/01.webp",
        "/images/textures/02.webp",
        "/images/textures/03.webp",
        "/images/textures/04.webp",
        "/images/textures/05.webp",
        "/images/textures/06.webp",
        "/images/textures/parchment.jpg",
        "/images/mentors/aayush.webp",
        "/images/mentors/adarsh.webp",
        "/images/mentors/akarsh.webp",
        "/images/mentors/ali.webp",
        "/images/mentors/anurag.webp",
        "/images/mentors/harsh.webp",
        "/images/mentors/patel.webp",
        '/images/mentors/ankur.webp',
        '/images/mentors/sarthak.webp',
        // ...Array.from({ length: 28 }, (_, i) => `/videos/timelapse/${i + 1}.webp`),

    ],
    fonts: [
        { name: 'Bulevar', url: '/fonts/bulevar-regular.woff2', weight: 'normal' },
        { name: 'Bulevar', url: '/fonts/bulevar-poster.woff2', weight: 'bold' },
        { name: 'Decaydence', url: '/fonts/Decaydence.woff2', weight: 'normal' },
        { name: 'Minecraft', url: '/fonts/Minecraft.woff2', weight: 'normal' },
        { name: 'NeueMontreal', url: '/fonts/PPNeueMontreal-Regular.woff2', weight: 'normal' }
    ],
    videos: [
        '/videos/showreel.mp4'
    ],
    audios: [
        '/audio/bg.mp3'
    ]
};



export {
    MentorDatabase,
    CarouselDatabase,
    OpenRolesDatabase,
    AssetsDatabase
}
