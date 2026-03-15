let puneCollege_data = [];

// Load the JSON data
fetch('puneCollege_data.json')
    .then(response => response.json())
    .then(data => {
        puneCollege_data = data;
        console.log("Data loaded:", puneCollege_data.length);
    })
    .catch(err => console.error("Data load error:", err));

// tier and rating
function getCollegeMetrics(percentile) {
    if (percentile >= 95) {
        return { tier: "Tier 1", rating: "⭐⭐⭐⭐⭐" };
    } else if (percentile >= 85) {
        return { tier: "Tier 2", rating: "⭐⭐⭐⭐" };
    } else if (percentile >= 70) {
        return { tier: "Tier 3", rating: "⭐⭐⭐" };
    } else {
        return { tier: "Tier 3", rating: "⭐⭐" };
    }
}

//  predict logic
function predictcolleges() {
    const percentile = parseFloat(document.getElementById('percentile').value);
    const categoryValue = document.getElementById('category').value;
    const branchFilter = document.getElementById('branch').value;

    const resultsGrid = document.getElementById('results');
    const statsDiv = document.getElementById('stats');
    const collegeListDiv = document.querySelector('.collegelist');

    if (isNaN(percentile)) {
        alert("Please enter a valid percentile.");
        return;
    }

    if (puneCollege_data.length === 0) { alert("Data is loading..."); return; }

    const matches = [];

    // Loop through the flat array in JSON
    puneCollege_data.forEach(entry => {
        const branchMatch = (branchFilter === 'All' || entry.branch.includes(branchFilter));
        const selectedValue = document.getElementById('category').value;
        const categoryMatch = entry.category.includes(selectedValue)

        if (branchMatch && categoryMatch) {
            const cutoff = entry.percentile;
            const diff = percentile - cutoff;

            const remark = getCollegeMetrics(cutoff);

            // Only show results within 5% range
            if (diff >= -5) {
                let status = 'Dream', statusClass = 'tag-low', priority = 3;

                if (diff >= 0) {
                    status = 'Safe'; statusClass = 'tag-high'; priority = 1;
                } else if (diff >= -2) {
                    status = 'Likely'; statusClass = 'tag-medium'; priority = 2;
                }

                matches.push({
                    name: entry.college,
                    branch: entry.branch || "General",
                    category: entry.category,
                    cutoff: cutoff.toFixed(2),
                    tier: remark.tier,
                    rating: remark.rating,
                    status: status,
                    statusClass: statusClass,
                    priority: priority
                });
            }
        }
    });

    // Sort: Safe first
    matches.sort((a, b) => a.priority - b.priority);

    renderResults(matches, resultsGrid, statsDiv, collegeListDiv);
}


// rendering function
function renderResults(matches, container, statsDiv, listDiv) {
    container.classList.add('show')
    listDiv.innerHTML = "";

    if (matches.length === 0) {
        listDiv.innerHTML = `<div class="no-results-message">
            <p>No matches found. Try a lower percentile or "All Branches".</p>
        </div>`;
        statsDiv.innerHTML = "";
        return;
    }

    const safe = matches.filter(m => m.priority === 1).length;
    const likely = matches.filter(m => m.priority === 2).length;
    const dream = matches.filter(m => m.priority === 3).length;

    statsDiv.innerHTML = `
        <div class="stats-summary">
            <div class="stat-item stat-safe"><b class="stat-number">${safe}</b><small>Safe</small></div>
            <div class="stat-item stat-likely"><b class="stat-number">${likely}</b><small>Likely</small></div>
            <div class="stat-item stat-dream"><b class="stat-number">${dream}</b><small>Dream</small></div>
        </div>
    `;

    matches.forEach(m => {
        listDiv.innerHTML += `
            <div class="college-card">
                <div class="card-header">
                    <h3 class="college-name">${m.name}</h3>
                    <span class="tier-badge">${m.tier}</span>
                </div>
                <div class="rating-stars">${m.rating}</div>
                <div class="branch-row">
                    <div class="branch-meta">
                        <span class="branch-name">${m.branch}</span>
                        <div class="category-tag">Caste: <strong>${m.category}</strong></div>
                        <br><small class="cutoff-text">Cutoff: ${m.cutoff}%</small>
                    </div>
                    <span class="tag ${m.statusClass}">${m.status}</span>
                </div>
            </div>`;
    });
}