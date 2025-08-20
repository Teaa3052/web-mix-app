from flask import Blueprint, request, jsonify
import random

complex_bp = Blueprint('complex_mix', __name__)

def gcd_multiple(numbers):
    """Calculate GCD of multiple numbers"""
    def gcd(a, b):
        return int(b == 0 and a or gcd(b, a % b))
    
    result = int(numbers[0])
    for i in range(1, len(numbers)):
        result = gcd(result, int(numbers[i]))
    return result

def generate_standard_mix(components_data, total_amount, desired_intensity):
    """Generate mix using schematic approach - simple pairing method for 3 components"""
    
    if len(components_data) != 3:
        return {"error": "Algoritam je trenutno implementiran samo za 3 komponente"}
    
    # Sort components by intensity (ascending)
    sorted_components = sorted(components_data, key=lambda x: x['intensity'])
    intensities = [comp['intensity'] for comp in sorted_components]
    
    # Split into worse and better components based on desired intensity
    worse_components = [intensity for intensity in intensities if intensity < desired_intensity]
    better_components = [intensity for intensity in intensities if intensity > desired_intensity]
    equal_components = [intensity for intensity in intensities if intensity == desired_intensity]
    
    # Handle case where desired intensity equals one of components
    if equal_components:
        return {"error": "Željeni intenzitet ne može biti jednak intenzitetu bilo koje komponente"}
    
    # Calculate ratios using simple pairing method
    ratios = [0.0, 0.0, 0.0]
    
    # Each worse component gets ratio = sum of differences from better components
    for i, intensity in enumerate(intensities):
        if intensity in worse_components:
            ratios[i] = sum(better - desired_intensity for better in better_components)
        else:  # better component
            ratios[i] = sum(desired_intensity - worse for worse in worse_components)
    
    # Calculate quantities
    if sum(ratios) == 0:
        return {"error": "Nemoguće izračunati omjere"}
    
    k = total_amount / sum(ratios)
    quantities = [ratio * k for ratio in ratios]
    
    # Verify average intensity
    avg_intensity = sum(intensities[i] * quantities[i] for i in range(3)) / sum(quantities)
    if abs(avg_intensity - desired_intensity) > 0.01:
        return {"error": f"Prosječni intenzitet {avg_intensity:.2f} ne odgovara željenom {desired_intensity}"}
    
    # Map back to original order
    original_order_quantities = [0] * 3
    for i, comp in enumerate(components_data):
        for j, sorted_comp in enumerate(sorted_components):
            if comp['intensity'] == sorted_comp['intensity']:
                original_order_quantities[i] = quantities[j]
                break
    
    # Create grouping info
    worse_list = [str(w) for w in worse_components]
    better_list = [str(b) for b in better_components]
    grouping_info = f"Lošiji: {', '.join(worse_list)}, Bolji: {', '.join(better_list)}"
    
    return {
        'quantities': original_order_quantities,
        'ratios': [ratios[intensities.index(comp['intensity'])] for comp in components_data],
        'method': 'standard_schematic',
        'grouping_info': grouping_info,
        'valid_solutions_count': 1
    }

def calculate_average_intensity(components_data, quantities):
    """Calculate weighted average intensity of the mixture"""
    total_weighted_intensity = 0
    total_quantity = sum(quantities)
    
    for i, component in enumerate(components_data):
        intensity = component['intensity']
        quantity = quantities[i]
        total_weighted_intensity += intensity * quantity
    
    return total_weighted_intensity / total_quantity if total_quantity > 0 else 0

def format_simplified_ratio(ratios):
    """Create simplified ratio string with whole numbers"""
    # Convert float ratios to integers by scaling up
    scale_factor = 10
    scaled_ratios = [max(1, round(ratio * scale_factor)) for ratio in ratios]
    
    # Find GCD to simplify
    if len(scaled_ratios) > 1 and all(r > 0 for r in scaled_ratios):
        divisor = gcd_multiple(scaled_ratios)
        simplified = [r // divisor for r in scaled_ratios]
        return " : ".join(map(str, simplified))
    else:
        return " : ".join(map(str, scaled_ratios))

@complex_bp.route("/complex", methods=["POST"])
def complex_mix():
    data = request.json
    
    try:
        # Parse input
        components = data.get("components", [])
        total_amount = float(data.get("total_amount", 0))
        desired_intensity = data.get("desired_intensity")
        mix_type = data.get("mix_type", "standard")
        
        # Validation
        if len(components) != 3:
            return jsonify({"error": "Potrebno je točno 3 komponente"}), 400
            
        if total_amount <= 0:
            return jsonify({"error": "Ukupna količina mora biti veća od 0"}), 400
        
        if mix_type == "standard":
            if desired_intensity is None:
                return jsonify({"error": "Željeni intenzitet je obavezan za standardni račun"}), 400
            try:
                desired_intensity = float(desired_intensity)
            except:
                return jsonify({"error": "Željeni intenzitet mora biti broj"}), 400

        # Validate components
        for i, comp in enumerate(components):
            if 'intensity' not in comp:
                return jsonify({"error": f"Komponenta {i+1} mora imati intenzitet"}), 400
            try:
                comp['intensity'] = float(comp['intensity'])
            except:
                return jsonify({"error": f"Intenzitet komponente {i+1} mora biti broj"}), 400

        # Generate mix
        if mix_type == "standard":
            # Validate intensity range
            intensities = [comp['intensity'] for comp in components]
            min_intensity = min(intensities)
            max_intensity = max(intensities)
            
            if not (min_intensity < desired_intensity < max_intensity):
                return jsonify({
                    "error": f"Željeni intenzitet {desired_intensity} mora biti između {min_intensity} i {max_intensity}"
                }), 400
            
            mix_result = generate_standard_mix(components, total_amount, desired_intensity)
            
        elif mix_type == "priority":
            return jsonify({"error": "Prioritetno miješanje još nije implementirano"}), 400
        
        else:
            return jsonify({"error": "Nepoznat tip miješanja"}), 400
        
        if "error" in mix_result:
            return jsonify(mix_result), 400
        
        quantities = mix_result['quantities']
        
        # Calculate average intensity
        avg_intensity = calculate_average_intensity(components, quantities)
        
        # Format results
        quantities_formatted = [f"{q:.2f}" for q in quantities]
        # Use raw ratios for ratio calculation
        simplified_ratio = format_simplified_ratio(mix_result['ratios'])
        
        # Prepare component results
        component_results = []
        for i, comp in enumerate(components):
            component_results.append({
                'name': comp.get('name', f"Komponenta {i + 1}"),
                'intensity': comp['intensity'],
                'quantity': quantities[i],
                'quantity_formatted': quantities_formatted[i],
                'percentage': (quantities[i] / total_amount) * 100,
                'priority': comp.get('priority', None)
            })
        
        # Final validation
        calculated_total = sum(quantities)
        if abs(calculated_total - total_amount) > 0.01:
            return jsonify({
                "error": f"Račun nije konzistentan: izračunato {calculated_total:.4f}, a očekivano {total_amount}"
            }), 400
        
        return jsonify({
            "components": component_results,
            "quantities": quantities,
            "quantities_formatted": quantities_formatted,
            "simplified_ratio": simplified_ratio,
            "average_intensity": round(avg_intensity, 2),
            "total_amount": total_amount,
            "mix_type": mix_type,
            "method_details": mix_result
        })
    
    except Exception as e:
        return jsonify({"error": f"Greška: {str(e)}"}), 400