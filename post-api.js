import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    // fetch and convert response to json
    const posts = await page.evaluate(async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        return await response.json();
    });

    // // To simulate invalid posts uncomment 
    // posts[0].title = "";        // Invalid title
    // posts[7].id = null;         // Invalid ID
    // posts[2].userId = 'banana'; // Invalid userId
    // posts[3].body = "";         // Invalid body
    // posts[10].body = null;      // Invalid body (null)
    // posts[11].id = null;        // Invalid ID (null)

    const failedPosts = [];
    // check every post in the response and verify that the params are valid and save to failedPosts list
    posts.forEach(post => {
        let isValid = true;
        if (
            !post.title ||
            !post.body || 
            typeof post.userId !== 'number' ||
            typeof post.id !== 'number' || post.id === null
        ) {
            failedPosts.push(post);
            isValid = false
        }
        if (isValid) {
            console.log(`Post ID: ${post.id} passed validation.`);
        } else {
            console.log(`Post ID: ${post.id} failed validation.`);
        }
    });

    // if the failedPosts list contains data - save data to failed-posts.json
    if (failedPosts.length > 0) {
        const failedPostsPath = './failed-posts.json';
        fs.writeFileSync(failedPostsPath, JSON.stringify(failedPosts, null, 2));
        console.log(`Failed posts saved to ${failedPostsPath}`);
    } else {
        console.log('All posts passed validation!');
    }
    // log failed posts
    if (failedPosts.length > 0) {
        console.log('Posts that failed validation:');
        failedPosts.forEach(post => {
            console.log(`Post ID: ${post.id}`);
            console.log(`Title: ${post.title}`);
            console.log(`Body: ${post.body}`);
            console.log(`User ID: ${post.userId}`);
            console.log('-----------------------------');
        });
    } else {
        console.log('All posts passed validation!');
    }

    await browser.close();
})();
