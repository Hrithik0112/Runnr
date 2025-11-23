import React from 'react'

const Footer = () => {
  return (
    <footer className="py-12 px-4 sm:px-6 border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-base font-sans font-medium text-slate-900">Runnr</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600 font-sans">
              <span>Update 2025</span>
              <span>•</span>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-slate-900 transition-colors duration-200"
              >
                Made by Your Name
              </a>
            </div>
          </div>
        </div>
      </footer>
  )
}

export default Footer