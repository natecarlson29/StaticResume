const tab1Content = document.getElementById("tab1");
const tab2Content = document.getElementById("tab2");
const tab3Content = document.getElementById("tab3");
const tab4Content = document.getElementById("tab4");

changeStarAbout = () => {
    document.documentElement.style.setProperty('--star1', '#ffff00');
    document.documentElement.style.setProperty('--star2', '#ffea00');
}
changeStarProjects = () => {
    document.documentElement.style.setProperty('--star1', '#00ffff');
    document.documentElement.style.setProperty('--star2', '#00ffbf');
}
changeStarResume = () => {
    document.documentElement.style.setProperty('--star1', '#bfff00');
    document.documentElement.style.setProperty('--star2', '#7fff00');
}
changeStarContact = () => {
    document.documentElement.style.setProperty('--star1', '#ff00ff');
    document.documentElement.style.setProperty('--star2', '#d500ff');
}

tab1 = () => {
    changeStarAbout();
    tab1Content.style.display = "block";
    tab2Content.style.display = "none";
    tab3Content.style.display = "none";
    tab4Content.style.display = "none";
}

tab2 = () => {
    changeStarProjects();
    tab1Content.style.display = "none";
    tab2Content.style.display = "flex";
    tab3Content.style.display = "none";
    tab4Content.style.display = "none";
}

tab3 = () => {
    changeStarResume();
    tab1Content.style.display = "none";
    tab2Content.style.display = "none";
    tab3Content.style.display = "block";
    tab4Content.style.display = "none";
}

tab4 = () => {
    changeStarContact();
    tab1Content.style.display = "none";
    tab2Content.style.display = "none";
    tab3Content.style.display = "none";
    tab4Content.style.display = "block";
}