function getById(myArray, idVal) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].id === idVal) {
            return myArray[i];
        }
    }
    return null;
}
Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
    ].join('');
};

function parseDateFolder(str, isLongMonth) {
    var y = str.substr(0, 4),
        m = str.substr(4, 2) - 1,
        d = str.substr(6, 2);
    var D = new Date(y, m, d);
    // console.log("date :: ", appConfig.monthShortNames[D.getMonth()], " : ", D.getDate());
    var dateNum = D.getDate();
    var monthStr = "";
    if (isLongMonth) {
        monthStr = appConfig.monthNames[D.getMonth()];
    } else {
        monthStr = appConfig.monthShortNames[D.getMonth()];
    }
    return monthStr + "" + dateNum;
    // return dateNum + "" + monthStr;
};

function getDateFolder(myTimeStamp, callee) {
    /** Returns a date str used to create folder in FB */
    var dateObj = { dateStr: "", timeStamp: "" };
    var myDate = null;
    if (!myTimeStamp) {
        myDate = new Date();
    } else {
        myDate = new Date(myTimeStamp);
    }
    dateObj.timeStamp = myDate.getTime();
    dateObj.dateStr = myDate.yyyymmdd();

    console.log(" dateObj.timeStamp:::: ", dateObj.dateStr, " :callee :: ", callee, " :dateObj.timeStamp :: ", dateObj.timeStamp);
    return dateObj;
}

function getProblemObj(logDesc) {
    var prob = null;
    for (var j = 0; j < appConfig.problemTypes.length; j++) {
        //
        prob = appConfig.problemTypes[j];
        //console.log("desc 1 :: ", prob.logDesc, " :: desc 2 :: ", logDesc);
        if (logDesc.indexOf(prob.logDesc) != -1) {
            break;
        }
    }
    return prob;
}

function setProblemObj(compiledProblem) {
    var prob = null;
    for (var j = 0; j < appConfig.problemTypes.length; j++) {
        //
        prob = appConfig.problemTypes[j];
        if (!compiledProblem[prob.value]) {
            //first time
            compiledProblem[prob.value] = 0;
        }
    }
    return compiledProblem;
}

function tagProblem(myData) {
    var compiledProblem = {
        userTotalCount: 0,
        userSuccessCount: 0,
        userSupportCount: 0,
        userNoSchoolCount: 0,
        userSkippedCount: 0
            //others goes here.
    }
    for (var i = 0; i < myData.length; i++) {
        var newCompiledProblem = setProblemObj(compiledProblem);
        // console.log('outer newCompiledProblem:', newCompiledProblem);
        var group = myData[i];
        if (group.logStatus != "true" && group.schoolName) {
            var prob = getProblemObj(group[0].logDesc);
            // console.log('outer tag Problem prob:', prob);

            if (group[0].logDesc.indexOf(prob.logDesc) != -1) {
                //same log desc
                if (!compiledProblem[prob.value]) {
                    //first time
                    compiledProblem[prob.value] = 1;
                } else {
                    compiledProblem[prob.value]++;
                }
                //console.log(group.logStatus, ' :: tag Problem tagged:', prob.logDesc);
                compiledProblem.userSupportCount++;
            } else {
                //some other type has came in...
                // console.log('inner tag Problem prob:', prob);
                console.log('!!!!!!!!!!!!!! --------- tag Problem group[0].logDesc:', group[0].logDesc);
                console.log('!!!!!!!!!!!!!! --------- tag Problem prob desc:', prob.logDesc);
                //console.log('tag Problem prob:', group[0].logDesc);
                //console.log('-------------------------');
            }
        } else if (group.logStatus == "true") {
            //console.log(group.logStatus, '  :: tag Problem user Success Count :');
            compiledProblem.userSuccessCount++;
        } else if (!group.schoolName) {
            console.log(group.logStatus, '  :: tag Problem not no school name:');
            compiledProblem.userNoSchoolCount++;
        } else {
            compiledProblem.userSkippedCount++;
            console.log(group.logStatus, '  :: tag Problem not included group:', group);
        }

        compiledProblem.userTotalCount++;
    }
    console.log("tag Problem compiledProblem:: ", compiledProblem);
    return compiledProblem;
}
/** BO Shorten URL */

function makeShortNew(url) {
    //http://qiita.com/niusounds/items/ad6fd61f22f11d136331
    return new Promise((resolve, reject) => {
        gapi.load('client', _ => {
            gapi.client.init({
                    'apiKey': 'AIzaSyA-8GYOBUMWiwLcSvzjwCfR7bH9OoHSkGE',
                    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/urlshortener/v1/rest'],
                })
                .then(_ => gapi.client.urlshortener.url.insert({
                    longUrl: url
                }))
                .then(resolve, reject)
        });
    });
}

function makeShortWorking(longUrl) {
    //https://gist.github.com/hayageek/4584508
    var str = "";
    var request = gapi.client.urlshortener.url.insert({
        'resource': {
            'longUrl': longUrl
        }
    });
    request.execute(function(response) {
        console.log("response : ", response);
        if (response.id != null) {
            console.log("response.id : ", response.id);
            return response
        } else {
            alert("error: creating short url");
        }
    });
}


/** EO Shorten URL */
