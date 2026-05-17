@charset "UTF-8";

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
    list-style: none !important;
    scroll-behavior: smooth;
}

:root {
    --primary-text: #ffffff;
    --accent: #d6a4ff;
    --bg-deep: #12051d;
    --bg-light: #1e0b2e;
    --card-bg: rgba(255, 255, 255, 0.04);
}

body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: linear-gradient(135deg, var(--bg-deep) 0%, var(--bg-light) 100%);
    background-attachment: fixed;
    color: var(--primary-text);
    line-height: 1.6;
    overflow-x: hidden;
}

/* Scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg-deep); }
::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 10px; }

/* Navigation */
nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 10%;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    background: rgba(18, 5, 29, 0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(214, 164,
