(() => {
  const PROFILE_URL = "/profile.json";

  const getValue = (obj, path) => {
    if (!obj || !path) return undefined;
    return path.split(".").reduce((acc, key) => {
      if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
        return acc[key];
      }
      return undefined;
    }, obj);
  };

  const interpolate = (template, profile) => {
    if (typeof template !== "string") return "";
    return template.replace(/\{([^}]+)\}/g, (match, token) => {
      const value = getValue(profile, token.trim());
      return value === undefined || value === null ? match : String(value);
    });
  };

  const setTextById = (id, value) => {
    if (value === undefined || value === null) return;
    const el = document.getElementById(id);
    if (el) {
      el.textContent = value;
    }
  };

  const setTitle = (profile) => {
    const page = document.body && document.body.dataset ? document.body.dataset.page : "";
    if (page && profile.pageTitles && profile.pageTitles[page]) {
      document.title = profile.pageTitles[page];
    } else if (page === "index" && profile.name) {
      document.title = profile.name;
    }
  };

  const setPhoto = (profile) => {
    const photo = profile.photo;
    const img = document.getElementById("profilePhoto");
    if (!img || !photo || !photo.src) return;
    img.src = photo.src;
    if (photo.alt) {
      img.alt = photo.alt;
    }
  };

  const renderEducation = (profile) => {
    const education = profile.education;
    const introEl = document.getElementById("educationIntro");
    if (introEl && education && education.intro) {
      introEl.textContent = education.intro;
    }

    const listEl = document.getElementById("educationList");
    if (!listEl || !education || !Array.isArray(education.items)) return;

    listEl.innerHTML = "";
    education.items.forEach((item) => {
      if (!item) return;
      const li = document.createElement("li");
      if (item.text) {
        li.textContent = item.text;
      } else {
        li.appendChild(document.createTextNode(item.program || ""));
        if (item.school) {
          li.appendChild(document.createElement("br"));
          const school = document.createElement("div");
          school.className = "school";
          school.textContent = item.school;
          li.appendChild(school);
        }
      }
      listEl.appendChild(li);
    });
  };

  const renderCourses = (profile) => {
    const listEl = document.getElementById("courseList");
    if (!listEl || !Array.isArray(profile.majorCourses)) return;

    listEl.innerHTML = "";
    profile.majorCourses.forEach((course) => {
      if (course === undefined || course === null) return;
      const li = document.createElement("li");
      li.textContent = course;
      listEl.appendChild(li);
    });
  };

  const renderOverview = (profile) => {
    const overview = document.getElementById("overview");
    if (!overview || !Array.isArray(profile.overview)) return;

    overview.innerHTML = "";
    profile.overview.forEach((item) => {
      if (typeof item !== "string") return;
      const p = document.createElement("p");
      p.innerHTML = interpolate(item, profile);
      overview.appendChild(p);
    });
    if (profile.overview.length > 0) {
      overview.appendChild(document.createElement("br"));
    }
  };

  const renderAbout = (profile) => {
    if (!profile.about) return;
    setTextById("aboutTitle", profile.about.title);

    const container = document.getElementById("aboutSections");
    const sections = profile.about.sections;
    if (!container || !Array.isArray(sections)) return;

    container.innerHTML = "";
    sections.forEach((section, index) => {
      const sectionEl = document.createElement("section");
      const wrapper = document.createElement("div");
      wrapper.className = "flex-fill p-4";

      const heading = document.createElement("h3");
      heading.style.marginLeft = "7px";
      if (section.icon) {
        const icon = document.createElement("i");
        icon.className = section.icon;
        heading.appendChild(icon);
        heading.appendChild(document.createTextNode(" "));
      }
      heading.appendChild(document.createTextNode(section.heading || ""));

      const textWrap = document.createElement("div");
      const paragraph = document.createElement("p");
      paragraph.style.fontStyle = "italic";
      paragraph.textContent = section.text || "";
      textWrap.appendChild(paragraph);

      wrapper.appendChild(heading);
      wrapper.appendChild(textWrap);
      sectionEl.appendChild(wrapper);
      container.appendChild(sectionEl);

      if (index < sections.length - 1) {
        container.appendChild(document.createElement("br"));
      }
    });
  };

  const renderQuiz = (profile) => {
    if (!profile.quiz) return;
    const title = profile.quiz.title ? interpolate(profile.quiz.title, profile) : "";
    setTextById("quizTitle", title);
    setTextById("quizWelcome", profile.quiz.welcome);

    const input = document.getElementById("playerName");
    if (input && profile.quiz.placeholder) {
      input.placeholder = profile.quiz.placeholder;
    }
  };

  const applyProfile = (profile) => {
    if (!profile) return;
    setTextById("profileName", profile.name);
    setTitle(profile);
    setPhoto(profile);
    renderEducation(profile);
    renderCourses(profile);
    renderOverview(profile);
    renderAbout(profile);
    renderQuiz(profile);
  };

  const loadProfile = () =>
    fetch(PROFILE_URL, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .catch(() => null);

  const init = () => {
    loadProfile().then((profile) => {
      if (profile) {
        applyProfile(profile);
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
