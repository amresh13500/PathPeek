# 📂 Node + React Folder Browser

A simple **Node.js (Express)** + **React** app to browse local folders and list files/folders with icons.  
Supports **absolute** paths and **relative** paths (relative paths are resolved from your **Desktop**).

## ✨ Features

- 🌐 **Express API**
  - `GET /api/base-path` → returns Desktop path
  - `POST /api/list-folder` → returns files/folders for a given path
  - Relative paths like `./something` resolve from **Desktop**
  - CORS: **allow all** (easy local dev)
- 🖥️ **React UI**
  - Center-aligned card
  - Single input + **List** button
  - **Press Enter** to trigger listing
  - Auto **focus** back to input after search
  - 📁 Folder and 📄 File icons, shows file extension
