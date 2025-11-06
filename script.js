// Get Selected Template from Home Page
let template = localStorage.getItem("chosenTemplate") || "classic";

// Generate Resume Preview
function generateResume() {
  const name = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const linkedin = document.getElementById("linkedin").value;
  const education = document.getElementById("Education").value;
  const skills = document.getElementById("Skills").value;
  const experience = document.getElementById("Experience").value;

  const chosenTemplate = localStorage.getItem("chosenTemplate") || "modern";

  const resumeHTML = `
  <div id="resume-generated" class="resume-wrapper ${chosenTemplate}">
    <h1>${name}</h1>
    <p>${email} | ${phone} | ${address}</p>
    ${linkedin ? `<p><a href="${linkedin}" target="_blank">${linkedin}</a></p>` : ""}

    <h2>Education</h2>
    <p>${education.replace(/\n/g, "<br>")}</p>

    <h2>Skills</h2>
    <p>${skills.replace(/\n/g, "<br>")}</p>

    <h2>Experience</h2>
    <p>${experience.replace(/\n/g, "<br>")}</p>
  </div>
  `;

  document.getElementById("output").innerHTML = resumeHTML;
}


// AI Summary
async function generateSummary() {
  const name = document.getElementById("fullName").value.trim();
  const skills = document.getElementById("Skills").value.trim();
  const experience = document.getElementById("Experience").value.trim();

  if (!skills || !experience) {
    alert("⚠️ Please enter your Skills and Experience first.");
    return;
  }

  const data = { name, skills, experience };

  try {
    const res = await fetch("http://localhost:5000/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.summary) {
      document.getElementById("output").innerHTML += `
        <h3>✨ AI Summary</h3>
        <p>${result.summary}</p>
      `;
      alert("✅ AI Summary added to your resume!");
    } else {
      alert("❌ Failed to get AI summary");
    }
  } catch (error) {
    console.error(error);
    alert("⚠️ Error connecting to AI server.");
  }
}

//  Download PDF
document.getElementById("downloadBtn").addEventListener("click", function () {
  const resumeContent = document.querySelector("#output .resume-wrapper");

  if (!resumeContent) {
    alert("⚠️ Please generate your resume first!");
    return;
  }

  // Ensure all images/fonts are loaded
  setTimeout(() => {
    const opt = {
      margin: 0.3,
      filename: 'My_Resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(resumeContent).save();
  }, 500);
});



// ✅ TEMPLATE SELECTION LOGIC
function filterTemplates(element) {
  document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
  element.classList.add('selected');

  const filterValue = element.getAttribute('data-filter');
  const templateContainer = document.getElementById("templatesMore");
  const templateCards = document.querySelectorAll('#templatesMore .template-card');

  templateContainer.style.display = 'flex';

  templateCards.forEach(card => {
    const category = card.getAttribute('data-category');
    card.style.display = (filterValue === 'all' || category === filterValue) ? 'block' : 'none';
  });

  document.getElementById("useTemplateBtn").style.display = "none";
}

function selectTemplateCard(e) {
  const card = e.target.closest('.template-card');

  document.querySelectorAll('.individual-templates .template-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');

  const chosen = card.getAttribute('data-template');
  localStorage.setItem("chosenTemplate", chosen);

  document.getElementById("useTemplateBtn").style.display = "inline-block";
}

document.getElementById("useTemplateBtn")?.addEventListener("click", () => {
  const chosen = localStorage.getItem("chosenTemplate");
  if (!chosen) {
    alert("⚠️ Please select an individual template first!");
    return;
  }
  window.location.href = "resume.html";
});

window.onload = function() {
  const allFilter = document.querySelector('.category-card[data-filter="all"]');
  if (allFilter) {
    filterTemplates(allFilter);
    document.getElementById("templatesMore").style.display = 'none';
  }
};
