import json

# Load the original JSON file
with open('/workspace/src/data/subjects/english_questions_jamb_2010.json', 'r') as file:
    data = json.load(file)

# Create a new structure with questions grouped by their associated passages and instructions
organized_data = {
    "passages": data["passages"],
    "instructions": data["instructions"],
    "questions": []
}

# Create dictionaries to map passage and instruction IDs to their content
passage_map = {p["id"]: p for p in data["passages"]}
instruction_map = {i["id"]: i for i in data["instructions"]}

# Organize questions by their associated passage or instruction
questions_by_group = {}

# First, group all questions by their passageId or instructionId
for question in data["questions"]:
    if "passageId" in question:
        group_id = question["passageId"]
        if group_id not in questions_by_group:
            questions_by_group[group_id] = []
        questions_by_group[group_id].append(question)
    elif "instructionId" in question:
        group_id = question["instructionId"]
        if group_id not in questions_by_group:
            questions_by_group[group_id] = []
        questions_by_group[group_id].append(question)

# Now, arrange questions in the order of passages first, then instructions
# Sort passage IDs in order: "Passage I", "Passage II", etc.
passage_ids = sorted([p_id for p_id in questions_by_group.keys() if p_id.startswith("Passage")])

# Sort instruction IDs in order: "Instruction 1", "Instruction 2", etc.
instruction_ids = sorted([i_id for i_id in questions_by_group.keys() if i_id.startswith("Instruction")], 
                         key=lambda x: int(x.split()[1]))

# Add questions in the correct order
for passage_id in passage_ids:
    organized_data["questions"].extend(questions_by_group[passage_id])

for instruction_id in instruction_ids:
    organized_data["questions"].extend(questions_by_group[instruction_id])

# Write the organized data to a new file
with open('/workspace/src/data/subjects/english_questions_jamb_2010_organized.json', 'w') as file:
    json.dump(organized_data, file, indent=2)

print("Questions have been reorganized and saved to english_questions_jamb_2010_organized.json")
print(f"Total passages: {len(organized_data['passages'])}")
print(f"Total instructions: {len(organized_data['instructions'])}")
print(f"Total questions: {len(organized_data['questions'])}")

# Print a summary of the organization
print("\nPassage order and associated questions:")
for i, passage in enumerate(organized_data['passages'], 1):
    question_count = len([q for q in organized_data['questions'] if q.get('passageId') == passage['id']])
    print(f"  {passage['id']}: {question_count} questions")

print("\nInstruction order and associated questions:")
for i, instruction in enumerate(organized_data['instructions'], 1):
    question_count = len([q for q in organized_data['questions'] if q.get('instructionId') == instruction['id']])
    print(f"  {instruction['id']}: {question_count} questions")