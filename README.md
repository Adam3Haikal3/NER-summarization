# NER-Enhanced Text Summarizer

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Introduction

This NER-Enhanced Text Summarizer is an innovative project that leverages Named Entity Recognition (NER) to create more informative and context-aware summaries of long-form text. By giving special weight to named entities such as persons, organizations, and locations, this summarizer aims to preserve the most crucial information in the summarization process.

### Why NER for Summarization?

Traditional summarization techniques often focus on frequency-based or position-based importance of words and sentences. However, these methods can miss crucial contextual information. Named entities often carry significant meaning in a text, regardless of their frequency. By incorporating NER, we ensure that key actors, organizations, and places are appropriately represented in the final summary.

## Features

- **Entity-Aware Summarization**: Utilizes spaCy's NER capabilities to identify and prioritize named entities.
- **Configurable Entity Weights**: Customize the importance of different entity types (e.g., PERSON, ORG, LOC).
- **Adjustable Summary Length**: Control the output length with a summary ratio parameter.
- **Position-Based Weighting**: Option to give more weight to sentences at the beginning and end of the text.
- **Separate Entity Scoring**: Toggle between combined and separate scoring for words and entities.
- **Web Interface**: Easy-to-use Next.js frontend for inputting text and adjusting parameters.
- **API Endpoint**: Summarize text programmatically using a RESTful API.

## How It Works

1. **Text Processing**: The input text is processed using spaCy's NLP pipeline.
2. **Entity Recognition**: Named entities are identified and categorized.
3. **Frequency Analysis**: Word and entity frequencies are calculated.
4. **Sentence Scoring**: Each sentence is scored based on:
   - Word importance (frequency-based)
   - Entity importance (based on configurable weights)
   - Sentence position
5. **Summary Generation**: Top-scoring sentences are selected and reordered to maintain the original text flow.

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ner-enhanced-summarizer.git
cd ner-enhanced-summarizer

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install

# Download spaCy model
python -m spacy download en_core_web_sm
```

## Usage

To run the web interface:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser to use the summarizer.

## Configuration

You can adjust the following parameters:

- `base_weights`: Importance weights for different entity types
- `use_entity_score`: Toggle entity-based scoring
- `separate_entity_score`: Toggle separate scoring for entities and words
- `position_weight`: Adjust the importance of sentence position
- `summary_ratio`: Control the length of the output summary
- `min_sentences`: Set a minimum number of sentences for the summary

## API Reference

Endpoint: `POST /api/summarize`

Request body:
```json
{
  "text": "Your long text here...",
  "args": {
    "base_weights": {"PERSON": 2.0, "ORG": 1.8, "LOC": 1.5, "DATE": 1.2, "default": 1.0},
    "use_entity_score": true,
    "separate_entity_score": true,
    "position_weight": 1.25,
    "summary_ratio": 0.3,
    "min_sentences": 3
  }
}
```

Response:
```json
{
  "summary": "Generated summary text..."
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [spaCy](https://spacy.io/) for NLP and NER capabilities
- [Next.js](https://nextjs.org/) for the web framework
- [Tailwind CSS](https://tailwindcss.com/) for styling