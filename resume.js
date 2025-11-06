let template = localStorage.getItem("chosenTemplate") || "modern";

function generateResume() {
    const name = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const linkedin = document.getElementById("linkedin").value;
    const education = document.getElementById("Education").value;
    const skills = document.getElementById("Skills").value;
    const experience = document.getElementById("Experience").value;

    if (!name || !email) { alert("⚠️ Please enter Name and Email."); return; }

    let resumeHTML = `
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
            <h3>Education</h3><p>${education.replace(/\n/g,"<br>")}</p>
            <h3>Skills</h3><p>${skills.replace(/\n/g,"<br>")}</p>
            <h3>Experience</h3><p>${experience.replace(/\n/g,"<br>")}</p>
        </div>
    </div>`;

    document.getElementById("output").innerHTML = resumeHTML;
}

async function generateSummary() {
    const name = document.getElementById("fullName").value.trim();
    const skills = document.getElementById("Skills").value.trim();
    const experience = document.getElementById("Experience").value.trim();
    if (!skills || !experience) { alert("⚠️ Enter Skills & Experience."); return; }

    try {
        const res = await fetch("http://localhost:5000/summary", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({name, skills, experience})
        });
        const result = await res.json();
        if (result.summary) {
            document.getElementById("output").innerHTML += `
            <h3>✨ AI Summary</h3>
            <p>${result.summary}</p>`;
            alert("✅ AI Summary added!");
        } else { alert("❌ Failed to get AI summary"); }
    } catch(e) { console.error(e); alert("⚠️ AI server error."); }
}

document.getElementById("downloadBtn").addEventListener("click", ()=>{
    const resumeContent = document.getElementById("resumePreview");
    if (!resumeContent) { alert("⚠️ Generate resume first!"); return; }

    const opt = { margin:0.5, filename:'My_Resume.pdf', image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2}, jsPDF:{unit:'in',format:'letter',orientation:'portrait'} };
    setTimeout(()=>{ html2pdf().from(resumeContent).set(opt).save(); },100);
});
