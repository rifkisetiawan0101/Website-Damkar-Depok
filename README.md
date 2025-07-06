# 🚒 Depok City Fire & Rescue Department Website

<img src="https://komarev.com/ghpvc/?username=[YOUR_GITHUB_USERNAME]&label=Project%20Views&color=DC3545&style=flat" alt="Project Views"/>

## ✨ Overview

The **Depok City Fire & Rescue Website** is a functional and informative web platform designed to serve the community of Depok, Indonesia. This project acts as a central hub for public information regarding the department's activities and educational outreach. Crucially, it features a modern, interactive emergency reporting system for citizens. The application is supported by a comprehensive admin dashboard that allows for complete management of all website content.

---

## ⚙️ Key Features

### 👨‍👩‍👧 For the Public

* **Interactive Map (Leaflet.js):** Displays all fire station locations across Depok and visualizes active, user-submitted emergency reports (e.g., fires, evacuations) with distinct icons.
* **Smart Reporting System:**
    * **Geo-location Integration:** Users can click on the map to automatically fill in the address field via reverse geocoding (using the Nominatim API).
    * **Rich Media Uploads:** The reporting form allows users to upload photo or video evidence, with client-side validation for file size.
    * **Asynchronous Submission:** Reports are submitted via AJAX (`fetch` API), providing instant feedback to the user without a page reload.
* **Dynamic Content:** The "Events" and "Education" sections are dynamically populated from the database, ensuring all information is up-to-date.
* **Modern & Responsive UI:** Built with Bootstrap 5, the website is fully responsive and accessible on all devices. It features engaging UI elements like a transparent-to-solid navbar on scroll and a video background.

### 👮 For Administrators

* **Comprehensive Admin Dashboard:** A secure, session-protected dashboard serves as the control center for the entire website.
* **Full CRUD Functionality:** Administrators have full **C**reate, **R**ead, **U**pdate, and **D**elete capabilities for all site data:
    * Incoming Emergency Reports
    * Fire Station Locations
    * Department Events
    * Educational Content
    * User/Admin Accounts
* **Interactive Data Management:** All data is presented in interactive tables using **DataTables.js**, featuring searching, sorting, and pagination.
* **Efficient Report Handling:** Admins can view report details, preview submitted media (images and videos) in a modal, and update a report's status from **"Pending"** to **"Handled"** with a single click.
* **Asynchronous Workflow:** All admin actions are handled via AJAX, creating a fast and efficient content management experience.

---

## 💻 Technology Stack

This project is built with a classic and reliable web stack.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need a local server environment that supports PHP and MySQL, such as:
* [XAMPP](https://www.apachefriends.org/index.html)
* [WAMP](https://www.wampserver.com/en/)
* [MAMP](https://www.mamp.info/en/mamp/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/](https://github.com/)[YOUR_GITHUB_USERNAME]/[YOUR_REPOSITORY_NAME].git
    ```

2.  **Move to your server directory:**
    Place the cloned project folder inside the `htdocs` (for XAMPP) or `www` (for WAMP/MAMP) directory.

3.  **Set up the Database:**
    * Start your Apache and MySQL services from your server control panel.
    * Open phpMyAdmin (e.g., navigate to `http://localhost/phpmyadmin`).
    * Create a new database and name it `database-damkar`.
    * Select the new database and go to the **"Import"** tab.
    * Click "Choose File" and select the `database-damkar.sql` file included in this project.
    * Click "Go" to import the tables and data.

4.  **Configure the Database Connection:**
    * Open the database configuration file located at `src/config/db-config.php`.
    * Verify that the credentials (`$hostname`, `$username`, `$password`, `$database`) match your local MySQL setup. The default is usually correct for a standard XAMPP installation.
    ```php
    $hostname = "localhost";
    $username = "root";
    $password = "";
    $database = "database-damkar";
    ```

5.  **Run the Application:**
    Open your web browser and navigate to `http://localhost/WEBSITE-DAMKAR-DEPOK/public/home.html`.

---

## 📸 Screenshots

*(It is highly recommended to add screenshots of your project here)*

**Homepage with Interactive Map**
`![Homepage Screenshot](path/to/your/screenshot_home.png)`

**Admin Dashboard**
`![Admin Dashboard Screenshot](path/to/your/screenshot_admin.png)`

**Emergency Reporting Form**
`![Reporting Form Screenshot](path/to/your/screenshot_form.png)`

---

## 📄 License

This project is licensed under the Apache 2.0 License. See the [`LICENSE`](LICENS.txt) file for details.

---

## 🙏 Credits

Fullstack Developer - **[Rifki Setiawan]** [Rifki's Github](https://github.com/rifkisetiawan0101).
UI/UX Designer - [Danang Aryaputra Giffary](https://github.com/nangsen1)
Researcher - [Yoseph Satria Praka](https://www.instagram.com/yyoooosz/)
