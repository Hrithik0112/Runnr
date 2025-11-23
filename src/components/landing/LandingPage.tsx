import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/app')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 via-accent-500 to-teal-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-display font-bold text-neutral-900">Runnr</span>
            </div>
            <button
              onClick={handleGetStarted}
              className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-display font-semibold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-6 sm:px-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-accent-50 to-teal-50 opacity-50"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-neutral-200 shadow-soft">
              <span className="text-sm font-mono font-semibold text-primary-600">Visual CI/CD Builder</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display font-bold text-neutral-900 leading-[1.1] mb-8">
              Build Pipelines,
              <br />
              <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-teal-600 bg-clip-text text-transparent">
                Not Code
              </span>
            </h1>
            
            <p className="text-2xl sm:text-3xl text-neutral-600 font-sans font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
              Create GitHub Actions workflows with drag-and-drop. No YAML knowledge required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={handleGetStarted}
                className="px-10 py-5 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-display font-bold text-lg rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              >
                Start Building Free
              </button>
              <button className="px-10 py-5 bg-white text-neutral-700 font-display font-semibold text-lg rounded-2xl border-2 border-neutral-300 hover:border-primary-400 hover:text-primary-600 transition-all duration-300 shadow-soft hover:shadow-medium w-full sm:w-auto">
                Watch Demo
              </button>
            </div>

            {/* Hero Visual - Boxy Style */}
            <div className="mt-20 max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-white to-neutral-50 rounded-3xl p-8 border-2 border-neutral-200 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-8 border-2 border-neutral-200 shadow-large hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="h-6 bg-gradient-to-r from-primary-200 to-accent-200 rounded-lg mb-4 w-3/4"></div>
                      <div className="h-4 bg-neutral-100 rounded-lg mb-3 w-full"></div>
                      <div className="h-4 bg-neutral-100 rounded-lg mb-3 w-5/6"></div>
                      <div className="h-4 bg-neutral-100 rounded-lg w-4/6"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-display font-bold text-neutral-900 mb-6">
              Everything You Need
            </h2>
            <p className="text-2xl text-neutral-600 font-sans font-medium max-w-3xl mx-auto">
              Build complex CI/CD workflows with an intuitive visual interface
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-neutral-50 rounded-3xl p-10 border-2 border-neutral-200 shadow-large hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-display font-bold text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed text-lg font-sans">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-6 sm:px-8 bg-gradient-to-br from-primary-50 via-accent-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-display font-bold text-neutral-900 mb-6">
              How It Works
            </h2>
            <p className="text-2xl text-neutral-600 font-sans font-medium max-w-3xl mx-auto">
              Three simple steps to your first pipeline
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 text-white font-display font-bold text-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  {index + 1}
                </div>
                <h3 className="text-3xl font-display font-bold text-neutral-900 mb-4">{step.title}</h3>
                <p className="text-neutral-600 text-xl leading-relaxed font-sans">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-display font-bold text-neutral-900 mb-6">
              Loved by Developers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-neutral-50 rounded-3xl p-10 border-2 border-neutral-200 shadow-large"
              >
                <p className="text-xl text-neutral-700 font-sans leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400"></div>
                  <div>
                    <p className="font-display font-bold text-neutral-900">{testimonial.name}</p>
                    <p className="text-neutral-600 font-sans">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 sm:px-8 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-accent-600/20 to-teal-600/20"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-5xl sm:text-6xl font-display font-bold text-white mb-6">
            Ready to Build?
          </h2>
          <p className="text-2xl text-neutral-300 mb-12 font-sans font-medium">
            Start creating your CI/CD pipelines in minutes, not hours.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-12 py-6 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-display font-bold text-xl rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 sm:px-8 border-t-2 border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-6 sm:mb-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 via-accent-500 to-teal-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-display font-bold text-neutral-900">Runnr</span>
            </div>
            <p className="text-neutral-600 font-sans">
              © 2024 Runnr. Built for developers, by developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: 'Drag & Drop Builder',
    description: 'Intuitive visual interface to build complex workflows without writing YAML manually.',
    color: 'bg-gradient-to-br from-primary-100 to-primary-200',
    icon: (
      <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    ),
  },
  {
    title: 'Live YAML Preview',
    description: 'See your workflow YAML update in real-time as you build. Copy or download instantly.',
    color: 'bg-gradient-to-br from-accent-100 to-accent-200',
    icon: (
      <svg className="w-8 h-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Job Dependencies',
    description: 'Visualize and manage complex job dependencies with automatic connection lines.',
    color: 'bg-gradient-to-br from-teal-100 to-teal-200',
    icon: (
      <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: 'Workflow Templates',
    description: 'Start quickly with pre-built templates for Node.js, Python, Docker, and more.',
    color: 'bg-gradient-to-br from-primary-100 to-accent-200',
    icon: (
      <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
      </svg>
    ),
  },
  {
    title: 'Auto-Save',
    description: 'Your work is automatically saved locally. Never lose your progress.',
    color: 'bg-gradient-to-br from-teal-100 to-primary-200',
    icon: (
      <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
    ),
  },
  {
    title: 'Undo/Redo',
    description: 'Full history support with undo/redo functionality. Experiment fearlessly.',
    color: 'bg-gradient-to-br from-accent-100 to-teal-200',
    icon: (
      <svg className="w-8 h-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    ),
  },
]

const steps = [
  {
    title: 'Drag Components',
    description: 'Drag jobs, steps, and triggers from the sidebar onto the canvas.',
  },
  {
    title: 'Configure Properties',
    description: 'Edit properties in the inspector panel. See changes update in real-time.',
  },
  {
    title: 'Copy YAML',
    description: 'Copy the generated YAML and paste it into your GitHub Actions workflow file.',
  },
]

const testimonials = [
  {
    quote: 'Runnr transformed how we build CI/CD pipelines. No more YAML headaches!',
    name: 'Sarah Chen',
    role: 'Senior DevOps Engineer',
  },
  {
    quote: 'Finally, a tool that makes GitHub Actions accessible to everyone on the team.',
    name: 'Marcus Johnson',
    role: 'Engineering Lead',
  },
]
