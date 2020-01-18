class UAHoursView {
    constructor() {
        this.mainWrapper = document.getElementById("mainWrapper");
    }

    mainPage() {
        _clearMainWrapper();
        
        // Create title
        let title = document.createElement("span");
        title.id = "mainTitle";
        title.textContent = "UofA Hours";

        // Create search wrapper
        let mainSearchWrapper = document.createElement("div");
        mainSearchWrapper.className = "mainSearchWrapper";
        mainSearchWrapper.innerHTML = '<input id="mainSearch" type="text"><img src="../images/search.png" id="mainSearchMag">';

        // Create class tab wrapper
        let mainClassTabWrapper = document.createElement("div");
        mainClassTabWrapper.id = "mainClassTabWrapper";
        mainSearchWrapper.appendChild(mainClassTabWrapper);

        // Create calendar button
        let mainViewCalendar = document.createElement("div");
        mainViewCalendar.id = "mainViewCalendar";
        mainViewCalendar.className = "button";
        mainViewCalendar.textContent = "View Calendar";

        // Create wrapper class for everything above.
        let mainContentWrapper = document.createElement("div");
        mainContentWrapper.className = "mainContentWrapper";
        mainContentWrapper.appendChild(title);
        mainContentWrapper.appendChild(mainSearchWrapper);
        mainContentWrapper.appendChild(mainViewCalendar);
    
        this.mainWrapper.appendChild(mainContentWrapper);
    }

    searchPage() {
        _clearMainWrapper();

        // Create search wrapper
        let searchWrapper = document.createElement("div");
        searchWrapper.className = "searchWrapper";
        searchWrapper.innerHTML = '<input id="searchSearch" type="text"><img src="../images/search.png" id="mainSearchMag">';

        // Create mainClassTabWrapper wrapper
        let mainClassTabWrapper = document.createElement("div");
        mainClassTabWrapper.id = "mainClassTabWrapper";
        searchWrapper.appendChild(mainClassTabWrapper);

         // Create wrapper class for everything above.
         let searchContentWrapper = document.createElement("div");
         searchContentWrapper.className = "searchContentWrapper";

         // Create searchBack button
         let searchBack = document.createElement("div");
         searchBack.id = "searchBack";
         searchBack.className = "button";
         searchWrapper.appendChild(searchContentWrapper);
         searchContentWrapper.appendChild(searchWrapper);

         // Create the search results wrapper. 
         let searchResultsWrapper = document.createElement("div");
         searchResultsWrapper.id = "searchResultsWrapper";
    }

    _clearMainWrapper() {
        this.mainWrapper.innerHTML = "";
    }

    _createSearchResult(prof, className, loc, hours) {
        // Create the searchResultWrapper
        let searchResultWrapper = document.createElement("div");
        searchResultWrapper.className = "searchResultWrapper";

        let generalInfo = document.createElement("div");
        generalInfo.className = "searchResultGeneralInfoWrapper";
        generalInfo.innerHTML = prof + "<br />" + className + "<br />" + loc;
    
        let officeHours = document.createElement("div");
        officeHours.className = "searchResultGeneralOfficeHoursWrapper";
        for (var i = 0; i < hours.length; i++) {
            if (i > 0) {
                officeHours.innerHTML += "<br />";
            }
            officeHours.innerHTML += hours[i];
        }

        searchResultWrapper.appendChild(officeHours);
        searchResultWrapper.appendChild(generalInfo);
        return searchResultWrapper;
    }
}

class UAHoursController {
    constructor() {
        this.view = new UAHoursView();
        this.model = new UAHoursModel();
    }

    mainScreen() {
        this.view.mainPage();
    }
}

class UAHoursModel {
    constructor() {
        
    }
}

let main = function() {
    let controller = new UAHoursController();
    controller.mainScreen();
}