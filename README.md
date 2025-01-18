# Javascript Playwright Automation Project

## This Project Validates Website Analysis and API Retrieval Data

### 1. Website Analysis and Validation Task 

Explanation:
The lighthouse.js file needs to run in order to monitor a website for performance issues, broken links, SEO, and accessibility. It needs to be run at regular intervals (daily, weekly, or monthly) to ensure the website is functioning correctly and performing optimally

### 01.
Install npm and node on your machine.

### 02.
Install the required packges with npm:

```
npm init -y
npm install playwright lighthouse
```

### 03.
Run the lighthouse.js file with:

```
node lighthouse.js
```

### 04.
Monitor the console log output, lighthouse-report.json the broken-links.json files.

### 2. API Data Retrieval Task

Explanation:
The post-api.js file needs to run in order to automate the process of validating API responses. By running it, you can ensure that each post includes all the required parameters (userId, id, body, and title) and meets expectations for these fields. This ensures that the posts are properly written and valid according to your criteria.

### 01.
Run the post-api.js file with:

```
node post-api.js
```

### 02. (Optional)
To simulate invalid posts uncomment rows 15-21, and run the post-api file again:

```
node post-api.js
```

### 03.

Monitor the console log output, and the failed-posts.json file.
