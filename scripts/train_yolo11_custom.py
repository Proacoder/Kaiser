import os
import sys

def prepare_yolo11_training_script():
    """
    YOLO11 Custom Training Pipeline for KAISER Civic Intelligence.
    Trains YOLO11 on custom real-world civic datasets (Pothole, Garbage, Water Leakage, Cable Hazard, Streetlight).
    """

    script_content = '''# ==============================================================================
# KAISER Civic Intelligence -- YOLO11 Custom Model Training Script
# ==============================================================================
# Usage:
#   python scripts/train_yolo11_custom.py --data dataset/data.yaml --epochs 50
# ==============================================================================

import os
import argparse
from ultralytics import YOLO

def train_custom_yolo11(data_yaml_path: str, epochs: int = 50, img_size: int = 640, model_variant: str = "yolo11n.pt"):
    print("=" * 70)
    print("   KAISER AI -- TRAINING YOLO11 CUSTOM CIVIC DETECTION MODEL")
    print("=" * 70)
    
    if not os.path.exists(data_yaml_path):
        print(f"❌ ERROR: Dataset config '{data_yaml_path}' not found!")
        print("Please ensure your data.yaml is configured with train/val image paths and classes.")
        return

    # 1. Initialize pretrained YOLO11 base weights
    print(f"📦 Loading base model weights '{model_variant}'...")
    model = YOLO(model_variant)

    # 2. Train on custom dataset
    print(f"🚀 Starting training for {epochs} epochs at resolution {img_size}x{img_size}...")
    results = model.train(
        data=data_yaml_path,
        epochs=epochs,
        imgsz=img_size,
        batch=16,
        name="kaiser_civic_yolo11",
        project="runs/detect",
        exist_ok=True
    )

    # 3. Copy trained best.pt weights to models/civicconnect_yolo11.pt
    best_weights_path = os.path.join("runs", "detect", "kaiser_civic_yolo11", "weights", "best.pt")
    target_models_dir = "./models"
    target_weights_path = os.path.join(target_models_dir, "civicconnect_yolo11.pt")

    os.makedirs(target_models_dir, exist_ok=True)

    if os.path.exists(best_weights_path):
        import shutil
        shutil.copy(best_weights_path, target_weights_path)
        print("\n" + "=" * 70)
        print(f"🎉 SUCCESS: Trained weights exported to '{target_weights_path}'!")
        print("Your Python FastAPI AI Microservice will now automatically load")
        print("this custom trained model on startup!")
        print("=" * 70)
    else:
        print(f"⚠️ Training completed, but weights not found at '{best_weights_path}'.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train custom YOLO11 for CivicConnect AI")
    parser.add_argument("--data", type=str, default="./dataset/data.yaml", help="Path to data.yaml dataset config")
    parser.add_argument("--epochs", type=int, default=50, help="Number of training epochs")
    parser.add_argument("--imgsz", type=int, default=640, help="Image resolution")
    parser.add_argument("--model", type=str, default="yolo11n.pt", help="Base YOLO11 model (yolo11n.pt, yolo11s.pt, yolo11m.pt)")
    
    args = parser.parse_args()
    train_custom_yolo11(args.data, args.epochs, args.imgsz, args.model)
'''

    os.makedirs("scripts", exist_ok=True)
    target_file = os.path.join("scripts", "train_yolo11_custom.py")
    with open(target_file, "w", encoding="utf-8") as f:
        f.write(script_content)

    print(f"✅ Training script created at '{target_file}'")

if __name__ == "__main__":
    prepare_yolo11_training_script()
