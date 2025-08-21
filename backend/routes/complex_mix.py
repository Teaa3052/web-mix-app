from flask import Blueprint, request, jsonify

complex_bp = Blueprint('complex_mix', __name__)

def gcd_multiple(numbers):
    """Calculate GCD of multiple numbers"""
    def gcd(a, b):
        return int(b == 0 and a or gcd(b, a % b))
    
    result = int(numbers[0])
    for i in range(1, len(numbers)):
        result = gcd(result, int(numbers[i]))
    return result

def format_simplified_ratio(ratios):
    """Create simplified ratio string with whole numbers"""
    # Find the maximum number of decimal places
    max_decimals = 0
    for ratio in ratios:
        str_ratio = f"{ratio:.10f}".rstrip('0')
        if '.' in str_ratio:
            decimals = len(str_ratio.split('.')[1])
            max_decimals = max(max_decimals, decimals)
    
    # Convert to integers by multiplying by 10^max_decimals
    multiplier = 10 ** max_decimals
    int_ratios = [round(ratio * multiplier) for ratio in ratios]
    
    # Ensure all are positive and at least 1
    int_ratios = [max(1, abs(r)) for r in int_ratios]
    
    # Find GCD to simplify
    if len(int_ratios) > 1 and all(r > 0 for r in int_ratios):
        divisor = gcd_multiple(int_ratios)
        simplified = [r // divisor for r in int_ratios]
        return " : ".join(map(str, simplified))
    else:
        return " : ".join(map(str, int_ratios))

def calculate_average_intensity(components_data, quantities):
    """Calculate weighted average intensity of the mixture"""
    total_weighted_intensity = 0
    total_quantity = sum(quantities)
    
    for i, component in enumerate(components_data):
        intensity = component['intensity']
        quantity = quantities[i]
        total_weighted_intensity += intensity * quantity
    
    return total_weighted_intensity / total_quantity if total_quantity > 0 else 0

def generate_mix_3_components(components_data, total_amount, desired_intensity):
    """Generate mix for 3 components"""
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
    
    return {
        'quantities': original_order_quantities,
        'ratios': [ratios[intensities.index(comp['intensity'])] for comp in components_data]
    }

def generate_mix_4_components(components_data, total_amount, desired_intensity):
    """Generate mix for 4 components following strict textbook rules"""
    # Sort components by intensity (ascending)
    sorted_components = sorted(components_data, key=lambda x: x['intensity'])
    intensities = [comp['intensity'] for comp in sorted_components]
    
    # Split into worse and better components
    worse_components = [intensity for intensity in intensities if intensity < desired_intensity]
    better_components = [intensity for intensity in intensities if intensity > desired_intensity]
    equal_components = [intensity for intensity in intensities if intensity == desired_intensity]
    
    # Handle case where desired intensity equals one of components
    if equal_components:
        return {"error": "Željeni intenzitet ne može biti jedan intenzitetu bilo koje komponente"}
    
    valid_solutions = []
    
    # Scenario 1: 2 worse + 2 better (1-to-1 pairing with 2 choices)
    if len(worse_components) == 2 and len(better_components) == 2:
        worse_indices = [i for i, x in enumerate(intensities) if x in worse_components]
        better_indices = [i for i, x in enumerate(intensities) if x in better_components]
        
        # Prvi izbor: worse[0]↔better[0], worse[1]↔better[1]
        ratios_1 = [0.0, 0.0, 0.0, 0.0]
        ratios_1[worse_indices[0]] = better_components[0] - desired_intensity
        ratios_1[worse_indices[1]] = better_components[1] - desired_intensity
        ratios_1[better_indices[0]] = desired_intensity - worse_components[0]
        ratios_1[better_indices[1]] = desired_intensity - worse_components[1]
        
        if all(r > 0 for r in ratios_1):
            k1 = total_amount / sum(ratios_1)
            quantities_1 = [r * k1 for r in ratios_1]
            
            # Verify average intensity
            avg_intensity_1 = sum(intensities[i] * quantities_1[i] for i in range(4)) / sum(quantities_1)
            if abs(avg_intensity_1 - desired_intensity) < 0.01:
                valid_solutions.append({
                    'quantities': quantities_1,
                    'ratios': ratios_1,
                    'combination': 'Prvi izbor'
                })
        
        # Drugi izbor: worse[0]↔better[1], worse[1]↔better[0]
        ratios_2 = [0.0, 0.0, 0.0, 0.0]
        ratios_2[worse_indices[0]] = better_components[1] - desired_intensity
        ratios_2[worse_indices[1]] = better_components[0] - desired_intensity
        ratios_2[better_indices[0]] = desired_intensity - worse_components[1]
        ratios_2[better_indices[1]] = desired_intensity - worse_components[0]
        
        if all(r > 0 for r in ratios_2):
            k2 = total_amount / sum(ratios_2)
            quantities_2 = [r * k2 for r in ratios_2]
            
            # Verify average intensity
            avg_intensity_2 = sum(intensities[i] * quantities_2[i] for i in range(4)) / sum(quantities_2)
            if abs(avg_intensity_2 - desired_intensity) < 0.01:
                valid_solutions.append({
                    'quantities': quantities_2,
                    'ratios': ratios_2,
                    'combination': 'Drugi izbor'
                })
    
    # Scenario 2: 3 worse + 1 better (each worse pairs with same better)
    elif len(worse_components) == 3 and len(better_components) == 1:
        ratios = [0.0, 0.0, 0.0, 0.0]
        
        # Each worse component pairs with the single better component
        # Better component gets sum of all pairing ratios
        for i, intensity in enumerate(intensities):
            if intensity in worse_components:
                ratios[i] = better_components[0] - desired_intensity
            else:  # better component
                ratios[i] = sum(desired_intensity - worse for worse in worse_components)
        
        if all(r > 0 for r in ratios):
            k = total_amount / sum(ratios)
            quantities = [r * k for r in ratios]
            
            # Verify average intensity
            avg_intensity = sum(intensities[i] * quantities[i] for i in range(4)) / sum(quantities)
            if abs(avg_intensity - desired_intensity) < 0.01:
                valid_solutions.append({
                    'quantities': quantities,
                    'ratios': ratios,
                    'combination': 'Jedno rješenje'
                })
    
    # Scenario 3: 1 worse + 3 better (single worse pairs with each better)
    elif len(worse_components) == 1 and len(better_components) == 3:
        ratios = [0.0, 0.0, 0.0, 0.0]
        
        # Single worse component pairs with each better component
        # Worse component gets sum of all pairing ratios
        for i, intensity in enumerate(intensities):
            if intensity in worse_components:
                ratios[i] = sum(better - desired_intensity for better in better_components)
            else:  # better component
                ratios[i] = desired_intensity - worse_components[0]
        
        if all(r > 0 for r in ratios):
            k = total_amount / sum(ratios)
            quantities = [r * k for r in ratios]
            
            # Verify average intensity
            avg_intensity = sum(intensities[i] * quantities[i] for i in range(4)) / sum(quantities)
            if abs(avg_intensity - desired_intensity) < 0.01:
                valid_solutions.append({
                    'quantities': quantities,
                    'ratios': ratios,
                    'combination': 'Jedno rješenje'
                })
    
    # Return solutions
    if not valid_solutions:
        return {"error": f"Nema valjalnih rješenja za željeni intenzitet {desired_intensity}"}
    
    # Map all solutions back to original order
    all_solutions_mapped = []
    for solution in valid_solutions:
        original_order_quantities = [0] * 4
        for i, comp in enumerate(components_data):
            for j, sorted_comp in enumerate(sorted_components):
                if comp['intensity'] == sorted_comp['intensity']:
                    original_order_quantities[i] = solution['quantities'][j]
                    break
        
        all_solutions_mapped.append({
            'quantities': original_order_quantities,
            'ratios': [solution['ratios'][intensities.index(comp['intensity'])] for comp in components_data],
            'simplified_ratio': format_simplified_ratio([solution['ratios'][intensities.index(comp['intensity'])] for comp in components_data]),
            'combination_used': solution['combination']
        })
    
    return {
        'all_solutions': all_solutions_mapped,
        'valid_solutions_count': len(valid_solutions)
    }

@complex_bp.route("/complex", methods=["POST"])
def complex_mix():
    data = request.json
    
    try:
        # Parse input
        components = data.get("components", [])
        total_amount = float(data.get("total_amount", 0))
        desired_intensity = float(data.get("desired_intensity"))
        
        # Validation
        if len(components) not in [3, 4]:
            return jsonify({"error": "Podržano je točno 3 ili 4 komponente"}), 400
            
        if total_amount <= 0:
            return jsonify({"error": "Ukupna količina mora biti veća od 0"}), 400

        # Validate components
        for i, comp in enumerate(components):
            if 'intensity' not in comp:
                return jsonify({"error": f"Komponenta {i+1} mora imati intenzitet"}), 400
            comp['intensity'] = float(comp['intensity'])

        # Validate intensity range
        intensities = [comp['intensity'] for comp in components]
        min_intensity = min(intensities)
        max_intensity = max(intensities)
        
        if not (min_intensity < desired_intensity < max_intensity):
            return jsonify({
                "error": f"Željeni intenzitet {desired_intensity} mora biti između {min_intensity} i {max_intensity}"
            }), 400
        
        # Generate mix based on component count
        if len(components) == 3:
            mix_result = generate_mix_3_components(components, total_amount, desired_intensity)
        else:  # 4 components
            mix_result = generate_mix_4_components(components, total_amount, desired_intensity)
        
        if "error" in mix_result:
            return jsonify(mix_result), 400
        
        # Handle different response formats
        if "all_solutions" in mix_result:
            # Multiple solutions (4 components)
            return jsonify({
                "total_amount": total_amount,
                "method_details": {
                    "all_solutions": mix_result['all_solutions'],
                    "valid_solutions_count": mix_result['valid_solutions_count']
                }
            })
        else:
            # Single solution (3 components)
            quantities = mix_result['quantities']
            avg_intensity = calculate_average_intensity(components, quantities)
            quantities_formatted = [f"{q:.2f}" for q in quantities]
            simplified_ratio = format_simplified_ratio(mix_result['ratios'])
            
            # Prepare component results
            component_results = []
            for i, comp in enumerate(components):
                component_results.append({
                    'name': comp.get('name', f"Komponenta {i + 1}"),
                    'intensity': comp['intensity'],
                    'quantity': quantities[i],
                    'quantity_formatted': quantities_formatted[i],
                    'percentage': (quantities[i] / total_amount) * 100
                })
            
            return jsonify({
                "components": component_results,
                "quantities": quantities,
                "quantities_formatted": quantities_formatted,
                "simplified_ratio": simplified_ratio,
                "average_intensity": round(avg_intensity, 2),
                "total_amount": total_amount
            })
    
    except ValueError:
        return jsonify({"error": "Molimo unesite ispravne numeričke vrijednosti"}), 400
    except Exception as e:
        return jsonify({"error": f"Greška: {str(e)}"}), 400