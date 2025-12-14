# 📂 Project Files Overview

## Essential Files (Required)

### **Models** ⭐
```
models/
├── asl_landmark_model.tflite (25.5 KB) - Trained TFLite model
└── asl_landmark_model.txt          - Class labels (A-Z + del + space)
```
**These are the only files needed for deployment!**

---

### **Source Code**
```
src/
├── hand_detector.py          - MediaPipe hand detection wrapper
├── landmark_classifier.py    - TFLite model inference
├── pipeline.py              - Combined processing pipeline
└── ui.py                    - Tkinter desktop GUI
```

### **Utilities**
```
utils/
├── config.py                - Configuration settings
└── preprocessing.py         - Image preprocessing functions
```

### **Scripts**
```
extract_landmarks.py         - Extract landmarks from images
train_landmark_model.py      - Train neural network
main.py                      - Desktop app entry point
```

---

## Documentation Files

```
README.md                    - Project overview & quick start
TRAINING_DOCUMENTATION.md    - Complete training guide ⭐
REACT_NATIVE_GUIDE.md       - Mobile deployment guide ⭐
requirements.txt             - Python dependencies
confusion_matrix.png         - Model evaluation visualization
```

---

## Data Files (Local Only)

```
data/
├── asl_alphabet/           - Original image dataset (not in repo)
│   ├── A/
│   ├── B/
│   └── ... (28 folders)
└── landmarks.csv           - Extracted landmarks (not in repo)
```

**Note:** Data folder is excluded from git (in .gitignore)

---

## Development Files

```
.venv/                      - Python virtual environment
.git/                       - Git repository
.gitignore                  - Git ignore rules
.gitattributes              - Git attributes
```

---

## For Mobile Deployment

**Copy these 2 files to your React Native project:**
```
✅ models/asl_landmark_model.tflite (25.5 KB)
✅ models/asl_landmark_model.txt
```

That's it! Everything else stays on desktop.

---

## File Sizes

```
Total project size (without data): ~1 MB
- Models: 26 KB
- Source code: 50 KB
- Documentation: 100 KB
- Dependencies: 500 MB (in .venv)
- Data folder: ~2 GB (excluded from repo)
```

---

## Git Repository Structure

**Included in repo:**
- ✅ Source code (src/, utils/)
- ✅ Scripts (extract, train, main)
- ✅ Models (tflite + labels)
- ✅ Documentation (MD files)
- ✅ Requirements.txt
- ✅ Confusion matrix

**Excluded from repo (.gitignore):**
- ❌ .venv/ (virtual environment)
- ❌ data/ (dataset folder)
- ❌ __pycache__/ (Python cache)
- ❌ *.pyc (compiled Python)
- ❌ .DS_Store (Mac files)

---

## Quick Navigation

**Want to:**
- Run desktop app? → `python main.py`
- Train new model? → Read `TRAINING_DOCUMENTATION.md`
- Deploy to mobile? → Read `REACT_NATIVE_GUIDE.md`
- Understand architecture? → Read `README.md`
- Check model performance? → View `confusion_matrix.png`

---

## Clean Project ✅

All unnecessary files have been removed. Project is now:
- ✅ Well-organized
- ✅ Production-ready
- ✅ Fully documented
- ✅ Mobile-deployment ready
- ✅ Easy to understand

**Total essential files: 15**
**Total documentation: 4**
**Total size: ~1 MB (without data)**
