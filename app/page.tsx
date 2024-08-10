'use client';

import { useState } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [args, setArgs] = useState({
    base_weights: {
      PERSON: 2.0,
      ORG: 1.8,
      LOC: 1.5,
      DATE: 1.2,
      default: 1.0
    },
    use_entity_score: true,
    separate_entity_score: true,
    position_weight: 1.25,
    summary_ratio: 0.3,
    min_sentences: 3
  });

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText, args }),
      });

      if (!response.ok) {
        throw new Error('Failed to summarize text');
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error:', error);
      setSummary('An error occurred while summarizing the text.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArgChange = (key: string, value: number | boolean) => {
    setArgs(prevArgs => ({ ...prevArgs, [key]: value }));
  };

  const handleBaseWeightChange = (entity: string, value: string) => {
    setArgs(prevArgs => ({
      ...prevArgs,
      base_weights: { ...prevArgs.base_weights, [entity]: parseFloat(value) }
    }));
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Text Summarizer</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block mb-2 font-bold">Input Text:</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            placeholder="Enter your text here..."
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-bold">Base Weights:</label>
            {Object.entries(args.base_weights).map(([entity, weight]) => (
              <div key={entity} className="flex items-center mb-2">
                <span className="w-20">{entity}:</span>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => handleBaseWeightChange(entity, e.target.value)}
                  className="w-20 p-1 border border-gray-300 rounded text-black"
                />
              </div>
            ))}
          </div>
          <div>
            <div className="mb-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={args.use_entity_score}
                  onChange={(e) => handleArgChange('use_entity_score', e.target.checked)}
                  className="mr-2"
                />
                Use Entity Score
              </label>
            </div>
            <div className="mb-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={args.separate_entity_score}
                  onChange={(e) => handleArgChange('separate_entity_score', e.target.checked)}
                  className="mr-2"
                />
                Separate Entity Score
              </label>
            </div>
            <div className="mb-2">
              <label className="block mb-1">Position Weight:</label>
              <input
                type="number"
                step="0.05"
                value={args.position_weight}
                onChange={(e) => handleArgChange('position_weight', parseFloat(e.target.value))}
                className="w-20 p-1 border border-gray-300 rounded text-black"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Summary Ratio:</label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={args.summary_ratio}
                onChange={(e) => handleArgChange('summary_ratio', parseFloat(e.target.value))}
                className="w-20 p-1 border border-gray-300 rounded text-black"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Minimum Sentences:</label>
              <input
                type="number"
                step="1"
                min="1"
                value={args.min_sentences}
                onChange={(e) => handleArgChange('min_sentences', parseInt(e.target.value))}
                className="w-20 p-1 border border-gray-300 rounded text-black"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? 'Summarizing...' : 'Summarize'}
        </button>
      </form>
      {summary && (
        <div>
          <h2 className="text-2xl font-bold mb-2">Summary:</h2>
          <p className="p-2 border border-gray-300 rounded">{summary}</p>
        </div>
      )}
    </main>
  );
}