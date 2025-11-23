import React from 'react'

const HowItworks = () => {
  return (
    <section className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-sans font-semibold text-slate-900 mb-3">
              How It Works
            </h2>
            <p className="text-base text-slate-600 font-sans max-w-2xl mx-auto">
              Three simple steps to your first pipeline
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-lg bg-slate-900 text-white font-sans font-semibold text-lg flex items-center justify-center mx-auto mb-5">
                  {index + 1}
                </div>
                <h3 className="text-lg font-sans font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-sans">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default HowItworks

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
  