# 🎓 MHT-CET College Predictor (Pune Region)

A web-based tool to help engineering aspirants predict potential colleges in Pune based on previous year MHT-CET cutoff percentiles.

## 🚀 Features
- **PDF Data Extraction:** Custom Python script to convert official DTE Maharashtra PDF cutoffs into searchable JSON.
- **Smart Prediction:** Categorizes colleges into **Safe**, **Likely**, and **Dream** options.
- **Auto-Ranking:** Dynamically assigns **Tiers** and **Ratings** based on cutoff competitiveness.
- **Glassmorphism UI:** Modern, responsive design with smooth animations.

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3 (Custom Glassmorphism), JavaScript (ES6+)
- **Backend/Automation:** Python 3.x, `pdfplumber` for data extraction

## 📖 How to Use
1. **Data Extraction:** - Place your official cutoff PDF in the folder.
   - Run `python pdf_convertor.py`.
2. **Launch Predictor:** - Open `web_app/predictor.html` using a **Live Server** (required for `fetch()` to work).
   - Enter your percentile and select your category/branch.

## ⚠️ Disclaimer
This tool is for reference only. Actual admission depends on current year competition and official DTE counseling.
