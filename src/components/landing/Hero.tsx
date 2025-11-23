const Hero = ( { handleNavigateToBuilder }: { handleNavigateToBuilder: () => void }) => {
  return (
    <section className="pt-28 pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="inline-block mb-5 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
              <span className="text-xs font-mono text-slate-600">Visual CI/CD Builder</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-slate-900 leading-tight mb-5">
              <span className="font-sans font-semibold">
                Build Pipelines
              </span>
              <br />
              <span className="font-sans font-light text-slate-700 inline-block">
                Without Writing 
                <span className="font-mono font-bold inline-block ml-1 bg-slate-300 px-1 rounded-md">YAML</span>
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 font-sans mb-8 max-w-2xl mx-auto leading-relaxed">
              Design GitHub Actions workflows visually with drag-and-drop. Generate production-ready YAML automatically. Ship faster, spend less time debugging syntax.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16">
              <button
                onClick={handleNavigateToBuilder}
                className="px-6 py-2.5 bg-slate-900 text-white font-sans font-medium text-sm rounded-md hover:bg-slate-800 transition-colors duration-200 w-full sm:w-auto"
              >
                Start Building
              </button>
              <button className="px-6 py-2.5 bg-white text-slate-700 font-sans font-medium text-sm rounded-md border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-colors duration-200 w-full sm:w-auto">
                Watch Demo
              </button>
            </div>

          </div>
        </div>
      </section>
  )
}

export default Hero