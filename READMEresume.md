Resume Builder (MERN Stack)

A Resume Builder Web App built using the MERN stack (MongoDB, Express, React, Node.js) that allows users to create, customize, preview, and download resumes in real-time.

It comes with 4 modern resume templates, theme customization, real-time editing, and download/share functionality — all designed to make resume creation fast and elegant.

🚀 Features<br>

✅ 4 Professional Resume Templates – Choose from different layouts and designs. <br>
✅ Real-time Editing – Instantly preview changes while editing.<br>
✅ Theme Customization – Switch between different color themes for your resume.<br>
✅ Download as PDF – One-click download of your resume in high quality.<br>
✅ Share Functionality – Easily share your resume via a generated link.<br>
✅ Responsive UI – Works smoothly on desktop and mobile devices.<br>
✅ User Authentication (optional) – Secure login and user-based data management.<br>

Installation & Setup<br>

git clone https://github.com/iamcody-git/Resume-Builder/ <br>
cd resume-builder

Install dependencies <br>
cd client  <br>
npm install  <br>
cd ../server  <br>
npm install  <br>

To run the file:  <br>
For Backend :=> npm run server  <br>
For Frontend :> npm run dev  <br>

Note :=> have to create own .env file  <br>

for backend .env:  <br>
JWT_SECRET = ''  <br>
PROJECT_NAME = ""  <br>
MONGODB_URI = ""  <br>
IMAGEKIT_PRIVATE_KEY=''  <br>
OPENAI_API_KEY=''  <br>
OPENAI_BASE_URL =''  <br>
OPENAI_MODEL= "gemini-2.5-flash"  <br>

for frontend .env :  <br>
VITE_BASE_URL = ""
