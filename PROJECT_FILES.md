# 📂 Project Files Overview - Advanced Landmark-Based Classification

## Essential Files (Required)

### **Models** ⭐
```
models/
├── asl_landmark_model.tflite (25.5 KB) - Advanced Landmark-Based TFLite model
└── asl_landmark_model.txt          - Class labels (A-Z + del + space)
```
**These are the only files needed for deployment!** (100-800x smaller than simple image classifiers)

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

### **Scripts (Advanced Pipeline)**
```
extract_landmarks.py         - Extract landmarks from images (pre-training data engineering)
train_landmark_model.py      - Train neural network on landmark features
main.py                      - Desktop app entry point
```

> **💡 Key Difference from Simple Image Classification:**
> - `extract_landmarks.py` processes entire dataset BEFORE training
> - Creates custom geometric feature dataset (landmarks.csv)
> - This extra step enables 99.38% accuracy vs 70-85% for simple classifiers

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
✅ models/asl_landmark_model.tflite (25.5 KB) - Advanced landmark-based model
✅ models/asl_landmark_model.txt              - Class labels
```

That's it! Just 26 KB total (vs 5-20 MB for simple image classification models).

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
- ✅ **Advanced** - Uses landmark-based classification (not simple image classification)
- ✅ **Well-organized** - Clear separation of concerns
- ✅ **Production-ready** - 99.38% accuracy, <10ms inference
- ✅ **Fully documented** - Complete technical deep-dives
- ✅ **Mobile-deployment ready** - 25.5 KB TFLite model
- ✅ **Easy to understand** - Comprehensive guides

**Total essential files: 15**
**Total documentation: 4**
**Total size: ~1 MB (without data)**
**Model size: 25.5 KB** (vs 5-20 MB for simple image classifiers)
