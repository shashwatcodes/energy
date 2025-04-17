import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Sun,
  Wind,
  Droplet,
  Leaf,
  BarChart,
  Battery,
  Factory,
  CloudSun,
} from "lucide-react"

const energyData = {
  global: {
    title: "Global Renewable Energy Statistics",
    stats: [
      { label: "Total Renewable Energy Capacity", value: "3,064 GW", year: 2022 },
      { label: "Annual Investment", value: "$366 billion", year: 2022 },
      { label: "Jobs in Renewable Sector", value: "12.7 million", year: 2022 },
      { label: "CO2 Emissions Avoided", value: "2.1 billion tonnes", year: 2022 },
    ],
  },
  india: {
    title: "India's Renewable Energy Progress",
    stats: [
      { label: "Installed Renewable Capacity", value: "168.96 GW", year: 2023 },
      { label: "Solar Power Capacity", value: "66.72 GW", year: 2023 },
      { label: "Wind Power Capacity", value: "42.85 GW", year: 2023 },
      { label: "Biomass Power Capacity", value: "10.73 GW", year: 2023 },
    ],
  },
}

const technologies = [
  {
    name: "Solar Photovoltaic (PV)",
    icon: <Sun className="h-8 w-8" />,
    description:
      "Converts sunlight directly into electricity using semiconductor materials.",
    efficiency: "15-20% typical efficiency",
    applications: ["Residential rooftops", "Solar farms", "Portable devices"],
    advantages: ["Zero emissions", "Low maintenance", "Scalable"],
    challenges: ["Weather dependent", "Storage needs", "Initial cost"],
  },
  {
    name: "Wind Power",
    icon: <Wind className="h-8 w-8" />,
    description:
      "Harnesses wind energy through turbines to generate electricity.",
    efficiency: "35-45% typical efficiency",
    applications: ["Onshore wind farms", "Offshore installations", "Microgeneration"],
    advantages: ["Cost-effective", "Land-use compatible", "No fuel needed"],
    challenges: ["Wind variability", "Location constraints", "Wildlife impact"],
  },
  {
    name: "Hydroelectric",
    icon: <Droplet className="h-8 w-8" />,
    description: "Generates power from flowing water through turbines.",
    efficiency: "90-95% typical efficiency",
    applications: ["Large dams", "Run-of-river", "Pumped storage"],
    advantages: ["High reliability", "Long lifespan", "Low operating cost"],
    challenges: ["Environmental impact", "High initial cost", "Location dependent"],
  },
  {
    name: "Biomass",
    icon: <Leaf className="h-8 w-8" />,
    description: "Converts organic matter into heat or electricity.",
    efficiency: "20-35% typical efficiency",
    applications: ["Power plants", "Combined heat and power", "Residential heating"],
    advantages: ["Carbon neutral", "Waste reduction", "Reliable baseload"],
    challenges: ["Land use", "Resource competition", "Emissions control"],
  },
]

