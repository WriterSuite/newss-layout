Here is the updated step-by-step guide with **`npm run build`** included in the correct sequence (right after installing packages, so the website files can be compiled before deploying).

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

* **What to expect:** You will see text scrolling down the screen. This is normal! It means Node.js is downloading all the necessary tools for your project. Wait a minute or two until it stops.

---

## Step 6: Build Your Website

Next, compile your website code into production-ready files. In the same terminal window, type the following command and press **Enter**:

```bash
npm run build
```

* **What to expect:** This process will take a few seconds and will create the `./dist` folder containing the compiled files ready for Cloudflare.

---

## Step 7: Deploy Your Website

Now, upload your site to Cloudflare. In the same terminal window, type:

```bash
npx wrangler deploy
```

* **What to expect:**
  1. If this is your first time using Cloudflare on your computer, your browser will automatically open a Cloudflare login page.
  2. Click **Allow / Authorize** to connect your computer to your Cloudflare account.
  3. Once authorized, return to the terminal window. The deployment process will complete.
  4. At the end, you will see a temporary URL where your website is published.

---

## Step 8: Attach Your Custom Domain

Now that your site is deployed, you can connect your own domain name (e.g., `yourwebsite.com`) to it.

1. Open your browser and log in to the **[Cloudflare Dashboard](https://dash.cloudflare.com/)**.
2. In the left sidebar menu, click on **Build** > **Compute** > **Workers & Pages**.
3. Locate and click on your newly deployed website from the list (it will be named **news** or whatever name was set in your file).
4. Select the **Domains** tab.
5. Click the blue **Add domain** button.
6. Choose or type the domain name you want to connect to your site, then click **Add domain** to save.

🎉 **Congratulations!** Your website is now fully set up and live on your custom domain.
