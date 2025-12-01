from flask import Flask
from transformers import pipeline

app = Flask(__name__)

# Example of using the transformers library
# This might take some time to download the model on the first run
try:
    classifier = pipeline('sentiment-analysis')
    default_sentiment = classifier('We are very happy to show you the 🤗 Transformers library.')
except Exception as e:
    default_sentiment = f"Error loading transformer model: {e}"

@app.route('/')
def hello_world():
    return 'Hello from Flask!'

@app.route('/sentiment')
def sentiment():
    # This is a simplified example.
    # In a real application, you would pass text to the classifier.
    return str(default_sentiment)

if __name__ == '__main__':
    app.run(debug=True)
