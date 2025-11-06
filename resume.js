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

  // Modern Template
  if (template === "modern") {
    const resumeHTML = `
    <div class="template-modern" id="resumePreview">
        <div class="left">
            <img src="https://via.placeholder.com/120" class="profile" alt="Profile Photo">
            <h2>${name}</h2>
            <p>${email}</p>
            <p>${phone}</p>
            <p>${address}</p>
            ${linkedin ? `<p><a style="color:white;" href="${linkedin}" target="_blank">LinkedIn</a></p>` : ""}
        </div>
        <div class="right">
            <h3>Education</h3>
            <p>${education.replace(/\n/g, "<br>")}</p>

            <h3>Skills</h3>
            <p>${skills.replace(/\n/g, "<br>")}</p>

            <h3>Experience</h3>
            <p>${experience.replace(/\n/g, "<br>")}</p>
        </div>
    </div>`;
    document.getElementById("output").innerHTML = resumeHTML;
  }

  // Classic Template
  else {
    const resumeHTML = `
      <div class="resume-content classic" id="resumePreview">
        <h2>${name}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>
        ${linkedin ? `<p><strong>LinkedIn:</strong> <a href="${linkedin}" target="_blank">${linkedin}</a></p>` : ""}

        <h3>Education</h3>
        <p>${education.replace(/\n/g, "<br>")}</p>

        <h3>Skills</h3>
        <p>${skills.replace(/\n/g, "<br>")}</p>

        <h3>Experience</h3>
        <p>${experience.replace(/\n/g, "<br>")}</p>
      </div>`;
    document.getElementById("output").innerHTML = resumeHTML;
  }
}

// AI Summary Feature
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

// 🌟 Download Resume as PDF
document.getElementById("downloadBtn")?.addEventListener("click", function () {
  const resumeContent = document.getElementById("resumePreview");

  if (!resumeContent) {
    alert("⚠️ Please generate your resume first.");
    return;
  }

  const opt = {
    margin: 0.5,
    filename: 'My_Resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().from(resumeContent).set(opt).save();
});


// Template Filtering (on homepage)
function filterTemplates(element) {
  document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
  element.classList.add('selected');

  const filterValue = element.getAttribute('data-filter');
  const templateCards = document.querySelectorAll('#templatesMore .template-card');

  document.getElementById("templatesMore").style.display = 'flex';

  templateCards.forEach(card => {
    const category = card.getAttribute('data-category');
    card.style.display = (filterValue === 'all' || category === filterValue) ? 'block' : 'none';
  });

  document.getElementById("useTemplateBtn").style.display = "none";
}

// Select Template Card
function selectTemplateCard(e) {
  const card = e.target.closest('.template-card');

  document.querySelectorAll('.individual-templates .template-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');

  localStorage.setItem("chosenTemplate", card.getAttribute('data-template'));
  document.getElementById("useTemplateBtn").style.display = "inline-block";
}

// Go to Resume Builder Page
document.getElementById("useTemplateBtn")?.addEventListener("click", () => {
  const chosen = localStorage.getItem("chosenTemplate");
  if (!chosen) return alert("⚠️ Please select a template!");
  window.location.href = "resume.html";
});

// Auto Select "Show All" on load
window.onload = () => {
  const all = document.querySelector('.category-card[data-filter="all"]');
  all && all.classList.add('selected');
};
