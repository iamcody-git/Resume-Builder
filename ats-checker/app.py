import streamlit as st
import PyPDF2
import os
import io
from dotenv import load_dotenv
import google.generativeai as genai
import re

# Load environment variables
load_dotenv()

# Set up Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

st.set_page_config(page_title="AI Resume Analyzer", page_icon="📄", layout="centered")

st.title("📄 AI Resume Analyzer (Gemini Version)")
st.markdown("Upload your resume and get **AI-powered insights** using Google's Gemini model.")

# --- File upload ---
uploaded_file = st.file_uploader("Upload your resume (PDF or TXT)", type=["pdf", "txt"])
job_role = st.text_input("🎯 Target Job Role (optional)", placeholder="e.g., Software Engineer, Data Analyst")
analyze = st.button("🚀 Analyze Resume")

# --- Helper functions ---
def extract_text_from_pdf(file):
    pdf_reader = PyPDF2.PdfReader(file)
    text = ""
    for page in pdf_reader.pages:
        content = page.extract_text()
        if content:
            text += content + "\n"
    return text.strip()

def extract_text_from_file(uploaded_file):
    if uploaded_file.type == "application/pdf":
        return extract_text_from_pdf(uploaded_file)
    else:
        return uploaded_file.read().decode("utf-8").strip()

# --- Main logic ---
if analyze and uploaded_file:
    try:
        file_content = extract_text_from_file(uploaded_file)
        if not file_content:
            st.error("⚠️ The uploaded file does not contain readable text.")
            st.stop()

        # Build analysis prompt
        prompt = f"""
You are a professional HR and resume review expert.

Analyze the following resume and provide a structured report with markdown formatting.
Focus on:
1. Content clarity & impact
2. Skills presentation
3. Experience relevance
4. Improvements specific to {"the role of " + job_role if job_role else "general job applications"}

At the end, include:
- Key strengths
- Areas for improvement
- Estimated match percentage (%)

Resume Content:
{file_content}
"""

        # --- Gemini API Call ---
        model = genai.GenerativeModel("gemini-2.5-flash")

        with st.spinner("🤖 Analyzing your resume using Gemini... please wait..."):
            response = model.generate_content(prompt)

        analysis_text = response.text.strip()

        # --- Extract match percentage (if mentioned) ---
        match_percentage = None
        match = re.search(r"(\d{1,3})\s*%", analysis_text)
        if match:
            match_percentage = min(100, int(match.group(1)))

        # --- Display output ---
        st.success("✅ Analysis Complete!")

        if match_percentage is not None:
            st.markdown("### 🎯 Match Score")
            st.progress(match_percentage / 100)
            st.markdown(f"**Estimated Match:** {match_percentage}%")

        st.markdown("---")
        st.markdown("### 📋 Detailed AI Feedback")
        st.markdown(analysis_text)

        # Download option
        st.download_button(
            label="⬇️ Download Analysis as Text File",
            data=analysis_text,
            file_name="resume_analysis.txt",
            mime="text/plain",
        )

    except Exception as e:
        st.error(f"❌ Error: {str(e)}")
