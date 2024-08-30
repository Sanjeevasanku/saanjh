from flask import Flask, request, jsonify
from flask_cors import CORS
from ctransformers import AutoModelForCausalLM

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the local Mistral model
model_path = r"C:\Users\Sanjeeva Sanku\Downloads\mistral-7b-instruct-v0.1.Q4_K_S.gguf"
model = AutoModelForCausalLM.from_pretrained(model_path)

@app.route('/biomistral/predict', methods=['POST'])
def diagnose():
    data = request.json
    
    if not data or 'content' not in data:
        return jsonify({'error': 'Invalid input data'}), 400
    
    msgs = [
        {"role": "system", "content": "The user will give you a medical report, give a diagnosis for the text report provided."},
        {"role": "user", "content": data['content']}
    ]
    
    try:
        # Prepare the input
        input_text = msgs[1]['content']
        inputs = model.tokenize(input_text)
        
        # Generate the response from the model
        outputs = model.generate(inputs)
        
        # Collect all outputs from the generator
        diagnosis_list = list(outputs)
        
        # Decode the first output (assuming single output for simplicity)
        diagnosis = diagnosis_list[0]
        
        return jsonify({'diagnosis': diagnosis})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
