from flask import Blueprint, request, jsonify

simple_bp = Blueprint('simple_mix', __name__)

# Najveći zajednički djelitelj
def gcd(a, b):
    return int(b == 0 and a or gcd(b, a % b))

@simple_bp.route("/simple", methods=["POST"])
def simple_mix():
    data = request.json
    try:
        a1 = float(data["a1"])
        a2 = float(data["a2"])
        m = float(data["m"])
        S = float(data["S"])

        # Validacija: m mora biti između a1 i a2
        if not (min(a1, a2) < m < max(a1, a2)):
            return jsonify({"error": "m mora biti između a1 i a2"}), 400

        # Omjer komponenti
        x1_ratio = a2 - m
        x2_ratio = m - a1

        # Faktor skaliranja
        k = S / (x1_ratio + x2_ratio)

        # Količine
        x1 = x1_ratio * k
        x2 = x2_ratio * k

        # Provjera valjanosti
        if any([
            not isinstance(x1, float),
            not isinstance(x2, float),
            not (x1 > 0),
            not (x2 > 0),
            not (x1 < float('inf')),
            not (x2 < float('inf'))
        ]):
            return jsonify({"error": "Izračunate vrijednosti nisu valjane. Provjerite ulazne podatke."}), 400

        # Skraćeni omjer
        x1_int = round(x1)
        x2_int = round(x2)
        divisor = gcd(x1_int, x2_int)
        simplified_ratio = f"{x1_int // divisor} : {x2_int // divisor}"

        # Formatirane količine (2 decimale)
        quantities_formatted = [f"{round(x1, 2):.2f}", f"{round(x2, 2):.2f}"]

        # Provjera ukupne količine
        ukupno = x1 + x2
        tolerancija = 0.001

        if abs(ukupno - S) > tolerancija:
            return jsonify({
                "error": f"Račun nije konzistentan: izračunato {ukupno:.4f}, a očekivano {S}"
            }), 400

        # Odgovor
        return jsonify({
            "quantities": [x1, x2],
            "quantities_formatted": quantities_formatted,
            "simplified_ratio": simplified_ratio,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400