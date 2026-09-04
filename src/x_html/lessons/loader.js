async function loadTextFile(filePath) {
      try {
        // 1. Read the raw text file from the folder
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawText = await response.text();

        // 2. Store the content directly inside the target div
        const container = document.getElementById('content');
        container.innerHTML = rawText;

        // 3. Process sub-divs and their inner contents
        const subDivs = container.querySelectorAll('div');
        console.log(`Found ${subDivs.length} nested sub-div(s).`);

        subDivs.forEach((subDiv, index) => {
          console.group(`Sub-Div #${index + 1} (Class: "${subDiv.className || 'none'}")`);
          
          // Read all text inside this specific sub-div
          console.log("Direct/Nested Text:", subDiv.textContent.trim());

          // Read any images located directly inside this sub-div
          const imagesInside = subDiv.querySelectorAll('img');
          imagesInside.forEach(img => {
            console.log("Found Image -> src:", img.getAttribute('src'), "| alt:", img.alt);
          });

          console.groupEnd();
        });

      } catch (err) {
        console.error("Error reading file:", err);
      }
}


const params = new URLSearchParams(window.location.search)
const special = params.get('spcl') || 1;
const lesson = params.get('lsn') || 1;
const subset = params.get('sub') || 1;

const stData = `lesson_data/${special}_${lesson}_${subset}.txt`;

loadTextFile(stData);

document.addEventListener('DOMContentLoaded', () => {
  loadTextFile(stData);
  const nextButton = document.getElementById('next-btn');
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const nextLesson = parseInt(lesson, 10) + 1;
      window.location.href = `${nextLesson}.html?spcl=${special}&lsn=${lesson}&sub=${nextLesson}`;
    });
  } else {
    console.warn('next-btn element not found in DOM');
  }
});