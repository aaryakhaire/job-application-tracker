function loadApps() {
    fetch("/applications")
        .then(res => res.json())
        .then(data => {
            const rows = document.getElementById("rows");
            const filter = document.getElementById("filter").value;

            rows.innerHTML = "";

            let applied = 0, interview = 0, offer = 0, rejected = 0;

            data.forEach(app => {
                if (app.status === "Applied") applied++;
                if (app.status === "Interview") interview++;
                if (app.status === "Offer") offer++;
                if (app.status === "Rejected") rejected++;

                if (filter !== "All" && app.status !== filter) return;

                rows.innerHTML += `
                    <tr>
                        <td>${app.company}</td>
                        <td>${app.role}</td>
                        <td><span class="badge ${app.status}">${app.status}</span></td>
                        <td>${app.date_applied}</td>
                        <td>
                            <button class="delete-btn" onclick="deleteApp(${app.id})">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;
            });

            document.getElementById("appliedCount").innerText = applied;
            document.getElementById("interviewCount").innerText = interview;
            document.getElementById("offerCount").innerText = offer;
            document.getElementById("rejectedCount").innerText = rejected;
        });
}

function addApplication() {
    const company = document.getElementById("company").value;
    const role = document.getElementById("role").value;
    const status = document.getElementById("status").value;
    const date = document.getElementById("date").value;

    if (!company || !role || !date) return;

    fetch("/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            company, role, status, date_applied: date
        })
    }).then(() => {
        loadApps();
        company.value = role.value = date.value = "";
    });
}

function deleteApp(id) {
    fetch(`/applications/${id}`, { method: "DELETE" })
        .then(() => loadApps());
}

loadApps();
