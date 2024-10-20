document.addEventListener("DOMContentLoaded", fetchData); // Ensure DOM is ready

let globalData;
let globalFilteredData;

async function fetchData() {
    try {
        console.log('Fetching data...');
        const response = await fetch('achievements.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log('Data fetched:', data);
        globalData = data;
        globalFilteredData = data;
        filterData()
    } catch (error) {
        console.error('Error loading JSON data:', error);
    }
}

function addData(event) {
    event.preventDefault();

    let errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = ''; // Clear previous error messages

    //let achievement_form = document.getElementById('add-achievement-form');
    let chapter = document.getElementById('chapter').value;
    let title = document.getElementById('title').value;
    let dateInput = document.getElementById('date').value;
    let description = document.getElementById('description').value;
    let photo = document.getElementById('photo').value;

    if (!chapter || !title || !dateInput || !description || !photo) {
        errorMessageDiv.textContent = 'All fields are required!';
        return; // Exit the function if validation fails
    }

    let date = new Date(dateInput)
    const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

    console.log(chapter, title, date, description, photo);

    //alert(chapter, title, date, description, photo);

    let chapterEntry = globalData.find((entry) => entry.Chapter.toLowerCase() == chapter.toLowerCase())

    console.log("adding entry: ", chapterEntry);

    if (chapterEntry) {
        // If chapter exists, push the new achievement  
        chapterEntry.Achievements.push({
            Date: formattedDate,
            Title: title,
            Description: description,
            Photo: photo
        });
    } else {
        // If the chapter doesn't exist, create a new chapter with the achievement
        globalData.push({
            Chapter: chapter,
            Achievements: [{
                Date: formattedDate,
                Title: title,
                Description: description,
                Photo: photo
            }]
        });
    }


    globalFilteredData = globalData;    
    filterData(); //refilter for new element
}

function filterData() {
    let data = globalData;
    //console.log(data);

    let selectedChapter = document.getElementById("chapterFilter").value;
    //console.log(selectedChapter);
    if (selectedChapter == "all") {
        globalFilteredData = data;
        return renderChapters();
    }
    
    let filteredData = data.filter((item) => item.Chapter.toLowerCase() == selectedChapter);

    globalFilteredData = filteredData;
    return renderChapters(filteredData);
}


function renderChapters() {
    let data = globalFilteredData;
    
    const container = document.getElementById('chapters-container');
    if (!container) {
        console.error('Container element not found!');
        return;
    }

    //clear container before rerendering
    container.innerHTML = '';

    data.forEach(chapter => {
        const chapterDiv = document.createElement('div');
        chapterDiv.className = 'chapter';

        const chapterTitle = document.createElement('h2');
        chapterTitle.className = 'chapter-title';
        chapterTitle.textContent = chapter.Chapter;
        chapterDiv.appendChild(chapterTitle);

        if (chapter.Achievements.length > 0) {
            chapter.Achievements.forEach(achievement => {
                if (achievement.Title) {
                    const achievementDiv = document.createElement('div');
                    achievementDiv.className = 'achievement';

                    const contentWrapper = document.createElement('div');
                    contentWrapper.className = 'content-wrapper';

                    // Title and Date Row
                    const titleRow = document.createElement('div');
                    titleRow.className = 'title-row';

                    const title = document.createElement('h3');
                    title.className = 'achievement-title';
                    title.textContent = achievement.Title;

                    const date = document.createElement('p');
                    date.className = 'achievement-date';
                    date.textContent = achievement.Date;

                    titleRow.appendChild(title);
                    titleRow.appendChild(date);
                    contentWrapper.appendChild(titleRow);

                    // Image Section
                    const img = document.createElement('img');
                    img.src = achievement.Photo;
                    img.alt = achievement.Title;

                    // Description
                    const description = document.createElement('p');
                    description.className = 'achievement-description';
                    description.textContent = achievement.Description;

                    // Append elements
                    achievementDiv.appendChild(contentWrapper);
                    achievementDiv.appendChild(img);
                    achievementDiv.appendChild(description);
                    chapterDiv.appendChild(achievementDiv);
                }
            });
        } else {
            const noAchievements = document.createElement('p');
            noAchievements.textContent = 'No achievements yet.';
            chapterDiv.appendChild(noAchievements);
        }

        container.appendChild(chapterDiv);
    });
}


