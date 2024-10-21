Please write this on perl 

import os

# Create the necessary folder structure
os.makedirs("eco_ops_banana_theme", exist_ok=True)

# Common HTML Template with Hamburger Navigation
html_template = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="nav.js" defer></script> <!-- Nav.js for common navigation -->
  <style>
    body {{
      background-image: url('https://example.com/tropical-lake-background.jpg');
      background-size: cover;
      background-repeat: no-repeat;
      font-family: 'Poppins', sans-serif;
    }}
    .banana-theme {{
      background-color: rgba(255, 255, 204, 0.8); /* Banana color */
    }}
    .header {{
      background-color: rgba(0, 128, 0, 0.9); /* Kenyan green */
      color: white;
      padding: 1rem;
    }}
    .content {{
      padding: 2rem;
      background-color: rgba(255, 255, 255, 0.8); /* Light overlay */
      border-radius: 10px;
      margin: 2rem;
    }}
    .page-title {{
      font-size: 1.5rem;
      color: #ffcc00; /* Banana yellow */
    }}
    .hamburger {{
      display: inline-block;
      cursor: pointer;
    }}
    .nav-links {{
      display: none;
      flex-direction: column;
      gap: 1rem;
    }}
    .hamburger.active + .nav-links {{
      display: flex;
    }}
    .btn-primary {{
      background-color: #007bff;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      margin-top: 1rem;
    }}
  </style>
</head>
<body>
  <!-- Main Container -->
  <div class="banana-theme min-h-screen">
    <!-- Header and Nav -->
    <div class="header flex justify-between items-center">
      <h1>Eco Ops - {title}</h1>
      <div class="hamburger" onclick="toggleNav()">☰</div>
    </div>
    <div id="navigation" class="nav-links"></div>

    <!-- Page Content Placeholder -->
    <div class="content">
      <h2 class="page-title">{page_title}</h2>
      {page_content}
    </div>
  </div>
  <script>
    function toggleNav() {{
      document.querySelector('.hamburger').classList.toggle('active');
    }}
  </script>
</body>
</html>
"""

# Create the files
pages = {
    "public_login.html": {"title": "Public Login", "page_title": "Login", "page_content": '<form><input type="text" placeholder="Username" /><br><input type="password" placeholder="Password" /><br><button class="btn-primary">Login</button></form>'},
    "admin_login.html": {"title": "Admin Login", "page_title": "Admin Login", "page_content": '<form><input type="text" placeholder="Admin Username" /><br><input type="password" placeholder="Admin Password" /><br><button class="btn-primary">Login</button></form>'},
    "public_dashboard.html": {"title": "Public Dashboard", "page_title": "Welcome, User!", "page_content": "<p>Your eco efforts progress here.</p>"},
    "admin_dashboard.html": {"title": "Admin Dashboard", "page_title": "Admin Panel", "page_content": "<p>Manage users, milestones, and tokens here.</p>"},
    "role_calibration.html": {"title": "Role Calibration", "page_title": "Role Calibration", "page_content": "<p>Calibrate user roles.</p>"},
    "milestone_management.html": {"title": "Milestone Management", "page_title": "Milestone Management", "page_content": "<p>Manage milestones for projects.</p>"},
    "goal_setting.html": {"title": "Goal Setting", "page_title": "Goal Setting", "page_content": "<p>Set goals for users and projects.</p>"},
    "token_association.html": {"title": "Token Association", "page_title": "Token Association", "page_content": "<p>Associate milestones with tokens.</p>"},
    "progress_tracking.html": {"title": "Progress Tracking", "page_title": "Progress Tracking", "page_content": "<p>Track user progress.</p>"},
    "simulation_results.html": {"title": "Simulation Results", "page_title": "Simulation Results", "page_content": "<p>View simulation results.</p>"},
    "token_history.html": {"title": "Token History", "page_title": "Token Distribution History", "page_content": "<p>View the history of token distributions.</p>"}
}

for page, content in pages.items():
    with open(os.path.join("eco_ops_banana_theme", page), 'w') as f:
        f.write(html_template.format(**content))

# Create the nav.js file
nav_js = """document.getElementById('navigation').innerHTML = `
<nav class="p-4 text-white">
  <ul class="flex flex-col space-y-4">
    <li><a href="public_dashboard.html" class="hover:underline">Public Dashboard</a></li>
    <li><a href="admin_dashboard.html" class="hover:underline">Admin Dashboard</a></li>
    <li><a href="role_calibration.html" class="hover:underline">Role Calibration</a></li>
    <li><a href="milestone_management.html" class="hover:underline">Milestone Management</a></li>
    <li><a href="goal_setting.html" class="hover:underline">Goal Setting</a></li>
    <li><a href="token_association.html" class="hover:underline">Token Association</a></li>
    <li><a href="progress_tracking.html" class="hover:underline">Progress Tracking</a></li>
    <li><a href="simulation_results.html" class="hover:underline">Simulation Results</a></li>
    <li><a href="token_history.html" class="hover:underline">Token History</a></li>
  </ul>
</nav>
`;
"""

with open(os.path.join("eco_ops_banana_theme", "nav.js"), 'w') as f:
    f.write(nav_js)

print("Perk script has generated the eleven files with hamburger navigation in the 'eco_ops_banana_theme' folder.")