import React from 'react'

const Feature = () => {
  return (
    <section className="py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-sans font-semibold text-slate-900 mb-3">
              Everything You Need
            </h2>
            <p className="text-base text-slate-600 font-sans max-w-2xl mx-auto">
              Build complex CI/CD workflows with an intuitive visual interface
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-base font-mono font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-sans">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default Feature

const features = [
    {
      title: 'Drag & Drop Builder',
      description: 'Intuitive visual interface to build complex workflows without writing YAML manually.',
      icon: (
        <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
    },
    {
      title: 'Live YAML Preview',
      description: 'See your workflow YAML update in real-time as you build. Copy or download instantly.',
      icon: (
        <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Job Dependencies',
      description: 'Visualize and manage complex job dependencies with automatic connection lines.',
      icon: (
        <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: 'Workflow Templates',
      description: 'Start quickly with pre-built templates for Node.js, Python, Docker, and more.',
      icon: (
        <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
        </svg>
      ),
    },
    {
      title: 'Auto-Save',
      description: 'Your work is automatically saved locally. Never lose your progress.',
      icon: (
        <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      ),
    },
    {
      title: 'Undo/Redo',
      description: 'Full history support with undo/redo functionality. Experiment fearlessly.',
      icon: (
        <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      ),
    },
  ]