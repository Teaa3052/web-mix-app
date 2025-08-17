from flask import Flask, request, jsonify
from routes.simple_mix import simple_bp
from routes.complex_mix import complex_bp
from flask_cors import CORS # da frontend moze slati zahtjeve 

app = Flask(__name__)
CORS(app) # omogućava CORS 

# registracija blueprintova
app.register_blueprint(simple_bp, url_prefix="/api/mix")
app.register_blueprint(complex_bp, url_prefix="/api/mix")

if __name__ == '__main__':
    app.run(debug=True)