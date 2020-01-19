class UAHoursView {
    constructor(model) {
        this.model = model;
        this.mainWrapper = document.getElementById("mainWrapper");
        this.INIT_ENTRY_HOURS_BOXES = 3;
        this.OFFICE_HOUR_BOX_PLACEHOLDER = "Monday 11:00AM - 2:00PM"
        this.mainPage();
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
        this._loadSearchTabs();

        // Add event listeners
        mainEntryButton.addEventListener("click", () => {
            this.entryPage();
        });

        let searchFunction = () => {
            fetch('/search?term=' + encodeURIComponent(document.getElementById("mainSearch").value)).then((response) => {
                response.json().then((data) => {
                    console.log(data);
                    this.searchPage(data);
                });
            });
        }

        document.getElementById("mainSearch").addEventListener("keyup", (e) => {
            if (e.keyCode == 13) {
                searchFunction();
            }
        })

        document.getElementById("mainSearchMag").addEventListener("click", searchFunction);
    }

    searchPage(data) {
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
         searchBack.addEventListener("click", () => {
            this.model.clearLoadedClasses();
            this.mainPage();
         });
         searchWrapper.appendChild(searchBack);
         searchContentWrapper.appendChild(searchWrapper);

         // Create the search results wrapper. 
         let searchResultsWrapper = document.createElement("div");
         searchResultsWrapper.id = "searchResultsWrapper";

         // Append search results here
         
         for (var i = 0; i < data.length; i++) {
             for (var j = 0; j < data[i].classes.length; j++) {
                searchResultsWrapper.appendChild(this._createSearchResult(data[i].professor, data[i].classes[j], data[i].locName[j], data[i].hours[j]));
             }
         }
         
         searchContentWrapper.appendChild(searchResultsWrapper);

        // Add searchContentWrapper to mainWrapper
        this.mainWrapper.appendChild(searchContentWrapper);
        this._loadSearchTabs();
    }

    entryPage() {
        this._clearMainWrapper();

        let entryContentWrapper = document.createElement("div");
        entryContentWrapper.className = "entryContentWrapper";
        entryContentWrapper.innerHTML = `
            <span id="entryTitle">Submit Your Office Hours</span>
            <input id="profName" type="text" class="entryFormBox" placeholder="Professor (Dr. Wilbur Wildcat)">
            <input id="className" type="text" class="entryFormBox" placeholder="Class (CSC 352)">
            <input id="locName" type="text" class="entryFormBox" placeholder="Location (GS 902)">
            <div id="entryHoursWrapper">
                <div id="entryHoursInputWrapper"></div>
                <div id="plusButtonWrapper">
                    <span class="plusIcon">+</span>
                </div>
            </div>
            <span id="entryError"></span>
            <span id="entrySuccessMessage">Your office hours have been recorded!</span>
            <div class="entrySubmissionWrapper">
                <div class="button" id="entryBack">Back</div>
                <div class="button" id="entrySubmit">Submit</div>
            </div>`;
        this.mainWrapper.appendChild(entryContentWrapper);
        
        let entryHoursInputWrapper = document.getElementById("entryHoursInputWrapper");
        for (var i = 0; i < this.INIT_ENTRY_HOURS_BOXES; i++) {
            let hoursBox = this._createEntryHoursBox(this.OFFICE_HOUR_BOX_PLACEHOLDER);
            entryHoursInputWrapper.appendChild(hoursBox[0]);
            entryHoursInputWrapper.appendChild(hoursBox[1]);
        }

        // Add event listeners

        document.getElementById("plusButtonWrapper").addEventListener("click", () => {
            let hoursBox = this._createEntryHoursBox(this.OFFICE_HOUR_BOX_PLACEHOLDER);
            entryHoursInputWrapper.appendChild(hoursBox[0]);
            entryHoursInputWrapper.appendChild(hoursBox[1]);
        });

        document.getElementById("entryBack").addEventListener("click", () => {
            this.mainPage();
        });

        document.getElementById("entrySubmit").addEventListener("click", () => {
            let profName = encodeURIComponent(document.getElementById("profName").value);
            let className = encodeURIComponent(document.getElementById("className").value);
            let locName = encodeURIComponent(document.getElementById("locName").value);
            let queryString = "/entry?profName=" + encodeURIComponent(profName) + "&className=" + encodeURIComponent(className) + "&locName=" + encodeURIComponent(locName);

            let entryHoursBoxes = document.getElementsByClassName("entryHoursBox");

            for (let i = 0; i < entryHoursBoxes.length; i++) {
                queryString += "&officeHour" + i + "=" + encodeURIComponent(entryHoursBoxes[i].value);
            }

            fetch(queryString).then((data) => {
                var entryFormBoxes = document.getElementsByClassName("entryFormBox");
                for (var i = 0; i < entryFormBoxes.length; i++) {
                    entryFormBoxes[i].style.display = "none";
                }
                document.getElementById("entryHoursWrapper").style.display = "none";
                document.getElementById("entrySuccessMessage").style.display = "block";
                document.getElementById("entrySubmit").style.display = "none";
                document.getElementById("entryBack").style.left = "50%";
                document.getElementById("entryBack").style.transform = "translate(-50%, 0)";
            }).catch((error) => {
                document.getElementById("entryError").style.display = "block";
                document.getElementById("entryError").textContent = error;
            });
        });
    }

    _loadExistingSearchTabs() {

    }

    _clearMainWrapper() {
        this.mainWrapper.innerHTML = "";
    }

    _loadSearchTabs() {
        let mainClassTabWrapper = document.getElementById("mainClassTabWrapper");
        mainClassTabWrapper.innerHTML = "";
        for (let id in this.model.savedClassesTabs) {
            mainClassTabWrapper.appendChild(this.model.savedClassesTabs[id]);
        }
    }

    _createSearchTab(title, id) {
        let mainClassTab = document.createElement("div");
        mainClassTab.className = "mainClassTab";

        let ID = id;
        mainClassTab.addEventListener("click", () => {
            this.model.removeSavedClass(ID);
            mainClassTab.parentElement.removeChild(mainClassTab);
            if (this.model.getHiddenId(ID)) {
                this.model.getHiddenId(ID).click();
            }
        });

        
        mainClassTab.innerHTML = '<span class="removeText">REMOVE</span><span class="titleText">' + title + '</span>';
        
        this.model.saveTab(id, mainClassTab);
        this._loadSearchTabs();
    }

    _createEntryHoursBox(placeholder) {
        let entryHoursBox = document.createElement("input");
        entryHoursBox.className = "entryHoursBox";
        entryHoursBox.placeholder = placeholder;
        entryHoursBox.type = "text";

        let minusIcon = document.createElement("span");
        minusIcon.className = "minusIcon";
        minusIcon.textContent = "-";
        minusIcon.addEventListener("click", function() {
            this.parentElement.removeChild(this.previousSibling);
            this.parentElement.removeChild(this);
        });

        return [entryHoursBox, minusIcon];
    }

    _createSearchResult(prof, className, loc, hours) {
        // The ID is the professor + className
        let id = prof + className;
        this.model.loadClass(id, [prof, className, loc, hours]);

        // Create the searchResultWrapper
        let searchResultWrapper = document.createElement("div");
        searchResultWrapper.className = "searchResultWrapper";

        let itemID = document.createElement("input");
        itemID.type = "hidden";
        itemID.value = id;
        itemID.className = "itemID";
        itemID.addEventListener("click", (e) => {
            e.target.parentElement.className = "searchResultWrapper";         
        });
        this.model.saveHiddenId(id, itemID);

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
        
        // Add event listener
        searchResultWrapper.addEventListener("click", (e) => {
            
            // Check for if hidden id was clicked
            if (e.target.className == "itemID") {
                return;
            }
            
            let targetID = searchResultWrapper.getElementsByClassName("itemID")[0].value;
            let mainClassTabWrapper = document.getElementById("mainClassTabWrapper");
            if (this.model.isClassSaved(targetID)) {
                searchResultWrapper.className = "searchResultWrapper";
                
                // Remove tab.
                mainClassTabWrapper.removeChild(this.model.getSavedTab(targetID));
                this.model.removeSavedClass(targetID);
            } else {
                searchResultWrapper.className = "searchResultWrapper searchResultWrapperSelected";
                this.model.saveClass(targetID);
                this._createSearchTab(this.model.getSavedClass(targetID)[1], targetID);
            }
        });

        searchResultWrapper.appendChild(officeHours);
        searchResultWrapper.appendChild(generalInfo);
        searchResultWrapper.appendChild(itemID);
        return searchResultWrapper;
    }
}

