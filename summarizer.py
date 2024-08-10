import base64
import sys
import json
import spacy
from collections import Counter

nlp = spacy.load("en_core_web_sm")

def get_entity_weights(doc, base_weights):
    entity_counts = Counter([ent.label_ for ent in doc.ents])
    max_count = max(entity_counts.values()) if entity_counts else 1
    weights = {ent_type: base_weights.get(ent_type, base_weights['default']) * (count / max_count)
               for ent_type, count in entity_counts.items()}
    return weights

def summarize(text, base_weights, use_entity_score, separate_entity_score, 
              position_weight, summary_ratio, min_sentences):
    doc = nlp(text)
    
    entity_weights = get_entity_weights(doc, base_weights) if use_entity_score else {}
    
    word_freq = Counter()
    entity_freq = Counter()
    for token in doc:
        if not token.is_stop and not token.is_punct:
            if use_entity_score:
                if token.ent_type_:
                    entity_freq[token.ent_type_] += 1
                    if not separate_entity_score:
                        word_freq[token.text.lower()] += 1
                else:
                    word_freq[token.text.lower()] += 1
            else:
                word_freq[token.text.lower()] += 1
    
    max_freq = max(word_freq.values()) if word_freq else 1
    
    sentences = list(doc.sents)
    num_sentences = len(sentences)
    
    sentence_scores = []
    for i, sent in enumerate(sentences):
        if use_entity_score and separate_entity_score:
            word_score = sum(word_freq[token.text.lower()] / max_freq for token in sent 
                             if not token.is_stop and not token.is_punct and not token.ent_type_)
            entity_score = sum(entity_weights.get(ent.label_, entity_weights.get('default', 1.0)) 
                               for ent in sent.ents)
            score = word_score + entity_score
        else:
            score = sum(word_freq[token.text.lower()] / max_freq for token in sent 
                        if not token.is_stop and not token.is_punct)
            if use_entity_score:
                score += sum(entity_weights.get(ent.label_, entity_weights.get('default', 1.0)) 
                             for ent in sent.ents)
        
        # Position-based weighting
        if num_sentences > 1:
            first_5_percent = max(1, int(0.05 * num_sentences))
            last_5_percent = max(1, int(0.95 * num_sentences))
            if i < first_5_percent or i >= last_5_percent:
                score *= position_weight
        
        sentence_scores.append((sent, score))
    
    # Sort sentences by score in descending order
    sentence_scores.sort(key=lambda x: x[1], reverse=True)
    
    # Select top sentences based on summary_ratio
    num_summary_sentences = max(min_sentences, int(num_sentences * summary_ratio))
    summary_sentences = [sent.text for sent, _ in sentence_scores[:num_summary_sentences]]
    
    # Reorder summary sentences to maintain original text flow
    summary_sentences.sort(key=lambda s: text.index(s))
    
    return " ".join(summary_sentences)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python summarizer.py <input_text> <base64_encoded_args>")
        sys.exit(1)

    input_text = sys.argv[1]
    args_base64 = sys.argv[2]
    
    # Decode the base64 encoded args
    args_json = base64.b64decode(args_base64).decode('utf-8')
    args = json.loads(args_json)
    
    summary = summarize(
        input_text,
        base_weights=args['base_weights'],
        use_entity_score=args['use_entity_score'],
        separate_entity_score=args['separate_entity_score'],
        position_weight=args['position_weight'],
        summary_ratio=args['summary_ratio'],
        min_sentences=args['min_sentences']
    )
    
    print(summary)