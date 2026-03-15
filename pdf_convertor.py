import pdfplumber
import json
import re

def extract_pune_data(pdf_path, output_json):
    """
    Parses DTE Maharashtra PDFs using regex and text extraction 
    specifically for Pune Region (Code 6xxx).
    """
    database = []
    # Regex to find percentiles like (77.8495773)
    percentile_pattern = re.compile(r'\((\d{1,3}\.\d+)\)')
    college_pattern = re.compile(r'^(\d{4})\s*-\s*(.*)')
    branch_pattern = re.compile(r'^(\d{9})\s*-\s*(.*)')

    print(f"Reading {pdf_path}...")

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text: 
                continue
            
            lines = text.split('\n')
            current_college = ""
            current_branch = ""
            categories = []

            for line in lines:
                #Detect College (Filter for Pune/6xxx)
                col_match = college_pattern.match(line)
                if col_match:
                    if col_match.group(1).startswith('6') or "Pune" in col_match.group(2):
                        current_college = f"{col_match.group(1)} - {col_match.group(2).strip()}"
                    else:
                        current_college = ""
                    continue
                
                if not current_college: 
                    continue

                #Detect Branch
                br_match = branch_pattern.match(line)
                if br_match:
                    current_branch = br_match.group(2).strip()
                    continue

                #Detect & Clean Categories (The "Stage" line)
                if "Stage" in line:
                    clean_line = re.sub(r'[",\n]', ' ', line.replace("Stage", ""))
                    categories = [c.strip() for c in clean_line.split() if c.strip()]
                    continue

                #Detect Percentiles and Pair them
                if percentile_pattern.search(line) and categories:
                    scores = percentile_pattern.findall(line)
                    
                    # Logic: Pair Category index with Score index
                    for i in range(len(scores)):
                        if i < len(categories):
                            database.append({
                                "college": current_college,
                                "branch": current_branch,
                                "category": categories[i],
                                "percentile": float(scores[i])
                            })

    
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(database, f, indent=4)
    
    print(f"Success! Found {len(database)} Pune entries. Check {output_json}")

if __name__ == "__main__":
    extract_pune_data("cutoff_cet.pdf", "puneCollege_data.json")