class UAHoursController {
    constructor() {
        this.model = new UAHoursModel();
        this.view = new UAHoursView(this.model);
    }
}

class UAHoursModel {
    constructor() {
        this.savedClasses = {};
        this.savedClassesTabs = {};

        this.loadedClasses = {};
        this.loadedHiddenIds = {};
    }

    saveHiddenId(id, elem) {
        this.loadedHiddenIds[id] = elem;
    }

    getHiddenId(id) {
        return this.loadedHiddenIds[id];
    }

    loadClass(id, classInfo) {
        this.loadedClasses[id] = classInfo;
    }

    clearLoadedClasses() {
        this.loadedClasses = {};
        this.loadedHiddenIds = {};
    }

    saveTab(id, elem) {
        this.savedClassesTabs[id] = elem;
    }

    getSavedTab(id) {
        return this.savedClassesTabs[id];
    }

    isClassSaved(id) {
        return this.savedClasses[id] != undefined;
    }

    saveClass(id) {
        this.savedClasses[id] = this.loadedClasses[id];
    }

    getSavedClass(id) {
        return this.savedClasses[id];
    }

    removeSavedClass(id) {
        delete this.savedClasses[id];
        delete this.savedClassesTabs[id];
    }
}

let main = function() {
    let controller = new UAHoursController();
}

main();