
import React, { useState } from 'react';
import { analyzeMovie } from './services/geminiService';
import { AnalysisState } from './types';
import ScoreGauge from './components/ScoreGauge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [state, setState] = useState<AnalysisState>({
    data: null,
    loading: false,
    error: null
  });

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setState({ ...state, loading: true, error: null });
    try {
      const result = await analyzeMovie(input);
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      console.error(err);
      setState({ 
        data: null, 
        loading: false, 
        error: "Failed to analyze the movie. Please try again later." 
      });
    }
  };

  const chartData = state.data ? [
    { name: 'Story', score: state.data.storyQualityScore, color: '#3b82f6' },
    { name: 'Sentiment', score: state.data.sentimentScore, color: '#10b981' },
    { name: 'Society', score: state.data.societalImpactScore, color: '#f59e0b' },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-lg">C</div>
            <h1 className="text-xl font-bold tracking-tight">CineMetrics</h1>
          </div>
          <p className="text-sm text-slate-400 hidden sm:block">AI Movie & Societal Analysis</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-12">
        {/* Input Section */}
        <section className="mb-12">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Is the story good? Does it help society?
            </h2>
            <p className="text-lg text-slate-400">
              Enter a movie title or paste a plot summary to get an in-depth analysis of its narrative quality and social impact.
            </p>
          </div>

          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Interstellar, The Godfather, or a custom plot..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <button
              onClick={handleAnalyze}
              disabled={state.loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center justify-center min-w-[140px]"
            >
              {state.loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : 'Analyze'}
            </button>
          </div>
          {state.error && <p className="text-red-400 text-center mt-4">{state.error}</p>}
        </section>

        {/* Results Section */}
        {state.data && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Summary & Main Scores */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-3xl font-bold">{state.data.title}</h3>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-sm font-semibold">
                      {state.data.overallSentiment} Sentiment
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-8 text-lg italic">
                    "{state.data.summary}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <ScoreGauge score={state.data.storyQualityScore} label="Story Quality" color="#3b82f6" />
                    <ScoreGauge score={state.data.sentimentScore} label="Positivity" color="#10b981" />
                    <ScoreGauge score={state.data.societalImpactScore} label="Society Impact" color="#f59e0b" />
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-8">
                  <h4 className="text-xl font-bold mb-6 flex items-center">
                    <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span>
                    Societal Development Evaluation
                  </h4>
                  <div className="space-y-6">
                    <div>
                      <p className="text-slate-200 text-lg leading-relaxed mb-4">
                        {state.data.societalDevelopment.contributionToSociety}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {state.data.societalDevelopment.keyThemes.map((theme, i) => (
                          <span key={i} className="bg-slate-700 px-3 py-1 rounded text-sm text-slate-300">
                            #{theme}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-700/50">
                      <div>
                        <h5 className="text-emerald-400 font-semibold mb-3">Positive Impacts</h5>
                        <ul className="space-y-2">
                          {state.data.societalDevelopment.potentialPositiveImpact.map((item, i) => (
                            <li key={i} className="flex items-start text-sm text-slate-300">
                              <span className="text-emerald-500 mr-2">✓</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-amber-400 font-semibold mb-3">Critical Concerns</h5>
                        <ul className="space-y-2">
                          {state.data.societalDevelopment.potentialNegativeInfluences.map((item, i) => (
                            <li key={i} className="flex items-start text-sm text-slate-300">
                              <span className="text-amber-500 mr-2">⚠</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative Analysis & Charts */}
              <div className="space-y-8">
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-6">Score Visualization</h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                          cursor={{fill: '#1e293b'}} 
                          contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px'}}
                        />
                        <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={40}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                  <h4 className="text-xl font-bold mb-6">Narrative Details</h4>
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Pacing & Structure</h5>
                      <p className="text-sm text-slate-300">{state.data.narrativeAnalysis.pacing}</p>
                    </div>
                    <div>
                      <h5 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Character Depth</h5>
                      <p className="text-sm text-slate-300">{state.data.narrativeAnalysis.characterDepth}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-700/50">
                      <h5 className="text-sm font-semibold text-blue-400 mb-2">Strengths</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {state.data.narrativeAnalysis.strengths.map((s, i) => (
                          <li key={i} className="text-xs text-slate-400">{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border border-blue-500/30 rounded-2xl p-6">
                  <h4 className="text-lg font-bold mb-3 text-blue-400 italic">CineMetrics Verdict</h4>
                  <p className="text-slate-200 leading-relaxed">
                    {state.data.finalVerdict}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!state.data && !state.loading && (
          <div className="mt-20 flex flex-col items-center justify-center opacity-40">
            <svg className="w-24 h-24 mb-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            <p className="text-xl font-medium">Ready for your first analysis</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-24 py-12 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>© 2024 CineMetrics. Powered by Gemini AI for Media Criticism.</p>
        <p className="mt-2">Analyze responsibly. Film is subjective.</p>
      </footer>
    </div>
  );
};

export default App;
