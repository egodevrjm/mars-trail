import os

# Define the project file structure
file_structure = {
    "public": ["favicon.ico"],
    "src": {
        "assets": {
            "icons": ["settings.svg"],
            "images": [
                "placeholder_character.png",
                "placeholder_map.png",
                "placeholder_settlement.png"
            ],
            "ui": ["placeholder_button.svg"]
        },
        "components": [
            "GameMap.jsx",
            "MainMenu.jsx",
            "StatusBar.jsx",
            "CharacterList.jsx",
            "SettlementView.jsx",
            "ResourceManagement.jsx"
        ],
        "data": [
            "initialSettlers.json",
            "initialResources.json",
            "terrainData.json"
        ],
        "hooks": ["useGameLogic.js"],
        "styles": ["globals.css"],
        "": ["App.jsx", "main.jsx", "index.css"]
    }
}

# Helper function to create files and directories recursively
def create_structure(base_path, structure):
    for name, contents in structure.items():
        if isinstance(contents, dict):  # If it's a folder
            folder_path = os.path.join(base_path, name)
            os.makedirs(folder_path, exist_ok=True)
            create_structure(folder_path, contents)
        elif isinstance(contents, list):  # If it's a list of files
            folder_path = os.path.join(base_path, name)
            os.makedirs(folder_path, exist_ok=True)
            for file_name in contents:
                file_path = os.path.join(folder_path, file_name)
                open(file_path, "w").close()
        else:  # If it's a single file
            file_path = os.path.join(base_path, contents)
            open(file_path, "w").close()

# Main execution
if __name__ == "__main__":
    # Create the structure in the current directory
    print("Creating project file structure...")
    create_structure(".", file_structure)
    print("File structure created successfully!")
