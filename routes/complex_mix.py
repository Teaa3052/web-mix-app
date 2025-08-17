from flask import Blueprint, request, jsonify

complex_bp = Blueprint('complex_mix', __name__)

@complex_bp.route("/complex", methods=["POST"])
def complex_mix():
    """
      Očekuje JSON:
    {
      "components": [
        {"a": 70, "x": 0},   # intenzitet i količina (količina će se izračunati)
        {"a": 80, "x": 0},
        {"a": 96, "x": 0}
      ],
      "m": 85,   # željeni prosjek
      "S": 230   # ukupna količina
    }
    """

    data = request.get_json()

    components = data.get('components')
    m = data.get('m')
    S = data.get('S')

    if not components or m is None or S is None:
        return jsonify({"error": "Nedostaju podaci"}), 400

    # Provjera: m mora biti između min i max intenziteta
    values = [c['a'] for c in components]
    if not (min(values) < m < max(values)):
        return jsonify({"error": "Prosječni intenzitet mora biti između najmanje i najveće vrijednosti"}), 400

    # *** Ovdje kasnije dodamo pravu logiku ***
    # Za sada vraćamo samo potvrdu
    return jsonify({
        "message": "Složeni račun – logika će biti dodana",
        "components_received": components,
        "target": {"m": m, "S": S}
    })