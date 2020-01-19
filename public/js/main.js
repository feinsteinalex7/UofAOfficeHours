class UAHoursView {
    constructor() {
        this.mainWrapper = document.getElementById("mainWrapper");
        this.INIT_ENTRY_HOURS_BOXES = 3;
    }

    mainPage() {
        this._clearMainWrapper();
        
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

        // Create entry button
        let mainEntryButton = document.createElement("div");
        mainEntryButton.id = "mainEntryButton";
        mainEntryButton.className = "button";
        mainEntryButton.textContent = "Enter Your Office Hours";

        // Create button wrapper
        let mainButtonWrapper = document.createElement("div");
        mainButtonWrapper.className = "mainButtonWrapper";
        mainButtonWrapper.appendChild(mainViewCalendar);
        mainButtonWrapper.appendChild(mainEntryButton);

        // Create wrapper class for everything above.
        let mainContentWrapper = document.createElement("div");
        mainContentWrapper.className = "mainContentWrapper";
        mainContentWrapper.appendChild(title);
        mainContentWrapper.appendChild(mainSearchWrapper);
        mainContentWrapper.appendChild(mainButtonWrapper);
    
        this.mainWrapper.appendChild(mainContentWrapper);

        // Add event listeners
        mainEntryButton.addEventListener("click", () => {
            this.entryPage();
        });

        let searchFunction = () => {
            fetch('/search?term=' + encodeURIComponent(document.getElementById("mainSearch").value)).then((data) => {
                console.log(data);
                this.searchPage(data);
            });
        }

        document.getElementById("mainSearch").addEventListener("keyup", (e) => {
            if (e.keyCode == 13) {
                searchFunction();
            }
        })

        document.getElementById("mainSearchMag").addEventListener("click", searchFunction);
    }

    searchPage() {
        this._clearMainWrapper();

        // Create search wrapper
        let searchWrapper = document.createElement("div");
        searchWrapper.className = "searchSearchWrapper";
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
         searchBack.textContent = "Back";
         searchWrapper.appendChild(searchBack);
         searchContentWrapper.appendChild(searchWrapper);

         // Create the search results wrapper. 
         let searchResultsWrapper = document.createElement("div");
         searchResultsWrapper.id = "searchResultsWrapper";
         searchResultsWrapper.appendChild(this._createSearchResult("test", "test", "test", ["1", "2", "3"]));
         searchResultsWrapper.appendChild(this._createSearchResult("test", "test", "test", ["1", "2", "3"]));
         searchContentWrapper.appendChild(searchResultsWrapper);

        // Add searchContentWrapper to mainWrapper
        this.mainWrapper.appendChild(searchContentWrapper);
    }

    entryPage() {
        this._clearMainWrapper();

        let entryContentWrapper = document.createElement("div");
        entryContentWrapper.className = "entryContentWrapper";
        entryContentWrapper.innerHTML = `
            <span id="entryTitle">Submit Your Office Hours</span>
            <input type="text" class="entryFormBox" placeholder="Professor (Dr. Wilbur Wildcat)">
            <input type="text" class="entryFormBox" placeholder="Class (CSC 352)">
            <div class="entryHoursWrapper">
                <div id="entryHoursInputWrapper"></div>
                <div class="plusButtonWrapper">
                    <span class="plusIcon">+</span>
                </div>
            </div>
            <div class="entrySubmissionWrapper">
                <div class="button" id="entryBack">Back</div>
                <div class="button" id="entrySubmit">Submit</div>
            </div>`;
        this.mainWrapper.appendChild(entryContentWrapper);
        
        let entryHoursInputWrapper = document.getElementById("entryHoursInputWrapper");
        for (var i = 0; i < this.INIT_ENTRY_HOURS_BOXES; i++) {
            let hoursBox = this._createEntryHoursBox();
            entryHoursInputWrapper.appendChild(hoursBox[0]);
            entryHoursInputWrapper.appendChild(hoursBox[1]);
        }
    }

    _clearMainWrapper() {
        this.mainWrapper.innerHTML = "";
    }

    _createEntryHoursBox(placeholder) {
        let entryHoursBox = document.createElement("input");
        entryHoursBox.className = "entryHoursBox";
        entryHoursBox.placeholder = placeholder;
        entryHoursBox.type = "text";

        let minusIcon = document.createElement("span");
        minusIcon.className = "minusIcon";
        minusIcon.textContent = "-";

        return [entryHoursBox, minusIcon];
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

    searchScreen() {
        this.view.searchPage();
    }

    entryScreen() {
        this.view.entryPage();
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

main();