const researchTopics = [
  {
    title: "Next-Generation Solar Cells",
    description:
      "Research into perovskite solar cells, multi-junction cells, and organic photovoltaics.",
    status: "Active Research",
    potential: "30%+ efficiency potential",
  },
  {
    title: "Advanced Energy Storage",
    description:
      "Development of solid-state batteries, flow batteries, and thermal storage systems.",
    status: "Breakthrough Expected",
    potential: "80% cost reduction by 2030",
  },
  {
    title: "Smart Grid Integration",
    description: "AI-powered grid management and demand response systems.",
    status: "Implementation Phase",
    potential: "15% grid efficiency improvement",
  },
  {
    title: "Green Hydrogen Production",
    description: "Renewable energy-powered electrolysis for clean hydrogen production.",
    status: "Scaling Up",
    potential: "$2/kg production cost target",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture1-E4XatmMyzuEoIzp6xNw5U5BN49gv8e.png"
                alt="e-Yantra Logo"
                width={150}
                height={50}
                className="mr-2"
              />
            </div>
            <ul className="flex flex-wrap justify-center gap-6">
              <li>
                <Link href="/" className="hover:text-primary font-medium">
                  Home
                </Link>
              </li>
                <li>
                  <Link href="#about" className="hover:text-primary font-medium">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#technologies" className="hover:text-primary font-medium">
                    Technologies
                  </Link>
                </li>
                <li>
                  <Link href="#research" className="hover:text-primary font-medium">
                    Research
                  </Link>
                </li>
              <li>
                <Link href="/games" className="hover:text-primary font-medium">
                  Energy Games
                </Link>
              </li>
              <li>
                <Link href="/analysis" className="hover:text-primary font-medium">
                  Energy Analysis
                </Link>
              </li>
              {/* <li>
                <Link href="#contact" className="hover:text-primary font-medium">
                  Contact
                </Link>
              </li> */}
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="eyantra-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Renewable Energy Innovation Hub
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Empowering the future through sustainable energy solutions and cutting-edge research
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#technologies"
              className="inline-flex items-center bg-white text-primary px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              Explore Technologies
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/analysis"
              className="inline-flex items-center bg-secondary text-white px-6 py-3 rounded-full font-bold hover:bg-secondary/90 transition-colors"
            >
              Energy Analysis Tools
              <BarChart className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Global Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {energyData.global.title}
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {energyData.global.stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-600 mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section id="technologies" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Renewable Energy Technologies
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">{tech.icon}</div>
                  <h3 className="text-xl font-bold">{tech.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{tech.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Efficiency</h4>
                    <p className="text-primary">{tech.efficiency}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Applications</h4>
                    <ul className="list-disc list-inside text-sm">
                      {tech.applications.map((app, i) => (
                        <li key={i}>{app}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Advantages</h4>
                  <ul className="list-disc list-inside text-sm grid grid-cols-2 gap-2">
                    {tech.advantages.map((adv, i) => (
                      <li key={i}>{adv}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Challenges</h4>
                  <ul className="list-disc list-inside text-sm grid grid-cols-2 gap-2">
                    {tech.challenges.map((challenge, i) => (
                      <li key={i}>{challenge}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research and Innovation Section */}
      <section id="research" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Latest Research & Innovation
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchTopics.map((topic, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{topic.title}</h3>
                  <p className="text-gray-600 mb-4">{topic.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CloudSun className="h-4 w-4 mr-2 text-primary" />
                      <span>Status: {topic.status}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <BarChart className="h-4 w-4 mr-2 text-primary" />
                      <span>Potential: {topic.potential}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* India's Progress Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {energyData.india.title}
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {energyData.india.stats.map((stat, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-600 mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Resources Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Educational Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Battery className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Energy Storage Fundamentals</h3>
              <p className="text-gray-600 mb-4">
                Learn about different energy storage technologies, from batteries to pumped hydro storage.
              </p>
              <Link
                href="/resources/storage"
                className="text-primary font-medium hover:underline inline-flex items-center"
              >
                Start Learning
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Factory className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Smart Grid Technology</h3>
              <p className="text-gray-600 mb-4">
                Explore how smart grids are revolutionizing energy distribution and management.
              </p>
              <Link
                href="/resources/smart-grid"
                className="text-primary font-medium hover:underline inline-flex items-center"
              >
                Start Learning
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <CloudSun className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Climate Impact Analysis</h3>
              <p className="text-gray-600 mb-4">
                Understand how renewable energy helps combat climate change and reduce emissions.
              </p>
              <Link
                href="/resources/climate-impact"
                className="text-primary font-medium hover:underline inline-flex items-center"
              >
                Start Learning
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {/* <section id="contact" className="py-16 eyantra-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Have questions about renewable energy or want to collaborate on research? Reach out to our team of experts.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-primary px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section> */}

      {/* Footer */}
      {/* <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture1-E4XatmMyzuEoIzp6xNw5U5BN49gv8e.png"
                alt="e-Yantra Logo"
                width={120}
                height={40}
                className="mb-4"
              />
              <p className="text-gray-300">
                Empowering sustainable energy innovation through research, education, and technology.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="text-gray-300 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#technologies" className="text-gray-300 hover:text-white">
                    Technologies
                  </Link>
                </li>
                <li>
                  <Link href="#research" className="text-gray-300 hover:text-white">
                    Research
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/resources/storage" className="text-gray-300 hover:text-white">
                    Energy Storage
                  </Link>
                </li>
                <li>
                  <Link href="/resources/smart-grid" className="text-gray-300 hover:text-white">
                    Smart Grid
                  </Link>
                </li>
                <li>
                  <Link href="/resources/climate-impact" className="text-gray-300 hover:text-white">
                    Climate Impact
                  </Link>
                </li>
                <li>
                  <Link href="/analysis" className="text-gray-300 hover:text-white">
                    Energy Analysis
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="space-y-2">
                <p className="text-gray-300">Email: info@eyantra.org</p>
                <p className="text-gray-300">Phone: +91 (22) 2576 4989</p>
                <div className="flex space-x-4 mt-4">
                  <a href="#" className="text-gray-300 hover:text-white">
                    Twitter
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white">
                    LinkedIn
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white">
                    YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} e-Yantra. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
    </div>
  )
}
