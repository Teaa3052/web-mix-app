from flask import Flask, request, jsonify
from flask_cors import CORS

from routes.simple_mix import simple_bp
from routes.complex_mix import complex_bp

app = Flask(__name__)
CORS(app)

# Test routes
@app.route('/')
def home():
    return "Backend is working!"

@app.route('/test')
def test():
    return jsonify({"message": "API is working!"})

# registracija blueprintova
app.register_blueprint(simple_bp, url_prefix="/api/mix")
app.register_blueprint(complex_bp, url_prefix="/api/mix")

if __name__ == '__main__':
    app.run(debug=True)