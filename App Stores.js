function checkName(name) {
    let regex = /^[A-Za-z0-9 ]{1,24}$/;
    let result = regex.test(name.trim());//name.trim 3shan 2shel l white spaces ly fl2awl wl 25er S
    if (!result) {
        throw 'Name is Wrong';
    }
}
function checkDescription(description) {

    if (typeof description != "string") {
        throw 'Description must be a String';
    }
}
function checkVersion(version) {
    if (version < 0) {
        throw 'version must be Positive number more than old one';
    }
}
function checkrating(rating) {
    if (typeof rating != "number" || rating > 10 || rating < 1) {
        throw 'Rating must be number between 1 and 10';
    }
}
function checkHostName(hostname) {
    if (typeof hostname != "string" && hostname.length > 32) {
        throw 'This Hostname is invalid '
    }
}
function checkAppsArray(appsArray) {
    for (let i of appsArray) {
        if (!(i instanceof App)) {
            throw 'This apps is invalid';
        }
    }
}

class App {
    constructor(name, description, version, rating) {
        checkName(name);
        checkDescription(description);
        checkVersion(version);
        checkrating(rating);
        this.name = name;
        this.description = description;
        this.version = version;
        this.rating = rating;
    }
    release(options) {
        if (options.version < this.version || options.version < 0 || options.version == undefined) {
            throw 'You can not update this version';
        }
        this.version = options.version;
        if (typeof options.description != "string" && options.description != undefined) {
            throw 'Description must be a String';
        }
        this.description = options.description;
        if (typeof options.rating != "number" && options.rating != undefined) {
            throw 'Rating must be a number';
        }
        this.rating = options.rating;
    }
}


class Store extends App {
    constructor(name, description, version, rating, apps) {
        super(name, description, version, rating);
        this.apps = [];
    }
    uploadApp(app) {
        let newApp;
        let newIndex = 0;
        if (this.apps.length == 0) {
            if (app instanceof App) {
                newApp = new App(app.name, app.description, app.version, app.rating);
                this.apps.push(newApp);
            }
        }
        else if (this.apps.length > 0) {
            for (let i in this.apps) {
                if (app instanceof App) {
                    if (this.apps[i].name == app.name) {
                        newIndex = 1;
                        if (this.apps[i].version > app.version) {
                            throw 'You can not update this version';
                        }
                        this.apps[i].version = app.version;
                        this.apps[i].description = app.description;
                        this.apps[i].rating = app.rating;
                    }
                }
            }
            if (newIndex == 0) {
                newApp = new App(app.name, app.description, app.version, app.rating);
                this.apps.push(newApp);
            }
            // console.log(this.apps);
        }
    }
    takedownApp(name) {
        let flag = 0;
        for (let i in this.apps) {
            if (this.apps[i].name == name) {
                const index = i;
                this.apps.splice(index, 1);
                flag = 1;
            }
        }
        if (flag == 0) {
            throw 'There is no App like that in the store'
        }
        // console.log("after delete",this.apps);
    }
    search(pattern) {
        let searchedArr = [];
        for (let i of this.apps) {
            if (i.name.toLowerCase().includes(pattern.toLowerCase()) && i.name.toLowerCase().startsWith(pattern.toLowerCase())) {
                searchedArr.push(i);
            }
        }
        return searchedArr.sort(function (a, b) { return a.name.localeCompare(b.name); });
    }
    listMostRecentApps(count = 10) {
        let length = 0;
        let appsArray = this.apps.slice();
        let recentApps = [];
        for (let i = 1; i <= count; i++) {
            recentApps.push(appsArray.pop());
        }
        return recentApps;
        // console.log("MostRecent",recentApps);
        // console.log("OLD",this.apps);
        // console.log("Copied",appsArray);
    }
    listMostPopularApps(count = 10) {
        let appsArray = this.apps.slice();
        let popularApps = [];
        let rate = 0;
        for (let i = 0; i < count; i++) {
            popularApps.push(appsArray[i]);
        }
        let sortedArray = popularApps.sort(function (a, b) {
            return a.rating - b.rating
        });
        sortedArray.reverse();
        return popularApps;
    }
}

