Here is a step-by-step guide designed for beginners with no coding experience.

---

# Beginner’s Guide: How to Deploy Your News Layout Website

This guide will help you download, set up, and launch your news website step-by-step. You don't need any programming skills—just follow the instructions below!

---

## 📋 Prerequisites

Before starting, make sure you have a **Cloudflare Account** (it’s free). If you don't have one, sign up at [Cloudflare](https://dash.cloudflare.com/sign-up).

---

## Step 1: Install Node.js

Node.js is a tool that allows your computer to run the commands needed to build and deploy the website.

1. Go to the official website: **[https://nodejs.org/](https://nodejs.org/)**
2. Download the version labeled **LTS** (Long Term Support) for your operating system (Windows or Mac).
3. Open the downloaded file and click **Next / Agree** through all the default prompts to complete the installation.

---

## Step 2: Download the Project Code

1. Visit the project repository: **[https://github.com/WriterSuite/newss-layout](https://github.com/WriterSuite/newss-layout)**
2. Click the green **`Code`** button near the top right of the page.
3. Click **`Download ZIP`**.
4. Once downloaded, locate the ZIP file on your computer, right-click it, and select **Extract All** (Windows) or double-click it (Mac) to unzip it into a regular folder.

---

## Step 3: Open the Project Folder in Command Prompt / Terminal

Now you need to open your computer's command line inside the unzipped folder.

### **On Windows:**
1. Open the extracted folder so you can see the files inside.
2. Click on the empty space in the address bar at the top of the File Explorer window.
3. Type `cmd` and press **Enter**. A black or blue terminal window will pop up.

### **On Mac:**
1. Open **Finder** and locate the extracted folder.
2. Right-click (or Control-click) the folder.
3. Select **Services** > **New Terminal at Folder** (or **Open in Terminal**).

---

## Step 4: Create the Configuration File (`wrangler.jsonc`)

1. Open a text editor like **Notepad** (Windows) or **TextEdit** (Mac).
2. Copy and paste the exact code below into the text editor:

```jsonc
{
	"$schema": "./node_modules/wrangler/config-schema.json",
	"compatibility_date": "2026-08-08",
	"compatibility_flags": [
		"global_fetch_strictly_public"
	],
	"name": "news",
	"main": "@astrojs/cloudflare/entrypoints/server",
	"assets": {
		"directory": "./dist",
		"binding": "ASSETS"
	},
	"observability": {
		"enabled": true
	},
	"vars": {
		"API_URL": "https://subdomain.writersuite.app/api/v1",
		"API_KEY": "API_KEY",
		"WRITERSUITE_POST_LIMIT": "10"
	}
}
```

> ⚠️ **Important:** Replace `"https://subdomain.writersuite.app/api/v1"` and `"API_KEY"` with your actual API credentials before saving.

3. Save the file directly inside your unzipped project folder.
4. Name the file exactly: **`wrangler.jsonc`**
   * *Note for Windows users:* Make sure the "Save as type" dropdown is set to **All Files (*.*)** so it doesn't accidentally save as `wrangler.jsonc.txt`.

---

## Step 5: Install Required Packages

In the terminal window you opened in **Step 3**, type the following command and press **Enter**:

```bash
npm i
```

* **What to expect:** You will see a lot of text scrolling down the screen. This is normal! It means Node.js is downloading all the necessary tools for your project. Wait a minute or two until it finishes and stops moving.

---

## Step 6: Deploy Your Website

In the same terminal window, type the following command and press **Enter**:

```bash
npx wrangler deploy
```

* **What to expect:**
  1. If this is your first time using Cloudflare on your computer, your browser will automatically open a Cloudflare login page.
  2. Click **Allow / Authorize** to connect your computer to your Cloudflare account.
  3. Once authorized, return to the terminal window. The deployment process will complete.
  4. At the end, you will see a link (URL) where your website is now live! 🎉