class Device {
    constructor(hostname, appsArray) {
        checkHostName(hostname);
        checkAppsArray(appsArray);
        this.hostname = hostname;
        this.appsArray = appsArray;
    }
    search(pattern) {;
        let version = 0;
        let n="";
        let searchedArr = [];
        for (let i of this.appsArray) {
            if (i instanceof Store) {
                for (let x of i.apps) {
                    if (x.name.toLowerCase().includes(pattern.toLowerCase()) && x.name.toLowerCase().startsWith(pattern.toLowerCase())) {
                        searchedArr.push(x);
                    }
                }
            }
        }
        let sortedSearchArray = searchedArr.sort(function (a, b) { return a.name.localeCompare(b.name); });
        let finalArray = [];
        for (let i of sortedSearchArray) {
                if (i.version > version) {
                    version = i.version;
                    finalArray.pop();   
                    finalArray.push(i);
                }
        }
        return finalArray;

        // let arr=this.appsArray.forEach(function(item){
        //     console.log(item);
        //         return item.forEach(function(){return console.log(it)})
        // });
        // // arr.forEach( function(x)
        // // {
        // //     if (x instanceof Store)
        // //     {
        // //         return x
        // //     }
        // // })
    }
    install(name) {
        let check = 0;
        for (let i of this.appsArray) {
            if (i instanceof Store) {
                for (let x of i.apps) {
                    if (name == x.name) {
                        //  console.log(x.version);
                        check = 1;
                    }
                }
            }
        }
        if (check == 0) {
            throw 'App name is not available in installed stores';
        }
    }
    uninstall(name) {
        let check = 0;
        for (let i of this.appsArray) {
            if (i instanceof Store) {
                for (let x of i.apps) {
                    if (name == x.name) {
                        check = 1;
                    }
                }
            }
        }
        if (check != 1) {
            throw 'App name is not available in installed stores to uninstall it';
        }
    }
    listInstalled() {
        let installedAppsList = [];
        installedApps = this.appsArray.slice();
        let sortedInstalledApps = installedApps.sort(function (a, b) { return a.name.localeCompare(b.name); });
        console.log("Sorted Listed Array \n", sortedInstalledApps)
    }
    update() {
        let installedAppsArray = [];
        // let storesAppsArray=[];
        for (let i of this.appsArray) {
            if (i instanceof App && !(i instanceof Store)) {
                installedAppsArray.push(i);
                // console.log(typeof (i.name));
                arr = this.search(i.name);
                console.log(arr);
            }
        }

        // console.log("All Stores \n",storesAppsArray)
        // console.log("All Apps \n",installedAppsArray)
    }
}

// App and Store test cases
// let store = new Store("Google PlayStore", "Android app store to install and explore apps on the device", 1.2, 5);
// let app1 = new App("Facebook", "Social App ", 1, 5);
// store.uploadApp(app1);
// let app2 = new App("Instagram", "Photo Gallery App", 3, 1);
// store.uploadApp(app2);
// let app3 = new App("Facebook", "New Version of this App", 2, 10);
// store.uploadApp(app3);
// let app4 = new App("Whats App", "Chatting App", 3.2, 1);
// store.uploadApp(app4);
// let app5 = new App("Google Maps", "Find location App", 1.6, 1);
// store.uploadApp(app5);
// let arr=store.search("Insta");
// // console.log(store);
// // console.log(arr);
// // store.takedownApp("Instgram");
// let recentAppArray=store.listMostRecentApps();
// // console.log("Recent Apps List :  \n" , recentAppArray);
// console.log("Most Popular Apps List :  \n" , store.listMostPopularApps());


// Device test cases
// let arr = [
//     { name: "Facebook", description: "Social App", version: 2, rating: 9 },
//     { name: "Google Maps", description: "Finding palces App", version: 1, rating: 10 },
//     { name: "WhatsApp", description: "Chat App", version: 3, rating: 4 },
// ];

// let installedApps = [];
// let currentApp;
// for (let i of arr) {
//     currentApp = new App(i.name, i.description, i.version, i.rating);
//     installedApps.push(currentApp);
// }
// let deviceStore1 = new Store("Google PlayStore", "Android app store to install and explore apps on the device", 1.2, 5);
// let app1 = new App("Facebook", "Social App ", 3.5, 5);
// deviceStore1.uploadApp(app1);
// let app4 = new App("Whats App ", "Chatting App", 10, 6);
// deviceStore1.uploadApp(app4);
// installedApps.push(deviceStore1);
// let deviceStore2 = new Store("Amazone PlayStore", "Android app store to install and explore apps on the device", 1.2, 5);
// let app2 = new App("wFacebook", "Social App ", 2, 5);
// deviceStore2.uploadApp(app2);
// let app5 = new App("whats App", "Chatting App", 3, 5);
// deviceStore2.uploadApp(app5);
// installedApps.push(deviceStore2);
// let device = new Device("192.168.1.111", installedApps);
// device.install("Facebook");
// // device.uninstall("Facebook");
// // device.listInstalled();
// // console.log(installedApps);
// console.log(device.search("w"));
// // device.update();